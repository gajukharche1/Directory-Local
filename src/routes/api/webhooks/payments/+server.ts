import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PaymentService } from "$lib/services/payment.service";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (process.env.NODE_ENV === "production" && secret) {
      if (!signature) {
        return json({ error: "Missing webhook signature" }, { status: 400 });
      }

      const isValid = PaymentService.verifyRazorpaySignature(rawBody, signature, secret);
      if (!isValid) {
        return json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};

      const listingId = notes.listingId;
      const planId = notes.planId;
      const paymentId = paymentEntity?.id || "mock_payment_id";

      if (listingId && planId) {
        await PaymentService.activateListingPlan(listingId, planId, paymentId);
      }
    }

    return json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return json({ error: "Webhook handler failed" }, { status: 500 });
  }
};
