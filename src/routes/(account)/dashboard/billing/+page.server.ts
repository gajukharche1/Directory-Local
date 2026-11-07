import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ locals }) => {
  const listings = await ListingService.getByOwnerId(locals.user!.id);
  return toPOJO({ listings });
};
