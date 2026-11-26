/**
 * High-performance non-blocking client-side analytics event dispatcher.
 * Uses navigator.sendBeacon when available with keepalive fetch fallback.
 */

export function trackAnalyticsEvent(
  listingId: string,
  eventType: "PAGE_VIEW" | "CALL" | "WHATSAPP" | "DIRECTIONS" | "WEBSITE" | "ENQUIRY" | "SHARE" | string,
  extra?: { referrer?: string | null; deviceType?: string | null }
): void {
  if (typeof window === "undefined" || !listingId) return;

  const deviceType =
    extra?.deviceType ||
    (window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");

  const payload = JSON.stringify({
    listingId,
    eventType,
    referrer: extra?.referrer !== undefined ? extra.referrer : (document.referrer || null),
    deviceType,
  });

  const endpoint = "/api/analytics/track";

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }

    // Fallback: fetch with keepalive
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget: silently ignore telemetry network drops
    });
  } catch {
    // Non-blocking catch
  }
}

export const trackEvent = trackAnalyticsEvent;
