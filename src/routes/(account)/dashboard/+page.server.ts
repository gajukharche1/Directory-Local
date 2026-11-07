import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { EnquiryService } from "$lib/services/enquiry.service";

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user!;

  const [listings, enquiries] = await Promise.all([
    ListingService.getByOwnerId(user.id),
    EnquiryService.getEnquiriesForOwner(user.id),
  ]);

  const totalViews = listings.reduce((acc, curr) => acc + Number(curr.viewCount), 0);
  const totalReviews = listings.reduce((acc, curr) => acc + curr._count.reviews, 0);
  const unreadEnquiries = enquiries.filter((e) => !e.isRead).length;

  return {
    listings,
    enquiries: enquiries.slice(0, 5),
    totalViews,
    totalReviews,
    unreadEnquiries,
  };
};
