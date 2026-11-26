import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import db from "$lib/db/client";
import { AnalyticsService } from "$lib/services/analytics.service";
import { canManageListing } from "$lib/auth/rbac";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ params, url, locals }) => {
  if (!locals.user) {
    throw error(401, "Please log in to view listing analytics.");
  }

  const listing = await db.listing.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      slug: true,
      locality: true,
      ownerId: true,
      status: true,
      averageRating: true,
      reviewCount: true,
    },
  });

  if (!listing) {
    throw error(404, "Listing not found.");
  }

  if (!canManageListing(locals.user, listing.ownerId)) {
    throw error(403, "You do not have permission to view analytics for this business.");
  }

  const daysParam = Number(url.searchParams.get("days")) || 30;
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

  const analytics = await AnalyticsService.getListingAnalytics(listing.id, days);

  return toPOJO({
    listing,
    analytics,
    days,
  });
};
