<script lang="ts">
  import type { PageData } from "./$types";
  import ListingCard from "$lib/components/listing/ListingCard.svelte";
  import SearchFilters from "$lib/components/search/SearchFilters.svelte";
  import MapView from "$lib/components/map/MapView.svelte";
  import { Search, Map, ListFilter, ArrowLeft } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let listings = $derived(data.searchResult.listings);
  let total = $derived(data.searchResult.total);
  let totalPages = $derived(data.searchResult.totalPages);
  let currentPage = $derived(data.searchResult.currentPage);
</script>

<svelte:head>
  <title>{data.q ? `Search results for "${data.q}"` : "Search Businesses & Services in Pimple Saudagar | Directory"}</title>
  <meta
    name="description"
    content="Search verified businesses, doctors, restaurants, clinics, and shops across Pimple Saudagar, PCMC."
  />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <!-- Search Header Bar -->
  <section class="border-b bg-muted/20 py-6">
    <div class="container mx-auto px-4 max-w-6xl">
      <form action="/search" method="GET" class="flex flex-col sm:flex-row gap-2 max-w-3xl">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            value={data.q}
            placeholder="Search by business name, keyword, or service..."
            class="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Keep current filters on new keyword search -->
        {#if data.category && data.category !== "all"}
          <input type="hidden" name="category" value={data.category} />
        {/if}
        {#if data.location && data.location !== "all"}
          <input type="hidden" name="location" value={data.location} />
        {/if}

        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  </section>

  <!-- Main Content Area -->
  <main class="container mx-auto px-4 py-8 max-w-6xl flex-1">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-foreground">
          {data.q ? `Search results for "${data.q}"` : "Explore Businesses in Pimple Saudagar"}
        </h1>
        <p class="text-xs text-muted-foreground mt-0.5">
          Showing {listings.length} of {total} verified local businesses
        </p>
      </div>

      <!-- View Mode Switcher -->
      <div class="flex items-center gap-1 rounded-lg border bg-muted p-1 text-xs">
        <a
          href="/search?q={encodeURIComponent(data.q)}&category={data.category}&location={data.location}&minRating={data.minRating}&sort={data.sort}&view=list"
          class="flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition {data.view === 'list'
            ? 'bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          <ListFilter class="h-3.5 w-3.5" />
          <span>List</span>
        </a>
        <a
          href="/search?q={encodeURIComponent(data.q)}&category={data.category}&location={data.location}&minRating={data.minRating}&sort={data.sort}&view=map"
          class="flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition {data.view === 'map'
            ? 'bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          <Map class="h-3.5 w-3.5" />
          <span>Map</span>
        </a>
      </div>
    </div>

    <!-- Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Column: Filter Sidebar -->
      <div class="lg:col-span-1">
        <SearchFilters
          currentCategory={data.category}
          currentLocation={data.location}
          currentSort={data.sort}
          currentMinRating={data.minRating}
          q={data.q}
          categories={data.allCategories}
          locations={data.allLocations}
        />
      </div>

      <!-- Right Column: Search Results Grid or Map -->
      <div class="lg:col-span-3 space-y-6">
        {#if data.view === "map"}
          <MapView {listings} height="600px" />
        {:else if listings.length === 0}
          <div class="rounded-xl border border-dashed p-12 text-center bg-card">
            <Search class="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
            <h3 class="font-bold text-sm text-foreground">No businesses match your criteria</h3>
            <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try clearing some filters or searching with a different keyword.
            </p>
            <a
              href="/search"
              class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
            >
              Clear All Filters
            </a>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each listings as listing (listing.id)}
              <ListingCard {listing} />
            {/each}
          </div>
        {/if}

        <!-- Pagination Controls -->
        {#if totalPages > 1}
          <div class="flex items-center justify-center gap-2 pt-6 border-t">
            {#each Array.from({ length: totalPages }, (_, idx) => idx + 1) as pageNum}
              {@const isCurrent = pageNum === currentPage}
              <a
                href="/search?q={encodeURIComponent(data.q)}&category={data.category}&location={data.location}&minRating={data.minRating}&sort={data.sort}&view={data.view}&page={pageNum}"
                class="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition {isCurrent
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'border bg-card text-foreground hover:border-primary'}"
              >
                {pageNum}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>
