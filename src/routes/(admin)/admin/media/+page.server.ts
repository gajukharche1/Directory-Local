import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/media");
  }

  const search = url.searchParams.get("q") || undefined;
  const statusFilter = url.searchParams.get("status");
  const folderId = url.searchParams.get("folderId");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

  let isQuarantined: boolean | undefined = undefined;
  if (statusFilter === "quarantined") isQuarantined = true;
  if (statusFilter === "clean") isQuarantined = false;

  const [mediaData, folders] = await Promise.all([
    MediaService.getAdminMedia({
      search,
      isQuarantined,
      folderId: folderId === "null" || folderId === "" ? null : folderId || undefined,
      page,
      limit: 24,
    }),
    MediaService.getFolders(null),
  ]);

  return {
    media: {
      ...mediaData,
      items: JSON.parse(JSON.stringify(mediaData.items)),
    },
    folders: JSON.parse(JSON.stringify(folders)),
    activeFolderId: folderId || null,
    searchQuery: search || "",
    statusFilter: statusFilter || "",
  };
};

export const actions: Actions = {
  createFolder: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

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
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin privilege required to delete folders." });
    }

    const formData = await request.formData();
    const folderId = formData.get("folderId")?.toString();

    if (!folderId) return fail(400, { error: "Folder ID is required." });

    try {
      await MediaService.deleteFolder(folderId, locals.user.id, true);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to delete folder." });
    }
  },

  moveMedia: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();
    const mediaIdsJson = formData.get("mediaIds")?.toString();
    const targetFolderId = formData.get("targetFolderId")?.toString() || null;

    if (!mediaIdsJson) return fail(400, { error: "Missing media IDs." });

    try {
      const mediaIds = JSON.parse(mediaIdsJson);
      await MediaService.moveMediaToFolder(
        mediaIds,
        targetFolderId === "root" ? null : targetFolderId,
        locals.user.id,
        true
      );
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to move media assets." });
    }
  },

  toggleQuarantine: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();
    const mediaId = formData.get("mediaId")?.toString();
    const isQuarantined = formData.get("isQuarantined") === "true";

    if (!mediaId) return fail(400, { error: "Media ID required." });

    try {
      await MediaService.toggleQuarantine(mediaId, isQuarantined);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to update quarantine status." });
    }
  },

  batchQuarantine: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();
    const mediaIdsJson = formData.get("mediaIds")?.toString();
    const isQuarantined = formData.get("isQuarantined") === "true";

    if (!mediaIdsJson) return fail(400, { error: "Missing media IDs." });

    try {
      const mediaIds = JSON.parse(mediaIdsJson);
      await MediaService.batchQuarantine(mediaIds, isQuarantined);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to batch update quarantine status." });
    }
  },

  deleteMedia: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin privilege required to delete." });
    }

    const formData = await request.formData();
    const mediaId = formData.get("mediaId")?.toString();

    if (!mediaId) return fail(400, { error: "Media ID required." });

    try {
      await MediaService.deleteMedia(mediaId, locals.user.id, true);
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to delete media asset." });
    }
  },

  batchDeleteMedia: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin privilege required to delete." });
    }

    const formData = await request.formData();
    const mediaIdsJson = formData.get("mediaIds")?.toString();

    if (!mediaIdsJson) return fail(400, { error: "Missing media IDs." });

    try {
      const mediaIds = JSON.parse(mediaIdsJson);
      for (const id of mediaIds) {
        await MediaService.deleteMedia(id, locals.user.id, true);
      }
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to batch delete media assets." });
    }
  },
};
