---
phase: 07-multi-entity-csv-import-opening-hours
plan: PLAN
subsystem: admin-import
tags: [csv-import, opening-hours, taxonomy, schedule-matrix, admin-tools, svelte5]
provides:
  - Shorthand natural language opening hours parser (opening-hours-parser.ts)
  - Visual 7-day schedule configuration matrix (OpeningHoursScheduler.svelte)
  - Multi-Entity CSV Import Hub supporting Listings, Categories, and Locations
  - Pre-flight client-side CSV validation and row error inspection preview
  - Downloadable CSV templates and 1-click sample demo data loaders
affects: [admin-imports, admin-listings, public-listing, categories, locations]
tech-stack:
  added: []
  patterns: [client-preflight-csv-validation, natural-language-time-parser, svelte5-runes]
key-files:
  created:
    - src/lib/utils/opening-hours-parser.ts
    - src/lib/utils/opening-hours-parser.spec.ts
    - src/lib/components/forms/OpeningHoursScheduler.svelte
    - src/lib/utils/csv-parser.ts
  modified:
    - src/routes/(admin)/admin/imports/+page.server.ts
    - src/routes/(admin)/admin/imports/+page.svelte
    - src/routes/(admin)/admin/listings/new/+page.svelte
    - src/routes/(admin)/admin/listings/[id]/edit/+page.svelte
key-decisions:
  - "Pre-flight validation: Checks column headers and mandatory fields in browser memory to eliminate costly server round-trips on malformed files."
  - "Flexible regex schedule parser: Supports military, 12-hour AM/PM, range, and natural language days ('Mon-Sat: 9am-8pm')."
status: planned
---

# Phase 07: Multi-Entity CSV Import Hub & Opening Hours Summary
Multi-entity CSV bulk import hub covering Listings, Categories, and Locations with pre-flight validation and an interactive visual 7-day opening hours schedule matrix.
