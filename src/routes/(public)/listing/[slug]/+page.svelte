<script lang="ts">
  import { Star, MapPin, Sparkles, Check, ChevronRight } from "lucide-svelte";
  import ListingGallery from "$lib/components/listing/ListingGallery.svelte";
  import OpeningHoursCard from "$lib/components/listing/OpeningHoursCard.svelte";
  import ContactCard from "$lib/components/listing/ContactCard.svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let listing = $derived(data.listing);
  let primaryCategory = $derived(listing?.categories?.[0]?.category);
  let ratingNumber = $derived(Number(listing?.averageRating || 0));
</script>

<svelte:head>
  <title>{listing?.title || "Business"} in {listing?.locality || "Local Area"}, Local Business | Reviews & Contact</title>
  <meta
    name="description"
    content={`Contact details, opening hours, photos, ratings, and customer reviews for ${listing?.title || "Business"} located at ${listing?.locality || "Local Area"}, Local Business.`}
  />
  {#if data.localBusinessSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(data.localBusinessSchema)}</script>`}
  {/if}
  {#if data.breadcrumbSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(data.breadcrumbSchema)}</script>`}
  {/if}
</svelte:head>

<Header user={data.user} />

{#if listing}
  <div class="min-h-screen bg-slate-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <a href="/" class="hover:text-slate-900 transition">Home</a>
        <ChevronRight class="h-3 w-3" />
        {#if primaryCategory}
          <a href={`/category/${primaryCategory.slug}`} class="hover:text-slate-900 transition">
            {primaryCategory.name}
          </a>
          <ChevronRight class="h-3 w-3" />
        {/if}
        <span class="text-slate-900 font-semibold truncate max-w-xs">{listing.title}</span>
      </nav>

      <!-- Header Title & Badges -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            {#if primaryCategory}
              <span class="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                {primaryCategory.name}
              </span>
            {/if}
            {#if listing.featured}
              <span class="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                <Sparkles class="h-3 w-3" />
                <span>Featured Spotlight</span>
              </span>
            {/if}
            {#if listing.priceRange}
              <span class="text-xs font-bold text-slate-500">
                {"₹".repeat(Math.min(4, Math.max(1, Math.floor(listing.priceRange))))}
              </span>
            {/if}
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {listing.title}
          </h1>

          <div class="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <div class="flex items-center gap-1 font-bold text-slate-900">
              <Star class="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{ratingNumber > 0 ? ratingNumber.toFixed(1) : "New"}</span>
            </div>
            <span>•</span>
            <span>{listing.reviewCount || 0} {(listing.reviewCount || 0) === 1 ? "review" : "reviews"}</span>
            <span>•</span>
            <div class="flex items-center gap-1">
              <MapPin class="h-3.5 w-3.5 text-slate-400" />
              <span>{listing.locality || "Local Area"}, Local Business</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a
            href={`/reviews/new?listingId=${listing.id}&slug=${listing.slug}`}
            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:border-slate-300 transition"
          >
            ★ Write Review
          </a>
        </div>
      </div>

      <!-- Media Gallery -->
      <div class="mb-8">
        <ListingGallery media={listing.media || []} title={listing.title} />
      </div>

      <!-- Main Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: About, Amenities, Reviews -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Overview / Rich Description -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 class="font-bold text-base text-slate-900 mb-3">About {listing.title}</h2>
            <div class="prose prose-sm text-slate-600 max-w-none text-xs leading-relaxed">
              {@html listing.description || ""}
            </div>
          </div>

          <!-- Amenities -->
          {#if listing.amenities && listing.amenities.length > 0}
            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="font-bold text-base text-slate-900 mb-3">Amenities & Features</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {#each listing.amenities as item}
                  <div class="flex items-center gap-2 text-slate-700">
                    <div class="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check class="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Reviews Section -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <h2 class="font-bold text-base text-slate-900">Customer Ratings & Reviews</h2>
                <p class="text-xs text-slate-500 mt-0.5">Verified authentic feedback from local residents</p>
              </div>
              <a
                href={`/reviews/new?listingId=${listing.id}&slug=${listing.slug}`}
                class="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Write Review
              </a>
            </div>

            {#if !listing.reviews || listing.reviews.length === 0}
              <div class="text-center py-8 text-slate-400 text-xs">
                No reviews yet. Be the first neighbor to write a review!
              </div>
            {:else}
              <div class="space-y-4">
                {#each listing.reviews as rev}
                  <div class="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-semibold text-xs text-slate-900">{rev.reviewerName}</span>
                      <div class="flex items-center gap-0.5">
                        {#each Array(Math.max(0, Math.floor(rev.rating || 0))) as _}
                          <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                        {/each}
                      </div>
                    </div>
                    <h4 class="font-semibold text-xs text-slate-900 mb-1">{rev.title}</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">{rev.body}</p>
                    {#if rev.ownerReply}
                      <div class="mt-2.5 rounded-xl bg-slate-50 p-3 text-xs border-l-2 border-indigo-600">
                        <p class="font-bold text-slate-900 text-[11px] mb-0.5">Response from Owner:</p>
                        <p class="text-slate-600">{rev.ownerReply}</p>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <!-- Right 1 Col: Contact & Location Card, Hours -->
        <div class="space-y-6">
          <ContactCard
            listingId={listing.id}
            title={listing.title}
            slug={listing.slug}
            phone={listing.phone}
            whatsapp={listing.whatsapp}
            email={listing.email}
            website={listing.website}
            address={listing.address}
            locality={listing.locality}
            landmark={listing.landmark}
            claimStatus={listing.claimStatus}
            callAllowed={listing.plan?.callButtonAllowed ?? true}
            whatsappAllowed={listing.plan?.whatsappAllowed ?? true}
          />

          <OpeningHoursCard openingHours={listing.openingHours} />
        </div>
      </div>
    </div>
  </div>
{/if}
