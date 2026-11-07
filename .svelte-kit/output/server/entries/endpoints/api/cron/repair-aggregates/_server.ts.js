import { t as db } from "../../../../../chunks/client.js";
import { t as env } from "../../../../../chunks/env.js";
import { json } from "@sveltejs/kit";
import { ReviewStatus } from "@prisma/client";
// src/routes/api/cron/repair-aggregates/+server.ts
var GET = async ({ request, url }) => {
	const authHeader = request.headers.get("authorization");
	const urlSecret = url.searchParams.get("key");
	const providedSecret = authHeader?.replace("Bearer ", "") || urlSecret;
	if (!providedSecret || providedSecret !== env.CRON_SECRET) return json({ error: "Unauthorized" }, { status: 401 });
	let repairedCount = 0;
	try {
		const listings = await db.listing.findMany({ select: {
			id: true,
			averageRating: true,
			reviewCount: true
		} });
		for (const listing of listings) {
			const stats = await db.review.aggregate({
				where: {
					listingId: listing.id,
					status: ReviewStatus.approved
				},
				_avg: { rating: true },
				_count: { id: true }
			});
			const actualAvg = Number(stats._avg.rating || 0).toFixed(2);
			const actualCount = stats._count.id;
			const currentAvg = Number(listing.averageRating).toFixed(2);
			const currentCount = listing.reviewCount;
			if (actualAvg !== currentAvg || actualCount !== currentCount) {
				await db.listing.update({
					where: { id: listing.id },
					data: {
						averageRating: stats._avg.rating || 0,
						reviewCount: actualCount
					}
				});
				repairedCount++;
			}
		}
		return json({
			success: true,
			totalChecked: listings.length,
			repairedCount,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (error) {
		console.error("Cron repair-aggregates error:", error);
		return json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 });
	}
};
export { GET };

//# sourceMappingURL=_server.ts.js.map