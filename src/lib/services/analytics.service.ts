import db from "$lib/db/client";
import { AnalyticsEventType } from "@prisma/client";
import { createHash } from "node:crypto";

const ANALYTICS_SECRET_SALT = process.env.AUTH_SECRET || "pimple-saudagar-local-analytics-salt-key-2026";

// Known bots & scrapers to filter out from analytics telemetry
const BOT_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /headlesschrome/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /duckduckbot/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
];

export interface TrackEventInput {
  listingId: string;
  eventType: AnalyticsEventType | keyof typeof AnalyticsEventType | string;
  ip?: string;
  userAgent?: string;
  visitorHash?: string;
  referrer?: string | null;
  deviceType?: "mobile" | "desktop" | "tablet" | string | null;
}

export interface DailyChartPoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Nov 20"
  views: number;
  uniqueVisitors: number;
  ctas: number;
  calls: number;
  whatsapps: number;
  directions: number;
  websites: number;
  enquiries: number;
}

export interface AnalyticsSummaryResult {
  listingId?: string;
  periodDays: number;
  totals: {
    views: number;
    uniqueVisitors: number;
    ctas: number;
    calls: number;
    whatsapps: number;
    directions: number;
    websites: number;
    enquiries: number;
    shares: number;
    conversionRate: number; // percentage (0 - 100)
  };
  deltas: {
    viewsPct: number;
    uniqueVisitorsPct: number;
    ctasPct: number;
    conversionRatePct: number;
  };
  timeSeries: DailyChartPoint[];
}

export interface ListingLeaderboardItem {
  id: string;
  title: string;
  slug: string;
  locality: string | null;
  categoryName?: string;
  views: number;
  uniqueVisitors: number;
  ctas: number;
  calls: number;
  whatsapps: number;
  conversionRate: number;
}

/**
 * DPDP-Compliant Salted Visitor Hash
 * Derives a deterministic daily hash from (IP + UserAgent + daily rotating salt).
 * Zero raw IPs are persisted, and hashes naturally expire/reset every midnight.
 */
export function generateVisitorHash(ip: string, userAgent: string, date: Date = new Date()): string {
  const dateKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const rawData = `${ip || "0.0.0.0"}:${userAgent || "unknown"}:${dateKey}:${ANALYTICS_SECRET_SALT}`;
  return createHash("sha256").update(rawData).digest("hex").slice(0, 32);
}

/**
 * Returns midnight UTC for consistent day-based database aggregation
 */
