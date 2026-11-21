import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/locations");
  }

  const query = url.searchParams.get("q") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const whereClause: any = {};
  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  const [locations, totalCount, rootCount, featuredCount] = await Promise.all([
    db.location.findMany({
      where: whereClause,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take: pageSize,
      include: {
        parent: {
          select: { id: true, name: true },
        },
        _count: {
          select: { listings: true, children: true },
        },
      },
    }).catch(() => []),
    db.location.count({ where: whereClause }).catch(() => 0),
    db.location.count({ where: { parentId: null } }).catch(() => 0),
    db.location.count({ where: { featured: true } }).catch(() => 0),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    locations: locations.map((loc) => ({
      ...loc,
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null,
      listingCount: loc._count.listings,
      sublocationsCount: loc._count.children,
    })),
    totalLocations: totalCount,
    rootLocationsCount: rootCount,
    featuredCount,
    page,
    pageSize,
    totalPages,
    query,
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

  bulkDelete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to delete locations" });
    }

    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;

    if (!rawIds) {
      return fail(400, { error: "Missing IDs for bulk delete" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { error: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { error: "No locations selected" });
    }

    try {
      const result = await db.location.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to bulk delete locations" });
    }
  },

  bulkFeature: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Unauthorized access" });
    }

    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;
    const featured = formData.get("featured") === "true";

    if (!rawIds) {
      return fail(400, { error: "Missing IDs for bulk update" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { error: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { error: "No locations selected" });
    }

    try {
      const result = await db.location.updateMany({
        where: { id: { in: ids } },
        data: { featured },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to bulk update locations" });
    }
  },
};
