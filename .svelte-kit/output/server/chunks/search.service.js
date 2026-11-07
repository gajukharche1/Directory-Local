import { t as db } from "./client.js";
import { ListingStatus, Prisma } from "@prisma/client";
// src/lib/services/search.service.ts
var SearchService = class {
	/**
	* Executes a robust multi-criteria search across listings
	*/
	static async search(params) {
		const { q, category, location, minRating, priceRange, featured, sort = "priority", page = 1, limit = 12 } = params;
		const skip = (page - 1) * limit;
		const where = { status: ListingStatus.published };
		if (q && q.trim().length > 0) {
			const keyword = q.trim();
			where.OR = [
				{ title: {
					contains: keyword,
					mode: "insensitive"
				} },
				{ description: {
					contains: keyword,
					mode: "insensitive"
				} },
				{ locality: {
					contains: keyword,
					mode: "insensitive"
				} },
				{ landmark: {
					contains: keyword,
					mode: "insensitive"
				} },
				{ categories: { some: { category: { name: {
					contains: keyword,
					mode: "insensitive"
				} } } } }
			];
		}
		if (category && category !== "all") where.categories = { some: { category: { slug: category } } };
		if (location && location !== "all") where.OR = [
			...where.OR || [],
			{ locality: {
				contains: location,
				mode: "insensitive"
			} },
			{ locations: { some: { location: { slug: location } } } }
		];
		if (minRating && minRating > 0) where.averageRating = { gte: new Prisma.Decimal(minRating) };
		if (priceRange && priceRange > 0) where.priceRange = priceRange;
		if (featured) where.featured = true;
		let orderBy = [];
		switch (sort) {
			case "rating":
				orderBy = [{ averageRating: "desc" }, { reviewCount: "desc" }];
				break;
			case "newest":
				orderBy = [{ publishedAt: "desc" }];
				break;
			default: orderBy = [
				{ priority: "desc" },
				{ averageRating: "desc" },
				{ publishedAt: "desc" }
			];
		}
		try {
			const [total, listings] = await Promise.all([db.listing.count({ where }), db.listing.findMany({
				where,
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
				orderBy,
				skip,
				take: limit
			})]);
			return {
				listings,
				total,
				totalPages: Math.ceil(total / limit),
				currentPage: page
			};
		} catch {
			return {
				listings: [],
				total: 0,
				totalPages: 1,
				currentPage: page
			};
		}
	}
	/**
	* Fast autocomplete suggestions for the global search bar
	*/
	static async getSuggestions(query) {
		if (!query || query.trim().length < 2) return {
			listings: [],
			categories: [],
			locations: []
		};
		const keyword = query.trim();
		try {
			const [listings, categories, locations] = await Promise.all([
				db.listing.findMany({
					where: {
						status: ListingStatus.published,
						title: {
							contains: keyword,
							mode: "insensitive"
						}
					},
					select: {
						id: true,
						title: true,
						slug: true,
						locality: true
					},
					take: 5
				}),
				db.category.findMany({
					where: { name: {
						contains: keyword,
						mode: "insensitive"
					} },
					select: {
						id: true,
						name: true,
						slug: true
					},
					take: 3
				}),
				db.location.findMany({
					where: { name: {
						contains: keyword,
						mode: "insensitive"
					} },
					select: {
						id: true,
						name: true,
						slug: true
					},
					take: 3
				})
			]);
			return {
				listings,
				categories,
				locations
			};
		} catch {
			return {
				listings: [],
				categories: [],
				locations: []
			};
		}
	}
};
export { SearchService as t };

//# sourceMappingURL=search.service.js.map