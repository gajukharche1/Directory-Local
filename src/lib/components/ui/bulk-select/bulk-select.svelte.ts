import { SvelteSet } from "svelte/reactivity";

/**
 * Bulk Selection Engine (Svelte 5 Runes)
 * Provides O(1) Set-based selection state, contiguous Shift+Click range tracking,
 * and reactive indeterminate states for administrative tables.
 */
export class BulkSelection<T = string> {
  // Reactive Set of selected entity IDs using SvelteSet for fine-grained reactivity
  selected = new SvelteSet<string>();

  // Tracks the index of the most recently clicked row for Shift+Click range calculations
  lastIndex = $state<number | null>(null);

  /**
   * Returns current count of selected items
   */
  get count(): number {
    return this.selected.size;
  }

  /**
   * Alias for count to support selectedCount property lookups
   */
  get selectedCount(): number {
    return this.selected.size;
  }

  /**
   * Returns selected IDs as an array
   */
  get selectedArray(): string[] {
    return Array.from(this.selected);
  }

  /**
   * Checks whether a specific ID is currently selected
   */
  isSelected(id: string): boolean {
    return this.selected.has(id);
  }

  /**
   * Toggles selection for a single row, supporting Shift+Click contiguous range selection
   * Supports both positional parameters and options object.
   */
  toggle(
    id: string,
    currentIndexOrOptions?:
      | number
      | { currentIndex?: number; range?: boolean; shiftKey?: boolean; allIds?: string[]; allOrderedIds?: string[] },
    shiftKey = false,
    allOrderedIds?: string[]
  ) {
    let index: number | undefined;
    let isShift = shiftKey;
    let orderedList = allOrderedIds;

    if (typeof currentIndexOrOptions === "object" && currentIndexOrOptions !== null) {
      index = currentIndexOrOptions.currentIndex;
      isShift = Boolean(currentIndexOrOptions.range || currentIndexOrOptions.shiftKey);
      orderedList = currentIndexOrOptions.allIds || currentIndexOrOptions.allOrderedIds;
    } else if (typeof currentIndexOrOptions === "number") {
      index = currentIndexOrOptions;
    }

    if (isShift && this.lastIndex !== null && index !== undefined && orderedList) {
      const start = Math.min(this.lastIndex, index);
      const end = Math.max(this.lastIndex, index);
      const targetState = !this.selected.has(id);

      for (let i = start; i <= end; i++) {
        const item = orderedList[i];
        if (item) {
          if (targetState) {
            this.selected.add(item);
          } else {
            this.selected.delete(item);
          }
        }
      }
    } else {
      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.add(id);
      }
    }

    if (index !== undefined) {
      this.lastIndex = index;
    }
  }

  /**
   * Toggles all visible rows. If all visible rows are selected, deselects them.
   * Otherwise, selects all visible rows.
   */
  toggleAll(allOrderedIds: string[]) {
    if (this.isAllSelected(allOrderedIds)) {
      this.deselectAll();
    } else {
      this.selectAll(allOrderedIds);
    }
  }

  /**
   * Selects all IDs in the visible list
   */
  selectAll(allOrderedIds: string[]) {
    for (const id of allOrderedIds) {
      this.selected.add(id);
    }
  }

  /**
   * Clears all selections
   */
  deselectAll() {
    this.selected.clear();
    this.lastIndex = null;
  }

  /**
   * Determines if all currently visible rows are selected
   */
  isAllSelected(allOrderedIds: string[]): boolean {
    if (!allOrderedIds || allOrderedIds.length === 0) return false;
    return allOrderedIds.every((id) => this.selected.has(id));
  }

  /**
   * Determines if some (but not all) visible rows are selected
   */
  isIndeterminate(allOrderedIds: string[]): boolean {
    if (!allOrderedIds || allOrderedIds.length === 0) return false;
    let selectedVisibleCount = 0;
    for (const id of allOrderedIds) {
      if (this.selected.has(id)) selectedVisibleCount++;
    }
    return selectedVisibleCount > 0 && selectedVisibleCount < allOrderedIds.length;
  }
}

/**
 * Factory helper for creating a new BulkSelection instance
 */
export function createBulkSelection(): BulkSelection {
  return new BulkSelection();
}
