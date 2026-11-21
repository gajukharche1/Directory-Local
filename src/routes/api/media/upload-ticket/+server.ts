import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized. Please log in to upload media." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fileName, mimeType, bytes, listingId, folderId, altText } = body;

    if (!fileName || !mimeType || typeof bytes !== "number") {
      return json({ error: "Missing required file metadata: fileName, mimeType, bytes." }, { status: 400 });
    }

    const ticket = await MediaService.createUploadTicket(locals.user.id, {
      fileName,
      mimeType,
      bytes,
      listingId,
      folderId,
      altText,
    });

    return json({ ticket });
  } catch (err: any) {
    return json({ error: err.message || "Failed to generate upload ticket." }, { status: 400 });
  }
};
