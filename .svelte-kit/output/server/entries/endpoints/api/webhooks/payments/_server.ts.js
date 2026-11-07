import { t as db } from "../../../../../chunks/client.js";
import { json } from "@sveltejs/kit";
import crypto from "node:crypto";
// src/lib/services/payment.service.ts
var PaymentService = class {
	/**
	* Verifies Razorpay webhook signature (HMAC SHA-256)
	*/
	static verifyRazorpaySignature(rawBody, signature, secret) {
		try {
			const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
			return crypto.timingSafeEqual(Buffer.from(expectedSignature, "utf8"), Buffer.from(signature, "utf8"));
		} catch {
			return false;
		}
	}
	/**
	* Activates a purchased plan for a business listing
	*/
	static async activateListingPlan(listingId, planId, paymentReference) {
		const plan = await db.pricingPlan.findUnique({ where: { id: planId } });
		if (!plan) throw new Error(`Pricing plan ${planId} not found.`);
		const now = /* @__PURE__ */ new Date();
		const expiryDate = new Date(now.getTime() + plan.billingPeriodDays * 24 * 60 * 60 * 1e3);
		return await db.$transaction(async (tx) => {
			const updatedListing = await tx.listing.update({
				where: { id: listingId },
				data: {
					planId: plan.id,
					planStartedAt: now,
					planExpiresAt: expiryDate,
					priority: plan.searchPriority,
					featured: plan.featuredAllowed ? true : void 0
				}
			});
			await tx.auditLog.create({ data: {
				action: "PLAN_ACTIVATION",
				entity: "listing",
				entityId: listingId,
				diff: {
					planName: plan.name,
					paymentReference,
					planStartedAt: now.toISOString(),
					planExpiresAt: expiryDate.toISOString()
				}
			} });
			return updatedListing;
		});
	}
	/**
	* Creates checkout session parameters for client-side modal or redirect
	*/
	static async createCheckoutSession(req) {
		const plan = await db.pricingPlan.findUnique({ where: { id: req.planId } });
		if (!plan) throw new Error("Invalid plan selected.");
		if (plan.priceMinor === 0) {
			await this.activateListingPlan(req.listingId, plan.id, "FREE_ACTIVATION");
			return {
				type: "free",
				redirectUrl: `/dashboard?activated=true`
			};
		}
		return {
			type: "gateway",
			orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
			amount: plan.priceMinor,
			currency: plan.currency,
			key: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key",
			name: `Pimple Saudagar Directory - ${plan.name}`,
			description: plan.description,
			prefill: { email: req.customerEmail }
		};
	}
};
// src/routes/api/webhooks/payments/+server.ts
var POST = async ({ request }) => {
	try {
		const rawBody = await request.text();
		const signature = request.headers.get("x-razorpay-signature");
		const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
		if (process.env.NODE_ENV === "production" && secret) {
			if (!signature) return json({ error: "Missing webhook signature" }, { status: 400 });
			if (!PaymentService.verifyRazorpaySignature(rawBody, signature, secret)) return json({ error: "Invalid webhook signature" }, { status: 400 });
		}
		const payload = JSON.parse(rawBody);
		const event = payload.event;
		if (event === "payment.captured" || event === "order.paid") {
			const paymentEntity = payload.payload?.payment?.entity;
			const notes = paymentEntity?.notes || {};
			const listingId = notes.listingId;
			const planId = notes.planId;
			const paymentId = paymentEntity?.id || "mock_payment_id";
			if (listingId && planId) await PaymentService.activateListingPlan(listingId, planId, paymentId);
		}
		return json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("Payment webhook error:", error);
		return json({ error: "Webhook handler failed" }, { status: 500 });
	}
};
export { POST };

//# sourceMappingURL=_server.ts.js.map