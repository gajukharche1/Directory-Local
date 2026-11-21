/**
 * Bulk Selection Engine (Svelte 5 Runes)
 * Provides O(1) Set-based selection state, contiguous Shift+Click range tracking,
 * and reactive indeterminate states for administrative tables.
 */
export class BulkSelection<T = string> {
  // Reactive Set of selected entity IDs
  selected = $state<Set<string>>(new Set());

  // Tracks the index of the most recently clicked row for Shift+Click range calculations
  lastIndex = $state<number | null>(null);

  /**
   * Returns current count of selected items
   */
  get count(): number {
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
   * @param id The entity ID being toggled
   * @param currentIndex Row index in the displayed list
   * @param shiftKey Whether the Shift key was held down
   * @param allOrderedIds Ordered array of all visible row IDs
   */
  toggle(id: string, currentIndex?: number, shiftKey = false, allOrderedIds?: string[]) {
    const next = new Set(this.selected);

    if (shiftKey && this.lastIndex !== null && currentIndex !== undefined && allOrderedIds) {
      const start = Math.min(this.lastIndex, currentIndex);
      const end = Math.max(this.lastIndex, currentIndex);
      const targetState = !this.selected.has(id);

      for (let i = start; i <= end; i++) {
        const item = allOrderedIds[i];
        if (item) {
          if (targetState) {
            next.add(item);
          } else {
            next.delete(item);
          }
        }
      }
    } else {
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
    }

    this.selected = next;
    if (currentIndex !== undefined) {
      this.lastIndex = currentIndex;
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
    const next = new Set(this.selected);
    for (const id of allOrderedIds) {
      next.add(id);
    }
    this.selected = next;
  }

  /**
   * Clears all selections
   */
  deselectAll() {
    this.selected = new Set();
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
    const selectedVisibleCount = allOrderedIds.filter((id) => this.selected.has(id)).length;
    return selectedVisibleCount > 0 && selectedVisibleCount < allOrderedIds.length;
  }
}

/**
 * Factory helper for creating a new BulkSelection instance
 */
export function createBulkSelection(): BulkSelection {
  return new BulkSelection();
}
