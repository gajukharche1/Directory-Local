# Phase Plan: Multi-Entity CSV Import Hub & Business Opening Hours

## Goal
Expand administrative bulk data onboarding into a multi-entity CSV Import Hub covering Listings, Categories, and Locations with pre-flight client validation, and integrate an intelligent opening hours parser and visual 7-day schedule configuration matrix across listing creation, editing, and CSV imports.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-07-csv-import-opening-hours`
- **Branch Creation**: `git checkout -b feature/phase-07-csv-import-opening-hours`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(opening-hours): implement natural language parser and 7-day scheduler component`
  - Wave 2: `feat(listings): integrate opening hours scheduler into listing create and edit forms`
  - Wave 3: `feat(admin-import): build multi-entity CSV import hub with pre-flight validation`
  - Wave 4: `feat(admin-import): implement category, location, and listing batch import actions`
  - Wave 5: `test(admin-import): verify large CSV parsing, error edge cases and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-07-csv-import-opening-hours`.

### Wave 1: Opening Hours Engine & Smart Parser
- [ ] **Task 1.1**: Build `src/lib/utils/opening-hours-parser.ts` to parse shorthand formats ("09:00-21:00", "Mon-Sat: 09:00-20:00", "24/7", JSON) into structured `WeekSchedule`.
- [ ] **Task 1.2**: Write unit tests in `src/lib/utils/opening-hours-parser.spec.ts` covering natural language inputs, edge cases, and fallback schedules.
- [ ] **Task 1.3**: Build `src/lib/components/forms/OpeningHoursScheduler.svelte` with day toggle switches, 30-min time selectors, and 1-click presets ("24/7", "Mon-Sat 9am-9pm", "Mon-Fri 9am-6pm").
- [ ] **Task 1.4**: Commit Wave 1: `git commit -m "feat(opening-hours): implement natural language parser and 7-day scheduler component"`.

### Wave 2: Listing Form Integration
- [ ] **Task 2.1**: Wire `OpeningHoursScheduler.svelte` into admin listing creation and editing forms.
- [ ] **Task 2.2**: Update listing server actions in `src/routes/(admin)/admin/listings/new/+page.server.ts` and `[id]/edit/+page.server.ts` to persist `openingHours` JSON in PostgreSQL.
- [ ] **Task 2.3**: Commit Wave 2: `git commit -m "feat(listings): integrate opening hours scheduler into listing create and edit forms"`.

### Wave 3: Multi-Entity CSV Import Hub (`/admin/imports`)
- [ ] **Task 3.1**: Build `src/lib/utils/csv-parser.ts` with client-side header validation, delimiter detection, and row-level error reporting.
- [ ] **Task 3.2**: Create downloadable CSV sample templates and 1-click mock data loaders for Listings, Categories, and Locations.
- [ ] **Task 3.3**: Build tabbed multi-entity interface in `src/routes/(admin)/admin/imports/+page.svelte` (Listings, Categories, Locations).
- [ ] **Task 3.4**: Build pre-flight inspection preview modal showing valid rows vs flagged rows before committing to database.
- [ ] **Task 3.5**: Commit Wave 3: `git commit -m "feat(admin-import): build multi-entity CSV import hub with pre-flight validation"`.

### Wave 4: Backend Import Actions & Taxonomy Sync
- [ ] **Task 4.1**: Implement `importCategoriesAction` and `importLocationsAction` in `src/routes/(admin)/admin/imports/+page.server.ts` with hierarchy slug creation.
- [ ] **Task 4.2**: Update `importListingsAction` to parse `openingHours` from CSV columns and map to `Listing` relational records.
- [ ] **Task 4.3**: Commit Wave 4: `git commit -m "feat(admin-import): implement category, location, and listing batch import actions"`.

### Wave 5: Verification & Accessibility
- [ ] **Task 5.1**: Test CSV import with 500 rows to ensure zero memory leaks and proper batching.
- [ ] **Task 5.2**: Verify that invalid CSVs present line-by-line error warnings without crashing.
- [ ] **Task 5.3**: Run `npm run check` and `npm test` verifying 0 errors.
- [ ] **Task 5.4**: Commit Wave 5: `git commit -m "test(admin-import): verify large CSV parsing, error edge cases and typecheck"`.

---

## Verification Criteria
1. Opening hours parser accurately translates "Mon-Sat: 10am-8pm" into standard JSON.
2. `OpeningHoursScheduler.svelte` allows merchants to configure a weekly timetable and apply 1-click presets.
3. `/admin/imports` allows uploading CSVs for Listings, Categories, and Locations with pre-flight error previews.
4. Imported listings display accurate live open/closed status on public profile pages.
5. `npm run check` and `npm test` exit cleanly.
