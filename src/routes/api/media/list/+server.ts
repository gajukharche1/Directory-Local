import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized." }, { status: 401 });
  }

  const folderId = url.searchParams.get("folderId");
  const search = url.searchParams.get("search") || undefined;
  const limit = Number(url.searchParams.get("limit")) || 36;
  const page = Number(url.searchParams.get("page")) || 1;

  try {
    const isAdminOrMod = locals.user.role === "admin" || locals.user.role === "moderator";
    const result = isAdminOrMod
      ? await MediaService.getAdminMedia({
          folderId: folderId === "null" || folderId === "" ? null : folderId || undefined,
          search,
          limit,
          page,
          isQuarantined: false,
        })
      : await MediaService.getMerchantMedia(locals.user.id, {
          folderId: folderId === "null" || folderId === "" ? null : folderId || undefined,
          search,
          limit,
          page,
        });

    return json(result);
  } catch (err: any) {
    return json({ error: err.message || "Failed to fetch media." }, { status: 500 });
  }
};
