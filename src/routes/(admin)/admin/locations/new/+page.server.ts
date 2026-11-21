import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/locations/new");
  }

  const parentLocations = await db.location.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  }).catch(() => []);

  return { parentLocations };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to create locations" });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    let slug = formData.get("slug")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;
    const parentId = formData.get("parentId")?.toString() || null;
    const latitudeStr = formData.get("latitude")?.toString().trim();
    const longitudeStr = formData.get("longitude")?.toString().trim();
    const featured = formData.get("featured") === "true" || formData.get("featured") === "on";

    if (!name) {
      return fail(400, { error: "Location name is required" });
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const latitude = latitudeStr ? parseFloat(latitudeStr) : null;
    const longitude = longitudeStr ? parseFloat(longitudeStr) : null;

    try {
      await db.location.create({
        data: {
          name,
          slug,
          description,
          parentId,
          latitude: latitude && !isNaN(latitude) ? latitude : null,
          longitude: longitude && !isNaN(longitude) ? longitude : null,
          featured,
        },
      });

      throw redirect(303, "/admin/locations");
    } catch (err: any) {
      if (err?.status === 303) throw err;
      return fail(500, { error: err?.message || "Failed to create location" });
    }
  },
};
