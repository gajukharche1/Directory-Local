import type { PageServerLoad } from "./$types";
import db from "$lib/db/client";
import { ListingStatus, ReviewStatus, ClaimRequestStatus } from "@prisma/client";
import { getSettings } from "$lib/services/settings.service";

export const load: PageServerLoad = async () => {
  const [
    publishedListings,
    pendingListings,
    pendingReviews,
    pendingClaims,
    totalUsers,
    totalMedia,
    totalCategories,
    totalLocations,
    recentListings,
    pendingReviewItems,
    pendingClaimItems,
    siteSettings,
  ] = await Promise.all([
    db.listing.count({ where: { status: ListingStatus.published } }).catch(() => 0),
    db.listing.count({ where: { status: ListingStatus.pending_review } }).catch(() => 0),
    db.review.count({ where: { status: ReviewStatus.pending } }).catch(() => 0),
    db.claimRequest.count({ where: { status: ClaimRequestStatus.pending } }).catch(() => 0),
    db.user.count({ where: { deletedAt: null } }).catch(() => 0),
    db.media.count().catch(() => 0),
    db.category.count().catch(() => 0),
    db.location.count().catch(() => 0),
    db.listing.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        locality: true,
        categories: { select: { category: { select: { name: true } } } },
      },
    }).catch(() => []),
    db.review.findMany({
      where: { status: ReviewStatus.pending },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        authorName: true,
        rating: true,
        comment: true,
        createdAt: true,
        listing: { select: { title: true, slug: true } },
      },
    }).catch(() => []),
    db.claimRequest.findMany({
      where: { status: ClaimRequestStatus.pending },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        businessName: true,
        claimantName: true,
        claimantEmail: true,
        createdAt: true,
        listing: { select: { title: true, slug: true } },
      },
    }).catch(() => []),
    getSettings(),
  ]);

  return {
    metrics: {
      publishedListings,
      pendingListings,
      pendingReviews,
      pendingClaims,
      totalUsers,
      totalMedia,
      totalCategories,
      totalLocations,
      totalTriage: pendingListings + pendingReviews + pendingClaims,
    },
    recentListings,
    pendingReviewItems,
    pendingClaimItems,
    siteSettings,
  };
};
