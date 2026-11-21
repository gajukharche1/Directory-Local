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
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-05-bulk-select-utility`.

### Wave 1: Reactive Selection Engine & Components (Svelte 5 Runes)
- [ ] **Task 1.1**: Create `src/lib/components/ui/bulk-select/bulk-select.svelte.ts` providing Set-based O(1) selection state, Shift+Click range tracking, and indeterminate derivations.
- [ ] **Task 1.2**: Create `src/lib/components/ui/bulk-select/BulkSelectCheckbox.svelte` supporting checked, unchecked, and indeterminate visual states.
- [ ] **Task 1.3**: Create `src/lib/components/ui/bulk-select/BulkSelectToolbar.svelte` rendering the floating bottom action dock with selection counter, custom action slots, and animated transitions.
- [ ] **Task 1.4**: Create `src/lib/components/ui/bulk-select/BulkConfirmModal.svelte` for high-risk operations (bulk delete, status revokes) with entity summary.
- [ ] **Task 1.5**: Commit Wave 1: `git commit -m "feat(admin-ui): create reactive bulk select utility, checkbox, and toolbar"`.

### Wave 2: Backend Batch Server Actions & Services
- [ ] **Task 2.1**: Implement `bulkUpdateListingsStatusAction` and `bulkDeleteListingsAction` in `src/routes/(admin)/admin/listings/+page.server.ts`.
- [ ] **Task 2.2**: Implement bulk operations for Categories in `src/routes/(admin)/admin/categories/+page.server.ts`.
- [ ] **Task 2.3**: Implement bulk operations for Locations in `src/routes/(admin)/admin/locations/+page.server.ts`.
- [ ] **Task 2.4**: Implement cascade-safety checks in `src/lib/services/taxonomy.service.ts` to prevent deleting categories/locations containing active listings.
- [ ] **Task 2.5**: Commit Wave 2: `git commit -m "feat(admin): implement batch server actions for listings, categories and locations"`.

### Wave 3: Integration into Admin Views
- [ ] **Task 3.1**: Integrate bulk select into `src/routes/(admin)/admin/listings/+page.svelte` (header checkbox, row checkboxes, row highlight, floating toolbar for status update & delete).
- [ ] **Task 3.2**: Integrate bulk select into `src/routes/(admin)/admin/categories/+page.svelte`.
- [ ] **Task 3.3**: Integrate bulk select into `src/routes/(admin)/admin/locations/+page.svelte`.
- [ ] **Task 3.4**: Commit Wave 3: `git commit -m "feat(admin): wire multi-select and floating action dock into admin views"`.

### Wave 4: Verification & Quality Assurance
- [ ] **Task 4.1**: Test Shift+Click multi-row range selection across pagination boundaries.
- [ ] **Task 4.2**: Verify indeterminate checkbox state when selecting a subset of rows.
- [ ] **Task 4.3**: Verify batch actions show instant feedback toasts without broken table pagination.
- [ ] **Task 4.4**: Run `npm run check` and `npm test` verifying 0 errors.
- [ ] **Task 4.5**: Commit Wave 4: `git commit -m "test(admin): verify Shift+Click range selection, indeterminate state and typecheck"`.

---

## Verification Criteria
1. Clicking header checkbox toggles selection across all visible rows.
2. Clicking a row, then Shift+Clicking a row 5 items down selects all 6 contiguous rows.
3. Floating toolbar appears smoothly at the bottom with the exact selected count.
4. Performing a bulk status change (e.g. "Mark as Published") updates all selected records in a single database transaction.
5. Bulk delete triggers the safety modal with correct item preview before executing.
6. `npm run check` and `npm test` pass cleanly.
