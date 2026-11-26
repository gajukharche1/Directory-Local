import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { AnalyticsService } from "$lib/services/analytics.service";
import { checkRateLimit } from "$lib/security/rate-limit";

const trackEventSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required."),
  eventType: z.string().min(1, "Event type is required."),
  referrer: z.string().nullable().optional(),
  deviceType: z.string().nullable().optional(),
});

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const ip = getClientAddress() || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  // Rate limit: max 120 tracking beacons per minute per IP
  const rateCheck = await checkRateLimit(`analytics:${ip}`, 120, 60);
  if (!rateCheck.success) {
    return new Response(null, { status: 429 });
  }

  let body: any;
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("text/plain") || contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = Object.fromEntries(new URLSearchParams(text));
      }
    } else {
      // Handle Beacon or FormData fallback
      const formData = await request.formData();
      body = {
        listingId: formData.get("listingId")?.toString(),
        eventType: formData.get("eventType")?.toString(),
        referrer: formData.get("referrer")?.toString() || null,
        deviceType: formData.get("deviceType")?.toString() || null,
      };
    }
  } catch (err) {
    return json({ error: "Invalid payload format." }, { status: 400 });
  }

  const parsed = trackEventSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const result = await AnalyticsService.recordEvent({
    listingId: parsed.data.listingId,
    eventType: parsed.data.eventType,
    ip,
    userAgent,
    referrer: parsed.data.referrer,
    deviceType: parsed.data.deviceType,
  });

  if (!result.success) {
    return json({ error: "Failed to record event or ignored as bot." }, { status: 400 });
  }

  // Return 204 No Content for high-speed non-blocking beacon efficiency
  return new Response(null, { status: 204 });
};
