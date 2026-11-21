import db from "$lib/db/client";
import { sanitizeRichText, stripHtml } from "$lib/security/sanitize";
import { ListingStatus, ClaimStatus, Prisma } from "@prisma/client";

export interface CreateListingInput {
  title: string;
  description: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address: string;
  locality: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  yearEstablished?: number;
  priceRange?: number;
  openingHours?: Prisma.InputJsonValue;
  amenities?: string[];
  socialLinks?: Prisma.InputJsonValue;
  categoryIds: string[];
  locationIds: string[];
  planId?: string;
}

export class ListingService {
  /**
   * Retrieves a single published listing by its slug for public presentation.
   * Includes categories, locations, pricing plan privileges, and media.
   */
  static async getBySlug(slug: string) {
    const listing = await db.listing.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
        plan: true,
        media: {
          where: { isQuarantined: false, deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
        reviews: {
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!listing || listing.status !== ListingStatus.published) {
      return null;
    }

    return listing;
  }

  /**
   * Increments view count safely in the background
   */
  static async trackView(id: string): Promise<void> {
    await db.listing.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    }).catch(() => {});
  }

  /**
   * Fetch all listings owned by an authenticated user (DAL owner check)
   */
  static async getByOwnerId(ownerId: string) {
    return await db.listing.findMany({
      where: { ownerId },
      include: {
        plan: true,
        _count: {
          select: {
            reviews: true,
            enquiries: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create a new listing with sanitized inputs and plan bounds
   */
  static async create(ownerId: string, input: CreateListingInput) {
    const baseSlug = stripHtml(input.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // Get default free plan if none specified
    let planId = input.planId;
    if (!planId) {
      const freePlan = await db.pricingPlan.findFirst({
        where: { slug: "free" },
      });
      planId = freePlan?.id;
    }

    return await db.listing.create({
      data: {
        title: stripHtml(input.title),
        slug,
        description: sanitizeRichText(input.description),
        ownerId,
        claimStatus: ClaimStatus.claimed,
        status: ListingStatus.pending_review,
        planId,
        phone: input.phone?.trim() || null,
        whatsapp: input.whatsapp?.trim() || null,
        email: input.email?.trim() || null,
        website: input.website?.trim() || null,
        address: stripHtml(input.address),
        locality: stripHtml(input.locality),
        landmark: input.landmark ? stripHtml(input.landmark) : null,
        latitude: input.latitude !== undefined ? new Prisma.Decimal(input.latitude) : null,
        longitude: input.longitude !== undefined ? new Prisma.Decimal(input.longitude) : null,
        yearEstablished: input.yearEstablished ?? null,
        priceRange: input.priceRange ?? 1,
        openingHours: input.openingHours ?? Prisma.DbNull,
        amenities: input.amenities ?? [],
        socialLinks: input.socialLinks ?? Prisma.DbNull,
        categories: {
          create: input.categoryIds.map((categoryId) => ({ categoryId })),
        },
        locations: {
          create: input.locationIds.map((locationId, idx) => ({
            locationId,
            isPrimary: idx === 0,
          })),
        },
      },
    });
  }

  /**
   * Retrieves a single listing by its primary ID (for admin/owner management)
   */
  static async getById(id: string) {
    return await db.listing.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
        plan: true,
        media: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Update an existing listing with strict DAL owner validation or admin bypass
   */
  static async update(
    ownerId: string,
    listingId: string,
    input: Partial<CreateListingInput> & {
      status?: ListingStatus;
      featured?: boolean;
      priority?: number;
      categoryIds?: string[];
      locationIds?: string[];
    },
    isAdmin: boolean = false
  ) {
    // Assert existence and ownership
    const where: any = { id: listingId };
    if (!isAdmin) {
      where.ownerId = ownerId;
    }

    const existing = await db.listing.findFirst({
      where,
    });

    if (!existing) {
      throw new Error("Listing not found or access denied.");
    }

    // Handle categories update if provided
    if (input.categoryIds) {
      await db.listingCategory.deleteMany({ where: { listingId } });
      if (input.categoryIds.length > 0) {
        await db.listingCategory.createMany({
          data: input.categoryIds.map((categoryId) => ({ listingId, categoryId })),
        });
      }
    }

    // Handle locations update if provided
    if (input.locationIds) {
      await db.listingLocation.deleteMany({ where: { listingId } });
      if (input.locationIds.length > 0) {
        await db.listingLocation.createMany({
          data: input.locationIds.map((locationId, idx) => ({
            listingId,
            locationId,
            isPrimary: idx === 0,
          })),
        });
      }
    }

    return await db.listing.update({
      where: { id: listingId },
      data: {
        ...(input.title && { title: stripHtml(input.title) }),
        ...(input.description !== undefined && { description: sanitizeRichText(input.description) }),
        ...(input.status !== undefined && {
          status: input.status,
          ...(input.status === ListingStatus.published && !existing.publishedAt && { publishedAt: new Date() }),
        }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.phone !== undefined && { phone: input.phone ? input.phone.trim() : null }),
        ...(input.whatsapp !== undefined && { whatsapp: input.whatsapp ? input.whatsapp.trim() : null }),
        ...(input.email !== undefined && { email: input.email ? input.email.trim() : null }),
        ...(input.website !== undefined && { website: input.website ? input.website.trim() : null }),
        ...(input.address && { address: stripHtml(input.address) }),
        ...(input.locality && { locality: stripHtml(input.locality) }),
        ...(input.landmark !== undefined && { landmark: input.landmark ? stripHtml(input.landmark) : null }),
        ...(input.latitude !== undefined && { latitude: input.latitude !== null ? new Prisma.Decimal(input.latitude) : null }),
        ...(input.longitude !== undefined && { longitude: input.longitude !== null ? new Prisma.Decimal(input.longitude) : null }),
        ...(input.yearEstablished !== undefined && { yearEstablished: input.yearEstablished }),
        ...(input.priceRange !== undefined && { priceRange: input.priceRange }),
        ...(input.openingHours !== undefined && { openingHours: input.openingHours ?? Prisma.DbNull }),
        ...(input.amenities !== undefined && { amenities: input.amenities }),
        ...(input.socialLinks !== undefined && { socialLinks: input.socialLinks ?? Prisma.DbNull }),
        ...(input.tagline !== undefined && { tagline: input.tagline ? stripHtml(input.tagline) : null }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle ? stripHtml(input.seoTitle) : null }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription ? stripHtml(input.seoDescription) : null }),
        ...(input.customSections !== undefined && { customSections: input.customSections ?? Prisma.DbNull }),
      },
    });
  }
}
