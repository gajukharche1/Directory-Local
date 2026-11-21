import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/categories");
  }

  const categories = await db.category.findMany({
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

  const totalCategories = categories.length;
  const parentCategoriesCount = categories.filter((c) => !c.parentId).length;
  const featuredCount = categories.filter((c) => c.featuredOnHome).length;

  return {
    categories: categories.map((cat) => ({
      ...cat,
      listingCount: cat._count.listings,
      subcategoriesCount: cat._count.children,
    })),
    totalCategories,
    parentCategoriesCount,
    featuredCount,
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
};
