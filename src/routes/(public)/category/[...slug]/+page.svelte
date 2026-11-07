<script lang="ts">
  import type { PageData } from "./$types";
  import ListingCard from "$lib/components/listing/ListingCard.svelte";
  import { ChevronRight, Folder } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let category = $derived(data.category);
  let listings = $derived(data.listings);
</script>

<svelte:head>
  <title>{category.name} in Pimple Saudagar | Top Rated Services & Businesses</title>
  <meta
    name="description"
    content={category.description ||
      `Find the best ${category.name.toLowerCase()} in Pimple Saudagar with ratings, contact info, and directions.`}
  />
  <link rel="canonical" href={`/category/${data.slugPath}`} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <main class="container mx-auto px-4 py-8 max-w-6xl flex-1">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      <a href="/" class="hover:text-foreground transition-colors">Home</a>
      <ChevronRight class="h-3 w-3" />
      <a href="/search" class="hover:text-foreground transition-colors">Categories</a>
      {#if category.parent}
        <ChevronRight class="h-3 w-3" />
        <a href="/category/{category.parent.slug}" class="hover:text-foreground transition-colors">
          {category.parent.name}
        </a>
      {/if}
      <ChevronRight class="h-3 w-3" />
      <span class="text-foreground font-medium">{category.name}</span>
    </nav>

    <!-- Category Header -->
    <div class="mb-8 border-b pb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground">
        {category.name} in Pimple Saudagar
      </h1>
      {#if category.description}
        <p class="text-sm text-muted-foreground mt-2 max-w-2xl">
          {category.description}
        </p>
      {/if}

      <!-- Subcategories bar -->
      {#if category.children && category.children.length > 0}
        <div class="mt-5 flex flex-wrap gap-2 items-center">
          <span class="text-xs font-semibold text-muted-foreground">Subcategories:</span>
          {#each category.children as child (child.id)}
            <a
              href="/category/{category.slug}/{child.slug}"
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
          Available Businesses ({listings.length})
        </h2>
        <span class="text-xs text-muted-foreground">Sorted by Verified & Plan Priority</span>
      </div>

      {#if listings.length === 0}
        <div class="rounded-xl border border-dashed p-12 text-center bg-card">
          <Folder class="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
          <h3 class="font-bold text-sm text-foreground">No listings found yet</h3>
          <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Are you a local business owner providing {category.name.toLowerCase()} in Pimple Saudagar?
          </p>
          <a
            href="/submit"
            class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
          >
            Add Your Business Listing
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
