// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { EnquiryService } from "$lib/services/enquiry.service";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const enquiries = await EnquiryService.getEnquiriesForOwner(locals.user!.id);
  return { enquiries };
};
