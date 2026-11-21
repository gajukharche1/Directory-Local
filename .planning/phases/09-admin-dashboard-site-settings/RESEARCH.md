# Phase 09 Research: Admin Dashboard & Site Settings Modernization

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/dashboard-settings-plan.md`

---

## 1. UX Research & Administrative Governance (`/agency-ux-researcher`)

### Centralized Operational Control
1. **The "Hardcoded Settings" Anti-Pattern**:
   - Site branding (title, tagline, logo), default currency (`₹`), and operational toggles (maintenance mode, public registrations) are currently scattered across environment variables or code files.
   - Non-technical administrators cannot update business contact details or site branding without asking a developer to redeploy code.
   - *UX Solution*: A centralized Settings Console (`/admin/settings`) segmented into clean tabbed sections: `General Branding`, `Localization & Currency`, `Directory Rules & Moderation`, and `Maintenance`.
2. **Executive Overview & Triage**:
   - When an administrator logs into `/admin`, they need an immediate situational snapshot: What requires action *right now*? (Pending Reviews, Unclaimed Businesses, Expired Deals).
   - High-contrast KPI cards with priority alerts ("3 listings awaiting review", "12 unhandled enquiries") reduce triage time from minutes to seconds.

---

## 2. Technical Architecture & Persistence (`/agency-ux-architect`)

### Site Settings Schema & Singleton Pattern
```prisma
model SiteSetting {
  id               String   @id @default("default")
  siteName         String   @default("Local Business Directory")
  siteTagline      String   @default("Find the best verified local businesses")
  logoUrl          String?
  faviconUrl       String?
  supportEmail     String   @default("support@example.com")
  currencyCode     String   @default("INR")
  currencySymbol   String   @default("₹")
  defaultRadiusKm  Int      @default(25)
  maintenanceMode  Boolean  @default(false)
  allowRegistration Boolean @default(true)
  autoApproveClaims Boolean @default(false)
  updatedAt        DateTime @updatedAt

  @@map("site_settings")
}
```

- **Singleton DAL Service (`src/lib/services/settings.service.ts`)**:
  - `getSettings()`: Cached read (in-memory or fast single-row query) with fallback defaults.
  - `updateSettings(data)`: Validated update with RBAC check (`assertRole(admin)`).
  - Middleware/Hook Integration: `src/hooks.server.ts` checks `maintenanceMode` and redirects non-admin users to a maintenance landing page if enabled.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Admin Dashboard Modernization Tokens
- **Surface Geometry & Radii Rules**:
  - Outer Containers: `bg-card border border-border/70 rounded-2xl p-6 shadow-sm`
  - Inner Subsections: `bg-muted/40 rounded-xl p-4 border border-border/50`
  - Control Elements: `rounded-lg h-10 text-sm`
- **Dashboard Executive KPI Grid (4-column responsive)**:
  - Total Active Listings: Primary Accent (`bg-primary/10 text-primary border-primary/20`)
  - Pending Review Queue: Attention Amber (`bg-amber-500/10 text-amber-600 border-amber-500/20`)
  - Verified Claims: Security Blue (`bg-blue-500/10 text-blue-600 border-blue-500/20`)
  - Registered Users: Audience Purple (`bg-purple-500/10 text-purple-600 border-purple-500/20`)
- **Settings Form UI**:
  - Segmented vertical tab rail on desktop (General, Localization, Rules, Maintenance).
  - Accessible toggle switches with clear visual active indicators.
  - Image uploader slots for Logo and Favicon with real-time preview.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No emojis as icons (use Lucide SVG: `Settings`, `Shield`, `Globe`, `Coins`, `AlertTriangle`, `Sliders`).
- [ ] Toggle switches accessible via Space and Enter keys with `role="switch"` and `aria-checked`.
- [ ] Saving settings displays immediate success toast notification.
- [ ] Full dark mode and light mode contrast compliance (minimum 4.5:1 ratio).
