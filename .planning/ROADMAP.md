# Roadmap: Local Business Directory

> **Execution Directive**: Execute phases sequentially. The UI/UX overhaul (Phases 3 through 9) is prioritized first, using `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, and `/agency-ux-researcher`. Promotional deals (Phase 10) and business analytics (Phase 11) are scheduled as the final phases.
> 
> **Git Discipline Invariant**: Every phase must be executed on its dedicated git branch and committed using Conventional Commits with wave-level atomic messages.

---

## Git Branch Registry

| Phase | Milestone Name | Dedicated Git Branch | Primary Commit Scope |
|---|---|---|---|
| **Phase 03** | Enterprise Media File Manager | `feature/phase-03-media-file-manager` | `feat(media): ...` |
| **Phase 04** | Modernized Listing Detail & Bento UX | `feature/phase-04-listing-bento-ux` | `feat(listing): ...` |
| **Phase 05** | Bulk Select & Multi-Action Utility | `feature/phase-05-bulk-select-utility` | `feat(admin-ui): ...` |
| **Phase 06** | Shimmer Loading States & Listings Redesign | `feature/phase-06-shimmer-loading-states` | `feat(ui): ...` |
| **Phase 07** | Multi-Entity CSV Import Hub & Opening Hours | `feature/phase-07-csv-import-opening-hours` | `feat(admin-import): ...` |
| **Phase 08** | User Management, Privileges & Collapsible Nav | `feature/phase-08-user-management-nav` | `feat(admin-users): ...` |
| **Phase 09** | Admin Dashboard & Site Settings Modernization | `feature/phase-09-admin-dashboard-settings` | `feat(settings): ...` |
| **Phase 10** | Deals, Offers & Coupons Engine | `feature/phase-10-deals-coupons-engine` | `feat(deals): ...` |
| **Phase 11** | Business Analytics & Click-to-Action Tracking | `feature/phase-11-business-analytics` | `feat(analytics): ...` |

---

### Phase 3: Enterprise Media File Manager

**Goal:** Centralized multi-tenant media file manager providing direct-to-cloud presigned storage streaming, virtual folders, asset quota management, and universal `MediaPickerModal.svelte` for listings, categories, and locations.  
**Git Branch:** `feature/phase-03-media-file-manager`  
**Requirements**: Media virtual folder taxonomy, S3/R2 direct upload tickets, quota enforcement per pricing plan, recycle bin with 30-day purge, and unified MediaPickerModal.  
**Depends on:** Baseline Scaffold  
**Plans:** 1/1 plans planned  

Plans:
- [x] 03-enterprise-media-file-manager/PLAN.md

---

### Phase 4: Modernized Listing Detail & Bento Experience

**Goal:** Elevate public listing profiles into modern, high-contrast Bento Grid storefronts inspired by top commercial directories (Justdial benchmark), featuring 5-tile photo mosaics, full-screen lightbox, high-conversion Action Docks, and interactive rate cards.  
**Git Branch:** `feature/phase-04-listing-bento-ux`  
**Requirements**: 5-tile Bento photo mosaic with fullscreen lightbox, high-conversion Action Dock (Call, WhatsApp, Enquire, Directions), sticky in-page anchor tabs, interactive services rate card, and customer insights chips.  
**Depends on:** Phase 3  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 04-modernized-listing-bento-ux/PLAN.md

---

### Phase 5: Bulk Select & Multi-Action Utility

**Goal:** Deploy a unified, accessible selection system across all administrative tabular data views (Listings, Categories, Locations), empowering batch status mutations, featured flags, and cascade-safe deletions.  
**Git Branch:** `feature/phase-05-bulk-select-utility`  
**Requirements**: Reusable `createBulkSelect` state logic with Shift+Click range support, indeterminate header checkbox, floating action dock, and destructive action safety modals.  
**Depends on:** Phase 4  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 05-bulk-select-multi-action-utility/PLAN.md

---

### Phase 6: Shimmer Loading States & Listings Management Redesign

**Goal:** Upgrade Admin Back-Office tabular views with Dribbble-style flowing shimmer loading skeletons and elevate older styling to modern semantic design tokens and tabular numbers.  
**Git Branch:** `feature/phase-06-shimmer-loading-states`  
**Requirements**: Streaming shimmer wave skeleton components, route-level loading suspense fallbacks, sidebar navigation micro-spinners, and dual-tone status pill badges.  
**Depends on:** Phase 5  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 06-shimmer-loading-states-listings-redesign/PLAN.md

---

### Phase 7: Multi-Entity CSV Import Hub & Business Opening Hours

**Goal:** Expand CSV bulk data import to support Categories and Locations alongside Listings, with pre-flight header validation and an interactive 7-day visual opening hours schedule matrix.  
**Git Branch:** `feature/phase-07-csv-import-opening-hours`  
**Requirements**: Tabbed multi-entity CSV import hub, pre-flight header checking with row-by-row error reporting, visual 7-day opening hours scheduler component, and shorthand schedule parser.  
**Depends on:** Phase 6  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 07-multi-entity-csv-import-opening-hours/PLAN.md

---

### Phase 8: User Management, Admin Privileges & Collapsible Navigation

**Goal:** Complete directory user governance, role and status lifecycles, administrative password resets, top-right admin privileges capsule, and smooth collapsible sidebar navigation.  
**Git Branch:** `feature/phase-08-user-management-nav`  
**Requirements**: User management tab with registration and status control, password reset modal with Argon2id re-hashing and session invalidation, admin privileges quick launcher, and persistent collapsible sidebar.  
**Depends on:** Phase 7  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 08-user-management-admin-privileges-collapsible-nav/PLAN.md

---

### Phase 9: Admin Dashboard & Site Settings Modernization

**Goal:** Centralized administration settings console at `/admin/settings` controlling site branding, admin identity, and operational governance, with upgraded dashboard KPI cards.  
**Git Branch:** `feature/phase-09-admin-dashboard-settings`  
**Requirements**: Centralized site settings form, brand token customization, operational maintenance controls, and elevated dashboard overview metrics.  
**Depends on:** Phase 8  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 09-admin-dashboard-site-settings/PLAN.md

---

### Phase 10: Deals, Offers & Coupons Engine

**Goal:** Implement a high-converting promotions engine enabling local merchants to publish targeted discounts and coupons, visitors to claim digital vouchers, and merchants to redeem vouchers at counter in real time.  
**Git Branch:** `feature/phase-10-deals-coupons-engine`  
**Requirements**: Deal and DealClaim models, concurrency-safe claim transactions, unique voucher generation algorithm, public /deals discovery hub, listing detail claim modal, merchant redemption scanner, and automated expiry cron.  
**Depends on:** Phase 9  
**Plans:** 1/1 plans planned  

Plans:
- [ ] 10-deals-offers-coupons-engine/PLAN.md

---

### Phase 11: Business Analytics & Click-to-Action Tracking

**Goal:** Implement privacy-first, DPDP-compliant visitor analytics and click-to-action conversion tracking with interactive dashboards for business owners and administrators.  
**Git Branch:** `feature/phase-11-business-analytics`  
**Requirements**: Schema models, tracking telemetry API, client tracking hooks, SVG visual charts, and merchant/admin dashboards.  
**Depends on:** Phase 10  
**Plans:** 1/1 plans complete  

Plans:
- [ ] 11-business-analytics-click-to-action-tracking/PLAN.md
