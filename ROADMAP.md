# Master Implementation Roadmap: Local Business Directory

> **Execution Directive**: Follow this roadmap in strict sequence. Each phase represents a verifiable milestone. No phase is marked complete without meeting its Empirical Verification criteria.

---

## Phase Summary & Dependencies

```
[Phase 1: SvelteKit 2 & Svelte 5 Scaffold] 
       │
       ▼
[Phase 2: Database & Migrations] 
       │
       ▼
[Phase 3: Auth & Roles] 
       │
       ▼
[Phase 4: SvelteKit Server Hooks & Security Headers] 
       │
       ▼
[Phase 5: Listings & Media Pipeline] ◄──┐
       │                                │
       ▼                                │
[Phase 6: Categories & Locations] ──────┤
       │                                │
       ▼                                │
[Phase 7: Search, Autocomplete & Maps] ─┤
       │                                │
       ▼                                │
[Phase 8: Reviews & Aggregates] ────────┤ (Domain Services)
       │                                │
       ▼                                │
[Phase 9: Pricing & Payments] ──────────┤
       │                                │
       ▼                                │
[Phase 10: Enquiries & Claims] ─────────┘
       │
       ▼
[Phase 11: Owner Dashboard] 
       │
       ▼
[Phase 12: Admin Back-Office & Moderation] 
       │
       ▼
[Phase 13: SEO, OpenGraph & Schema] 
       │
       ▼
[Phase 14: Notifications & Scheduled Jobs] 
       │
       ▼
[Phase 15: Accessibility & i18n Localization] 
       │
       ▼
[Phase 16: Test Suite & CI/CD Hardening] 
       │
       ▼
[Phase 17: Production Build & Vercel / Cloud Deployment]
```

---

## Detailed Phase Breakdown

### Phase 1: SvelteKit 2 & Svelte 5 Scaffold
- **Objective**: Establish the SvelteKit 2 codebase with Svelte 5 Runes (`$state`, `$props`, `$derived`), Tailwind CSS v4, strict TypeScript, and environment schema validation.
- **Key Files**:
  - `package.json`, `tsconfig.json`, `vite.config.ts`
  - `src/app.html`, `src/app.d.ts`, `src/routes/layout.css`
  - `src/lib/config/env.ts` (Zod validation for environment variables)
- **Verification Gate**:
  - `npm run build` succeeds without type errors.

---

### Phase 2: Database Schema & Migrations
- **Objective**: Implement the complete PostgreSQL relational schema in Prisma matching WordPress ListingPro functionality, apply schema to database, and maintain seed script.
- **Key Files**:
  - `prisma/schema.prisma` (Listings, Categories, Locations, PricingPlans, Reviews, Users, Enquiries, Claims, Media, AuditLog)
  - `src/lib/db/client.ts` (Prisma client singleton with connection management)
  - `scripts/seed.ts` (generates categories, localities, sample listings, reviews, default plans, and system accounts)
- **Verification Gate**:
  - `npx prisma db push` executes cleanly on fresh database.
  - `npx tsx scripts/seed.ts` seeds the full dataset and verifies relational integrity.

---

### Phase 3: Authentication & Role-Based Access Control (RBAC)
- **Objective**: Implement secure authentication with Argon2id password hashing, session cookies, and role gating (Visitor, Owner, Moderator, Admin).
- **Key Files**:
  - `src/lib/auth/password.ts` (Argon2id hashing & constant-time verify)
  - `src/lib/auth/session.ts` (HttpOnly, Secure, SameSite cookies, session creation & invalidation)
  - `src/lib/auth/rbac.ts` (role hierarchy & permission matrix)
  - `src/routes/(auth)/login/+page.server.ts`, `src/routes/(auth)/login/+page.svelte`
  - `src/routes/(auth)/register/+page.server.ts`, `src/routes/(auth)/register/+page.svelte`
  - `src/routes/(auth)/logout/+server.ts`
