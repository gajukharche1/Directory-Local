import { t as ListingService } from "../../../../../chunks/listing.service.js";
import { t as ClaimService } from "../../../../../chunks/claim.service.js";
import { error, fail } from "@sveltejs/kit";
import { ClaimStatus } from "@prisma/client";
import { z } from "zod";
// src/routes/(public)/claim/[slug]/+page.server.ts
var claimSchema = z.object({
	listingId: z.string().min(1, "Listing ID is required."),
	slug: z.string().min(1),
	proofFileUrl: z.string().url("Please provide a valid document URL.").min(1, "Proof document or link is required."),
	note: z.string().optional()
});
var load = async ({ params, locals }) => {
	const listing = await ListingService.getBySlug(params.slug);
	if (!listing) throw error(404, "Listing not found");
	return {
		listing,
		isAlreadyClaimed: listing.claimStatus === ClaimStatus.claimed || listing.claimStatus === ClaimStatus.verified,
		user: locals.user
	};
};
var actions = { default: async ({ request, locals }) => {
	if (!locals.user) return fail(401, { error: "You must be signed in to claim a business profile." });
	const formData = await request.formData();
	const rawData = {
		listingId: formData.get("listingId"),
		slug: formData.get("slug"),
		proofFileUrl: formData.get("proofFileUrl"),
		note: formData.get("note") || void 0
	};
	const validation = claimSchema.safeParse(rawData);
	if (!validation.success) return fail(400, { error: "Please provide a valid proof document URL and listing details." });
	try {
		await ClaimService.submitClaim({
			listingId: validation.data.listingId,
			userId: locals.user.id,
			proofFileUrl: validation.data.proofFileUrl,
			note: validation.data.note
		});
		return {
			success: true,
			message: "Your verification request has been submitted! Our local moderation team will verify your ownership documents within 24 hours."
		};
	} catch (err) {
		return fail(500, { error: err instanceof Error ? err.message : "Failed to submit claim request." });
	}
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map