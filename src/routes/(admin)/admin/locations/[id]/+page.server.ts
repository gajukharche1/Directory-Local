import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, `/login?redirectTo=/admin/locations/${params.id}`);
  }

  const [location, parentLocations] = await Promise.all([
    db.location.findUnique({
      where: { id: params.id },
      include: {
        parent: { select: { id: true, name: true } },
      },
    }),
    db.location.findMany({
      where: { parentId: null, id: { not: params.id } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }).catch(() => []),
  ]);

  if (!location) {
    throw error(404, "Location not found");
  }

  return {
    location: {
      ...location,
      latitude: location.latitude ? Number(location.latitude) : null,
      longitude: location.longitude ? Number(location.longitude) : null,
    },
    parentLocations,
  };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to update locations" });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    let slug = formData.get("slug")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;
    const parentId = formData.get("parentId")?.toString() || null;
    const latitudeStr = formData.get("latitude")?.toString().trim();
    const longitudeStr = formData.get("longitude")?.toString().trim();
    const featured = formData.get("featured") === "true" || formData.get("featured") === "on";

    const seoTitle = formData.get("seoTitle")?.toString().trim() || null;
    const seoDescription = formData.get("seoDescription")?.toString().trim() || null;
    const seoKeywords = formData.get("seoKeywords")?.toString().trim() || null;
    const ogImage = formData.get("ogImage")?.toString().trim() || null;

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
      await db.location.update({
        where: { id: params.id },
        data: {
          name,
          slug,
          description,
          parentId,
          latitude: latitude && !isNaN(latitude) ? latitude : null,
          longitude: longitude && !isNaN(longitude) ? longitude : null,
          featured,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImage,
          coverImage: ogImage,
        },
      });

      return { success: true };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to update location" });
    }
  },
};
