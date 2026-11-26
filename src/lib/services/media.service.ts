import db from "$lib/db/client";
import { StorageService } from "./storage.service";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/ico",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file

export interface CreateMediaTicketInput {
  fileName: string;
  mimeType: string;
  bytes: number;
  listingId?: string;
  folderId?: string;
  altText?: string;
}

export interface ConfirmMediaInput {
  key: string;
  url: string;
  mimeType: string;
  bytes: number;
  fileName?: string;
  listingId?: string;
  folderId?: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface GetMediaOptions {
  folderId?: string | null;
  search?: string;
  limit?: number;
  page?: number;
}

export class MediaService {
  /**
   * Verifies if the merchant can upload more photos under their active pricing plan
   */
  static async assertCanUploadMedia(ownerId: string, listingId?: string): Promise<boolean> {
    if (listingId) {
      const listing = await db.listing.findFirst({
        where: { id: listingId, ownerId },
        include: {
          plan: true,
          _count: {
            select: { media: { where: { deletedAt: null } } },
          },
        },
      });

      if (!listing) {
        throw new Error("Listing not found or access denied.");
      }

      const maxAllowed = listing.plan?.maxPhotos ?? 6;
      const currentCount = listing._count.media;

      if (currentCount >= maxAllowed) {
        throw new Error(
          `Photo limit reached for this listing. Your ${listing.plan?.name || "current"} plan allows up to ${maxAllowed} photos.`
        );
      }
    }

    return true;
  }

  /**
   * Generates a pre-signed or local storage upload ticket
   */
  static async createUploadTicket(ownerId: string, input: CreateMediaTicketInput) {
    const normalizedMime = input.mimeType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
      throw new Error("Invalid file type. Supported formats: JPG, PNG, WebP, AVIF, SVG, ICO.");
    }

    if (input.bytes > MAX_FILE_SIZE_BYTES) {
      throw new Error("File exceeds the 10 MB maximum size limit.");
    }

    if (input.listingId) {
      await this.assertCanUploadMedia(ownerId, input.listingId);
    }

    // WordPress-style upload folder structure: YYYY/MM
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const datePrefix = `${year}/${month}`;

    const ticket = await StorageService.createUploadTicket(
      input.fileName,
      normalizedMime,
      input.bytes,
      datePrefix
    );

    return ticket;
  }

  /**
   * Confirms the upload and creates the Media database record
   */
  static async confirmUpload(ownerId: string, input: ConfirmMediaInput) {
    const normalizedMime = input.mimeType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
      throw new Error("Invalid MIME type.");
    }

    const posixKey = input.key.replace(/\\/g, "/");

    // Look for serverless upload buffer if local disk was not writable
    let fileData: Buffer | null = null;
    try {
      const buffered = await db.mediaUploadBuffer.findUnique({
        where: { key: posixKey },
      });
      if (buffered) {
        fileData = buffered.data;
        await db.mediaUploadBuffer.delete({ where: { key: posixKey } }).catch(() => {});
      }
    } catch {
      // Non-fatal if buffer table check is skipped
    }

    const media = await db.media.create({
      data: {
        ownerId,
        listingId: input.listingId || null,
        folderId: input.folderId || null,
        key: posixKey,
        url: input.url,
        mimeType: input.mimeType,
        bytes: input.bytes,
        width: input.width || null,
        height: input.height || null,
        altText: input.altText || input.fileName || "Uploaded business media",
        scanStatus: "clean",
        fileData: fileData || undefined,
      },
    });

