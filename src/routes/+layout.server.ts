import type { LayoutServerLoad } from "./$types";
import { getSettings } from "$lib/services/settings.service";

export const load: LayoutServerLoad = async ({ locals }) => {
  const siteSettings = await getSettings();

  return {
    user: locals.user ?? null,
    siteSettings,
  };
};