export function getUtcMidnight(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Detects whether a User-Agent is a known web crawler or search bot
 */
export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

/**
 * Map flexible event type strings to Prisma AnalyticsEventType enum
 */
export function normalizeEventType(type: string): AnalyticsEventType | null {
  const upper = type.toUpperCase().trim();
  switch (upper) {
    case "PAGE_VIEW":
    case "VIEW":
      return AnalyticsEventType.PAGE_VIEW;
    case "CALL":
    case "PHONE":
      return AnalyticsEventType.CALL;
    case "WHATSAPP":
    case "CHAT":
      return AnalyticsEventType.WHATSAPP;
    case "DIRECTIONS":
    case "MAP":
      return AnalyticsEventType.DIRECTIONS;
    case "WEBSITE":
    case "URL":
      return AnalyticsEventType.WEBSITE;
    case "ENQUIRY":
    case "LEAD":
      return AnalyticsEventType.ENQUIRY;
    case "SHARE":
      return AnalyticsEventType.SHARE;
    default:
      return null;
  }
}

export class AnalyticsService {
  /**
   * Records a user telemetry action (view or CTA) and rolls it into daily summary
   */
  static async recordEvent(input: TrackEventInput): Promise<{ success: boolean; eventId?: string }> {
    const { listingId, ip = "127.0.0.1", userAgent = "", referrer, deviceType } = input;

    // Filter bots from skewing merchant visibility metrics
    if (isBot(userAgent)) {
      return { success: false };
    }

    const eventType = normalizeEventType(String(input.eventType));
    if (!eventType) {
      return { success: false };
    }

    const todayMidnight = getUtcMidnight();
    const visitorHash = input.visitorHash || generateVisitorHash(ip, userAgent, todayMidnight);

    try {
      // 1. Insert raw event stream record
      const event = await db.analyticsEvent.create({
        data: {
          listingId,
          eventType,
          visitorHash,
          referrer: referrer ? referrer.slice(0, 500) : null,
          deviceType: deviceType || "desktop",
        },
      });

      // 2. Determine unique visitor status for views
      let isNewDailyUnique = false;
      if (eventType === AnalyticsEventType.PAGE_VIEW) {
        const priorViewCount = await db.analyticsEvent.count({
          where: {
            listingId,
            eventType: AnalyticsEventType.PAGE_VIEW,
            visitorHash,
            createdAt: {
              gte: todayMidnight,
              lt: new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });
        // If priorViewCount is 1, this current insert was the first view today
        isNewDailyUnique = priorViewCount <= 1;
      }

      // 3. Atomically upsert daily summary rollup
      await db.analyticsDailySummary.upsert({
        where: {
          listingId_date: {
            listingId,
            date: todayMidnight,
          },
        },
        create: {
          listingId,
          date: todayMidnight,
          pageViews: eventType === AnalyticsEventType.PAGE_VIEW ? 1 : 0,
          uniqueVisitors: isNewDailyUnique ? 1 : 0,
          callClicks: eventType === AnalyticsEventType.CALL ? 1 : 0,
          whatsappClicks: eventType === AnalyticsEventType.WHATSAPP ? 1 : 0,
          directionsClicks: eventType === AnalyticsEventType.DIRECTIONS ? 1 : 0,
          websiteClicks: eventType === AnalyticsEventType.WEBSITE ? 1 : 0,
          enquiries: eventType === AnalyticsEventType.ENQUIRY ? 1 : 0,
          shares: eventType === AnalyticsEventType.SHARE ? 1 : 0,
        },
        update: {
          ...(eventType === AnalyticsEventType.PAGE_VIEW && {
            pageViews: { increment: 1 },
            ...(isNewDailyUnique && { uniqueVisitors: { increment: 1 } }),
          }),
          ...(eventType === AnalyticsEventType.CALL && { callClicks: { increment: 1 } }),
          ...(eventType === AnalyticsEventType.WHATSAPP && { whatsappClicks: { increment: 1 } }),
          ...(eventType === AnalyticsEventType.DIRECTIONS && { directionsClicks: { increment: 1 } }),
          ...(eventType === AnalyticsEventType.WEBSITE && { websiteClicks: { increment: 1 } }),
          ...(eventType === AnalyticsEventType.ENQUIRY && { enquiries: { increment: 1 } }),
          ...(eventType === AnalyticsEventType.SHARE && { shares: { increment: 1 } }),
        },
      });

      return { success: true, eventId: event.id };
    } catch (err) {
      console.error("Failed to record analytics event:", err);
      return { success: false };
    }
  }

  /**
   * Generates time series and totals for a single listing
   */
  static async getListingAnalytics(listingId: string, days = 30): Promise<AnalyticsSummaryResult> {
    const today = getUtcMidnight();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Current period summaries
    const currentSummaries = await db.analyticsDailySummary.findMany({
      where: {
        listingId,
        date: { gte: startDate, lte: today },
      },
      orderBy: { date: "asc" },
    });

    // Previous period summaries for percentage delta calculations
    const prevSummaries = await db.analyticsDailySummary.findMany({
      where: {
        listingId,
        date: { gte: prevStartDate, lt: startDate },
      },
    });

    return this.buildAnalyticsSummary(currentSummaries, prevSummaries, days, startDate, today, listingId);
  }

  /**
   * Generates aggregated metrics across all listings owned by a merchant
   */
  static async getMerchantOverview(ownerId: string, days = 30): Promise<AnalyticsSummaryResult & { topListings: ListingLeaderboardItem[] }> {
    const listings = await db.listing.findMany({
      where: { ownerId },
      select: {
        id: true,
        title: true,
        slug: true,
        locality: true,
        categories: { select: { category: { select: { name: true } } }, take: 1 },
      },
    });

    const listingIds = listings.map((l) => l.id);
    if (listingIds.length === 0) {
      const emptyResult = this.buildEmptySummary(days);
      return { ...emptyResult, topListings: [] };
    }

    const today = getUtcMidnight();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    const [currentSummaries, prevSummaries] = await Promise.all([
      db.analyticsDailySummary.findMany({
        where: {
          listingId: { in: listingIds },
          date: { gte: startDate, lte: today },
        },
        orderBy: { date: "asc" },
      }),
      db.analyticsDailySummary.findMany({
        where: {
          listingId: { in: listingIds },
          date: { gte: prevStartDate, lt: startDate },
        },
      }),
    ]);

    const summary = this.buildAnalyticsSummary(currentSummaries, prevSummaries, days, startDate, today);

    // Build top listings leaderboard
    const listingTotalsMap = new Map<string, { views: number; uniqueVisitors: number; calls: number; whatsapps: number; ctas: number }>();
    for (const s of currentSummaries) {
      const existing = listingTotalsMap.get(s.listingId) || { views: 0, uniqueVisitors: 0, calls: 0, whatsapps: 0, ctas: 0 };
      const ctas = s.callClicks + s.whatsappClicks + s.directionsClicks + s.websiteClicks + s.enquiries;
      existing.views += s.pageViews;
      existing.uniqueVisitors += s.uniqueVisitors;
      existing.calls += s.callClicks;
      existing.whatsapps += s.whatsappClicks;
      existing.ctas += ctas;
      listingTotalsMap.set(s.listingId, existing);
    }

    const topListings: ListingLeaderboardItem[] = listings
      .map((l) => {
        const stats = listingTotalsMap.get(l.id) || { views: 0, uniqueVisitors: 0, calls: 0, whatsapps: 0, ctas: 0 };
        const convRate = stats.uniqueVisitors > 0 ? Number(((stats.ctas / stats.uniqueVisitors) * 100).toFixed(1)) : 0;
        return {
          id: l.id,
          title: l.title,
          slug: l.slug,
          locality: l.locality,
          categoryName: l.categories[0]?.category?.name || "Business",
          views: stats.views,
          uniqueVisitors: stats.uniqueVisitors,
          ctas: stats.ctas,
          calls: stats.calls,
          whatsapps: stats.whatsapps,
          conversionRate: convRate,
        };
      })
      .sort((a, b) => b.ctas - a.ctas || b.views - a.views);

    return { ...summary, topListings };
  }

  /**
   * Directory-wide analytics and platform performance leaderboard for administrators
   */
  static async getDirectoryAnalytics(days = 30): Promise<AnalyticsSummaryResult & { topListings: ListingLeaderboardItem[]; totalTrackedListings: number }> {
    const today = getUtcMidnight();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    const [currentSummaries, prevSummaries, publishedListings] = await Promise.all([
      db.analyticsDailySummary.findMany({
        where: { date: { gte: startDate, lte: today } },
        orderBy: { date: "asc" },
      }),
      db.analyticsDailySummary.findMany({
        where: { date: { gte: prevStartDate, lt: startDate } },
      }),
      db.listing.findMany({
        where: { status: "published" },
        select: {
          id: true,
          title: true,
          slug: true,
          locality: true,
          categories: { select: { category: { select: { name: true } } }, take: 1 },
        },
      }),
    ]);

    const summary = this.buildAnalyticsSummary(currentSummaries, prevSummaries, days, startDate, today);

    // Group current metrics by listing
    const listingTotalsMap = new Map<string, { views: number; uniqueVisitors: number; calls: number; whatsapps: number; ctas: number }>();
    for (const s of currentSummaries) {
      const existing = listingTotalsMap.get(s.listingId) || { views: 0, uniqueVisitors: 0, calls: 0, whatsapps: 0, ctas: 0 };
      const ctas = s.callClicks + s.whatsappClicks + s.directionsClicks + s.websiteClicks + s.enquiries;
      existing.views += s.pageViews;
      existing.uniqueVisitors += s.uniqueVisitors;
      existing.calls += s.callClicks;
      existing.whatsapps += s.whatsappClicks;
      existing.ctas += ctas;
      listingTotalsMap.set(s.listingId, existing);
    }

    const listingMap = new Map(publishedListings.map((l) => [l.id, l]));

    const topListings: ListingLeaderboardItem[] = Array.from(listingTotalsMap.entries())
      .map(([id, stats]) => {
        const item = listingMap.get(id);
        const convRate = stats.uniqueVisitors > 0 ? Number(((stats.ctas / stats.uniqueVisitors) * 100).toFixed(1)) : 0;
        return {
          id,
          title: item?.title || "Listing #" + id.slice(0, 8),
          slug: item?.slug || "",
          locality: item?.locality || null,
          categoryName: item?.categories[0]?.category?.name || "Business",
          views: stats.views,
          uniqueVisitors: stats.uniqueVisitors,
          ctas: stats.ctas,
          calls: stats.calls,
          whatsapps: stats.whatsapps,
          conversionRate: convRate,
        };
      })
      .sort((a, b) => b.ctas - a.ctas || b.views - a.views)
      .slice(0, 10);

    return {
      ...summary,
      topListings,
      totalTrackedListings: listingTotalsMap.size,
    };
  }

  /**
   * Helper to consolidate summaries, zero-fill daily timeseries, and calculate deltas
   */
  private static buildAnalyticsSummary(
    currentSummaries: any[],
    prevSummaries: any[],
    days: number,
    startDate: Date,
    endDate: Date,
    listingId?: string
  ): AnalyticsSummaryResult {
    // Current period totals
    let views = 0;
    let uniqueVisitors = 0;
    let calls = 0;
    let whatsapps = 0;
    let directions = 0;
    let websites = 0;
    let enquiries = 0;
    let shares = 0;

    // Date bucket map for time series rollup
    const dateMap = new Map<string, DailyChartPoint>();

    // Pre-populate every day in the range with zeros
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dateMap.set(dateStr, {
        date: dateStr,
        label,
        views: 0,
        uniqueVisitors: 0,
        ctas: 0,
        calls: 0,
        whatsapps: 0,
        directions: 0,
        websites: 0,
        enquiries: 0,
      });
    }

    for (const row of currentSummaries) {
      views += row.pageViews;
      uniqueVisitors += row.uniqueVisitors;
      calls += row.callClicks;
      whatsapps += row.whatsappClicks;
      directions += row.directionsClicks;
      websites += row.websiteClicks;
      enquiries += row.enquiries;
      shares += row.shares;

      const dateStr = new Date(row.date).toISOString().slice(0, 10);
      const bucket = dateMap.get(dateStr);
      if (bucket) {
        const ctas = row.callClicks + row.whatsappClicks + row.directionsClicks + row.websiteClicks + row.enquiries;
        bucket.views += row.pageViews;
        bucket.uniqueVisitors += row.uniqueVisitors;
        bucket.ctas += ctas;
        bucket.calls += row.callClicks;
        bucket.whatsapps += row.whatsappClicks;
        bucket.directions += row.directionsClicks;
        bucket.websites += row.websiteClicks;
        bucket.enquiries += row.enquiries;
      }
    }

    const ctas = calls + whatsapps + directions + websites + enquiries;
    const conversionRate = uniqueVisitors > 0 ? Number(((ctas / uniqueVisitors) * 100).toFixed(1)) : 0;

    // Previous period totals for delta calculation
    let prevViews = 0;
    let prevUniqueVisitors = 0;
    let prevCalls = 0;
    let prevWhatsapps = 0;
    let prevDirections = 0;
    let prevWebsites = 0;
    let prevEnquiries = 0;

    for (const row of prevSummaries) {
      prevViews += row.pageViews;
      prevUniqueVisitors += row.uniqueVisitors;
      prevCalls += row.callClicks;
      prevWhatsapps += row.whatsappClicks;
      prevDirections += row.directionsClicks;
      prevWebsites += row.websiteClicks;
      prevEnquiries += row.enquiries;
    }

    const prevCtas = prevCalls + prevWhatsapps + prevDirections + prevWebsites + prevEnquiries;
    const prevConvRate = prevUniqueVisitors > 0 ? (prevCtas / prevUniqueVisitors) * 100 : 0;

    const calcDelta = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    return {
      listingId,
      periodDays: days,
      totals: {
        views,
        uniqueVisitors,
        ctas,
        calls,
        whatsapps,
        directions,
        websites,
        enquiries,
        shares,
        conversionRate,
      },
      deltas: {
        viewsPct: calcDelta(views, prevViews),
        uniqueVisitorsPct: calcDelta(uniqueVisitors, prevUniqueVisitors),
        ctasPct: calcDelta(ctas, prevCtas),
        conversionRatePct: Number((conversionRate - prevConvRate).toFixed(1)),
      },
      timeSeries: Array.from(dateMap.values()),
    };
  }

  private static buildEmptySummary(days: number): AnalyticsSummaryResult {
    const today = getUtcMidnight();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    const timeSeries: DailyChartPoint[] = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      timeSeries.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views: 0,
        uniqueVisitors: 0,
        ctas: 0,
        calls: 0,
        whatsapps: 0,
        directions: 0,
        websites: 0,
        enquiries: 0,
      });
    }

    return {
      periodDays: days,
      totals: {
        views: 0,
        uniqueVisitors: 0,
        ctas: 0,
        calls: 0,
        whatsapps: 0,
        directions: 0,
        websites: 0,
        enquiries: 0,
        shares: 0,
        conversionRate: 0,
      },
      deltas: {
        viewsPct: 0,
        uniqueVisitorsPct: 0,
        ctasPct: 0,
        conversionRatePct: 0,
      },
      timeSeries,
    };
  }
}
