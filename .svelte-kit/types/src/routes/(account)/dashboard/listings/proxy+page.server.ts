// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const listings = await ListingService.getByOwnerId(locals.user!.id);
  return { listings };
};
