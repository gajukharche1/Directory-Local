---
phase: 04-modernized-listing-bento-ux
plan: PLAN
subsystem: listings-ui
tags: [listing-detail, bento-grid, lightbox, action-dock, rate-card, svelte5-runes, seo]
provides:
  - Asymmetric 5-tile Bento photo mosaic with mobile swipe carousel
  - Fullscreen keyboard-accessible ListingLightboxModal.svelte
  - High-conversion desktop and mobile Action Dock (Call, WhatsApp, Enquire, Directions)
  - Sticky in-page anchor section tabs with IntersectionObserver tracking
  - Interactive services and rate card catalogue with starting prices
  - Verified sentiment chips ('Why People Love This') and review histogram
  - Enhanced Schema.org LocalBusiness JSON-LD rich snippets
affects: [public-listing, reviews, enquiries, seo]
tech-stack:
  added: []
  patterns: [bento-grid, sticky-action-dock, svelte5-runes, intersection-observer-tabs]
key-files:
  created:
    - src/lib/components/listing/ListingBentoHero.svelte
    - src/lib/components/listing/ListingLightboxModal.svelte
    - src/lib/components/listing/ListingTrustHeader.svelte
    - src/lib/components/listing/ListingActionDock.svelte
    - src/lib/components/listing/ListingAnchorNav.svelte
    - src/lib/components/listing/ListingServicesCatalog.svelte
    - src/lib/components/listing/ListingSentimentChips.svelte
    - src/lib/components/listing/ListingStickyLeadCard.svelte
    - src/lib/components/reviews/ReviewDistribution.svelte
  modified:
    - src/routes/(public)/listing/[slug]/+page.server.ts
    - src/routes/(public)/listing/[slug]/+page.svelte
key-decisions:
  - "Bento Hero grid: Pre-allocates aspect ratios eliminating Cumulative Layout Shift (CLS) on high-resolution displays."
  - "Action Dock: Dual-rail implementation guarantees mobile instant access to Call/WhatsApp without competing with desktop sticky sidebar."
  - "Svelte 5 Runes: State-driven active section tracking without heavy third-party scroll spy libraries."
status: planned
---

# Phase 04: Modernized Listing Detail & Bento UX Summary
Overhaul of the public listing detail page into a high-contrast Bento Grid storefront with 5-tile photo mosaic, fullscreen lightbox, conversion Action Dock, anchor section navigation, and interactive rate card.
