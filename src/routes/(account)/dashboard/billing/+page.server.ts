import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";

export const load: PageServerLoad = async ({ locals }) => {
  const listings = await ListingService.getByOwnerId(locals.user!.id);
  return { listings };
};
