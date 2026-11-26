import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StorageService } from "$lib/services/storage.service";

export const POST: RequestHandler = async ({ request, url, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  const rawKey = url.searchParams.get("key");
  if (!rawKey) {
    return json({ error: "Missing required query parameter: key" }, { status: 400 });
  }

  const key = decodeURIComponent(rawKey);

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicUrl = await StorageService.saveLocalFile(key, buffer);
    return json({ success: true, url: publicUrl, key });
  } catch (err: any) {
    return json({ error: err.message || "Direct storage write failed." }, { status: 500 });
  }
};

export const PUT: RequestHandler = POST;
