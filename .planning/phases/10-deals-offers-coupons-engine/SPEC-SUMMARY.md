---
phase: 02-deals-offers-coupons-engine
plan: PLAN
subsystem: promotions
tags: [deals, coupons, offers, vouchers, redemption, svelte5-runes, merchant-portal]
provides:
  - Deal, DealClaim PostgreSQL Prisma models and DealType/DealStatus/DealClaimStatus enums
  - Deal domain service (deal.service.ts) with concurrency-safe claim transactions and voucher code algorithm
  - Public Deals discovery hub at /deals with category & sorting filters
  - Storefront deal showcase and interactive ClaimDealModal.svelte on /listing/[slug]
  - Merchant Deals Dashboard and Counter Voucher Redemption Scanner at /dashboard/deals
  - Admin deal moderation and featured promotions portal at /admin/deals
  - Automated deal and voucher expiration cron endpoint at /api/cron/deal-expiry
affects: [listings, dashboard, admin, navigation, database]
tech-stack:
  added: []
  patterns: [svelte5-runes, atomic-claim-transaction, checksum-voucher-generator, pos-redemption-flow]
key-files:
  created:
    - src/lib/services/deal.service.ts
    - src/lib/services/deal.service.spec.ts
    - src/lib/components/deals/DealCard.svelte
    - src/lib/components/deals/ClaimDealModal.svelte
    - src/routes/(public)/deals/+page.server.ts
    - src/routes/(public)/deals/+page.svelte
    - src/routes/(account)/dashboard/deals/+page.server.ts
    - src/routes/(account)/dashboard/deals/+page.svelte
    - src/routes/(admin)/admin/deals/+page.server.ts
    - src/routes/(admin)/admin/deals/+page.svelte
    - src/routes/api/cron/deal-expiry/+server.ts
  modified:
    - prisma/schema.prisma
    - scripts/seed.ts
    - src/lib/components/ui/Header.svelte
    - src/routes/(public)/listing/[slug]/+page.server.ts
    - src/routes/(public)/listing/[slug]/+page.svelte
    - src/routes/(account)/dashboard/+layout.svelte
key-decisions:
  - "Atomic claim transaction: Interactive Prisma transaction prevents over-claiming or race conditions on limited-quantity promotions."
  - "Fraud-proof voucher format: Monospace D-[PREFIX]-[CODE]-[CHECKSUM] format guarantees in-store legibility and single-redemption integrity."
  - "Svelte 5 Runes: Built using Svelte 5 $state, $derived, and callback props for zero-lag reactivity in modals and voucher generation."
status: planned
---

# Phase 02: Deals, Offers & Coupons Engine Summary

**High-converting promotional deal engine enabling merchants to publish time-limited discounts and coupons, visitors to claim digital vouchers, and merchants to verify and redeem customer vouchers in real time.**

## Overview
Phase 2 introduces a full-lifecycle promotion and coupon system to the Local Business Directory:
- **Merchant Power**: Business owners can create targeted promotional campaigns (e.g., 20% off, flat ₹500 discount, BOGO, or consultation packages) with custom validity windows, claim caps, and terms.
- **Visitor Experience**: Customers discover active offers on the `/deals` directory hub and on listing detail pages, claiming vouchers with instant code generation and WhatsApp/print passes.
- **In-Store Redemption**: Business owners use their merchant dashboard to validate and redeem customer vouchers at the counter with 1-click verification.
- **Platform Governance**: Administrators have centralized moderation, featured deals control, and automated cron expiration.

## Next Step
Execute Phase 2 via `/gsd-execute-phase 2` or directly begin with Wave 1 database migrations.
