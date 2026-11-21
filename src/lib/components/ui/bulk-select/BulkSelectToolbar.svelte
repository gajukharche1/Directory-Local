<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "lucide-svelte";

  let {
    count,
    selectedCount,
    totalCount,
    entityName = "listings",
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

  $effect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && effectiveCount > 0) {
        handleDeselect();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
</script>

{#if effectiveCount > 0}
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-auto max-w-5xl bg-white text-slate-800 py-2.5 px-4 rounded-2xl sm:rounded-3xl shadow-[0_16px_45px_rgba(0,0,0,0.12)] border border-slate-200/80 flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-3.5 animate-in slide-in-from-bottom-5 duration-200"
    role="region"
    aria-label="Bulk actions dock"
  >
    <!-- Selected Count Pill (Matching Screenshot) -->
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-medium shrink-0">
      <span class="h-2 w-2 rounded-full bg-blue-600 shrink-0"></span>
      <span class="text-blue-900/80">
        <strong class="font-bold text-blue-700">{effectiveCount}</strong>
        {#if totalCount && totalCount > 0}
          <span class="text-blue-900/60 font-normal">of</span> <strong class="font-bold text-blue-700">{totalCount}</strong>
        {/if}
        {effectiveCount === 1 ? entityName.replace(/s$/, "") : entityName} selected
      </span>
    </div>

    <!-- Inline Clear Action with Esc Badge -->
    <div class="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        class="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
        onclick={handleDeselect}
        title="Clear selection (Esc)"
      >
        <X class="h-3.5 w-3.5 text-slate-400" />
        <span>Clear</span>
      </button>
      <kbd class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-[10px] font-mono text-slate-500 select-none">
        Esc
      </kbd>
    </div>

    <!-- Vertical Separator Divider -->
    <div class="h-6 w-px bg-slate-200 hidden sm:block shrink-0 mx-0.5"></div>

    <!-- Custom Action Buttons Container -->
    <div class="flex items-center flex-wrap gap-2">
      {#if actions}
        {@render actions()}
      {:else if children}
        {@render children()}
      {/if}
    </div>
  </div>
{/if}
