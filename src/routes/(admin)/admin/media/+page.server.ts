import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { MediaService } from "$lib/services/media.service";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/media");
  }

  const search = url.searchParams.get("q") || undefined;
  const statusFilter = url.searchParams.get("status");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

  let isQuarantined: boolean | undefined = undefined;
  if (statusFilter === "quarantined") isQuarantined = true;
  if (statusFilter === "clean") isQuarantined = false;

  const mediaData = await MediaService.getAdminMedia({
    search,
    isQuarantined,
    page,
    limit: 30,
  });

  return {
    media: {
      ...mediaData,
      items: JSON.parse(JSON.stringify(mediaData.items)),
    },
    searchQuery: search || "",
    statusFilter: statusFilter || "",
  };
};

export const actions: Actions = {
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
};
