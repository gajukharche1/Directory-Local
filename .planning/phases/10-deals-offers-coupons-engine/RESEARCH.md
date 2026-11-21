# Phase 02 Research: Deals, Offers & Coupons Engine

## 1. Domain Context & Business Value

In high-converting commercial business directories (e.g. Justdial, Yelp, Groupon, Nearbuy), **Deals, Offers & Coupons** represent the primary conversion catalyst bridging digital search with real-world footfall and transactions:
1. **Merchant Value Proposition**:
   - Gives local merchants a powerful tool to drive footfall during off-peak hours (e.g., "50% off on weekday salon services").
   - Provides quantifiable attribution: merchants know customers came specifically through the directory platform via unique redemption voucher codes.
   - Upsell gateway: merchants upgrade to premium directory subscription tiers to unlock more active deals and featured placement.
2. **Customer Intent & Engagement**:
   - High conversion pull: customers actively search for discount codes, promo vouchers, and seasonal festival offers.
   - Frictionless claim process: instant voucher code generation with 1-click WhatsApp/SMS clip and printable pass.
   - Anti-hoarding safeguards: per-user claim limits and real-time inventory caps (e.g., "Only 12 coupons left").
3. **Directory Monetization & Marketplace Network Effects**:
   - Featured Deals: sponsored placement on the directory homepage and category landing pages.
   - Performance analytics: conversion funnel tracking from Deal Impression -> Deal Claim -> In-Store Redemption.

---

## 2. Technical Architecture & Constraints in SvelteKit 2 + Svelte 5

### A. Svelte 5 Runes & Reactive Client Architecture
- Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`) for all client-side deal modals and interactive components.
- Avoid legacy Svelte 3/4 reactive declarations (`$:`) and legacy event dispatchers (`createEventDispatcher`). Use callback props (`onclaim`, `onclose`, etc.).
- Ensure POJO serialization compliance across SvelteKit server loaders (`+page.server.ts` -> `+page.svelte`) by converting Prisma `Decimal` and `Date` fields with `toPOJO` or ISO string conversions.

### B. High-Concurrency Claim Engine & Fraud Safeguards
1. **Transactional Race-Condition Protection**:
   - Coupon claims must be atomic. When claiming a limited-quantity deal (`claimLimit: 50`), concurrent claims must not oversell.
   - Implement Prisma interactive transactions (`prisma.$transaction`) with atomic increment and count validation:
     ```typescript
     await prisma.$transaction(async (tx) => {
       const deal = await tx.deal.findUnique({ where: { id: dealId } });
       if (!deal || deal.status !== 'ACTIVE') throw new Error('Deal unavailable');
       if (deal.claimLimit !== null && deal.claimCount >= deal.claimLimit) {
         throw new Error('Deal fully claimed');
       }
       if (userId) {
         const existingUserClaims = await tx.dealClaim.count({
           where: { dealId, userId }
         });
         if (existingUserClaims >= deal.userLimit) {
           throw new Error('Claim limit reached for this account');
         }
       }
       await tx.deal.update({
         where: { id: dealId },
         data: { claimCount: { increment: 1 } }
       });
       return await tx.dealClaim.create({ ... });
     });
     ```
2. **Unique Voucher Code Architecture**:
   - Human-readable, collision-resistant, fraud-proof vouchers formatted as:
     `D-[PREFIX]-[RANDOM_ALPHANUM_4]-[CHECKSUM_2]` (e.g., `D-SMILE-9X4K-7A`).
   - Supports 1-click clipboard copy, barcode/QR visual rendering, and SMS/WhatsApp sharing.
3. **In-Store Merchant Redemption Workflow**:
   - Merchants can verify and redeem vouchers at the cash register directly from their mobile or desktop merchant dashboard (`/dashboard/deals`).
   - Real-time verification: checks if the voucher is valid, already redeemed, or expired, instantly marking it as `REDEEMED` with timestamp and cashier identity.

### C. Database Model Specification (`prisma/schema.prisma`)
- **Enum `DealType`**:
  - `percentage_discount`: (e.g., 20% off)
  - `flat_discount`: (e.g., Flat ₹500 off)
  - `buy_x_get_y`: (e.g., Buy 1 Get 1 Free)
  - `freebie`: (e.g., Free consultation / dessert with billing)
  - `fixed_price`: (e.g., Comprehensive Service Package at ₹999)
- **Enum `DealStatus`**:
  - `draft`: Created by merchant but not yet published.
  - `active`: Live and claimable by customers.
  - `paused`: Temporarily suspended by merchant.
  - `expired`: Validity date has passed or claim quota exhausted.
  - `archived`: Soft-deleted / retired.
- **Enum `ClaimStatus`**:
  - `claimed`: Voucher issued to customer, pending store visit.
  - `redeemed`: Merchant verified and honored the voucher in-store.
  - `expired`: Validity elapsed without redemption.
  - `cancelled`: Revoked by merchant or customer.

---

## 3. UI/UX Design System Guidelines (`agency-ui-designer` & `ui-ux-pro-max`)

### A. Semantic Styling & Visual Hierarchy
- **Deal Accent / Promotional Badge**: Vibrant Amber/Orange & Emerald gradient pills:
  - Percentage / Discount Tag: `bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold`
  - Verified Deal Badge: `bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`
  - Urgent / Expiring Soon Badge: `bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse`
- **Deal Voucher Ticket Styling**:
  - Perforated coupon edge effect using CSS radial-gradient cutouts (`mask-image` or pseudo-element semicircles).
  - High-contrast monospace voucher code (`font-mono tracking-wider font-extrabold text-lg text-primary`).
  - Progress bar showing claim velocity (`"78% Claimed - Only 6 Left"`).

### B. Directory-Wide Touchpoints
1. **Public Deals Hub (`/deals`)**:
   - City/Locality and Category filter tabs.
   - Sorting: "Ending Soonest", "Highest Discount", "Most Popular".
   - Search bar filtering deal title, description, or store name.
2. **Listing Detail Profile (`/listing/[slug]`)**:
   - Prominent "Active Offers & Deals" section in the main overview and sticky lead sidebar.
   - Interactive `ClaimDealModal.svelte` with instant voucher code generation, print view, and WhatsApp deep-link.
3. **Merchant Management Console (`/dashboard/deals`)**:
   - Deal creation wizard with live preview card.
   - Fast Voucher Redemption Input: merchant types or scans customer voucher code and presses Enter to instantly redeem.
4. **Admin Moderation Portal (`/admin/deals`)**:
   - Platform oversight, moderation status, feature flags, and fraud audit log.

---

## 4. Verification and Empirical Standards
- 100% type-safe compilation via `npm run check`.
- Vitest unit tests in `src/lib/services/deal.service.spec.ts` covering:
  - Quota overflow prevention under simulated concurrent claims.
  - Expiration timestamp boundaries.
  - Voucher redemption lifecycle (valid -> redeemed -> reject double redemption).
  - Role-based authorization: non-owners cannot mutate other merchants' deals.
