import db from "$lib/db/client";
import { AnalyticsEventType } from "@prisma/client";
import { createHash } from "node:crypto";
import { env } from "$lib/config/env";

export { AnalyticsEventType };

export interface RecordEventInput {
  listingId: string;
  eventType: AnalyticsEventType;
  ip: string;
  userAgent: string;
  referrer?: string | null;
  deviceType?: string | null;
}

export interface AnalyticsSummaryPoint {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  actions: number;
  calls: number;
  whatsapp: number;
  directions: number;
  website: number;
  enquiries: number;
  shares: number;
}

export interface ListingAnalyticsResult {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalActions: number;
  totalCalls: number;
  totalWhatsApp: number;
  totalDirections: number;
  totalWebsite: number;
  totalEnquiries: number;
  totalShares: number;
  conversionRate: number; // percentage (0 - 100)
  trends: {
    pageViewsDiff: number; // % delta vs previous period
    uniqueVisitorsDiff: number;
    actionsDiff: number;
  };
  timeSeries: AnalyticsSummaryPoint[];
}

export interface MerchantOverviewResult {
  totalListings: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalActions: number;
  conversionRate: number;
  topListings: Array<{
    id: string;
    title: string;
    slug: string;
    pageViews: number;
    actions: number;
    conversionRate: number;
  }>;
  timeSeries: AnalyticsSummaryPoint[];
}

export interface DirectoryGlobalAnalyticsResult {
  totalTrackedListings: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalActions: number;
  conversionRate: number;
  topPerformers: Array<{
    id: string;
    title: string;
    slug: string;
    ownerName: string | null;
    pageViews: number;
    actions: number;
    conversionRate: number;
  }>;
  actionBreakdown: {
    calls: number;
    whatsapp: number;
    directions: number;
    website: number;
    enquiries: number;
    shares: number;
  };
  timeSeries: AnalyticsSummaryPoint[];
}

export class AnalyticsService {
  /**
   * Generates a DPDP Act 2023 compliant salted hash.
   * Uses rotating daily salt + secret so the same visitor is deduplicated within 24h
   * but cannot be tracked across days or reverse-engineered to raw IP.
   */
  static generateVisitorHash(ip: string, userAgent: string, date: Date = new Date()): string {
    const saltSecret = env.JWT_SECRET || "dpdp_local_salt_secret";
    const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const rawData = `${ip.trim()}::${userAgent.trim()}::${saltSecret}::${dateStr}`;
    return createHash("sha256").update(rawData).digest("hex").slice(0, 32);
  }

  /**
   * Ingests a telemetry event asynchronously and atomically rollups into daily summaries
   */
  static async recordEvent(input: RecordEventInput): Promise<void> {
    const now = new Date();
    const visitorHash = this.generateVisitorHash(input.ip, input.userAgent, now);

    // Compute UTC midnight of current day
    const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Insert raw event
    await db.analyticsEvent.create({
      data: {
        listingId: input.listingId,
        eventType: input.eventType,
        visitorHash,
        referrer: input.referrer ? input.referrer.slice(0, 255) : null,
        deviceType: input.deviceType ? input.deviceType.slice(0, 50) : null,
        createdAt: now,
      },
    });

    // Check if this visitor has already visited this listing today (for unique visitor counting)
    let isFirstUniqueVisitToday = false;
    if (input.eventType === AnalyticsEventType.PAGE_VIEW) {
      const priorCount = await db.analyticsEvent.count({
        where: {
          listingId: input.listingId,
          eventType: AnalyticsEventType.PAGE_VIEW,
          visitorHash,
          createdAt: {
            gte: todayMidnight,
            lt: now,
          },
        },
      });
      isFirstUniqueVisitToday = priorCount <= 1; // 1 means only the row we just inserted
    }

    // Atomically upsert the daily summary rollup
    const isView = input.eventType === AnalyticsEventType.PAGE_VIEW;
    const isCall = input.eventType === AnalyticsEventType.CALL;
    const isWA = input.eventType === AnalyticsEventType.WHATSAPP;
    const isDir = input.eventType === AnalyticsEventType.DIRECTIONS;
    const isWeb = input.eventType === AnalyticsEventType.WEBSITE;
    const isEnq = input.eventType === AnalyticsEventType.ENQUIRY;
    const isShare = input.eventType === AnalyticsEventType.SHARE;

    await db.analyticsDailySummary.upsert({
      where: {
        listingId_date: {
          listingId: input.listingId,
          date: todayMidnight,
        },
      },
      create: {
        listingId: input.listingId,
        date: todayMidnight,
        pageViews: isView ? 1 : 0,
        uniqueVisitors: isView && isFirstUniqueVisitToday ? 1 : 0,
        callClicks: isCall ? 1 : 0,
        whatsappClicks: isWA ? 1 : 0,
        directionsClicks: isDir ? 1 : 0,
        websiteClicks: isWeb ? 1 : 0,
        enquiries: isEnq ? 1 : 0,
        shares: isShare ? 1 : 0,
      },
      update: {
        ...(isView && { pageViews: { increment: 1 } }),
        ...(isView && isFirstUniqueVisitToday && { uniqueVisitors: { increment: 1 } }),
        ...(isCall && { callClicks: { increment: 1 } }),
        ...(isWA && { whatsappClicks: { increment: 1 } }),
        ...(isDir && { directionsClicks: { increment: 1 } }),
        ...(isWeb && { websiteClicks: { increment: 1 } }),
        ...(isEnq && { enquiries: { increment: 1 } }),
        ...(isShare && { shares: { increment: 1 } }),
      },
    });
  }

