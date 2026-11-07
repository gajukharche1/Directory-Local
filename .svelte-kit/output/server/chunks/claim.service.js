import { t as db } from "./client.js";
import { ClaimRequestStatus, ClaimStatus, UserRole } from "@prisma/client";
// src/lib/services/claim.service.ts
var ClaimService = class {
	/**
	* Submits a claim request for an unclaimed listing
	*/
	static async submitClaim(input) {
		const listing = await db.listing.findUnique({ where: { id: input.listingId } });
		if (!listing) throw new Error("Listing not found.");
		if (listing.claimStatus === ClaimStatus.claimed || listing.claimStatus === ClaimStatus.verified) throw new Error("This business has already been claimed and verified.");
		if (await db.claimRequest.findFirst({ where: {
			listingId: input.listingId,
			userId: input.userId,
			status: ClaimRequestStatus.pending
		} })) throw new Error("You already have a pending verification request for this listing.");
		return await db.$transaction(async (tx) => {
			const claim = await tx.claimRequest.create({ data: {
				listingId: input.listingId,
				userId: input.userId,
				proofFileUrl: input.proofFileUrl,
				note: input.note?.trim() || null,
				status: ClaimRequestStatus.pending
			} });
			await tx.listing.update({
				where: { id: input.listingId },
				data: { claimStatus: ClaimStatus.claim_pending }
			});
			return claim;
		});
	}
	/**
	* Approves a claim request (Admin / Moderator action)
	* Transfers ownership of listing to user and promotes user to 'owner' role.
	*/
	static async approveClaim(claimId, reviewerId) {
		return await db.$transaction(async (tx) => {
			const claim = await tx.claimRequest.findUnique({
				where: { id: claimId },
				include: { user: true }
			});
			if (!claim || claim.status !== ClaimRequestStatus.pending) throw new Error("Claim request not found or already processed.");
			const updatedClaim = await tx.claimRequest.update({
				where: { id: claimId },
				data: {
					status: ClaimRequestStatus.approved,
					reviewedBy: reviewerId,
					reviewedAt: /* @__PURE__ */ new Date()
				}
			});
			await tx.listing.update({
				where: { id: claim.listingId },
				data: {
					ownerId: claim.userId,
					claimStatus: ClaimStatus.verified
				}
			});
			if (claim.user.role === UserRole.visitor) await tx.user.update({
				where: { id: claim.userId },
				data: { role: UserRole.owner }
			});
			await tx.auditLog.create({ data: {
				actorId: reviewerId,
				action: "CLAIM_APPROVED",
				entity: "listing",
				entityId: claim.listingId,
				diff: {
					newOwnerId: claim.userId,
					userEmail: claim.user.email
				}
			} });
			return updatedClaim;
		});
	}
	/**
	* Rejects a claim request
	*/
	static async rejectClaim(claimId, reviewerId, reason) {
		return await db.$transaction(async (tx) => {
			const claim = await tx.claimRequest.update({
				where: { id: claimId },
				data: {
					status: ClaimRequestStatus.rejected,
					reviewedBy: reviewerId,
					reviewedAt: /* @__PURE__ */ new Date(),
					note: reason || null
				}
			});
			if (!await tx.claimRequest.findFirst({ where: {
				listingId: claim.listingId,
				status: ClaimRequestStatus.pending
			} })) await tx.listing.update({
				where: { id: claim.listingId },
				data: { claimStatus: ClaimStatus.unclaimed }
			});
			return claim;
		});
	}
};
export { ClaimService as t };

//# sourceMappingURL=claim.service.js.map