<script lang="ts">
  import { Filter, RotateCcw } from "lucide-svelte";

  interface Props {
    currentCategory?: string;
    currentLocation?: string;
    currentSort?: string;
    currentMinRating?: number;
    q?: string;
    categories: Array<{ id: string; slug: string; name: string }>;
    locations: Array<{ id: string; slug: string; name: string }>;
  }

  let {
    currentCategory = "all",
    currentLocation = "all",
    currentSort = "priority",
    currentMinRating = 0,
    q = "",
    categories = [],
    locations = [],
  }: Props = $props();
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
    <div class="flex items-center gap-2">
      <Filter class="h-4 w-4 text-indigo-600" />
      <h3 class="font-bold text-sm text-slate-900">Filter Listings</h3>
    </div>

    <a
      href="/search"
      class="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition"
    >
      <RotateCcw class="h-3 w-3" />
      <span>Reset</span>
    </a>
  </div>

  <form action="/search" method="GET" class="space-y-4">
    {#if q}
      <input type="hidden" name="q" value={q} />
    {/if}

    <!-- Category Filter -->
    <div>
      <label for="filter-category" class="block text-xs font-semibold text-slate-700 mb-1.5">
        Category
      </label>
      <select
        id="filter-category"
        name="category"
        value={currentCategory}
        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        <option value="all">All Categories</option>
        {#each categories as c}
          <option value={c.slug}>{c.name}</option>
        {/each}
      </select>
    </div>

    <!-- Locality Filter -->
    <div>
      <label for="filter-location" class="block text-xs font-semibold text-slate-700 mb-1.5">
        Locality / Landmark
      </label>
      <select
        id="filter-location"
        name="location"
        value={currentLocation}
        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        <option value="all">All Locations</option>
        {#each locations as l}
          <option value={l.slug}>{l.name}</option>
        {/each}
      </select>
    </div>

    <!-- Minimum Rating -->
    <div>
      <label for="filter-rating" class="block text-xs font-semibold text-slate-700 mb-1.5">
        Minimum Rating
      </label>
      <select
        id="filter-rating"
        name="minRating"
        value={currentMinRating ? String(currentMinRating) : "0"}
        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        <option value="0">Any Rating</option>
        <option value="4">4.0 Stars & above</option>
        <option value="4.5">4.5 Stars & above</option>
        <option value="3">3.0 Stars & above</option>
      </select>
    </div>

    <!-- Sort By -->
    <div>
      <label for="filter-sort" class="block text-xs font-semibold text-slate-700 mb-1.5">
        Sort Order
      </label>
      <select
        id="filter-sort"
        name="sort"
        value={currentSort}
        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        <option value="priority">Featured & Priority</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">Newly Added</option>
      </select>
    </div>

    <button
      type="submit"
      class="w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
    >
      Apply Filters
    </button>
  </form>
</div>
