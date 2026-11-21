import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/locations");
  }

  const locations = await db.location.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: {
        select: { id: true, name: true },
      },
      _count: {
        select: { listings: true, children: true },
      },
    },
  }).catch(() => []);

  return {
    locations: locations.map((loc) => ({
      ...loc,
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null,
      listingCount: loc._count.listings,
      sublocationsCount: loc._count.children,
    })),
    totalLocations: locations.length,
    rootLocationsCount: locations.filter((l) => !l.parentId).length,
    featuredCount: locations.filter((l) => l.featured).length,
  };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to delete locations" });
    }

    const formData = await request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return fail(400, { error: "Location ID required" });
    }

    try {
      await db.location.delete({ where: { id } });
      return { success: true };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to delete location" });
    }
  },
};
