// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { SearchService } from "$lib/services/search.service";
import db from "$lib/db/client";

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const q = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "all";
  const location = url.searchParams.get("location") || "all";
  const minRatingParam = url.searchParams.get("minRating");
  const minRating = minRatingParam ? parseFloat(minRatingParam) : 0;
  const sortParam = url.searchParams.get("sort");
  const sort = (sortParam as "relevance" | "rating" | "newest" | "priority") || "priority";
  const view = (url.searchParams.get("view") as "list" | "map") || "list";
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
      limit: 12,
    }),
    db.category
      .findMany({
        select: { id: true, slug: true, name: true },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
    db.location
      .findMany({
        select: { id: true, slug: true, name: true },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
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
    allLocations,
  };
};
