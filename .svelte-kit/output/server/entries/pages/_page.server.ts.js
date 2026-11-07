import { t as TaxonomyService } from "../../chunks/taxonomy.service.js";
import { t as db } from "../../chunks/client.js";
import { ListingStatus } from "@prisma/client";
// src/routes/+page.server.ts
var load = async () => {
	const [categories, locations, featuredListings] = await Promise.all([
		TaxonomyService.getFeaturedCategories(),
		TaxonomyService.getFeaturedLocations(),
		db.listing.findMany({
			where: {
				status: ListingStatus.published,
				featured: true
			},
			include: {
				plan: true,
				media: {
					where: { scanStatus: "clean" },
					take: 1
				},
				categories: {
					include: { category: true },
					take: 1
				}
			},
			orderBy: [{ priority: "desc" }, { averageRating: "desc" }],
			take: 6
		}).catch(() => [])
	]);
	return {
		categories,
		locations,
		featuredListings
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map