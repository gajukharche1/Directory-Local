import { t as TaxonomyService } from "../../../../../chunks/taxonomy.service.js";
import { error } from "@sveltejs/kit";
// src/routes/(public)/category/[...slug]/+page.server.ts
var load = async ({ params }) => {
	const slugArray = params.slug ? params.slug.split("/").filter(Boolean) : [];
	if (slugArray.length === 0) throw error(404, "Category not found");
	const category = await TaxonomyService.getCategoryBySlugPath(slugArray);
	if (!category) throw error(404, "Category not found");
	return {
		category,
		listings: await TaxonomyService.getListingsByCategory(category.id),
		slugPath: params.slug
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map