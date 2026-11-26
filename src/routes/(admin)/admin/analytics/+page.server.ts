import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AnalyticsService } from "$lib/services/analytics.service";
import { hasRole } from "$lib/auth/rbac";
import { UserRole } from "@prisma/client";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user || !hasRole(locals.user.role, UserRole.moderator)) {
    throw error(403, "Access restricted to administrators and moderators.");
  }

  const daysParam = Number(url.searchParams.get("days")) || 30;
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

  const analytics = await AnalyticsService.getDirectoryAnalytics(days);

  return toPOJO({
    analytics,
    days,
  });
};
