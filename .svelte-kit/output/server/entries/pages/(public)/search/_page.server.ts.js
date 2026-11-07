import { t as SearchService } from "../../../../chunks/search.service.js";
import { t as db } from "../../../../chunks/client.js";
// src/routes/(public)/search/+page.server.ts
var load = async ({ url }) => {
	const q = url.searchParams.get("q") || "";
	const category = url.searchParams.get("category") || "all";
	const location = url.searchParams.get("location") || "all";
	const minRatingParam = url.searchParams.get("minRating");
	const minRating = minRatingParam ? parseFloat(minRatingParam) : 0;
	const sort = url.searchParams.get("sort") || "priority";
	const view = url.searchParams.get("view") || "list";
	const pageParam = url.searchParams.get("page");
	const page = pageParam ? parseInt(pageParam, 10) : 1;
	const [searchResult, allCategories, allLocations] = await Promise.all([
		SearchService.search({
			q,
			category,
			location,
			minRating,
			sort,
			page,
			limit: 12
		}),
		db.category.findMany({
			select: {
				id: true,
				slug: true,
				name: true
			},
			orderBy: { sortOrder: "asc" }
		}).catch(() => []),
		db.location.findMany({
			select: {
				id: true,
				slug: true,
				name: true
			},
			orderBy: { sortOrder: "asc" }
		}).catch(() => [])
	]);
	return {
		q,
		category,
		location,
		minRating,
		sort,
		view,
		searchResult,
		allCategories,
		allLocations
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map