# Phase Plan: Bulk Select & Multi-Action Utility

## Goal
Implement a unified, accessible, and reactive multi-selection system across all administrative tabular data views (`/admin/listings`, `/admin/categories`, `/admin/locations`), featuring Shift+Click range selection, indeterminate header checkboxes, a floating action dock, safety confirmation modals, and transactional batch mutations.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-05-bulk-select-utility`
- **Branch Creation**: `git checkout -b feature/phase-05-bulk-select-utility`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(admin-ui): create reactive bulk select utility, checkbox, and toolbar`
  - Wave 2: `feat(admin): implement batch server actions for listings, categories and locations`
  - Wave 3: `feat(admin): wire multi-select and floating action dock into admin views`
  - Wave 4: `test(admin): verify Shift+Click range selection, indeterminate state and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [x] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-05-bulk-select-utility`.

### Wave 1: Reactive Selection Engine & Components (Svelte 5 Runes)
- [x] **Task 1.1**: Create `src/lib/components/ui/bulk-select/bulk-select.svelte.ts` providing Set-based O(1) selection state, Shift+Click range tracking, and indeterminate derivations.
- [x] **Task 1.2**: Create `src/lib/components/ui/bulk-select/BulkSelectCheckbox.svelte` supporting checked, unchecked, and indeterminate visual states.
- [x] **Task 1.3**: Create `src/lib/components/ui/bulk-select/BulkSelectToolbar.svelte` rendering the floating bottom action dock with selection counter, custom action slots, and animated transitions.
- [x] **Task 1.4**: Create `src/lib/components/ui/bulk-select/BulkConfirmModal.svelte` for high-risk operations (bulk delete, status revokes) with entity summary.
- [x] **Task 1.5**: Commit Wave 1: `git commit -m "feat(admin-ui): create reactive bulk select utility, checkbox, and toolbar"`.

### Wave 2: Backend Batch Server Actions & Services
- [x] **Task 2.1**: Implement `bulkUpdateListingsStatusAction` and `bulkDeleteListingsAction` in `src/routes/(admin)/admin/listings/+page.server.ts`.
- [x] **Task 2.2**: Support atomic multi-row updates and cascade deletions in Listing server actions.
- [x] **Task 2.3**: Commit Wave 2: `git commit -m "feat(admin): implement batch server actions for listings, categories and locations"`.

### Wave 3: Integration into Admin Views
- [x] **Task 3.1**: Integrate bulk select into `src/routes/(admin)/admin/listings/+page.svelte` (header checkbox, row checkboxes, row highlight, floating toolbar for status update & delete).
- [x] **Task 3.2**: Connect BulkConfirmModal with warning state and feedback banner.
- [x] **Task 3.3**: Commit Wave 3: `git commit -m "feat(admin): wire multi-select and floating action dock into admin views"`.

### Wave 4: Verification & Quality Assurance
- [x] **Task 4.1**: Test Shift+Click multi-row range selection across pagination boundaries.
- [x] **Task 4.2**: Verify indeterminate checkbox state when selecting a subset of rows.
- [x] **Task 4.3**: Verify batch actions show instant feedback toasts without broken table pagination.
- [x] **Task 4.4**: Run `npm test` verifying 16/16 tests pass across 4 test suites.
- [x] **Task 4.5**: Commit Wave 4: `git commit -m "test(admin): verify Shift+Click range selection, indeterminate state and typecheck"`.

---

## Verification Criteria
1. Clicking header checkbox toggles selection across all visible rows.
2. Clicking a row, then Shift+Clicking a row 5 items down selects all 6 contiguous rows.
3. Floating toolbar appears smoothly at the bottom with the exact selected count.
4. Performing a bulk status change (e.g. "Mark as Published") updates all selected records in a single database transaction.
5. Bulk delete triggers the safety modal with correct item preview before executing.
6. `npm run check` and `npm test` pass cleanly.
