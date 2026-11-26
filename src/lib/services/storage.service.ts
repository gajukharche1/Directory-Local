import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import db from "$lib/db/client";

export interface StorageTicket {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
  isDirectLocal: boolean;
}

export class StorageService {
  private static uploadDir = path.resolve(process.cwd(), "static", "uploads");

  /**
   * Generates a ticket for file upload.
   * Organizes storage keys using WordPress date-based structure: YYYY/MM/filename-suffix.ext
   */
  static async createUploadTicket(
    fileName: string,
    mimeType: string,
    fileBytes: number,
    prefix?: string
  ): Promise<StorageTicket> {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const datePrefix = prefix || `${year}/${month}`;

    let ext = path.extname(fileName).toLowerCase();
    if (!ext) {
      if (mimeType.includes("icon") || mimeType.includes("ico")) ext = ".ico";
      else if (mimeType.includes("svg")) ext = ".svg";
      else if (mimeType.includes("png")) ext = ".png";
      else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
      else ext = ".webp";
    }
    const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;

    // WordPress-style clean filename slug + unique suffix
    const rawBase = path.basename(fileName, ext);
    const sanitizedBase = rawBase
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "upload";

    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const sanitizedPrefix = datePrefix.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/^\/+|\/+$/g, "");
    const objectKey = `${sanitizedPrefix}/${sanitizedBase}-${uniqueSuffix}.${cleanExt}`;

    const r2Bucket = process.env.STORAGE_BUCKET || process.env.R2_BUCKET_NAME;
    const r2Endpoint =
      process.env.STORAGE_ENDPOINT ||
      (process.env.R2_ACCOUNT_ID
        ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
        : undefined);
    const r2AccessKey = process.env.STORAGE_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.STORAGE_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
    const publicBaseUrl =
      process.env.STORAGE_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL;

    // Cloud S3 / Cloudflare R2 Presigned Upload
    if (r2Bucket && r2Endpoint && r2AccessKey && r2SecretKey) {
      const publicUrl = publicBaseUrl
        ? `${publicBaseUrl.replace(/\/+$/, "")}/${objectKey}`
        : `${r2Endpoint.replace(/\/+$/, "")}/${r2Bucket}/${objectKey}`;

      return {
        key: objectKey,
        uploadUrl: `/api/media/upload-direct?key=${encodeURIComponent(objectKey)}`,
        publicUrl,
        method: "POST",
        headers: {
          "Content-Type": mimeType,
        },
        isDirectLocal: false,
      };
    }

    // Default: WordPress YYYY/MM structure under /uploads/
    const publicUrl = `/uploads/${objectKey}`;

    return {
      key: objectKey,
      uploadUrl: `/api/media/upload-direct?key=${encodeURIComponent(objectKey)}`,
      publicUrl,
      method: "POST",
      isDirectLocal: true,
    };
  }

  /**
   * Saves a buffer to storage.
   * Attempts local filesystem write (for dev or persistent servers).
   * If local disk write fails (e.g. read-only filesystem on Vercel Serverless),
   * transparently persists buffer to database storage so upload never fails.
   */
  static async saveLocalFile(
    key: string,
    buffer: Buffer,
    mimeType: string = "image/jpeg"
  ): Promise<string> {
    const posixKey = key.replace(/\\/g, "/");

    // Path traversal security check (must always throw on malicious input)
    const normalizedDir = path.normalize(this.uploadDir);
    const targetPath = path.normalize(path.resolve(this.uploadDir, key));
    if (!targetPath.startsWith(normalizedDir)) {
      throw new Error("Invalid path traversal attempted.");
    }

    try {
      const parentDir = path.dirname(targetPath);
      await fs.mkdir(parentDir, { recursive: true });
      await fs.writeFile(targetPath, buffer);
      return `/uploads/${posixKey}`;
    } catch (diskErr: any) {
      // Vercel Serverless / Read-Only Filesystem Fallback
      console.warn(
        `Local disk write unavailable (${diskErr.message}), persisting to database buffer for ${posixKey}`
      );

      await db.mediaUploadBuffer.upsert({
        where: { key: posixKey },
        create: {
          key: posixKey,
          data: buffer,
          mimeType,
        },
        update: {
          data: buffer,
          mimeType,
        },
      });

      return `/uploads/${posixKey}`;
    }
  }

  /**
   * Deletes a local or remote object
   */
  static async deleteFile(key: string): Promise<boolean> {
    const posixKey = key.replace(/\\/g, "/");
    try {
      await db.mediaUploadBuffer.delete({ where: { key: posixKey } }).catch(() => {});
    } catch {
      // Non-fatal
    }

    try {
      const normalizedDir = path.normalize(this.uploadDir);
      const targetPath = path.normalize(path.resolve(this.uploadDir, key));
      if (targetPath.startsWith(normalizedDir)) {
        await fs.unlink(targetPath);
        return true;
      }
    } catch {
      // Non-fatal if file doesn't exist
    }
    return false;
  }
}
