import { describe, it, expect } from "vitest";
import {
  generateVisitorHash,
  getUtcMidnight,
  isBot,
  normalizeEventType,
} from "./analytics.service";
import { AnalyticsEventType } from "@prisma/client";

describe("Phase 11: Business Analytics & Telemetry Engine", () => {
  describe("DPDP Act 2023 Compliant Visitor Hashing", () => {
    it("generates deterministic 32-char SHA-256 hash for identical user on same day", () => {
      const today = new Date("2026-11-26T10:00:00Z");
      const hash1 = generateVisitorHash("192.168.1.50", "Mozilla/5.0 Chrome", today);
      const hash2 = generateVisitorHash("192.168.1.50", "Mozilla/5.0 Chrome", today);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(32);
      expect(hash1).not.toContain("192.168.1.50"); // Raw IP never leaked
    });

    it("rotates visitor hash across different calendar days for privacy preservation", () => {
      const day1 = new Date("2026-11-26T10:00:00Z");
      const day2 = new Date("2026-11-27T10:00:00Z");

      const hashDay1 = generateVisitorHash("192.168.1.50", "Mozilla/5.0 Chrome", day1);
      const hashDay2 = generateVisitorHash("192.168.1.50", "Mozilla/5.0 Chrome", day2);

      // Daily rotating salt prevents persistent cross-day user tracking
      expect(hashDay1).not.toBe(hashDay2);
    });

    it("distinguishes between different devices or IPs on the same day", () => {
      const today = new Date("2026-11-26T10:00:00Z");
      const hashDesktop = generateVisitorHash("192.168.1.50", "Mozilla/5.0 (Windows NT 10.0; Win64)", today);
      const hashMobile = generateVisitorHash("192.168.1.50", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)", today);
      const hashOtherIp = generateVisitorHash("10.0.0.1", "Mozilla/5.0 (Windows NT 10.0; Win64)", today);

      expect(hashDesktop).not.toBe(hashMobile);
      expect(hashDesktop).not.toBe(hashOtherIp);
    });
  });

  describe("Bot & Crawler Detection", () => {
    it("identifies known search engine crawlers and automated scraper user agents", () => {
      expect(isBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(true);
      expect(isBot("Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)")).toBe(true);
      expect(isBot("curl/8.4.0")).toBe(true);
      expect(isBot("python-requests/2.31.0")).toBe(true);
      expect(isBot("HeadlessChrome/120.0.0.0")).toBe(true);
    });

    it("allows standard human browser user agents", () => {
      expect(isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")).toBe(false);
      expect(isBot("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15")).toBe(false);
      expect(isBot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1")).toBe(false);
    });
  });

  describe("Event Type Normalization", () => {
    it("maps flexible user action strings to Prisma enum values", () => {
      expect(normalizeEventType("page_view")).toBe(AnalyticsEventType.PAGE_VIEW);
      expect(normalizeEventType("view")).toBe(AnalyticsEventType.PAGE_VIEW);
      expect(normalizeEventType("call")).toBe(AnalyticsEventType.CALL);
      expect(normalizeEventType("phone")).toBe(AnalyticsEventType.CALL);
      expect(normalizeEventType("whatsapp")).toBe(AnalyticsEventType.WHATSAPP);
      expect(normalizeEventType("chat")).toBe(AnalyticsEventType.WHATSAPP);
      expect(normalizeEventType("directions")).toBe(AnalyticsEventType.DIRECTIONS);
      expect(normalizeEventType("map")).toBe(AnalyticsEventType.DIRECTIONS);
      expect(normalizeEventType("website")).toBe(AnalyticsEventType.WEBSITE);
      expect(normalizeEventType("enquiry")).toBe(AnalyticsEventType.ENQUIRY);
      expect(normalizeEventType("lead")).toBe(AnalyticsEventType.ENQUIRY);
      expect(normalizeEventType("share")).toBe(AnalyticsEventType.SHARE);
    });

    it("rejects unknown or invalid event types", () => {
      expect(normalizeEventType("random_hack")).toBeNull();
      expect(normalizeEventType("")).toBeNull();
    });
  });

  describe("Date Alignment for Database Rollups", () => {
    it("returns midnight UTC consistently", () => {
      const sample = new Date("2026-11-26T17:45:30.500Z");
      const midnight = getUtcMidnight(sample);

      expect(midnight.getUTCHours()).toBe(0);
      expect(midnight.getUTCMinutes()).toBe(0);
      expect(midnight.getUTCSeconds()).toBe(0);
      expect(midnight.getUTCMilliseconds()).toBe(0);
      expect(midnight.toISOString().slice(0, 10)).toBe("2026-11-26");
    });
  });
});
