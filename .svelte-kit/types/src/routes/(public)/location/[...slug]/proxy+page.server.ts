// @ts-nocheck
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TaxonomyService } from "$lib/services/taxonomy.service";

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const slugArray = params.slug ? params.slug.split("/").filter(Boolean) : [];
  if (slugArray.length === 0) {
    throw error(404, "Location not found");
  }

  const location = await TaxonomyService.getLocationBySlugPath(slugArray);

  if (!location) {
    throw error(404, "Location not found");
  }

  const listings = await TaxonomyService.getListingsByLocation(location.id);

  return {
    location,
    listings,
    slugPath: params.slug,
  };
};
