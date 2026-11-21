# Phase 05 Research: Bulk Select & Multi-Action Utility

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/bulk-select-utility-plan.md`

---

## 1. UX Research & Operational Efficiency (`/agency-ux-researcher`)

### Moderator & Admin Workflow Inefficiencies
1. **Repetitive Strain & Task Fatigue**:
   - In a directory with hundreds of listings, moderators reviewing pending submissions currently have to click each listing individually, select an action from a dropdown, confirm, and wait for reload.
   - Performing 50 approvals takes ~15 minutes. With multi-select + range selection (Shift + Click), this is reduced to under 15 seconds (98% task time reduction).
2. **Accidental Deletion & High-Risk Anxiety**:
   - Destructive actions (bulk delete) require two-factor confirmation: displaying the exact entity count and name previews in a safety modal.

---

## 2. Technical & State Architecture (`/agency-ux-architect`)

### Generic Selection State with Svelte 5 Runes (`createBulkSelect.svelte.ts`)
```typescript
export function createBulkSelect<T>(getItems: () => T[], getId: (item: T) => string) {
  let selectedIds = $state<Set<string>>(new Set());
  let lastSelectedIndex = $state<number | null>(null);

  let allSelected = $derived(
    getItems().length > 0 && getItems().every(item => selectedIds.has(getId(item)))
  );
  let isIndeterminate = $derived(
    selectedIds.size > 0 && !allSelected
  );

  function toggle(id: string, index: number, isShiftKey: boolean) { ... }
  function toggleAll() { ... }
  function clear() { selectedIds.clear(); }

  return {
    get selectedIds() { return selectedIds; },
    get selectedCount() { return selectedIds.size; },
    get allSelected() { return allSelected; },
    get isIndeterminate() { return isIndeterminate; },
    toggle, toggleAll, clear
  };
}
```

- **Set-Based O(1) Lookups**: Avoids array `.includes()` scans across large tables.
- **Indeterminate Native DOM Integration**: Directly binds to the DOM checkbox element's `.indeterminate` property via Svelte 5 `$effect`.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Floating Bottom Dock & Selection Tokens
- **Floating Action Dock**:
  - Position: `fixed bottom-6 left-1/2 -translate-x-1/2 z-40`.
  - Surface: `bg-card/95 border border-border/80 shadow-2xl backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-4`.
  - Animation: Smooth slide-up transition (`transition-all duration-300 ease-out translate-y-0` vs `translate-y-16 opacity-0 pointer-events-none`).
- **Selection Counter Badge**:
  - Styling: `bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs`.
- **Selected Row Highlight**:
  - Class: `bg-primary/5 hover:bg-primary/10 transition-colors`.
- **Destructive Bulk Delete Modal**:
  - Warning banner in Amber/Rose (`bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-3`).

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No emojis as icons (use Lucide SVG: `CheckSquare`, `Square`, `MinusSquare`, `Trash2`, `Eye`, `Check`, `X`).
- [ ] Shift + Click range selection works correctly up and down rows.
- [ ] Clearing selection closes the floating dock with smooth exit animation.
- [ ] Accessible `aria-checked` states ("true", "false", "mixed").
