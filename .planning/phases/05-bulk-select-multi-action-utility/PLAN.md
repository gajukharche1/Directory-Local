# Phase Plan: Bulk Select & Multi-Action Utility (Comprehensive)

## Goal
Implement a unified, accessible, and reactive multi-selection and pagination system across all administrative tabular data views (`/admin/listings`, `/admin/categories`, `/admin/locations`), featuring Shift+Click range selection, indeterminate header checkboxes, floating action docks, safety confirmation modals, transactional batch mutations (publish, pending, delete, feature/unfeature, and category/location batch assignment), and universal server-side pagination with query preservation.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-05-bulk-select-utility`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - `feat(admin-ui): create reactive bulk select utility, checkbox, and toolbar`
  - `feat(admin): implement batch server actions for listings, categories and locations`
  - `feat(admin): wire multi-select and floating action dock into admin views`
  - `feat(admin-locations): add bulk select and multi-action utility to locations`
  - `feat(pagination): add universal pagination across listings, categories, and locations`
  - `feat(admin-categories): add bulk select and multi-action utility to categories`
  - `feat(admin-listings): add bulk category and location assignment multi-actions to listings`

---

## Detailed Task Breakdown

### Wave 1: Reactive Selection Engine & Components (Svelte 5 Runes)
- [x] **Task 1.1**: Create `src/lib/components/ui/bulk-select/bulk-select.svelte.ts` providing Set-based O(1) selection state, Shift+Click range tracking, and indeterminate derivations.
- [x] **Task 1.2**: Create `src/lib/components/ui/bulk-select/BulkSelectCheckbox.svelte` supporting checked, unchecked, and indeterminate visual states.
- [x] **Task 1.3**: Create and polish `src/lib/components/ui/bulk-select/BulkSelectToolbar.svelte` rendering the floating bottom action dock supporting count/selectedCount, onClear/ondeselect, and actions/children slots.
- [x] **Task 1.4**: Create `src/lib/components/ui/bulk-select/BulkConfirmModal.svelte` for high-risk operations (bulk delete, status revokes) with entity summary.

### Wave 2: Listings Multi-Action Utility & Batch Operations
- [x] **Task 2.1**: Implement `bulkUpdateStatus` and `bulkDelete` in `src/routes/(admin)/admin/listings/+page.server.ts`.
- [x] **Task 2.2**: Implement `bulkAssignCategory` and `bulkAssignLocation` with `createMany` and `skipDuplicates` in `src/routes/(admin)/admin/listings/+page.server.ts`.
- [x] **Task 2.3**: Wire header checkbox, row checkboxes, Shift+Click range, and floating dock into `src/routes/(admin)/admin/listings/+page.svelte`.
- [x] **Task 2.4**: Add modal dialogs for Category and Location assignment to selected listings.

### Wave 3: Locations Multi-Action Utility & Batch Operations
- [x] **Task 3.1**: Implement `bulkDelete` and `bulkFeature` actions in `src/routes/(admin)/admin/locations/+page.server.ts`.
- [x] **Task 3.2**: Wire `createBulkSelection`, `BulkSelectCheckbox`, `BulkSelectToolbar`, and `BulkConfirmModal` into `src/routes/(admin)/admin/locations/+page.svelte`.
- [x] **Task 3.3**: Add Feature All, Unfeature All, and Bulk Delete safety modal for Locations.

### Wave 4: Categories Multi-Action Utility & Batch Operations
- [x] **Task 4.1**: Implement `bulkDelete` and `bulkFeature` (`featuredOnHome`) actions in `src/routes/(admin)/admin/categories/+page.server.ts`.
- [x] **Task 4.2**: Wire `createBulkSelection`, `BulkSelectCheckbox`, `BulkSelectToolbar`, and `BulkConfirmModal` into `src/routes/(admin)/admin/categories/+page.svelte`.
- [x] **Task 4.3**: Add Feature on Home, Unfeature, and Bulk Delete safety modal for Categories.

### Wave 5: Universal Pagination Component Across Admin Modules
- [x] **Task 5.1**: Create reusable `src/lib/components/ui/Pagination.svelte` with page numbers, responsive item counter, previous/next buttons, and query param preservation.
- [x] **Task 5.2**: Add server-side pagination with query support to `/admin/listings`.
- [x] **Task 5.3**: Add server-side pagination with query support to `/admin/categories`.
- [x] **Task 5.4**: Add server-side pagination with query support to `/admin/locations`.

---

## Verification Criteria
1. Clicking header checkbox toggles selection across all visible rows on current page.
2. Shift+Click selects contiguous ranges in Listings, Categories, and Locations tables.
3. Floating dock appears smoothly when 1 or more items are selected in all three modules.
4. Listings dock offers Categories assignment, Location assignment, status changes, and deletion.
5. Categories dock offers Feature on Home, Unfeature, and deletion.
6. Locations dock offers Feature All, Unfeature All, and deletion.
7. Universal pagination displays correct items range and preserves active filters (`q`, `status`).
8. All test suites pass cleanly.
