import { describe, it, expect, beforeEach } from "vitest";
import { BulkSelection } from "./bulk-select.svelte";

describe("BulkSelection (Svelte 5 Runes)", () => {
  let selection: BulkSelection;
  const mockIds = ["item-1", "item-2", "item-3", "item-4", "item-5"];

  beforeEach(() => {
    selection = new BulkSelection();
  });

  it("initializes with empty selection", () => {
    expect(selection.count).toBe(0);
    expect(selection.selectedArray).toEqual([]);
    expect(selection.isAllSelected(mockIds)).toBe(false);
    expect(selection.isIndeterminate(mockIds)).toBe(false);
  });

  it("toggles individual items", () => {
    selection.toggle("item-1", 0);
    expect(selection.isSelected("item-1")).toBe(true);
    expect(selection.count).toBe(1);

    selection.toggle("item-1", 0);
    expect(selection.isSelected("item-1")).toBe(false);
    expect(selection.count).toBe(0);
  });

  it("supports Shift+Click contiguous range selection", () => {
    // Select item at index 1 ("item-2")
    selection.toggle("item-2", 1, false, mockIds);
    expect(selection.count).toBe(1);

    // Shift-click item at index 4 ("item-5") -> selects items 2, 3, 4, 5 (indices 1..4)
    selection.toggle("item-5", 4, true, mockIds);
    expect(selection.count).toBe(4);
    expect(selection.isSelected("item-1")).toBe(false);
    expect(selection.isSelected("item-2")).toBe(true);
    expect(selection.isSelected("item-3")).toBe(true);
    expect(selection.isSelected("item-4")).toBe(true);
    expect(selection.isSelected("item-5")).toBe(true);
  });

  it("correctly identifies indeterminate and all-selected states", () => {
    selection.toggle("item-1", 0);
    expect(selection.isIndeterminate(mockIds)).toBe(true);
    expect(selection.isAllSelected(mockIds)).toBe(false);

    selection.selectAll(mockIds);
    expect(selection.isIndeterminate(mockIds)).toBe(false);
    expect(selection.isAllSelected(mockIds)).toBe(true);
    expect(selection.count).toBe(5);

    selection.deselectAll();
    expect(selection.count).toBe(0);
    expect(selection.isIndeterminate(mockIds)).toBe(false);
    expect(selection.isAllSelected(mockIds)).toBe(false);
  });

  it("toggles all visible items", () => {
    selection.toggleAll(mockIds);
    expect(selection.count).toBe(5);

    selection.toggleAll(mockIds);
    expect(selection.count).toBe(0);
  });
});