- **Verification Gate**:
  - Users can sign in, register, and log out with encrypted cookies.
  - Database errors during auth return structured friendly alerts rather than 500 crashes.

---

### Phase 4: SvelteKit Server Hooks & Security Headers
- **Objective**: Centralize session resolution, role-based route protection, and security headers.
- **Key Files**:
  - `src/hooks.server.ts` (session resolution, `/admin/*` and `/dashboard/*` route protection, security headers)
  - `src/lib/security/headers.ts`, `src/lib/security/sanitize.ts`, `src/lib/security/rate-limit.ts`
- **Verification Gate**:
  - Unauthenticated requests to `/admin` or `/dashboard` redirect to `/login`.
  - Non-owner accounts cannot access `/dashboard`.

---

### Phase 5: Listings & Media Pipeline
- **Objective**: Core listing management and public listing profiles.
- **Key Files**:
  - `src/lib/services/listing.service.ts` (Data access layer enforcing owner isolation)
  - `src/lib/services/media.service.ts` (Image validation and upload limits)
  - `src/lib/utils/opening-hours.ts` (Timezone-aware live Open/Closed calculations)
  - `src/routes/(public)/listing/[slug]/+page.server.ts`, `+page.svelte`
  - `src/lib/components/listing/ListingCard.svelte`, `OpeningHoursCard.svelte`, `ContactCard.svelte`, `ListingGallery.svelte`
- **Verification Gate**:
  - Verified business pages render with hours, photos, ratings, and contact actions.

---

### Phase 6: Categories & Locations Taxonomy
- **Objective**: Hierarchical categories and location archive pages.
- **Key Files**:
  - `src/lib/services/taxonomy.service.ts`
  - `src/routes/(public)/category/[...slug]/+page.server.ts`, `+page.svelte`
  - `src/routes/(public)/location/[...slug]/+page.server.ts`, `+page.svelte`
  - `src/lib/components/taxonomy/CategoryCard.svelte`
- **Verification Gate**:
  - Nested category paths (e.g. `/category/food-dining/cafes-and-bakeries`) correctly filter listings.

---

### Phase 7: Search, Autocomplete & Interactive Maps
- **Objective**: Full-text search with instant autocomplete and dynamic Leaflet maps.
- **Key Files**:
  - `src/lib/services/search.service.ts`
  - `src/routes/(public)/search/+page.server.ts`, `+page.svelte`
  - `src/routes/api/search/autocomplete/+server.ts`
  - `src/lib/components/search/SearchFilters.svelte`
  - `src/lib/components/map/MapView.svelte` (client-only Leaflet map with markers)
- **Verification Gate**:
  - Search filters by query, category, locality, open now, rating, and sort order.

---

### Phase 8: Reviews & Aggregates Engine
- **Objective**: Customer reviews with privacy-safe DPDP hashing and atomic aggregate recalculation.
- **Key Files**:
  - `src/lib/services/review.service.ts`
  - `src/routes/(public)/reviews/new/+page.server.ts`, `+page.svelte`
  - `src/lib/components/reviews/ReviewForm.svelte`
- **Verification Gate**:
  - Approved reviews atomically update `averageRating` and `reviewCount`.
  - Reviewer emails are securely salted and hashed.

---

### Phase 9: Pricing Plans & Payments
- **Objective**: Multi-tier monetization (Free, Standard, Premium) with feature gating.
- **Key Files**:
  - `src/lib/services/plan.service.ts`
  - `src/lib/services/payment.service.ts`
  - `src/routes/(public)/pricing/+page.server.ts`, `+page.svelte`
  - `src/routes/api/webhooks/payments/+server.ts`
- **Verification Gate**:
  - Pricing page displays tier entitlements and prices in INR/paise.

---

### Phase 10: Enquiries & Claims
- **Objective**: Lead generation and business ownership verification.
- **Key Files**:
  - `src/lib/services/enquiry.service.ts`
  - `src/lib/services/claim.service.ts`
  - `src/lib/components/forms/EnquiryModal.svelte` (honeypot + anti-bot)
  - `src/routes/(public)/claim/[slug]/+page.server.ts`, `+page.svelte`
  - `src/routes/api/enquiry/+server.ts`
