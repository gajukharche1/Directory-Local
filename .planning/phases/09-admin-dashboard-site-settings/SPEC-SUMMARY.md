---
phase: 09-admin-dashboard-site-settings
plan: PLAN
subsystem: admin-settings
tags: [site-settings, branding, governance, admin-dashboard, kpi-metrics, svelte5]
provides:
  - Database-backed SiteSetting PostgreSQL Prisma model and DAL service
  - Centralized Settings Console at /admin/settings (Branding, Localization, Rules, Maintenance)
  - Accessible ToggleSwitch.svelte component with ARIA switch attributes
  - Executive KPI dashboard redesign at /admin with situational triage queues
  - Server hook integration for automated maintenance mode gating
affects: [admin-layout, admin-home, admin-settings, public-layout, header]
tech-stack:
  added: []
  patterns: [singleton-site-settings, server-hook-maintenance-guard, executive-kpi-grid, svelte5-runes]
key-files:
  created:
    - src/lib/services/settings.service.ts
    - src/lib/components/ui/ToggleSwitch.svelte
  modified:
    - prisma/schema.prisma
    - src/hooks.server.ts
    - src/routes/+layout.server.ts
    - src/routes/(admin)/admin/+page.server.ts
    - src/routes/(admin)/admin/+page.svelte
    - src/routes/(admin)/admin/settings/+page.server.ts
    - src/routes/(admin)/admin/settings/+page.svelte
    - src/lib/components/ui/Header.svelte
key-decisions:
  - "Database-backed site settings: Empowers non-technical administrators to adjust branding, logos, and currency without code redeployments."
  - "Hook-level maintenance gate: Intercepts unauthenticated visitor requests in hooks.server.ts before loading database queries, reducing server overhead during maintenance."
status: planned
---

# Phase 09: Admin Dashboard & Site Settings Modernization Summary
Dynamic site configuration console at `/admin/settings` controlling directory branding, currency, and operational governance, paired with an executive KPI dashboard redesign at `/admin`.
