import { t as TaxonomyService } from "../../../../../chunks/taxonomy.service.js";
import { error } from "@sveltejs/kit";
// src/routes/(public)/location/[...slug]/+page.server.ts
var load = async ({ params }) => {
	const slugArray = params.slug ? params.slug.split("/").filter(Boolean) : [];
	if (slugArray.length === 0) throw error(404, "Location not found");
	const location = await TaxonomyService.getLocationBySlugPath(slugArray);
	if (!location) throw error(404, "Location not found");
	return {
		location,
		listings: await TaxonomyService.getListingsByLocation(location.id),
		slugPath: params.slug
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map