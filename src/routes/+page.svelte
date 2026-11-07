<script lang="ts">
  import { Search, MapPin, Building2, Star, ShieldCheck, ArrowRight, Sparkles } from "lucide-svelte";
  import CategoryCard from "$lib/components/taxonomy/CategoryCard.svelte";
  import ListingCard from "$lib/components/listing/ListingCard.svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Header user={data.user} />

<!-- Hero Search Section -->
<section class="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-white py-16 sm:py-24 border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm mb-6">
      <Sparkles class="h-3.5 w-3.5 text-indigo-600" />
      <span>Pimple Saudagar's Trusted Community Directory</span>
    </div>

    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
      Find Verified Local Services in <span class="text-indigo-600">Pimple Saudagar</span>
    </h1>

    <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
      Discover top-rated restaurants, doctors, gyms, salons, and home repairs across PCMC, Pune.
    </p>

    <!-- Search Form Bar -->
    <div class="mt-8 max-w-3xl mx-auto">
      <form action="/search" method="GET" class="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2.5 shadow-xl border border-slate-200">
        <div class="flex-1 flex items-center gap-3 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-100">
          <Search class="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            name="q"
            placeholder="Search doctors, restaurants, gyms, repairs..."
            class="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>

        <div class="flex-1 flex items-center gap-3 px-3 py-1.5">
          <MapPin class="h-5 w-5 text-indigo-600 shrink-0" />
          <select name="location" class="w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer">
            <option value="all">All Pimple Saudagar</option>
            {#each data.locations as loc}
              <option value={loc.slug}>{loc.name}</option>
            {/each}
          </select>
        </div>

        <button
          type="submit"
          class="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      <!-- Quick Chips -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span class="font-semibold text-slate-400">Popular:</span>
        <a href="/search?category=restaurants-cafes" class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition">Restaurants</a>
        <a href="/search?category=dentists-dental-care" class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition">Dentists</a>
        <a href="/search?category=gyms-fitness" class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition">Gyms</a>
        <a href="/search?category=schools-coaching" class="rounded-lg bg-white px-2.5 py-1 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition">Schools</a>
      </div>
    </div>
  </div>
</section>

<!-- Featured Spotlight Section -->
{#if data.featuredListings.length > 0}
  <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Featured & Verified Spotlight</h2>
        <p class="text-sm text-slate-500 mt-1">Recommended businesses with verified authentic reviews</p>
      </div>
      <a href="/search?sort=priority" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
        <span>View all</span>
        <ArrowRight class="h-3.5 w-3.5" />
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each data.featuredListings as item}
        <ListingCard listing={item} />
      {/each}
    </div>
  </section>
{/if}

<!-- Browse by Category Section -->
<section class="py-16 bg-white border-y border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Explore Top Categories</h2>
        <p class="text-sm text-slate-500 mt-1">Find neighborhood specialists across Pimple Saudagar</p>
      </div>
      <a href="/search" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
        <span>View all categories</span>
        <ArrowRight class="h-3.5 w-3.5" />
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {#each data.categories as cat}
        <CategoryCard category={cat} />
      {/each}
    </div>
  </div>
</section>

<!-- Localities Section -->
<section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h2 class="text-2xl font-bold tracking-tight text-slate-900 mb-2">Explore by Neighborhood</h2>
  <p class="text-sm text-slate-500 mb-8">Navigate businesses across key localities in Pimple Saudagar</p>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {#each data.locations as loc}
      <a
        href={`/location/${loc.slug}`}
        class="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-indigo-600 hover:shadow-md transition group"
      >
        <MapPin class="h-6 w-6 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
        <h3 class="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{loc.name}</h3>
        <span class="text-[11px] text-slate-400 mt-0.5 block">{loc.listingCount} businesses</span>
      </a>
    {/each}
  </div>
</section>

<!-- Footer -->
<footer class="border-t border-slate-200 bg-slate-900 text-slate-400 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
    <div>
      <span class="font-bold text-white text-sm">Pimple Saudagar Local Directory</span>
      <p class="mt-1 text-slate-500">Supporting local businesses and residents across PCMC, Pune, Maharashtra.</p>
    </div>
    <div class="flex gap-6 text-slate-400 font-medium">
      <a href="/pricing" class="hover:text-white transition">Business Pricing</a>
      <a href="/search" class="hover:text-white transition">Search Directory</a>
      <a href="/login" class="hover:text-white transition">Merchant Login</a>
    </div>
  </div>
</footer>