    return media;
  }

  /**
   * Retrieves merchant media with folder filtering, pagination, and total quota calculations
   */
  static async getMerchantMedia(ownerId: string, options: GetMediaOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 24));
    const skip = (page - 1) * limit;

    const where: any = {
      ownerId,
      deletedAt: null,
    };

    if (options.folderId !== undefined) {
      where.folderId = options.folderId;
    }

    if (options.search) {
      where.OR = [
        { altText: { contains: options.search, mode: "insensitive" } },
        { key: { contains: options.search, mode: "insensitive" } },
      ];
    }

    const [items, totalCount, totalBytesAgg] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          folder: { select: { id: true, name: true } },
          listing: { select: { id: true, title: true, slug: true } },
        },
      }),
      db.media.count({ where }),
      db.media.aggregate({
        where: { ownerId, deletedAt: null },
        _sum: { bytes: true },
      }),
    ]);

    const totalBytesUsed = totalBytesAgg._sum.bytes || 0;
    const maxStorageBytes = 100 * 1024 * 1024; // 100 MB standard merchant quota

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalBytesUsed,
      maxStorageBytes,
      quotaPercentage: Math.min(100, Math.round((totalBytesUsed / maxStorageBytes) * 100)),
    };
  }

  /**
   * Retrieves global directory media for administrative inspection
   */
  static async getAdminMedia(options: {
    search?: string;
    mimeType?: string;
    isQuarantined?: boolean;
    folderId?: string | null;
    page?: number;
    limit?: number;
  } = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 24));
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (options.folderId !== undefined) {
      where.folderId = options.folderId;
    }

    if (options.isQuarantined !== undefined) {
      where.isQuarantined = options.isQuarantined;
    }

    if (options.mimeType) {
      where.mimeType = { startsWith: options.mimeType };
    }

    if (options.search) {
      where.OR = [
        { altText: { contains: options.search, mode: "insensitive" } },
        { key: { contains: options.search, mode: "insensitive" } },
        { owner: { email: { contains: options.search, mode: "insensitive" } } },
      ];
    }

    const [items, totalCount, totalStorageAgg, quarantinedCount, cleanCount] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true, email: true } },
          listing: { select: { id: true, title: true, slug: true } },
          folder: { select: { id: true, name: true } },
        },
      }),
      db.media.count({ where }),
      db.media.aggregate({
        where: { deletedAt: null },
        _sum: { bytes: true },
      }),
      db.media.count({
        where: { deletedAt: null, isQuarantined: true },
      }),
      db.media.count({
        where: { deletedAt: null, isQuarantined: false },
      }),
    ]);

    const totalBytesSystem = totalStorageAgg._sum.bytes || 0;
    const maxStorageBytes = 1024 * 1024 * 1024; // 1GB default system allocation
    const quotaPercentage = Math.min(100, Math.round((totalBytesSystem / maxStorageBytes) * 100));

    return {
      items,
      totalCount,
      quarantinedCount,
      cleanCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalBytesSystem,
      maxStorageBytes,
      quotaPercentage,
    };
  }

  /**
   * Admin toggle to quarantine or un-quarantine suspicious media
   */
  static async toggleQuarantine(mediaId: string, isQuarantined: boolean) {
    return await db.media.update({
      where: { id: mediaId },
      data: { isQuarantined },
    });
  }

  /**
   * Batch toggle quarantine status
   */
  static async batchQuarantine(mediaIds: string[], isQuarantined: boolean) {
    return await db.media.updateMany({
      where: { id: { in: mediaIds } },
      data: { isQuarantined },
    });
  }

  /**
   * Soft deletes a media record
   */
  static async deleteMedia(mediaId: string, ownerId: string, isAdmin: boolean = false) {
    const where: any = { id: mediaId };
    if (!isAdmin) {
      where.ownerId = ownerId;
    }

    const media = await db.media.findFirst({ where });
    if (!media) {
      throw new Error("Media asset not found or access denied.");
    }

    await db.media.update({
      where: { id: mediaId },
      data: { deletedAt: new Date() },
    });

    return true;
  }

  /**
   * Virtual Folders: Retrieves folders for an owner or all system folders for admin
   */
  static async getFolders(ownerId?: string | null, parentId: string | null = null) {
    const where: any = {
      parentId,
    };
    if (ownerId) {
      where.ownerId = ownerId;
    }

    return await db.mediaFolder.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            media: { where: { deletedAt: null } },
            children: true,
          },
        },
      },
    });
  }

  /**
   * Virtual Folders: Creates a new folder
   */
  static async createFolder(ownerId: string, name: string, parentId?: string) {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("Folder name cannot be empty.");

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    return await db.mediaFolder.create({
      data: {
        ownerId,
        name: cleanName,
        slug: slug || "folder",
        parentId: parentId || null,
      },
    });
  }

  /**
   * Virtual Folders: Deletes a folder and detaches its assets
   */
  static async deleteFolder(folderId: string, ownerId: string, isAdmin: boolean = false) {
    const where: any = { id: folderId };
    if (!isAdmin) {
      where.ownerId = ownerId;
    }

    const folder = await db.mediaFolder.findFirst({
      where,
    });

    if (!folder) throw new Error("Folder not found.");

    // Detach assets in this folder
    await db.media.updateMany({
      where: { folderId },
      data: { folderId: null },
    });

    await db.mediaFolder.delete({
      where: { id: folderId },
    });

    return true;
  }

  /**
   * Move assets to a target folder
   */
  static async moveMediaToFolder(mediaIds: string[], folderId: string | null, ownerId: string, isAdmin: boolean = false) {
    const where: any = {
      id: { in: mediaIds },
    };
    if (!isAdmin) {
      where.ownerId = ownerId;
    }

    return await db.media.updateMany({
      where,
      data: { folderId },
    });
  }
}
