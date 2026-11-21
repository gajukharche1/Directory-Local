import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ url }) => {
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

  const [listings, totalCount, publishedCount, pendingCount, draftCount] = await Promise.all([
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
    db.listing.count({ where: { status: ListingStatus.published } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.pending_review } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.draft } }).catch(() => 0),
  ]);

  return {
    listings: listings.map((l) => ({
      ...l,
      averageRating: Number(l.averageRating),
    })),
    totalCount,
    publishedCount,
    pendingCount,
    draftCount,
    statusFilter: statusFilter || "",
    query,
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
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

  bulkUpdateStatus: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;
    const status = formData.get("status") as ListingStatus;

    let ids: string[] = [];
    try {
      if (rawIds) {
        ids = JSON.parse(rawIds);
      } else {
        ids = formData.getAll("ids") as string[];
      }
    } catch {
      ids = formData.getAll("ids") as string[];
    }

    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return fail(400, { error: "Valid listing IDs and target status are required" });
    }

    if (!Object.values(ListingStatus).includes(status)) {
      return fail(400, { error: "Invalid status value provided" });
    }

    try {
      const result = await db.listing.updateMany({
        where: { id: { in: ids } },
        data: {
          status,
          ...(status === ListingStatus.published && { publishedAt: new Date() }),
        },
      });

      return {
        success: true,
        count: result.count,
        message: `Successfully updated ${result.count} listing(s) to ${status.replace("_", " ")}`,
      };
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : "Failed to bulk update listing statuses",
      });
    }
  },

  bulkDelete: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;

    let ids: string[] = [];
    try {
      if (rawIds) {
        ids = JSON.parse(rawIds);
      } else {
        ids = formData.getAll("ids") as string[];
      }
    } catch {
      ids = formData.getAll("ids") as string[];
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { error: "Listing IDs required for deletion" });
    }

    try {
      const result = await db.listing.deleteMany({
        where: { id: { in: ids } },
      });

      return {
        success: true,
        count: result.count,
        message: `Successfully deleted ${result.count} listing(s)`,
      };
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : "Failed to bulk delete listings",
      });
    }
  },
};
