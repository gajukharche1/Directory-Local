import type { PageServerLoad } from "./$types";
import { EnquiryService } from "$lib/services/enquiry.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ locals }) => {
  const enquiries = await EnquiryService.getEnquiriesForOwner(locals.user!.id);
  return toPOJO({ enquiries });
};
