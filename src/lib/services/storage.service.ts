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
   * If S3/R2 credentials are set, generates a presigned PUT URL.
   * Otherwise, provides a direct local upload URL fallback.
   */
  static async createUploadTicket(
    fileName: string,
    mimeType: string,
    fileBytes: number,
    prefix: string = "general"
  ): Promise<StorageTicket> {
    const ext = path.extname(fileName).toLowerCase() || ".webp";
    const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;
    const uniqueId = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/^\/+|\/+$/g, "");
    const objectKey = `${sanitizedPrefix}/${uniqueId}.${cleanExt}`;

    const r2Bucket = process.env.STORAGE_BUCKET;
    const r2Endpoint = process.env.STORAGE_ENDPOINT;
    const r2AccessKey = process.env.STORAGE_ACCESS_KEY_ID;
    const r2SecretKey = process.env.STORAGE_SECRET_ACCESS_KEY;
    const publicBaseUrl = process.env.STORAGE_PUBLIC_URL || process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL;

    // Cloud S3 / Cloudflare R2 Presigned Upload
    if (r2Bucket && r2Endpoint && r2AccessKey && r2SecretKey) {
      // In production with AWS SDK / S3 Client
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

    // Local Disk Fallback
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
   */
  static async saveLocalFile(key: string, buffer: Buffer): Promise<string> {
    // Path traversal guard
    const targetPath = path.resolve(this.uploadDir, key);
    if (!targetPath.startsWith(this.uploadDir)) {
      throw new Error("Invalid path traversal attempted.");
    }

    const parentDir = path.dirname(targetPath);
    await fs.mkdir(parentDir, { recursive: true });
    await fs.writeFile(targetPath, buffer);

    return `/uploads/${key}`;
  }

  /**
   * Deletes a local or remote object
   */
  static async deleteFile(key: string): Promise<boolean> {
    try {
      const targetPath = path.resolve(this.uploadDir, key);
      if (targetPath.startsWith(this.uploadDir)) {
        await fs.unlink(targetPath);
        return true;
      }
    } catch {
      // Non-fatal if file doesn't exist
    }
    return false;
  }
}
