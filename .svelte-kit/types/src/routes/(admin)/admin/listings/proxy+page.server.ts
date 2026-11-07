// @ts-nocheck
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const statusFilter = url.searchParams.get("status") as ListingStatus | null;
  const query = url.searchParams.get("q") || "";

  const whereClause: any = {};
  if (statusFilter && Object.values(ListingStatus).includes(statusFilter)) {
    whereClause.status = statusFilter;
  }
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { address: { contains: query, mode: "insensitive" } },
      { locality: { contains: query, mode: "insensitive" } },
    ];
  }

  const [listings, totalCount] = await Promise.all([
    db.listing
      .findMany({
        where: whereClause,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          locality: true,
          address: true,
          phone: true,
          averageRating: true,
          reviewCount: true,
          createdAt: true,
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
      .catch(() => []),
    db.listing.count({ where: whereClause }).catch(() => 0),
  ]);

  return {
    listings: listings.map((l) => ({
      ...l,
      averageRating: Number(l.averageRating),
    })),
    totalCount,
    statusFilter: statusFilter || "",
    query,
  };
};

export const actions = {
  updateStatus: async ({ request }: import('./$types').RequestEvent) => {
    const formData = await request.formData();
    const listingId = formData.get("listingId") as string;
    const status = formData.get("status") as ListingStatus;

    if (!listingId || !status) {
      return fail(400, { error: "Listing ID and status required" });
    }

    try {
      await db.listing.update({
        where: { id: listingId },
        data: {
          status,
          ...(status === ListingStatus.published && { publishedAt: new Date() }),
        },
      });
      return { success: true };
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : "Failed to update listing status",
      });
    }
  },
};
;null as any as Actions;