  /**
   * Retrieves analytics data for a specific listing over the specified lookback window
   */
  static async getListingAnalytics(listingId: string, days = 30): Promise<ListingAnalyticsResult> {
    const now = new Date();
    const currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days + 1));
    const previousStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days * 2 + 1));

    // Fetch daily summaries for current and previous periods
    const [currentSummaries, previousSummaries] = await Promise.all([
      db.analyticsDailySummary.findMany({
        where: {
          listingId,
          date: { gte: currentStart, lt: currentEnd },
        },
        orderBy: { date: "asc" },
      }),
      db.analyticsDailySummary.findMany({
        where: {
          listingId,
          date: { gte: previousStart, lt: currentStart },
        },
      }),
    ]);

    // Build day map for zero-filling time series
    const summaryMap = new Map<string, (typeof currentSummaries)[0]>();
    for (const s of currentSummaries) {
      summaryMap.set(s.date.toISOString().slice(0, 10), s);
    }

    const timeSeries: AnalyticsSummaryPoint[] = [];
    let totalPageViews = 0;
    let totalUniqueVisitors = 0;
    let totalCalls = 0;
    let totalWhatsApp = 0;
    let totalDirections = 0;
    let totalWebsite = 0;
    let totalEnquiries = 0;
    let totalShares = 0;

    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setUTCDate(d.getUTCDate() + i);
      const dateKey = d.toISOString().slice(0, 10);
      const item = summaryMap.get(dateKey);

      const pViews = item?.pageViews || 0;
      const uVisitors = item?.uniqueVisitors || 0;
      const calls = item?.callClicks || 0;
      const wa = item?.whatsappClicks || 0;
      const dirs = item?.directionsClicks || 0;
      const web = item?.websiteClicks || 0;
      const enqs = item?.enquiries || 0;
      const shs = item?.shares || 0;
      const actions = calls + wa + dirs + web + enqs;

      totalPageViews += pViews;
      totalUniqueVisitors += uVisitors;
      totalCalls += calls;
      totalWhatsApp += wa;
      totalDirections += dirs;
      totalWebsite += web;
      totalEnquiries += enqs;
      totalShares += shs;

      timeSeries.push({
        date: dateKey,
        pageViews: pViews,
        uniqueVisitors: uVisitors,
        actions,
        calls,
        whatsapp: wa,
        directions: dirs,
        website: web,
        enquiries: enqs,
        shares: shs,
      });
    }

    const totalActions = totalCalls + totalWhatsApp + totalDirections + totalWebsite + totalEnquiries;
    const conversionRate = totalUniqueVisitors > 0 ? Number(((totalActions / totalUniqueVisitors) * 100).toFixed(1)) : 0;

    // Previous period aggregates for trend calculation
    const prevPageViews = previousSummaries.reduce((acc, s) => acc + s.pageViews, 0);
    const prevUniqueVisitors = previousSummaries.reduce((acc, s) => acc + s.uniqueVisitors, 0);
    const prevActions = previousSummaries.reduce(
      (acc, s) => acc + s.callClicks + s.whatsappClicks + s.directionsClicks + s.websiteClicks + s.enquiries,
      0
    );

    const calcDelta = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    return {
      totalPageViews,
      totalUniqueVisitors,
      totalActions,
      totalCalls,
      totalWhatsApp,
      totalDirections,
      totalWebsite,
      totalEnquiries,
      totalShares,
      conversionRate,
      trends: {
        pageViewsDiff: calcDelta(totalPageViews, prevPageViews),
        uniqueVisitorsDiff: calcDelta(totalUniqueVisitors, prevUniqueVisitors),
        actionsDiff: calcDelta(totalActions, prevActions),
      },
      timeSeries,
    };
  }

  /**
   * Merchant Portfolio Overview across all business listings owned by a merchant
   */
  static async getMerchantOverviewAnalytics(ownerId: string, days = 30): Promise<MerchantOverviewResult> {
    const listings = await db.listing.findMany({
      where: { ownerId },
      select: { id: true, title: true, slug: true },
    });

    if (listings.length === 0) {
      return {
        totalListings: 0,
        totalPageViews: 0,
        totalUniqueVisitors: 0,
        totalActions: 0,
        conversionRate: 0,
        topListings: [],
        timeSeries: [],
      };
    }

    const listingIds = listings.map((l) => l.id);
    const now = new Date();
    const currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days + 1));

    const summaries = await db.analyticsDailySummary.findMany({
      where: {
        listingId: { in: listingIds },
        date: { gte: currentStart, lt: currentEnd },
      },
      orderBy: { date: "asc" },
    });

    // Date bucketed map
    const dateMap = new Map<string, AnalyticsSummaryPoint>();
    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      dateMap.set(key, {
        date: key,
        pageViews: 0,
        uniqueVisitors: 0,
        actions: 0,
        calls: 0,
        whatsapp: 0,
        directions: 0,
        website: 0,
        enquiries: 0,
        shares: 0,
      });
    }

    // Per-listing totals
    const perListingMap = new Map<string, { pageViews: number; actions: number }>();
    for (const l of listings) {
      perListingMap.set(l.id, { pageViews: 0, actions: 0 });
    }

    let totalPageViews = 0;
    let totalUniqueVisitors = 0;
    let totalActions = 0;

    for (const s of summaries) {
      const key = s.date.toISOString().slice(0, 10);
      const dayItem = dateMap.get(key);
      const actions = s.callClicks + s.whatsappClicks + s.directionsClicks + s.websiteClicks + s.enquiries;

      if (dayItem) {
        dayItem.pageViews += s.pageViews;
        dayItem.uniqueVisitors += s.uniqueVisitors;
        dayItem.actions += actions;
        dayItem.calls += s.callClicks;
        dayItem.whatsapp += s.whatsappClicks;
        dayItem.directions += s.directionsClicks;
        dayItem.website += s.websiteClicks;
        dayItem.enquiries += s.enquiries;
        dayItem.shares += s.shares;
      }

      totalPageViews += s.pageViews;
      totalUniqueVisitors += s.uniqueVisitors;
      totalActions += actions;

      const listingStat = perListingMap.get(s.listingId);
      if (listingStat) {
        listingStat.pageViews += s.pageViews;
        listingStat.actions += actions;
      }
    }

    const conversionRate = totalUniqueVisitors > 0 ? Number(((totalActions / totalUniqueVisitors) * 100).toFixed(1)) : 0;

    const topListings = listings
      .map((l) => {
        const stat = perListingMap.get(l.id) || { pageViews: 0, actions: 0 };
        return {
          id: l.id,
          title: l.title,
          slug: l.slug,
          pageViews: stat.pageViews,
          actions: stat.actions,
          conversionRate: stat.pageViews > 0 ? Number(((stat.actions / stat.pageViews) * 100).toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.actions - a.actions || b.pageViews - a.pageViews);

    return {
      totalListings: listings.length,
      totalPageViews,
      totalUniqueVisitors,
      totalActions,
      conversionRate,
      topListings,
      timeSeries: Array.from(dateMap.values()),
    };
  }

  /**
   * Directory-Wide Analytics Portal for Administrator Console
   */
  static async getDirectoryGlobalAnalytics(days = 30): Promise<DirectoryGlobalAnalyticsResult> {
    const now = new Date();
    const currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days + 1));

    const summaries = await db.analyticsDailySummary.findMany({
      where: {
        date: { gte: currentStart, lt: currentEnd },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            owner: { select: { name: true } },
          },
        },
      },
      orderBy: { date: "asc" },
    });

    const dateMap = new Map<string, AnalyticsSummaryPoint>();
    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      dateMap.set(key, {
        date: key,
        pageViews: 0,
        uniqueVisitors: 0,
        actions: 0,
        calls: 0,
        whatsapp: 0,
        directions: 0,
        website: 0,
        enquiries: 0,
        shares: 0,
      });
    }

    const listingMap = new Map<
      string,
      {
        id: string;
        title: string;
        slug: string;
        ownerName: string | null;
        pageViews: number;
        actions: number;
      }
    >();

    let totalPageViews = 0;
    let totalUniqueVisitors = 0;
    let totalCalls = 0;
    let totalWhatsApp = 0;
    let totalDirections = 0;
    let totalWebsite = 0;
    let totalEnquiries = 0;
    let totalShares = 0;

    for (const s of summaries) {
      const key = s.date.toISOString().slice(0, 10);
      const dayItem = dateMap.get(key);
      const actions = s.callClicks + s.whatsappClicks + s.directionsClicks + s.websiteClicks + s.enquiries;

      if (dayItem) {
        dayItem.pageViews += s.pageViews;
        dayItem.uniqueVisitors += s.uniqueVisitors;
        dayItem.actions += actions;
        dayItem.calls += s.callClicks;
        dayItem.whatsapp += s.whatsappClicks;
        dayItem.directions += s.directionsClicks;
        dayItem.website += s.websiteClicks;
        dayItem.enquiries += s.enquiries;
        dayItem.shares += s.shares;
      }

      totalPageViews += s.pageViews;
      totalUniqueVisitors += s.uniqueVisitors;
      totalCalls += s.callClicks;
      totalWhatsApp += s.whatsappClicks;
      totalDirections += s.directionsClicks;
      totalWebsite += s.websiteClicks;
      totalEnquiries += s.enquiries;
      totalShares += s.shares;

      if (s.listing) {
        let entry = listingMap.get(s.listing.id);
        if (!entry) {
          entry = {
            id: s.listing.id,
            title: s.listing.title,
            slug: s.listing.slug,
            ownerName: s.listing.owner?.name || null,
            pageViews: 0,
            actions: 0,
          };
          listingMap.set(s.listing.id, entry);
        }
        entry.pageViews += s.pageViews;
        entry.actions += actions;
      }
    }

    const totalActions = totalCalls + totalWhatsApp + totalDirections + totalWebsite + totalEnquiries;
    const conversionRate = totalUniqueVisitors > 0 ? Number(((totalActions / totalUniqueVisitors) * 100).toFixed(1)) : 0;

    const topPerformers = Array.from(listingMap.values())
      .map((item) => ({
        ...item,
        conversionRate: item.pageViews > 0 ? Number(((item.actions / item.pageViews) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.actions - a.actions || b.pageViews - a.pageViews)
      .slice(0, 10);

    return {
      totalTrackedListings: listingMap.size,
      totalPageViews,
      totalUniqueVisitors,
      totalActions,
      conversionRate,
      topPerformers,
      actionBreakdown: {
        calls: totalCalls,
        whatsapp: totalWhatsApp,
        directions: totalDirections,
        website: totalWebsite,
        enquiries: totalEnquiries,
        shares: totalShares,
      },
      timeSeries: Array.from(dateMap.values()),
    };
  }
}
