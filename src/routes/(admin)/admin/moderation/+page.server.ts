import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ReviewStatus, ClaimRequestStatus } from "@prisma/client";
import { ReviewService } from "$lib/services/review.service";
import { ClaimService } from "$lib/services/claim.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async () => {
  const [pendingReviews, pendingClaims] = await Promise.all([
    db.review
      .findMany({
        where: { status: ReviewStatus.pending },
        include: {
          listing: {
            select: { title: true, slug: true },
          },
        },
        orderBy: { createdAt: "asc" },
      })
      .catch(() => []),
    db.claimRequest
      .findMany({
        where: { status: ClaimRequestStatus.pending },
        include: {
          listing: {
            select: { title: true, slug: true, phone: true, locality: true },
          },
          user: {
            select: { name: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: "asc" },
      })
      .catch(() => []),
  ]);

  return toPOJO({
    pendingReviews,
    pendingClaims,
  });
};

export const actions: Actions = {
  approveReview: async ({ request, locals }) => {
    const formData = await request.formData();
    const reviewId = formData.get("reviewId") as string;
    if (!reviewId) return fail(400, { error: "Review ID required" });

    try {
      await ReviewService.setModerationStatus(reviewId, ReviewStatus.approved, locals.user!.id);
      return { success: true };
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Failed to approve review" });
    }
  },

  rejectReview: async ({ request, locals }) => {
    const formData = await request.formData();
    const reviewId = formData.get("reviewId") as string;
    if (!reviewId) return fail(400, { error: "Review ID required" });

    try {
      await ReviewService.setModerationStatus(reviewId, ReviewStatus.trashed, locals.user!.id);
      return { success: true };
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Failed to reject review" });
    }
  },

  approveClaim: async ({ request, locals }) => {
    const formData = await request.formData();
    const claimId = formData.get("claimId") as string;
    if (!claimId) return fail(400, { error: "Claim ID required" });

    try {
      await ClaimService.approveClaim(claimId, locals.user!.id);
      return { success: true };
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Failed to approve claim" });
    }
  },

  rejectClaim: async ({ request, locals }) => {
    const formData = await request.formData();
    const claimId = formData.get("claimId") as string;
    const reason = (formData.get("reason") as string) || "Documents insufficient";
    if (!claimId) return fail(400, { error: "Claim ID required" });

    try {
      await ClaimService.rejectClaim(claimId, locals.user!.id, reason);
      return { success: true };
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : "Failed to reject claim" });
    }
  },
};
