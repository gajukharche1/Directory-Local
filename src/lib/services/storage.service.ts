import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

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
   * If S3/R2 credentials are set, generates a presigned PUT URL.
   * Otherwise, provides a direct local upload URL fallback.
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

    const r2Bucket = process.env.STORAGE_BUCKET;
    const r2Endpoint = process.env.STORAGE_ENDPOINT;
    const r2AccessKey = process.env.STORAGE_ACCESS_KEY_ID;
    const r2SecretKey = process.env.STORAGE_SECRET_ACCESS_KEY;
    const publicBaseUrl = process.env.STORAGE_PUBLIC_URL || process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL;

    // Cloud S3 / Cloudflare R2 Presigned Upload
    if (r2Bucket && r2Endpoint && r2AccessKey && r2SecretKey) {
      const publicUrl = publicBaseUrl 
        ? `${publicBaseUrl.replace(/\/+$/, "")}/${objectKey}`
        : `${r2Endpoint.replace(/\/+$/, "")}/${r2Bucket}/${objectKey}`;

      return {
        key: objectKey,
        uploadUrl: `/api/media/upload-direct?key=${encodeURIComponent(objectKey)}`,
        publicUrl,
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
        isDirectLocal: false,
      };
    }

    // Local Disk Fallback (WordPress YYYY/MM structure under /uploads/)
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
   * Saves a buffer directly to local storage (for fallback / local dev)
   * Ensures parent directories (e.g. static/uploads/YYYY/MM/) are created recursively.
   */
  static async saveLocalFile(key: string, buffer: Buffer): Promise<string> {
    const normalizedDir = path.normalize(this.uploadDir);
    const targetPath = path.normalize(path.resolve(this.uploadDir, key));
    if (!targetPath.startsWith(normalizedDir)) {
      throw new Error("Invalid path traversal attempted.");
    }

    const parentDir = path.dirname(targetPath);
    await fs.mkdir(parentDir, { recursive: true });
    await fs.writeFile(targetPath, buffer);

    const posixKey = key.replace(/\\/g, "/");
    return `/uploads/${posixKey}`;
  }

  /**
   * Deletes a local or remote object
   */
  static async deleteFile(key: string): Promise<boolean> {
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
