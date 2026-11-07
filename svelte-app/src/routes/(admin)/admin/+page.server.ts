import type { PageServerLoad } from "./$types";
import db from "$lib/db/client";
import { ListingStatus, ReviewStatus, ClaimRequestStatus } from "@prisma/client";

export const load: PageServerLoad = async () => {
  const [
    publishedListings,
    pendingListings,
    pendingReviews,
    pendingClaims,
    totalUsers,
  ] = await Promise.all([
    db.listing.count({ where: { status: ListingStatus.published } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.pending_review } }).catch(() => 0),
    db.review.count({ where: { status: ReviewStatus.pending } }).catch(() => 0),
    db.claimRequest.count({ where: { status: ClaimRequestStatus.pending } }).catch(() => 0),
    db.user.count().catch(() => 0),
  ]);

  return {
    publishedListings,
    pendingListings,
    pendingReviews,
    pendingClaims,
    totalUsers,
  };
};
