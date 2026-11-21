import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, url: publicUrl, mimeType, bytes, fileName, listingId, folderId, altText, width, height } = body;

    if (!key || !publicUrl || !mimeType || typeof bytes !== "number") {
      return json({ error: "Missing required media confirmation metadata." }, { status: 400 });
    }

    const media = await MediaService.confirmUpload(locals.user.id, {
      key,
      url: publicUrl,
      mimeType,
      bytes,
      fileName,
      listingId,
      folderId,
      altText,
      width,
      height,
    });

    return json({ success: true, media }, { status: 201 });
  } catch (err: any) {
    return json({ error: err.message || "Failed to confirm media upload." }, { status: 400 });
  }
};
