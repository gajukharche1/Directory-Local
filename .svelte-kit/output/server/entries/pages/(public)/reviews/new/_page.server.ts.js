import { t as ListingService } from "../../../../../chunks/listing.service.js";
import { t as ReviewService } from "../../../../../chunks/review.service.js";
import { t as rateLimits } from "../../../../../chunks/rate-limit.js";
import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
// src/routes/(public)/reviews/new/+page.server.ts
var reviewSchema = z.object({
	listingId: z.string().min(1, "Listing ID is required."),
	rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5."),
	title: z.string().min(3, "Title must be at least 3 characters.").max(120),
	body: z.string().min(10, "Review must be at least 10 characters.").max(2e3),
	reviewerName: z.string().min(2, "Name must be at least 2 characters."),
	reviewerEmail: z.string().email("Valid email is required."),
	slug: z.string().optional()
});
var load = async ({ url, locals }) => {
	const listingSlug = url.searchParams.get("listing");
	if (!listingSlug) throw error(404, "Listing not specified");
	const listing = await ListingService.getBySlug(listingSlug);
	if (!listing) throw error(404, "Listing not found");
	return {
		listing,
		user: locals.user
	};
};
var actions = { default: async ({ request, getClientAddress, locals }) => {
	let ip = "127.0.0.1";
	try {
		ip = getClientAddress();
	} catch {}
	const rateLimitResult = await rateLimits.submission(ip);
	if (!rateLimitResult.success) return fail(429, { error: `Too many submissions. Please wait ${rateLimitResult.reset} seconds before trying again.` });
	const formData = await request.formData();
	const rawData = {
		listingId: formData.get("listingId"),
		rating: formData.get("rating"),
		title: formData.get("title"),
		body: formData.get("body"),
		reviewerName: formData.get("reviewerName"),
		reviewerEmail: formData.get("reviewerEmail"),
		slug: formData.get("slug") || void 0
	};
	const validation = reviewSchema.safeParse(rawData);
	if (!validation.success) return fail(400, {
		error: "Please correct the form errors.",
		fieldErrors: validation.error.flatten().fieldErrors
	});
	try {
		return {
			success: true,
			message: (await ReviewService.submitReview({
				...validation.data,
				authorId: locals.user?.id
			})).status === "approved" ? "Thank you! Your review has been published." : "Thank you! Your review has been submitted and will appear after moderation approval."
		};
	} catch (err) {
		return fail(500, { error: err instanceof Error ? err.message : "Failed to submit review." });
	}
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map