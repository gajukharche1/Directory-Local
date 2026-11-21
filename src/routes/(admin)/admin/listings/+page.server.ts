import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ url }) => {
  const statusFilter = url.searchParams.get("status") as ListingStatus | null;
  const query = url.searchParams.get("q") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

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

  const [
    listings,
    totalCount,
    publishedCount,
    pendingCount,
    draftCount,
    allCategories,
    allLocations,
  ] = await Promise.all([
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
                select: { id: true, name: true },
              },
            },
          },
          locations: {
            select: {
              location: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      })
      .catch(() => []),
    db.listing.count({ where: whereClause }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.published } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.pending_review } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.draft } }).catch(() => 0),
    db.category
      .findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      })
      .catch(() => []),
    db.location
      .findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      })
      .catch(() => []),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
    page,
    pageSize,
    totalPages,
    allCategories,
    allLocations,
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const listingId = formData.get("listingId") as string;
    const status = formData.get("status") as ListingStatus;

    if (!listingId || !status || !Object.values(ListingStatus).includes(status)) {
      return fail(400, { message: "Invalid listing or status" });
    }

    try {
      await db.listing.update({
        where: { id: listingId },
        data: { status },
      });
      return { success: true };
    } catch (err: any) {
      return fail(500, { message: err?.message || "Failed to update listing status" });
    }
  },

  bulkUpdateStatus: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;
    const status = formData.get("status") as ListingStatus;

    if (!rawIds || !status || !Object.values(ListingStatus).includes(status)) {
      return fail(400, { message: "Invalid parameters for bulk update" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { message: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { message: "No listings selected" });
    }

    try {
      const result = await db.listing.updateMany({
        where: { id: { in: ids } },
        data: { status },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { message: err?.message || "Failed to bulk update status" });
    }
  },

  bulkAssignCategory: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!rawIds || !categoryId) {
      return fail(400, { message: "Listing IDs and Category required" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { message: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { message: "No listings selected" });
    }

    try {
      const records = ids.map((listingId) => ({
        listingId,
        categoryId,
      }));

      await db.listingCategory.createMany({
        data: records,
        skipDuplicates: true,
      });

      return { success: true, count: ids.length };
    } catch (err: any) {
      return fail(500, { message: err?.message || "Failed to assign category" });
    }
  },

  bulkAssignLocation: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;
    const locationId = formData.get("locationId") as string;

    if (!rawIds || !locationId) {
      return fail(400, { message: "Listing IDs and Location required" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { message: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { message: "No listings selected" });
    }

    try {
      const records = ids.map((listingId) => ({
        listingId,
        locationId,
        isPrimary: false,
      }));

      await db.listingLocation.createMany({
        data: records,
        skipDuplicates: true,
      });

      return { success: true, count: ids.length };
    } catch (err: any) {
      return fail(500, { message: err?.message || "Failed to assign location" });
    }
  },

  bulkDelete: async ({ request }) => {
    const formData = await request.formData();
    const rawIds = formData.get("ids") as string;

    if (!rawIds) {
      return fail(400, { message: "Missing IDs for bulk delete" });
    }

    let ids: string[] = [];
    try {
      ids = JSON.parse(rawIds);
    } catch {
      return fail(400, { message: "Malformed IDs payload" });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return fail(400, { message: "No listings selected" });
    }

    try {
      const result = await db.listing.deleteMany({
        where: { id: { in: ids } },
      });
      return { success: true, count: result.count };
    } catch (err: any) {
      return fail(500, { message: err?.message || "Failed to bulk delete listings" });
    }
  },
};
