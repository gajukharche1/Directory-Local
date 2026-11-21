<script lang="ts">
  import type { Snippet } from "svelte";
  import { X, CheckSquare, Layers } from "lucide-svelte";

  let {
    count = 0,
    entityName = "items",
    ondeselect,
    children,
  }: {
    count: number;
    entityName?: string;
    ondeselect: () => void;
    children?: Snippet;
  } = $props();
</script>

{#if count > 0}
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-auto max-w-2xl bg-slate-950 text-white py-2 px-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-slate-800 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200"
    role="region"
    aria-label="Bulk actions toolbar"
  >
    <!-- Selected Count Pill -->
    <div class="flex items-center gap-2.5">
      <div class="h-6 px-2 rounded-full bg-white/15 text-white font-mono text-xs font-bold flex items-center justify-center">
        {count}
      </div>
      <span class="text-xs font-semibold text-slate-200 whitespace-nowrap">
        {count === 1 ? entityName.replace(/s$/, "") : entityName} selected
      </span>
      <button
        type="button"
        class="text-[11px] text-slate-400 hover:text-white underline cursor-pointer ml-1 whitespace-nowrap"
        onclick={ondeselect}
      >
        Clear
      </button>
    </div>

    <!-- Custom Actions (Slots / Snippets) -->
    <div class="flex items-center gap-2">
      {#if children}
        {@render children()}
      {/if}

      <button
        type="button"
        class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        onclick={ondeselect}
        title="Deselect all"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
{/if}
