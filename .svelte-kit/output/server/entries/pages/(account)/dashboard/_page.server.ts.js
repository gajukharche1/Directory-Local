import { t as ListingService } from "../../../../chunks/listing.service.js";
import { t as EnquiryService } from "../../../../chunks/enquiry.service.js";
// src/routes/(account)/dashboard/+page.server.ts
var load = async ({ locals }) => {
	const user = locals.user;
	const [listings, enquiries] = await Promise.all([ListingService.getByOwnerId(user.id), EnquiryService.getEnquiriesForOwner(user.id)]);
	const totalViews = listings.reduce((acc, curr) => acc + Number(curr.viewCount), 0);
	const totalReviews = listings.reduce((acc, curr) => acc + curr._count.reviews, 0);
	const unreadEnquiries = enquiries.filter((e) => !e.isRead).length;
	return {
		listings,
		enquiries: enquiries.slice(0, 5),
		totalViews,
		totalReviews,
		unreadEnquiries
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map