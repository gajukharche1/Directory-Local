# Phase Plan: 05.1 Admin Sidebar Accordion Navigation & Catalog Routes

## Goal
Transform the Admin Console navigation into a multi-group collapsible accordion sidebar matching the reference UI, featuring interactive accordion sections for **Listing**, **Categories**, and **Locations** (with `All` and `Add New` sub-items), top-level administration links, a modern operational status header bar, and full scaffolding for all target routes (`/admin/categories`, `/admin/locations`, `/admin/listings/new`, `/admin/analytics`, `/admin/settings`).

---

## Visual & Functional Blueprint (from Reference Image)

### 1. Left Sidebar Navigation Structure
- **Dashboard** (`/admin`) — High-level metric overview and operational launchpad
- **Moderation Queue** (`/admin/moderation`) — Reviews & ownership claim requests
- **Listing** (Collapsible Accordion):
  - `All Listing` (`/admin/listings`) — Full directory table with bulk select & filters
  - `Add New Listing` (`/admin/listings/new`) — Merchant onboarding & listing creation
- **Categories** (Collapsible Accordion):
  - `All Categories` (`/admin/categories`) — Category taxonomy, icons & parent hierarchy
  - `Add New Category` (`/admin/categories/new`) — New category creation form
- **Locations** (Collapsible Accordion):
  - `All Locations` (`/admin/locations`) — Geographical hubs, neighborhoods & coordinates
  - `Add New Location` (`/admin/locations/new`) — New location creation form
- **CSV Import / Export** (`/admin/imports`) — Bulk data upload and schema validation
- **Media Library** (`/admin/media`) — Enterprise cloud asset manager & virtual folders
- **Directory Analytics** (`/admin/analytics`) — Performance telemetry, clicks & views
- **Site & Settings** (`/admin/settings`) — Global branding, SEO & operational controls

### 2. Top Header & Operational Status Bar
- Left: `Operational Status · Level 2 RBAC Guard Active` with green status dot.
- Right: Profile pill `[Avatar] Directory Admin · ADMIN ▾` with dropdown to Public Site, Admin Profile, and Sign Out.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-05.1-admin-sidebar-accordion-navigation`
- **Branch Creation**: `git checkout -b feature/phase-05.1-admin-sidebar-accordion-navigation`
- **Commit Standards**: Conventional Commits with structured scopes:
  - Wave 1: `feat(admin-nav): build collapsible accordion sidebar with Svelte 5 runes`
  - Wave 2: `feat(admin-nav): add top operational status bar and admin user header dropdown`
  - Wave 3: `feat(admin-catalog): scaffold categories, locations and new listing routes`
  - Wave 4: `test(admin-nav): verify accordion routing, auto-expansion and visual state`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to feature branch: `git checkout -b feature/phase-05.1-admin-sidebar-accordion-navigation`.

### Wave 1: Collapsible Accordion Navigation (Svelte 5 Runes)
- [ ] **Task 1.1**: Update `src/routes/(admin)/admin/+layout.svelte` with reactive accordion state using Svelte 5 runes (`$state<Set<string>>`).
- [ ] **Task 1.2**: Support automatic expansion of parent accordions whenever `$page.url.pathname` matches any child route.
- [ ] **Task 1.3**: Add smooth chevron rotation and CSS transition animations (`grid-template-rows: 0fr -> 1fr`) for expand/collapse.
- [ ] **Task 1.4**: Style sub-links with indent lines, distinct active indicators, and hover micro-interactions matching the `#F6F7FC` / pastel UI.
- [ ] **Task 1.5**: Commit Wave 1: `git commit -m "feat(admin-nav): build collapsible accordion sidebar with Svelte 5 runes"`.

### Wave 2: Top Operational Status Bar & User Dropdown
- [ ] **Task 2.1**: Implement top operational status bar above the main content area in `src/routes/(admin)/admin/+layout.svelte`.
- [ ] **Task 2.2**: Include `Operational Status · Level 2 RBAC Guard Active` with emerald pulsing badge.
- [ ] **Task 2.3**: Build top-right user menu pill with avatar initials, role badge, and dropdown links (`Public Site`, `Site Settings`, `Sign Out`).
- [ ] **Task 2.4**: Commit Wave 2: `git commit -m "feat(admin-nav): add top operational status bar and admin user header dropdown"`.

### Wave 3: Route Scaffolding for Catalog & Admin Modules
- [ ] **Task 3.1**: Create `src/routes/(admin)/admin/listings/new/+page.server.ts` & `+page.svelte` to allow quick listing creation with automatic redirect to editor.
- [ ] **Task 3.2**: Create `src/routes/(admin)/admin/categories/+page.server.ts` & `+page.svelte` rendering existing categories from Prisma database with badge counts and create button.
- [ ] **Task 3.3**: Create `src/routes/(admin)/admin/categories/new/+page.svelte` & `+page.server.ts` with category form (name, slug, parent, icon, sort order).
- [ ] **Task 3.4**: Create `src/routes/(admin)/admin/locations/+page.server.ts` & `+page.svelte` rendering locations from Prisma database with coordinates and hierarchy.
- [ ] **Task 3.5**: Create `src/routes/(admin)/admin/locations/new/+page.svelte` & `+page.server.ts` with location form (name, slug, parent, latitude, longitude).
- [ ] **Task 3.6**: Create `src/routes/(admin)/admin/analytics/+page.svelte` and `src/routes/(admin)/admin/settings/+page.svelte` placeholder hubs to guarantee zero 404s.
- [ ] **Task 3.7**: Commit Wave 3: `git commit -m "feat(admin-catalog): scaffold categories, locations and new listing routes"`.

### Wave 4: Verification & Integration Testing
- [ ] **Task 4.1**: Verify clicking accordion headers toggles expand/collapse without navigating away.
- [ ] **Task 4.2**: Verify navigating directly to `/admin/categories` automatically expands the `Categories` accordion and highlights `All Categories`.
- [ ] **Task 4.3**: Verify clicking `Add New Listing`, `Add New Category`, `Add New Location` routes smoothly without 404 errors.
- [ ] **Task 4.4**: Run `npm test` verifying test suite passes with zero regressions.
- [ ] **Task 4.5**: Commit Wave 4: `git commit -m "test(admin-nav): verify accordion routing, auto-expansion and visual state"`.

---

## Verification Criteria
1. Sidebar displays 3 collapsible groups: **Listing**, **Categories**, **Locations**, each containing `All` and `Add New` links.
2. Clicking an accordion header smoothly expands/collapses the sub-links with rotating chevron icon.
3. Active route highlights the current item and keeps its parent group open automatically.
4. Top status bar displays the operational status indicator and admin profile pill.
5. All sidebar links resolve with HTTP 200 (no 404 broken routes).
6. Full test suite passes cleanly.