- **Verification Gate**:
  - Leads captured with honeypot validation; claim submissions queue for admin review.

---

### Phase 11: Business Owner Dashboard
- **Objective**: Self-service management console for verified business owners.
- **Key Files**:
  - `src/routes/(account)/dashboard/+layout.server.ts`, `+layout.svelte`
  - `src/routes/(account)/dashboard/+page.server.ts`, `+page.svelte` (KPIs)
  - `src/routes/(account)/dashboard/listings/+page.server.ts`, `+page.svelte`
  - `src/routes/(account)/dashboard/enquiries/+page.server.ts`, `+page.svelte`
  - `src/routes/(account)/dashboard/reviews/+page.server.ts`, `+page.svelte`
  - `src/routes/(account)/dashboard/billing/+page.server.ts`, `+page.svelte`
- **Verification Gate**:
  - Owners can view leads, respond to customer reviews, and view plan status.

---

### Phase 12: Admin Back-Office & Moderation
- **Objective**: Complete governance hub for administrators and moderators.
- **Key Files**:
  - `src/routes/(admin)/admin/+layout.server.ts`, `+layout.svelte`
  - `src/routes/(admin)/admin/+page.server.ts`, `+page.svelte`
  - `src/routes/(admin)/admin/moderation/+page.server.ts`, `+page.svelte` (Approve/Reject)
  - `src/routes/(admin)/admin/listings/+page.server.ts`, `+page.svelte` (Status controls)
  - `src/routes/(admin)/admin/imports/+page.server.ts`, `+page.svelte` (CSV Importer)
- **Verification Gate**:
  - Admins can bulk import CSV listings and moderate pending reviews/claims.

---

### Phase 13: SEO, Metadata & Sitemaps
- **Objective**: Search engine visibility and schema markup.
- **Key Files**:
  - `src/lib/services/seo.service.ts` (LocalBusiness & BreadcrumbList JSON-LD)
  - `src/routes/sitemap.xml/+server.ts`
  - `src/routes/robots.txt/+server.ts`
- **Verification Gate**:
  - `/sitemap.xml` and `/robots.txt` serve dynamic valid XML and text endpoints.

---

### Phase 14: Notifications & Scheduled Background Jobs
- **Objective**: Transactional emails and recurring database maintenance crons.
- **Key Files**:
  - `src/lib/services/email.service.ts`
  - `src/routes/api/cron/cleanup-sessions/+server.ts`
  - `src/routes/api/cron/plan-expiry/+server.ts`
  - `src/routes/api/cron/repair-aggregates/+server.ts`
- **Verification Gate**:
  - Cron endpoints reject unauthenticated calls and execute when `CRON_SECRET` matches.

---

### Phase 15: Accessibility (WCAG 2.2 AA) & Localization
- **Objective**: Inclusive UX and multi-language support.
- **Key Files**:
  - `src/lib/components/ui/SkipLink.svelte`
  - `src/lib/components/ui/LanguageSelector.svelte`
  - `src/lib/messages/en.json`, `mr.json`, `hi.json`
- **Verification Gate**:
  - Keyboard navigation passes skip link and ARIA landmarks.

---

### Phase 16: Automated Test Suite & CI/CD
- **Objective**: Continuous quality assurance.
- **Key Files**:
  - `src/lib/services/conversion.spec.ts`, `src/lib/vitest-examples/greet.spec.ts`
  - `.github/workflows/ci.yml`
- **Verification Gate**:
  - `npm test` passes all test suites.

---

### Phase 17: Production Build & Vercel Deployment
- **Objective**: Turnkey deployment on Vercel or cloud infrastructure.
- **Key Files**:
  - `vite.config.ts` (`@sveltejs/adapter-auto`)
  - `package.json` (`"build": "prisma generate && vite build"`)
- **Verification Gate**:
  - `npm run build` exits with code 0.
