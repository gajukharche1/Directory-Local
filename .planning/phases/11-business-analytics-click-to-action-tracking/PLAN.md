# Phase Plan: Business Analytics & Click-to-Action Tracking

## Goal
Implement a privacy-first, DPDP-compliant business analytics engine that tracks listing impressions and high-intent customer click-to-action conversions (Phone Calls, WhatsApp Chats, Directions, Website clicks, and Enquiries), paired with an interactive visual dashboard for business owners and system administrators.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-11-business-analytics`
- **Branch Creation**: `git checkout -b feature/phase-11-business-analytics`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(analytics): add AnalyticsEvent and AnalyticsDailySummary models and service`
  - Wave 2: `feat(analytics): implement non-blocking beacon tracking route and CTA hooks`
  - Wave 3: `feat(analytics): build SVG area chart and merchant listing analytics dashboard`
  - Wave 4: `feat(analytics): add admin directory analytics portal and leaderboard`
  - Wave 5: `test(analytics): add DPDP hashing tests, aggregation unit tests and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [x] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-11-business-analytics`.

### Wave 1: Database & Core Service
- [x] **Task 1.1**: Add `AnalyticsEvent` and `AnalyticsDailySummary` to `prisma/schema.prisma` with appropriate indexes and relations.
- [x] **Task 1.2**: Synchronize Postgres schema using `npx prisma db push` and regenerate Prisma Client (`npx prisma generate`).
- [x] **Task 1.3**: Create `src/lib/services/analytics.service.ts` with DPDP-compliant visitor hashing, event ingestion, daily aggregation rollup, and query methods.
- [x] **Task 1.4**: Commit Wave 1: `git commit -m "feat(analytics): add AnalyticsEvent and AnalyticsDailySummary models and service"`.

### Wave 2: Telemetry Ingestion & Client Instrumentation
- [x] **Task 2.1**: Implement `/api/analytics/track` route handler with Zod validation, rate limiting, and bot filtering.
- [x] **Task 2.2**: Build reusable tracking client `src/lib/components/analytics/track-event.ts` (using `navigator.sendBeacon` and `fetch` fallback).
- [x] **Task 2.3**: Build `src/lib/components/analytics/ListingAnalyticsTracker.svelte` and mount on `src/routes/(public)/listing/[slug]/+page.svelte`.
- [x] **Task 2.4**: Wire click telemetry triggers into Call, WhatsApp, Directions, and Enquiry buttons.
- [x] **Task 2.5**: Commit Wave 2: `git commit -m "feat(analytics): implement non-blocking beacon tracking route and CTA hooks"`.

### Wave 3: Visual Analytics Components & Owner Dashboard
- [x] **Task 3.1**: Build lightweight SVG chart primitives (`src/lib/components/analytics/AnalyticsAreaChart.svelte` and `AnalyticsBreakdownBar.svelte`).
- [x] **Task 3.2**: Build `src/routes/(account)/dashboard/listings/[id]/analytics/+page.svelte` with timeframe pills (7D, 30D, 90D) and trend deltas.
- [x] **Task 3.3**: Build global merchant overview in `src/routes/(account)/dashboard/analytics/+page.svelte`.
- [x] **Task 3.4**: Commit Wave 3: `git commit -m "feat(analytics): build SVG area chart and merchant listing analytics dashboard"`.

### Wave 4: Admin Directory Analytics & Verification
- [x] **Task 4.1**: Build `src/routes/(admin)/admin/analytics/+page.svelte` with directory-wide KPI summary, platform conversion rate, and top listing rankings.
- [x] **Task 4.2**: Add "Analytics" link to Admin Sidebar.
- [x] **Task 4.3**: Commit Wave 4: `git commit -m "feat(analytics): add admin directory analytics portal and leaderboard"`.

### Wave 5: Verification & Testing
- [x] **Task 5.1**: Add unit tests in `src/lib/services/analytics.service.spec.ts` validating DPDP anonymization hashing, conversion rate calculation, and aggregation logic.
- [x] **Task 5.2**: Run `npm run check` and `npm test` verifying 0 errors.
- [x] **Task 5.3**: Commit Wave 5: `git commit -m "test(analytics): add DPDP hashing tests, aggregation unit tests and typecheck"`.

---

## Verification Criteria
1. `npx prisma db push` executes cleanly.
2. Ingestion endpoint `/api/analytics/track` responds with 204 for valid events and records both raw event and daily summary.
3. Multiple page views on the same day from the same browser count as 1 unique visitor in daily summary.
4. Calling, WhatsApp clicking, and directions clicking update respective action counters.
5. Owner analytics dashboard renders interactive trend charts without layout shifts or third-party chart library bundle bloat.
6. `npm run check` passes with 0 errors.
7. `npm test` passes all unit tests.
