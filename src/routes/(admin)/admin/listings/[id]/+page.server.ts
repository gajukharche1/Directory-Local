import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingService } from "$lib/services/listing.service";
import { ListingStatus } from "@prisma/client";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, `/login?redirectTo=/admin/listings/${params.id}`);
  }

  const [listing, categories, locations, pricingPlans, owners] = await Promise.all([
    ListingService.getById(params.id),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.location.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true, searchPriority: true },
    }),
    db.user.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true },
      take: 100,
    }),
  ]);

  if (!listing) {
    throw error(404, "Listing not found");
  }

  return toPOJO({
    listing,
    categories,
    locations,
    pricingPlans,
    owners,
  });
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    const tagline = formData.get("tagline")?.toString() || undefined;
    const description = formData.get("description")?.toString();
    const status = formData.get("status")?.toString() as ListingStatus;
    const featured = formData.get("featured") === "true";
    const priority = Number(formData.get("priority")) || 0;
    const planId = formData.get("planId")?.toString() || undefined;
    const ownerId = formData.get("ownerId")?.toString() || undefined;

    const phone = formData.get("phone")?.toString() || undefined;
    const whatsapp = formData.get("whatsapp")?.toString() || undefined;
    const email = formData.get("email")?.toString() || undefined;
    const website = formData.get("website")?.toString() || undefined;
    const address = formData.get("address")?.toString();
    const locality = formData.get("locality")?.toString();
    const landmark = formData.get("landmark")?.toString() || undefined;
    const latStr = formData.get("latitude")?.toString();
    const lngStr = formData.get("longitude")?.toString();
    const latitude = latStr ? parseFloat(latStr) : undefined;
    const longitude = lngStr ? parseFloat(lngStr) : undefined;
    const yearEstablished = formData.get("yearEstablished") ? Number(formData.get("yearEstablished")) : undefined;
    const priceRange = formData.get("priceRange") ? Number(formData.get("priceRange")) : 1;
    const categoryIds = formData.getAll("categoryIds").map((c) => c.toString()).filter(Boolean);
    const locationIds = formData.getAll("locationIds").map((l) => l.toString()).filter(Boolean);

    const seoTitle = formData.get("seoTitle")?.toString() || undefined;
    const seoDescription = formData.get("seoDescription")?.toString() || undefined;
    const seoKeywords = formData.get("seoKeywords")?.toString() || undefined;
    const ogImage = formData.get("ogImage")?.toString() || undefined;

    const amenitiesRaw = formData.get("amenities")?.toString() || "";
    const amenities = amenitiesRaw
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const openingHoursJson = formData.get("openingHours")?.toString();
    let openingHours = undefined;
    if (openingHoursJson) {
      try {
        openingHours = JSON.parse(openingHoursJson);
      } catch {
        // Keep existing
      }
    }

    const customSectionsJson = formData.get("customSections")?.toString();
    let customSections = undefined;
    if (customSectionsJson) {
      try {
        customSections = JSON.parse(customSectionsJson);
      } catch {
        // Keep existing
      }
    }

    if (!title || !address || !locality) {
      return fail(400, { error: "Title, Address, and Locality are mandatory." });
    }

    try {
      await ListingService.update(
        locals.user.id,
        params.id,
        {
          title,
          tagline,
          description: description || "",
          status,
          featured,
          priority,
          phone,
          whatsapp,
          email,
          website,
          address,
          locality,
          landmark,
          latitude,
          longitude,
          yearEstablished,
          priceRange,
          amenities,
          openingHours,
          categoryIds,
          locationIds,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImage,
          customSections,
        },
        true
      );

      // Handle owner or plan mutation directly if provided
      if (ownerId !== undefined || planId !== undefined) {
        await db.listing.update({
          where: { id: params.id },
          data: {
            ...(ownerId !== undefined && { ownerId: ownerId === "unassigned" ? null : ownerId }),
            ...(planId !== undefined && { planId: planId === "none" ? null : planId }),
          },
        });
      }

      return { success: true, message: "Listing updated successfully!" };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to update listing." });
    }
  },

  detachMedia: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();
    const mediaId = formData.get("mediaId")?.toString();

    if (!mediaId) return fail(400, { error: "Media ID required." });

    try {
      await db.media.update({
        where: { id: mediaId },
        data: { listingId: null },
      });
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to detach media." });
    }
  },

  attachMedia: async ({ request, locals, params }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Permission denied." });
    }

    const formData = await request.formData();
    const mediaIdsJson = formData.get("mediaIds")?.toString();

    if (!mediaIdsJson) return fail(400, { error: "Media IDs required." });

    try {
      const mediaIds: string[] = JSON.parse(mediaIdsJson);
      await db.media.updateMany({
        where: { id: { in: mediaIds } },
        data: { listingId: params.id },
      });
      return { success: true };
    } catch (err: any) {
      return fail(400, { error: err.message || "Failed to attach media." });
    }
  },
};
