import { t as db } from "../../../../../chunks/client.js";
import { t as ReviewService } from "../../../../../chunks/review.service.js";
import { t as ClaimService } from "../../../../../chunks/claim.service.js";
import { fail } from "@sveltejs/kit";
import { ClaimRequestStatus, ReviewStatus } from "@prisma/client";
// src/routes/(admin)/admin/moderation/+page.server.ts
var load = async () => {
	const [pendingReviews, pendingClaims] = await Promise.all([db.review.findMany({
		where: { status: ReviewStatus.pending },
		include: { listing: { select: {
			title: true,
			slug: true
		} } },
		orderBy: { createdAt: "asc" }
	}).catch(() => []), db.claimRequest.findMany({
		where: { status: ClaimRequestStatus.pending },
		include: {
			listing: { select: {
				title: true,
				slug: true,
				phone: true,
				locality: true
			} },
			user: { select: {
				name: true,
				email: true,
				phone: true
			} }
		},
		orderBy: { createdAt: "asc" }
	}).catch(() => [])]);
	return {
		pendingReviews,
		pendingClaims
	};
};
var actions = {
	approveReview: async ({ request, locals }) => {
		const reviewId = (await request.formData()).get("reviewId");
		if (!reviewId) return fail(400, { error: "Review ID required" });
		try {
			await ReviewService.setModerationStatus(reviewId, ReviewStatus.approved, locals.user.id);
			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : "Failed to approve review" });
		}
	},
	rejectReview: async ({ request, locals }) => {
		const reviewId = (await request.formData()).get("reviewId");
		if (!reviewId) return fail(400, { error: "Review ID required" });
		try {
			await ReviewService.setModerationStatus(reviewId, ReviewStatus.trashed, locals.user.id);
			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : "Failed to reject review" });
		}
	},
	approveClaim: async ({ request, locals }) => {
		const claimId = (await request.formData()).get("claimId");
		if (!claimId) return fail(400, { error: "Claim ID required" });
		try {
			await ClaimService.approveClaim(claimId, locals.user.id);
			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : "Failed to approve claim" });
		}
	},
	rejectClaim: async ({ request, locals }) => {
		const formData = await request.formData();
		const claimId = formData.get("claimId");
		const reason = formData.get("reason") || "Documents insufficient";
		if (!claimId) return fail(400, { error: "Claim ID required" });
		try {
			await ClaimService.rejectClaim(claimId, locals.user.id, reason);
			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : "Failed to reject claim" });
		}
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map