import { t as db } from "../../../../../chunks/client.js";
import { t as env } from "../../../../../chunks/env.js";
import { t as EmailService } from "../../../../../chunks/email.service.js";
import { json } from "@sveltejs/kit";
// src/routes/api/cron/plan-expiry/+server.ts
var GET = async ({ request, url }) => {
	const authHeader = request.headers.get("authorization");
	const urlSecret = url.searchParams.get("key");
	const providedSecret = authHeader?.replace("Bearer ", "") || urlSecret;
	if (!providedSecret || providedSecret !== env.CRON_SECRET) return json({ error: "Unauthorized" }, { status: 401 });
	const now = /* @__PURE__ */ new Date();
	let downgradedCount = 0;
	let reminderCount = 0;
	try {
		const freePlan = await db.pricingPlan.findUnique({ where: { slug: "free" } });
		const expiredListings = await db.listing.findMany({
			where: {
				planExpiresAt: { lte: now },
				featured: true
			},
			include: {
				owner: { select: {
					email: true,
					name: true
				} },
				plan: { select: { name: true } }
			}
		});
		for (const listing of expiredListings) {
			await db.listing.update({
				where: { id: listing.id },
				data: {
					featured: false,
					priority: 0,
					planId: freePlan ? freePlan.id : listing.planId
				}
			});
			await db.auditLog.create({ data: {
				action: "cron_downgrade_expired_plan",
				entity: "listing",
				entityId: listing.id,
				diff: {
					title: listing.title,
					expiredAt: listing.planExpiresAt
				}
			} });
			downgradedCount++;
		}
		const sevenDaysFromNow = new Date(now.getTime() + 6048e5);
		const expiringSoon = await db.listing.findMany({
			where: { planExpiresAt: {
				gt: now,
				lte: sevenDaysFromNow
			} },
			include: {
				owner: { select: {
					email: true,
					name: true
				} },
				plan: { select: { name: true } }
			},
			take: 20
		});
		for (const listing of expiringSoon) if (listing.owner?.email) {
			const daysLeft = Math.ceil((new Date(listing.planExpiresAt).getTime() - now.getTime()) / 864e5);
			await EmailService.sendPlanExpiringEmail(listing.owner.email, {
				listingTitle: listing.title,
				planName: listing.plan?.name || "Featured",
				daysRemaining: daysLeft,
				renewalUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
			});
			reminderCount++;
		}
		return json({
			success: true,
			downgradedCount,
			reminderCount,
			timestamp: now.toISOString()
		});
	} catch (error) {
		console.error("Cron plan-expiry error:", error);
		return json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 });
	}
};
export { GET };

//# sourceMappingURL=_server.ts.js.map