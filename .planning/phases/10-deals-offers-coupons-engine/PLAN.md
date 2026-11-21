# Phase Plan: Deals, Offers & Coupons Engine

## Goal
Implement a high-converting, multi-tenant Deals, Offers & Coupons Engine that enables local business merchants to publish structured promotional campaigns, empowers visitors to claim unique redemption vouchers, and equips business owners with a real-time POS verification scanner and analytics dashboard, all fully integrated into the SvelteKit 2 + Svelte 5 architecture.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-10-deals-coupons-engine`
- **Branch Creation**: `git checkout -b feature/phase-10-deals-coupons-engine`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(deals): add Deal and DealClaim models with schema migration and seeders`
  - Wave 2: `feat(deals): implement deal domain service with atomic claim transactions`
  - Wave 3: `feat(deals): build public /deals hub, claim modal and listing integration`
  - Wave 4: `feat(deals): add merchant deal management and counter voucher POS scanner`
  - Wave 5: `test(deals): add admin deals moderation, expiry cron and unit test suite`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-10-deals-coupons-engine`.

### Wave 1: Database Modeling & Schema Migration
- [ ] **Task 1.1**: Add `DealType`, `DealStatus`, and `DealClaimStatus` enums to `prisma/schema.prisma`.
- [ ] **Task 1.2**: Add `Deal` and `DealClaim` models to `prisma/schema.prisma` with appropriate relations to `Listing` and `User`.
- [ ] **Task 1.3**: Synchronize schema using `npx prisma db push` and regenerate client via `npx prisma generate`.
- [ ] **Task 1.4**: Update seeder in `scripts/seed.ts` with realistic sample deals (e.g. Dental clinic whitening discount, AC servicing package, restaurant 20% off).
- [ ] **Task 1.5**: Commit Wave 1: `git commit -m "feat(deals): add Deal and DealClaim models with schema migration and seeders"`.

### Wave 2: Domain Service & Voucher Generation Engine
- [ ] **Task 2.1**: Implement `src/lib/services/deal.service.ts` with strict input validation and Zod schemas (`DealInputSchema`, `ClaimDealSchema`).
- [ ] **Task 2.2**: Implement atomic transaction in `claimDeal()` protecting against race conditions and limit exhaustion.
- [ ] **Task 2.3**: Implement human-friendly voucher generator with checksum verification algorithm.
- [ ] **Task 2.4**: Implement `redeemVoucher()` with merchant listing ownership authorization.
- [ ] **Task 2.5**: Write unit tests in `src/lib/services/deal.service.spec.ts` testing claim limits, expiry checks, and redemption logic.
- [ ] **Task 2.6**: Commit Wave 2: `git commit -m "feat(deals): implement deal domain service with atomic claim transactions"`.

### Wave 3: Public Deals Hub & Customer Claim Flow
- [ ] **Task 3.1**: Create `src/lib/components/deals/DealCard.svelte` using Svelte 5 Runes, supporting discount tags, progress bars, and countdown display.
- [ ] **Task 3.2**: Create `src/lib/components/deals/ClaimDealModal.svelte` with reactive form state, voucher generation, and printable pass view.
- [ ] **Task 3.3**: Create public directory deals page `src/routes/(public)/deals/+page.server.ts` and `+page.svelte` with category and sort filters.
- [ ] **Task 3.4**: Integrate active deals into `src/routes/(public)/listing/[slug]/+page.server.ts` and `+page.svelte`.
- [ ] **Task 3.5**: Add "Deals & Offers" navigation link to the main public header (`src/lib/components/ui/Header.svelte`).
- [ ] **Task 3.6**: Commit Wave 3: `git commit -m "feat(deals): build public /deals hub, claim modal and listing integration"`.

### Wave 4: Merchant Dashboard & Counter Redemption Scanner
- [ ] **Task 4.1**: Create `src/routes/(account)/dashboard/deals/+page.server.ts` loading merchant deals, metrics, and redemptions.
- [ ] **Task 4.2**: Create `src/routes/(account)/dashboard/deals/+page.svelte` with deal listing table and quick voucher redemption scanner.
- [ ] **Task 4.3**: Implement Server Actions in `+page.server.ts` for `createDeal`, `updateDeal`, `toggleDealStatus`, and `redeemVoucher`.
- [ ] **Task 4.4**: Add "Deals & Coupons" link to the merchant dashboard navigation.
- [ ] **Task 4.5**: Commit Wave 4: `git commit -m "feat(deals): add merchant deal management and counter voucher POS scanner"`.

### Wave 5: Admin Management, Expiry Cron & End-to-End Verification
- [ ] **Task 5.1**: Create `src/routes/(admin)/admin/deals/+page.server.ts` and `+page.svelte` for directory moderation and featured status toggles.
- [ ] **Task 5.2**: Create automated expiry cron endpoint `src/routes/api/cron/deal-expiry/+server.ts`.
- [ ] **Task 5.3**: Run `npm run check` (SvelteKit typecheck) and ensure 0 compilation errors.
- [ ] **Task 5.4**: Run `npm test` verifying that all unit tests pass cleanly.
- [ ] **Task 5.5**: Commit Wave 5: `git commit -m "test(deals): add admin deals moderation, expiry cron and unit test suite"`.

---

## Verification Criteria
1. `npx prisma db push` succeeds and creates `deals` and `deal_claims` tables.
2. Seed script populates active deals linked to sample listings.
3. Visiting `/deals` displays active promotions with accurate discounts, category filters, and expiry countdowns.
4. Visiting `/listing/[slug]` showcases the business's active deals.
5. Clicking "Claim Deal" opens `ClaimDealModal.svelte`, generates a unique voucher code (e.g. `D-SMILE-9X4K-7A`), and increments the deal's claim count.
6. A customer attempting to exceed `userLimit` receives a clean validation warning.
7. Attempting to claim after `claimLimit` is reached cleanly rejects the claim.
8. Business owners can input the voucher code in `/dashboard/deals` and verify/mark it as `redeemed`.
9. Attempting to redeem an already-redeemed or expired voucher returns a descriptive error.
10. `npm run check` passes with 0 errors.
11. `npm test` passes all tests.
