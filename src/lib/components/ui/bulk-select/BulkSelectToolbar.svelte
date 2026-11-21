<script lang="ts">
  import type { Snippet } from "svelte";
  import { X, CheckSquare, Layers } from "lucide-svelte";

  let {
    count,
    selectedCount,
    totalCount,
    entityName = "items",
    ondeselect,
    onClear,
    children,
    actions,
  }: {
    count?: number;
    selectedCount?: number;
    totalCount?: number;
    entityName?: string;
    ondeselect?: () => void;
    onClear?: () => void;
    children?: Snippet;
    actions?: Snippet;
  } = $props();

  let effectiveCount = $derived(selectedCount ?? count ?? 0);
  let handleDeselect = $derived(ondeselect ?? onClear ?? (() => {}));
</script>

{#if effectiveCount > 0}
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-4xl bg-slate-950 text-white py-2.5 px-4 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.4)] border border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200"
    role="region"
    aria-label="Bulk actions toolbar"
  >
    <!-- Selected Count Pill -->
    <div class="flex items-center gap-2.5 shrink-0">
      <div class="h-6 px-2.5 rounded-full bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 font-mono text-xs font-bold flex items-center justify-center">
        {effectiveCount}
      </div>
      <span class="text-xs font-semibold text-slate-200 whitespace-nowrap">
        {effectiveCount === 1 ? entityName.replace(/s$/, "") : entityName} selected
      </span>
      <button
        type="button"
        class="text-[11px] text-slate-400 hover:text-white underline cursor-pointer ml-1 whitespace-nowrap"
        onclick={handleDeselect}
      >
        Clear
      </button>
    </div>

    <!-- Custom Actions (Slots / Snippets) -->
    <div class="flex items-center flex-wrap gap-2">
      {#if actions}
        {@render actions()}
      {:else if children}
        {@render children()}
      {/if}

      <div class="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

      <button
        type="button"
        class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        onclick={handleDeselect}
        title="Deselect all"
        aria-label="Deselect all"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
{/if}
