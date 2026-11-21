<script lang="ts">
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let {
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    baseUrl = "",
    extraParams = {}
  }: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
    baseUrl?: string;
    extraParams?: Record<string, string | number | undefined | null>;
  } = $props();

  let startItem = $derived(totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1);
  let endItem = $derived(Math.min(currentPage * pageSize, totalItems));

  function buildUrl(pageNumber: number) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(extraParams)) {
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      }
    }
    params.set("page", String(pageNumber));
    return `${baseUrl}?${params.toString()}`;
  }

  let pages = $derived.by(() => {
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push("...");
      items.push(totalPages);
    }
    return items;
  });
</script>

{#if totalItems > 0}
  <div class="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs bg-slate-50/40">
    <!-- Item summary count -->
    <p class="text-slate-500 font-medium">
      Showing <span class="font-bold text-slate-800 font-mono tabular-nums">{startItem}</span> to{" "}
      <span class="font-bold text-slate-800 font-mono tabular-nums">{endItem}</span> of{" "}
      <span class="font-bold text-slate-800 font-mono tabular-nums">{totalItems}</span> results
    </p>

    <!-- Page navigation controls -->
    {#if totalPages > 1}
      <nav class="flex items-center gap-1.5 self-center sm:self-auto" aria-label="Pagination">
        <!-- Previous Page -->
        {#if currentPage > 1}
          <a
            href={buildUrl(currentPage - 1)}
            class="h-8 px-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-semibold transition-all shadow-2xs"
            aria-label="Previous Page"
          >
            <ChevronLeft class="h-3.5 w-3.5" />
          </a>
        {:else}
          <button
            type="button"
            disabled
            class="h-8 px-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 flex items-center justify-center cursor-not-allowed"
            aria-label="Previous Page Disabled"
          >
            <ChevronLeft class="h-3.5 w-3.5" />
          </button>
        {/if}

        <!-- Page Numbers -->
        {#each pages as p, i}
          {#if p === "..."}
            <span class="px-2 text-slate-400 select-none">…</span>
          {:else}
            {@const pageNum = Number(p)}
            {@const isCurrent = pageNum === currentPage}
            {#if isCurrent}
              <span
                class="h-8 min-w-8 px-2 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center font-mono tabular-nums shadow-xs"
                aria-current="page"
              >
                {pageNum}
              </span>
            {:else}
              <a
                href={buildUrl(pageNum)}
                class="h-8 min-w-8 px-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center font-mono tabular-nums transition-all shadow-2xs"
              >
                {pageNum}
              </a>
            {/if}
          {/if}
        {/each}

        <!-- Next Page -->
        {#if currentPage < totalPages}
          <a
            href={buildUrl(currentPage + 1)}
            class="h-8 px-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-semibold transition-all shadow-2xs"
            aria-label="Next Page"
          >
            <ChevronRight class="h-3.5 w-3.5" />
          </a>
        {:else}
          <button
            type="button"
            disabled
            class="h-8 px-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 flex items-center justify-center cursor-not-allowed"
            aria-label="Next Page Disabled"
          >
            <ChevronRight class="h-3.5 w-3.5" />
          </button>
        {/if}
      </nav>
    {/if}
  </div>
{/if}
