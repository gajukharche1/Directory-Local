import { t as db } from "../../../../../chunks/client.js";
import { t as ReviewService } from "../../../../../chunks/review.service.js";
import { fail } from "@sveltejs/kit";
// src/routes/(account)/dashboard/reviews/+page.server.ts
var load = async ({ locals }) => {
	const user = locals.user;
	return { reviews: await db.review.findMany({
		where: { listing: { ownerId: user.id } },
		include: { listing: { select: {
			id: true,
			title: true,
			slug: true
		} } },
		orderBy: { createdAt: "desc" }
	}).catch(() => []) };
};
var actions = { reply: async ({ request, locals }) => {
	const user = locals.user;
	const formData = await request.formData();
	const reviewId = formData.get("reviewId");
	const replyText = formData.get("replyText");
	if (!reviewId || !replyText || !replyText.trim()) return fail(400, { error: "Please enter a response message." });
	try {
		await ReviewService.addOwnerReply(reviewId, user.id, replyText);
		return { success: true };
	} catch (err) {
		return fail(400, { error: err instanceof Error ? err.message : "Failed to post response." });
	}
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map