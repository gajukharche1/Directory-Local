# Phase Plan: Shimmer Loading States & Listings Management Redesign

## Goal
Implement Dribbble-style shimmering wave skeleton loading states across all Admin tabular and form views, add instant navigation micro-feedback, and modernize the Listings Management interface with semantic tokens, dual-tone status badges, and accessible typography.


---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-06-shimmer-loading-states`
- **Branch Creation**: `git checkout -b feature/phase-06-shimmer-loading-states`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(ui): add shimmer wave CSS engine and Skeleton primitive`
  - Wave 2: `feat(ui): implement specialized skeletons for tables, forms, and taxonomy`
  - Wave 3: `feat(admin-listings): redesign listing table with semantic design tokens`
  - Wave 4: `feat(admin-nav): add sidebar click micro-spinners and route progress rail`
  - Wave 5: `test(ui): verify skeleton transitions, contrast and zero typecheck errors`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [x] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-06-shimmer-loading-states`.

### Wave 1: Shimmer Skeleton Primitives & CSS Engine
- [x] **Task 1.1**: Define `@keyframes shimmer-wave` and utility classes in `src/routes/layout.css` supporting light and dark theme contrast with `prefers-reduced-motion` fallbacks.
- [x] **Task 1.2**: Create `src/lib/components/ui/Skeleton.svelte` primitive supporting circular, text, and rectangular aspect-ratio placeholders.
- [x] **Task 1.3**: Create top indeterminate navigation progress rail in `src/routes/(admin)/admin/+layout.svelte` bound to SvelteKit's `$navigating`.
- [x] **Task 1.4**: Commit Wave 1: `git commit -m "feat(ui): add shimmer wave CSS engine and Skeleton primitive"`.

### Wave 2: Specialized View Skeletons
- [x] **Task 2.1**: Create `src/lib/components/skeletons/ListingTableSkeleton.svelte` mirroring the listings table layout (search input, status tabs, 6 placeholder rows with avatar, title, category, status pill, and action skeletons).
- [x] **Task 2.2**: Create `src/lib/components/skeletons/FormCardSkeleton.svelte` mirroring the Add/Edit listing form sections.
- [x] **Task 2.3**: Create `src/lib/components/skeletons/TaxonomyGridSkeleton.svelte` mirroring Category and Location cards.
- [x] **Task 2.4**: Commit Wave 2: `git commit -m "feat(ui): implement specialized skeletons for tables, forms, and taxonomy"`.

### Wave 3: Listings Management UI Overhaul (`/admin/listings`)
- [x] **Task 3.1**: Refactor `src/routes/(admin)/admin/listings/+page.svelte` to remove legacy hardcoded classes (`bg-slate-*`, `text-red-*`) in favor of semantic design tokens (`bg-card`, `border-border/70`, `rounded-2xl`).
- [x] **Task 3.2**: Upgrade status tabs into semantic filter pills with count badges and smooth active indicators.
- [x] **Task 3.3**: Redesign listing table rows with dual-tone status capsules, monospace ID badges, star ratings, and clean Lucide action buttons.
- [x] **Task 3.4**: Commit Wave 3: `git commit -m "feat(admin-listings): redesign listing table with semantic design tokens"`.

### Wave 4: Admin Sidebar Navigation Micro-Feedback
- [x] **Task 4.1**: Enhance Admin navigation sidebar to display an immediate micro-spinner/pulse on the clicked item during route transitions.
- [x] **Task 4.2**: Verify loading feedback across All Listings, Add Listing, Categories, and Locations.
- [x] **Task 4.3**: Commit Wave 4: `git commit -m "feat(admin-nav): add sidebar click micro-spinners and route progress rail"`.

### Wave 5: Verification & Accessibility
- [x] **Task 5.1**: Test skeleton transitions across 3G/slow network throttling in DevTools to ensure zero visual layout jumps.
- [x] **Task 5.2**: Verify light mode and dark mode color contrast across all new status pills.
- [x] **Task 5.3**: Run `npm run check` and `npm test` verifying 0 errors.
- [x] **Task 5.4**: Commit Wave 5: `git commit -m "test(ui): verify skeleton transitions, contrast and zero typecheck errors"`.

---

## Verification Criteria
1. Navigating between admin tabs triggers the top indeterminate progress bar and displays the corresponding shimmer skeleton before content loads.
2. The shimmer wave moves across skeleton placeholders with a smooth linear gradient.
3. The Listings Management page renders with modern rounded-2xl cards and dual-tone status badges.
4. `prefers-reduced-motion` disables wave animation.
5. `npm run check` and `npm test` pass cleanly.


