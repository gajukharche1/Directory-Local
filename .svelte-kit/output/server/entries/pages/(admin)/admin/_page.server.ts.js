import { t as db } from "../../../../chunks/client.js";
import { ClaimRequestStatus, ListingStatus, ReviewStatus } from "@prisma/client";
// src/routes/(admin)/admin/+page.server.ts
var load = async () => {
	const [publishedListings, pendingListings, pendingReviews, pendingClaims, totalUsers] = await Promise.all([
		db.listing.count({ where: { status: ListingStatus.published } }).catch(() => 0),
		db.listing.count({ where: { status: ListingStatus.pending_review } }).catch(() => 0),
		db.review.count({ where: { status: ReviewStatus.pending } }).catch(() => 0),
		db.claimRequest.count({ where: { status: ClaimRequestStatus.pending } }).catch(() => 0),
		db.user.count().catch(() => 0)
	]);
	return {
		publishedListings,
		pendingListings,
		pendingReviews,
		pendingClaims,
		totalUsers
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map