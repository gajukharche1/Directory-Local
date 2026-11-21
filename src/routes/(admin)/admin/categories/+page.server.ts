import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/categories");
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

  const [categories, totalCount, parentCount, featuredCount] = await Promise.all([
    db.category.findMany({
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
    db.category.count({ where: whereClause }).catch(() => 0),
    db.category.count({ where: { parentId: null } }).catch(() => 0),
    db.category.count({ where: { featuredOnHome: true } }).catch(() => 0),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    categories: categories.map((cat) => ({
      ...cat,
      listingCount: cat._count.listings,
      subcategoriesCount: cat._count.children,
    })),
    totalCategories: totalCount,
    parentCategoriesCount: parentCount,
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
      return fail(403, { error: "Admin role required to delete categories" });
    }

    const formData = await request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return fail(400, { error: "Category ID required" });
    }

    try {
      await db.category.delete({ where: { id } });
      return { success: true };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to delete category" });
    }
  },

  bulkDelete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to delete categories" });
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
      return fail(400, { error: "No categories selected" });
    }

    try {
      const result = await db.category.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to bulk delete categories" });
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
      return fail(400, { error: "No categories selected" });
    }

    try {
      const result = await db.category.updateMany({
        where: { id: { in: ids } },
        data: { featuredOnHome: featured },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to bulk update categories" });
    }
  },
};
