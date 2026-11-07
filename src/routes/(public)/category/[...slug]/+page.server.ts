import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TaxonomyService } from "$lib/services/taxonomy.service";

export const load: PageServerLoad = async ({ params }) => {
  const slugArray = params.slug ? params.slug.split("/").filter(Boolean) : [];
  if (slugArray.length === 0) {
    throw error(404, "Category not found");
  }

  const category = await TaxonomyService.getCategoryBySlugPath(slugArray);

  if (!category) {
    throw error(404, "Category not found");
  }

  const listings = await TaxonomyService.getListingsByCategory(category.id);

  return {
    category,
    listings,
    slugPath: params.slug,
  };
};
