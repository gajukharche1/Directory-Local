import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(303, "/login?redirectTo=/dashboard/media");
  }

  const folderId = url.searchParams.get("folderId");
  const search = url.searchParams.get("q") || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

  const [mediaData, folders] = await Promise.all([
    MediaService.getMerchantMedia(locals.user.id, {
      folderId: folderId === "null" || folderId === "" ? null : folderId || undefined,
      search,
      page,
      limit: 24,
    }),
    MediaService.getFolders(locals.user.id),
  ]);

  return {
    media: {
      ...mediaData,
      items: JSON.parse(JSON.stringify(mediaData.items)),
    },
    folders: JSON.parse(JSON.stringify(folders)),
    activeFolderId: folderId || null,
    searchQuery: search || "",
  };
};

export const actions: Actions = {
  createFolder: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const formData = await request.formData();
    const name = formData.get("name")?.toString()?.trim();
    const parentId = formData.get("parentId")?.toString() || undefined;

    if (!name) {
      return fail(400, { error: "Folder name is required." });
    }

    try {
      const folder = await MediaService.createFolder(locals.user.id, name, parentId);
      return { success: true, folder: JSON.parse(JSON.stringify(folder)) };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to create folder." });
    }
  },

  deleteFolder: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const formData = await request.formData();
    const folderId = formData.get("folderId")?.toString();

    if (!folderId) return fail(400, { error: "Folder ID is required." });

    try {
      await MediaService.deleteFolder(folderId, locals.user.id);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to delete folder." });
    }
  },

  deleteMedia: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const formData = await request.formData();
    const mediaId = formData.get("mediaId")?.toString();

    if (!mediaId) return fail(400, { error: "Media ID is required." });

    try {
      await MediaService.deleteMedia(mediaId, locals.user.id);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to delete media asset." });
    }
  },

  moveMedia: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const formData = await request.formData();
    const mediaIdsJson = formData.get("mediaIds")?.toString();
    const targetFolderId = formData.get("targetFolderId")?.toString() || null;

    if (!mediaIdsJson) return fail(400, { error: "Missing media IDs." });

    try {
      const mediaIds = JSON.parse(mediaIdsJson);
      await MediaService.moveMediaToFolder(mediaIds, targetFolderId === "root" ? null : targetFolderId, locals.user.id);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to move media assets." });
    }
  },
};
