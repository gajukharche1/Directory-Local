import fs from "node:fs/promises";
import path from "node:path";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/db/client";

const uploadDir = path.resolve(process.cwd(), "static", "uploads");

export const GET: RequestHandler = async ({ params }) => {
  const relPath = params.path;
  if (!relPath) throw error(404, "Asset not found.");

  // 1. Try local disk first (for local development or persistent disk)
  try {
    const targetPath = path.normalize(path.resolve(uploadDir, relPath));
    if (targetPath.startsWith(path.normalize(uploadDir))) {
      const buffer = await fs.readFile(targetPath);
      const ext = path.extname(relPath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".svg") contentType = "image/svg+xml";
      else if (ext === ".ico") contentType = "image/x-icon";
      else if (ext === ".avif") contentType = "image/avif";

      return new Response(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {
    // File not on local disk (expected on Vercel / serverless)
  }

  // 2. Query database for serverless-stored media
  const posixKey = relPath.replace(/\\/g, "/");
  try {
    const media = await db.media.findFirst({
      where: {
        OR: [
          { key: posixKey },
          { url: `/uploads/${posixKey}` },
          { url: { endsWith: posixKey } },
        ],
      },
      select: {
        fileData: true,
        mimeType: true,
      },
    });

    if (media && media.fileData) {
      return new Response(Buffer.from(media.fileData), {
        headers: {
          "Content-Type": media.mimeType || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Check temporary buffer in case image is being viewed before confirm
    const buffered = await db.mediaUploadBuffer.findUnique({
      where: { key: posixKey },
      select: { data: true, mimeType: true },
    });

    if (buffered && buffered.data) {
      return new Response(Buffer.from(buffered.data), {
        headers: {
          "Content-Type": buffered.mimeType || "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (err: any) {
    console.error("Error retrieving media from database:", err);
  }

  throw error(404, "Asset not found.");
};
