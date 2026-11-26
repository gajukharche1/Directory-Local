import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AnalyticsService } from "$lib/services/analytics.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    throw error(401, "Please log in to view your business analytics.");
  }

  const daysParam = Number(url.searchParams.get("days")) || 30;
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

  const analytics = await AnalyticsService.getMerchantOverview(locals.user.id, days);

  return toPOJO({
    analytics,
    days,
  });
};
