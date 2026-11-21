# Phase Plan: Modernized Listing Detail & Bento UX

## Goal
Elevate the public business listing profile (`/listing/[slug]`) into a modern, high-converting Bento Grid storefront inspired by top commercial directories (Justdial benchmark), featuring a 5-tile photo mosaic with full-screen lightbox, sticky conversion Action Dock, in-page section navigation, categorized rate card, and customer sentiment highlights.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-04-listing-bento-ux`
- **Branch Creation**: `git checkout -b feature/phase-04-listing-bento-ux`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(listing): implement responsive Bento 5-tile hero and fullscreen lightbox`
  - Wave 2: `feat(listing): add trust badge header, mobile action dock and sticky anchor nav`
  - Wave 3: `feat(listing): add categorized services rate card and customer sentiment chips`
  - Wave 4: `feat(listing): add sticky desktop lead card and review rating histogram`
  - Wave 5: `test(listing): integrate Schema.org JSON-LD, verify WCAG AA and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-04-listing-bento-ux`.

### Wave 1: Bento Photo Mosaic & Interactive Lightbox (Svelte 5)
- [ ] **Task 1.1**: Build `src/lib/components/listing/ListingBentoHero.svelte` rendering a responsive 5-tile photo layout on desktop (collapsing to a swipeable carousel on mobile) with pre-allocated aspect ratios to eliminate layout shifts.
- [ ] **Task 1.2**: Build `src/lib/components/listing/ListingLightboxModal.svelte` featuring keyboard arrow navigation, zoom controls, and escape dismiss.
- [ ] **Task 1.3**: Wire photo count badge ("+N Photos") to open lightbox starting on the selected image index.
- [ ] **Task 1.4**: Commit Wave 1: `git commit -m "feat(listing): implement responsive Bento 5-tile hero and fullscreen lightbox"`.

### Wave 2: Profile Trust Hub & High-Conversion Action Dock
- [ ] **Task 2.1**: Build `src/lib/components/listing/ListingTrustHeader.svelte` with verified business badge, emerald rating capsule, category breadcrumbs, and live open/closed timetable pill.
- [ ] **Task 2.2**: Build `src/lib/components/listing/ListingActionDock.svelte` with desktop sticky bar and mobile fixed bottom action bar (direct tel: call trigger, wa.me WhatsApp link, Directions deep-link, and Enquire modal).
- [ ] **Task 2.3**: Build in-page sticky anchor bar `src/lib/components/listing/ListingAnchorNav.svelte` using IntersectionObserver to highlight active sections (`Overview`, `Services`, `Photos`, `Reviews`, `Location`).
- [ ] **Task 2.4**: Commit Wave 2: `git commit -m "feat(listing): add trust badge header, mobile action dock and sticky anchor nav"`.

### Wave 3: Interactive Services & Rate Card Catalogue
- [ ] **Task 3.1**: Build `src/lib/components/listing/ListingServicesCatalog.svelte` with category filter pills, service duration, starting price (`₹`), and direct 1-click booking/enquiry trigger.
- [ ] **Task 3.2**: Build `src/lib/components/listing/ListingSentimentChips.svelte` ("Why People Love This") displaying verified positive tags extracted from reviews.
- [ ] **Task 3.3**: Commit Wave 3: `git commit -m "feat(listing): add categorized services rate card and customer sentiment chips"`.

### Wave 4: Sticky Right-Rail Lead Dock & Review Breakdown
- [ ] **Task 4.1**: Build desktop sticky lead sidebar `src/lib/components/listing/ListingStickyLeadCard.svelte` ("⚡ Usually responds in 15 mins", quick quote inputs, operating hours recap).
- [ ] **Task 4.2**: Overhaul `src/lib/components/reviews/ReviewDistribution.svelte` with 5-star to 1-star visual histogram bars, verified customer badges, and owner reply threads.
- [ ] **Task 4.3**: Commit Wave 4: `git commit -m "feat(listing): add sticky desktop lead card and review rating histogram"`.

### Wave 5: Page Assembly, Schema.org SEO & Verification
- [ ] **Task 5.1**: Integrate all components into `src/routes/(public)/listing/[slug]/+page.svelte` and ensure `toPOJO` serialization in `+page.server.ts`.
- [ ] **Task 5.2**: Inject dynamic Schema.org `LocalBusiness` / subtype JSON-LD with geo-coordinates, hours specification, and aggregate rating.
- [ ] **Task 5.3**: Run accessibility audit (WCAG AA 4.5:1 text contrast, 48px touch targets on mobile) and verify `npm run check` passes with 0 errors.
- [ ] **Task 5.4**: Commit Wave 5: `git commit -m "test(listing): integrate Schema.org JSON-LD, verify WCAG AA and typecheck"`.

---

## Verification Criteria
1. Visiting any listing profile renders the 5-tile Bento photo mosaic cleanly without CLS (Cumulative Layout Shift).
2. Clicking any photo launches `ListingLightboxModal.svelte` with full-resolution viewing and keyboard navigation.
3. Mobile view displays sticky bottom action dock with instant tap targets for Call and WhatsApp.
4. Sticky anchor navigation updates active tab as user scrolls through sections.
5. Interactive services catalog allows filtering items and submitting instant inquiries.
6. Schema.org JSON-LD validates on Google Rich Results test.
7. `npm run check` and `npm test` exit with 0 errors.
