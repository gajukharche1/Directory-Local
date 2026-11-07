// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { TaxonomyService } from "$lib/services/taxonomy.service";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load = async () => {
  const [categories, locations, featuredListings] = await Promise.all([
    TaxonomyService.getFeaturedCategories(),
    TaxonomyService.getFeaturedLocations(),
    db.listing
      .findMany({
        where: {
          status: ListingStatus.published,
          featured: true,
        },
        include: {
          plan: true,
          media: {
            where: { scanStatus: "clean" },
            take: 1,
          },
          categories: {
            include: { category: true },
            take: 1,
          },
        },
        orderBy: [{ priority: "desc" }, { averageRating: "desc" }],
        take: 6,
      })
      .catch(() => []),
  ]);

  return {
    categories,
    locations,
    featuredListings,
  };
};
;null as any as PageServerLoad;