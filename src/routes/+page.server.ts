import type { PageServerLoad } from "./$types";
import { TaxonomyService } from "$lib/services/taxonomy.service";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async () => {
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

  return toPOJO({
    categories,
    locations,
    featuredListings,
  });
};
