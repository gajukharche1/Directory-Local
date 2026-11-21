import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/categories/new");
  }

  const parentCategories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  }).catch(() => []);

  return { parentCategories };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to create categories" });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    let slug = formData.get("slug")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;
    const parentId = formData.get("parentId")?.toString() || null;
    const icon = formData.get("icon")?.toString().trim() || null;
    const featuredOnHome = formData.get("featuredOnHome") === "true" || formData.get("featuredOnHome") === "on";
    const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10);

    if (!name) {
      return fail(400, { error: "Category name is required" });
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    try {
      await db.category.create({
        data: {
          name,
          slug,
          description,
          parentId,
          icon,
          featuredOnHome,
          sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
        },
      });

      throw redirect(303, "/admin/categories");
    } catch (err: any) {
      if (err?.status === 303) throw err;
      return fail(500, { error: err?.message || "Failed to create category" });
    }
  },
};
