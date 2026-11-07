<script lang="ts">
  import type { PageData } from "./$types";
  import ListingCard from "$lib/components/listing/ListingCard.svelte";
  import { ChevronRight, MapPin } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let location = $derived(data.location);
  let listings = $derived(data.listings);
</script>

<svelte:head>
  <title>Businesses & Services in {location.name}, Local Business | Directory</title>
  <meta
    name="description"
    content={location.description ||
      `Explore top verified shops, doctors, dining, and professional services located at ${location.name}, Local Business.`}
  />
  <link rel="canonical" href={`/location/${data.slugPath}`} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <main class="container mx-auto px-4 py-8 max-w-6xl flex-1">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      <a href="/" class="hover:text-foreground transition-colors">Home</a>
      <ChevronRight class="h-3 w-3" />
      <a href="/search" class="hover:text-foreground transition-colors">Locations</a>
      {#if location.parent}
        <ChevronRight class="h-3 w-3" />
        <a href="/location/{location.parent.slug}" class="hover:text-foreground transition-colors">
          {location.parent.name}
        </a>
      {/if}
      <ChevronRight class="h-3 w-3" />
      <span class="text-foreground font-medium">{location.name}</span>
    </nav>

    <!-- Location Header -->
    <div class="mb-8 border-b pb-6">
      <div class="inline-flex items-center gap-1.5 text-xs font-medium text-primary mb-2">
        <MapPin class="h-3.5 w-3.5" />
        <span>Local Business Directory</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground">
        {location.name} Local Businesses
      </h1>
      {#if location.description}
        <p class="text-sm text-muted-foreground mt-2 max-w-2xl">
          {location.description}
        </p>
      {/if}

      <!-- Sub-locations / Landmarks -->
      {#if location.children && location.children.length > 0}
        <div class="mt-5 flex flex-wrap gap-2 items-center">
          <span class="text-xs font-semibold text-muted-foreground">Nearby Landmarks:</span>
          {#each location.children as child (child.id)}
            <a
              href="/location/{location.slug}/{child.slug}"
              class="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition shadow-xs"
            >
              {child.name}
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Listings Grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-foreground">
          Businesses in {location.name} ({listings.length})
        </h2>
        <span class="text-xs text-muted-foreground">Sorted by Verified & Plan Priority</span>
      </div>

      {#if listings.length === 0}
        <div class="rounded-xl border border-dashed p-12 text-center bg-card">
          <MapPin class="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
          <h3 class="font-bold text-sm text-foreground">No listings found in this area</h3>
          <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Do you operate a business in {location.name}? Add your listing to reach local customers.
          </p>
          <a
            href="/submit"
            class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
          >
            List Your Business Here
          </a>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each listings as listing (listing.id)}
            <ListingCard {listing} />
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>
