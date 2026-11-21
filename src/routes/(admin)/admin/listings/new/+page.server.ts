import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/listings/new");
  }

  const [categories, locations, pricingPlans, owners] = await Promise.all([
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }).catch(() => []),
    db.location.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }).catch(() => []),
    db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }).catch(() => []),
    db.user.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
      take: 50,
    }).catch(() => []),
  ]);

  return {
    categories,
    locations,
    pricingPlans,
    owners,
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Unauthorized access" });
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const tagline = formData.get("tagline")?.toString().trim() || null;
    const description = formData.get("description")?.toString().trim() || "Local business listing";
    const categoryId = formData.get("categoryId")?.toString();
    const locationId = formData.get("locationId")?.toString();
    const phone = formData.get("phone")?.toString().trim() || null;
    const email = formData.get("email")?.toString().trim() || null;
    const address = formData.get("address")?.toString().trim() || "Main Road, Pimple Saudagar";
    const locality = formData.get("locality")?.toString().trim() || "Pimple Saudagar";
    const planId = formData.get("planId")?.toString() || null;
    const ownerId = formData.get("ownerId")?.toString() || locals.user.id;

    if (!title) {
      return fail(400, { error: "Listing title is required" });
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug || "listing"}-${uniqueSuffix}`;

    try {
      // Find a default plan if not provided
      let effectivePlanId = planId;
      if (!effectivePlanId) {
        const defaultPlan = await db.pricingPlan.findFirst({
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
          select: { id: true },
        });
        effectivePlanId = defaultPlan?.id || null;
      }

      const newListing = await db.listing.create({
        data: {
          title,
          slug,
          tagline,
          description,
          phone,
          email,
          address,
          locality,
          status: ListingStatus.draft,
          ownerId: ownerId,
          planId: effectivePlanId,
          ...(categoryId
            ? {
                categories: {
                  create: [{ categoryId, isPrimary: true }],
                },
              }
            : {}),
          ...(locationId
            ? {
                locations: {
                  create: [{ locationId, isPrimary: true }],
                },
              }
            : {}),
        },
        select: { id: true },
      });

      throw redirect(303, `/admin/listings/${newListing.id}`);
    } catch (err: any) {
      if (err?.status === 303) throw err;
      return fail(500, { error: err?.message || "Failed to create listing" });
    }
  },
};
