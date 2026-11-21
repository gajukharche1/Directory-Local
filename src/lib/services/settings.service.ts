import db from "$lib/db/client";

export interface SiteSettingsData {
  id: string;
  siteName: string;
  siteTagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  supportEmail: string;
  currencyCode: string;
  currencySymbol: string;
  defaultRadiusKm: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  autoApproveClaims: boolean;
  requireReviewOtp: boolean;
  updatedAt: Date;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  id: "default",
  siteName: "Pimple Saudagar Local Directory",
  siteTagline: "Find verified local businesses, restaurants, clinics, and shops near you",
  logoUrl: null,
  faviconUrl: null,
  supportEmail: "support@pimplesaudagar.local",
  currencyCode: "INR",
  currencySymbol: "₹",
  defaultRadiusKm: 25,
  maintenanceMode: false,
  allowRegistration: true,
  autoApproveClaims: false,
  requireReviewOtp: true,
  updatedAt: new Date(),
};

// In-memory cache to prevent database query overhead on high-traffic public requests
let cachedSettings: SiteSettingsData | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Retrieves the current site settings (cached with 60s TTL)
 */
export async function getSettings(): Promise<SiteSettingsData> {
  const now = Date.now();
  if (cachedSettings && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  try {
    let record = await db.siteSetting.findUnique({
      where: { id: "default" },
    });

    if (!record) {
      record = await db.siteSetting.create({
        data: {
          id: "default",
          siteName: DEFAULT_SETTINGS.siteName,
          siteTagline: DEFAULT_SETTINGS.siteTagline,
          supportEmail: DEFAULT_SETTINGS.supportEmail,
          currencyCode: DEFAULT_SETTINGS.currencyCode,
          currencySymbol: DEFAULT_SETTINGS.currencySymbol,
          defaultRadiusKm: DEFAULT_SETTINGS.defaultRadiusKm,
          maintenanceMode: DEFAULT_SETTINGS.maintenanceMode,
          allowRegistration: DEFAULT_SETTINGS.allowRegistration,
          autoApproveClaims: DEFAULT_SETTINGS.autoApproveClaims,
          requireReviewOtp: DEFAULT_SETTINGS.requireReviewOtp,
        },
      });
    }

    cachedSettings = record;
    lastCacheTime = now;
    return cachedSettings;
  } catch (err) {
    console.warn("Failed to retrieve site settings from DB, using defaults:", err);
    return cachedSettings || DEFAULT_SETTINGS;
  }
}

/**
 * Updates site settings and invalidates cache immediately
 */
export async function updateSettings(
  data: Partial<Omit<SiteSettingsData, "id" | "updatedAt">>
): Promise<SiteSettingsData> {
  const updated = await db.siteSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: data.siteName ?? DEFAULT_SETTINGS.siteName,
      siteTagline: data.siteTagline ?? DEFAULT_SETTINGS.siteTagline,
      logoUrl: data.logoUrl,
      faviconUrl: data.faviconUrl,
      supportEmail: data.supportEmail ?? DEFAULT_SETTINGS.supportEmail,
      currencyCode: data.currencyCode ?? DEFAULT_SETTINGS.currencyCode,
      currencySymbol: data.currencySymbol ?? DEFAULT_SETTINGS.currencySymbol,
      defaultRadiusKm: data.defaultRadiusKm ?? DEFAULT_SETTINGS.defaultRadiusKm,
      maintenanceMode: data.maintenanceMode ?? DEFAULT_SETTINGS.maintenanceMode,
      allowRegistration: data.allowRegistration ?? DEFAULT_SETTINGS.allowRegistration,
      autoApproveClaims: data.autoApproveClaims ?? DEFAULT_SETTINGS.autoApproveClaims,
      requireReviewOtp: data.requireReviewOtp ?? DEFAULT_SETTINGS.requireReviewOtp,
    },
    update: {
      ...(data.siteName !== undefined && { siteName: data.siteName }),
      ...(data.siteTagline !== undefined && { siteTagline: data.siteTagline }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.faviconUrl !== undefined && { faviconUrl: data.faviconUrl }),
      ...(data.supportEmail !== undefined && { supportEmail: data.supportEmail }),
      ...(data.currencyCode !== undefined && { currencyCode: data.currencyCode }),
      ...(data.currencySymbol !== undefined && { currencySymbol: data.currencySymbol }),
      ...(data.defaultRadiusKm !== undefined && { defaultRadiusKm: data.defaultRadiusKm }),
      ...(data.maintenanceMode !== undefined && { maintenanceMode: data.maintenanceMode }),
      ...(data.allowRegistration !== undefined && { allowRegistration: data.allowRegistration }),
      ...(data.autoApproveClaims !== undefined && { autoApproveClaims: data.autoApproveClaims }),
      ...(data.requireReviewOtp !== undefined && { requireReviewOtp: data.requireReviewOtp }),
    },
  });

  cachedSettings = updated;
  lastCacheTime = Date.now();
  return updated;
}

/**
 * Invalidate cache manually (e.g. for testing)
 */
export function invalidateSettingsCache() {
  cachedSettings = null;
  lastCacheTime = 0;
}
