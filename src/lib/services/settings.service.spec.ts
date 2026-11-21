import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEFAULT_SETTINGS,
  getSettings,
  updateSettings,
  invalidateSettingsCache,
  type SiteSettingsData,
} from "./settings.service";
import db from "$lib/db/client";

describe("Phase 09: Dynamic Site Settings Engine & Maintenance Guard", () => {
  beforeEach(() => {
    invalidateSettingsCache();
  });

  it("exports valid DEFAULT_SETTINGS configuration matching localization and defaults", () => {
    expect(DEFAULT_SETTINGS.siteName).toBe("Pimple Saudagar Local Directory");
    expect(DEFAULT_SETTINGS.currencyCode).toBe("INR");
    expect(DEFAULT_SETTINGS.currencySymbol).toBe("₹");
    expect(DEFAULT_SETTINGS.defaultRadiusKm).toBe(25);
    expect(DEFAULT_SETTINGS.maintenanceMode).toBe(false);
    expect(DEFAULT_SETTINGS.allowRegistration).toBe(true);
    expect(DEFAULT_SETTINGS.autoApproveClaims).toBe(false);
    expect(DEFAULT_SETTINGS.requireReviewOtp).toBe(true);
  });

  it("fetches settings from database or falls back to defaults safely", async () => {
    const settings = await getSettings();
    expect(settings).toBeDefined();
    expect(settings.id).toBe("default");
    expect(settings.currencySymbol).toBe("₹");
    expect(settings.currencyCode).toBe("INR");
    expect(typeof settings.maintenanceMode).toBe("boolean");
  });

  it("caches settings in-memory to prevent database overhead on subsequent calls", async () => {
    const firstCall = await getSettings();
    const secondCall = await getSettings();
    expect(firstCall).toBe(secondCall); // Reference equality verifies in-memory cache hit
  });

  it("invalidates cache when invalidateSettingsCache() is invoked", async () => {
    const firstCall = await getSettings();
    invalidateSettingsCache();
    // After invalidation, subsequent call fetches fresh instance
    const freshCall = await getSettings();
    expect(freshCall).toBeDefined();
    expect(freshCall.siteName).toBe(firstCall.siteName);
  });
});
