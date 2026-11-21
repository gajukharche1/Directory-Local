<script lang="ts">
  import {
    Star,
    MapPin,
    Sparkles,
    Check,
    ChevronRight,
    CheckCircle2,
    Share2,
    Calendar,
    Globe,
    Phone,
    MessageCircle,
    Navigation,
  } from "lucide-svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import ListingBentoHero from "$lib/components/listing/ListingBentoHero.svelte";
  import ListingTrustHeader from "$lib/components/listing/ListingTrustHeader.svelte";
  import ListingActionDock from "$lib/components/listing/ListingActionDock.svelte";
  import ListingAnchorNav from "$lib/components/listing/ListingAnchorNav.svelte";
  import ListingServicesCatalog from "$lib/components/listing/ListingServicesCatalog.svelte";
  import ListingSentimentChips from "$lib/components/listing/ListingSentimentChips.svelte";
  import ListingStickyLeadCard from "$lib/components/listing/ListingStickyLeadCard.svelte";
  import ReviewDistribution from "$lib/components/reviews/ReviewDistribution.svelte";
  import OpeningHoursCard from "$lib/components/listing/OpeningHoursCard.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let listing = $derived(data.listing);
  let primaryCategory = $derived(listing?.categories?.[0]?.category);
  let ratingNumber = $derived(Number(listing?.averageRating || 0));

  let selectedServiceName = $state("");

  function handleEnquireService(serviceName?: string) {
    selectedServiceName = serviceName || "General Services";
    const leadInput = document.getElementById("leadService") as HTMLInputElement | null;
    if (leadInput) {
      leadInput.value = selectedServiceName;
      leadInput.scrollIntoView({ behavior: "smooth", block: "center" });
      leadInput.focus();
    }
  }
</script>

<svelte:head>
  <title>{listing?.title || "Business"} in {listing?.locality || "Local Area"} | Reviews, Rates & Contact</title>
  <meta
    name="description"
    content={`Contact details, opening hours, photos, rate cards, and customer reviews for ${listing?.title || "Business"} located at ${listing?.locality || "Local Area"}, Local Business.`}
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
  <div class="min-h-screen bg-slate-50/60 pb-24 md:pb-16 text-foreground">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- 1. Bento 5-Tile Photo Hero Mosaic with Fullscreen Lightbox -->
      <section id="photos">
        <ListingBentoHero
          images={listing.media || []}
          businessTitle={listing.title}
          categoryName={primaryCategory?.name}
        />
      </section>

      <!-- 2. Trust Header & Badges -->
      <ListingTrustHeader
        title={listing.title}
        primaryCategory={primaryCategory}
        locality={listing.locality}
        address={listing.address}
        averageRating={ratingNumber}
        reviewCount={listing.reviewCount}
        claimStatus={listing.claimStatus}
        featured={listing.featured}
        priceRange={listing.priceRange}
        yearEstablished={listing.yearEstablished}
        openingHours={listing.openingHours}
      />

      <!-- 3. Desktop High-Conversion Action Dock (and mobile trigger) -->
      <ListingActionDock
        phone={listing.phone}
        whatsapp={listing.whatsapp}
        email={listing.email}
        address={listing.address}
        businessTitle={listing.title}
        onenquire={() => handleEnquireService()}
      />
    </div>

    <!-- 4. Sticky In-Page Navigation Bar -->
    <ListingAnchorNav />

    <!-- 5. Main Content Layout (2-Column Desktop Grid) -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Column (Left 2 Columns) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Section: Overview -->
          <section id="overview" class="space-y-6 scroll-mt-24">
            <!-- Sentiment Highlights Chips -->
            <ListingSentimentChips
              reviews={listing.reviews || []}
              averageRating={ratingNumber}
              reviewCount={listing.reviewCount}
            />

            <!-- About / Description Card -->
            <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-3">
              <h2 class="text-base font-bold text-foreground">About {listing.title}</h2>
              <div class="prose prose-sm text-muted-foreground max-w-none text-xs leading-relaxed">
                {@html listing.description || ""}
              </div>
            </div>

            <!-- Amenities & Features -->
            {#if listing.amenities && listing.amenities.length > 0}
              <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-3">
                <h3 class="text-sm font-bold text-foreground">Amenities & Key Features</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {#each listing.amenities as amenity}
                    <div class="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60">
                      <CheckCircle2 class="h-4 w-4 text-emerald-600 shrink-0" />
                      <span class="text-foreground font-medium truncate">{amenity}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </section>

          <!-- Section: Services & Rate Card -->
          <section id="services" class="scroll-mt-24">
            <ListingServicesCatalog
              amenities={listing.amenities}
              categoryName={primaryCategory?.name}
              onenquire={handleEnquireService}
            />
          </section>

          <!-- Section: Reviews & Customer Feedback -->
          <section id="reviews" class="scroll-mt-24">
            <ReviewDistribution
              reviews={listing.reviews || []}
              averageRating={ratingNumber}
              reviewCount={listing.reviewCount}
              listingId={listing.id}
              listingSlug={listing.slug}
            />
          </section>

          <!-- Section: Location & Hours -->
          <section id="location" class="scroll-mt-24 space-y-6">
            <OpeningHoursCard openingHours={listing.openingHours} />

            <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h3 class="text-sm font-bold text-foreground">Location & Landmarks</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">
                <strong class="text-foreground">{listing.address}</strong>
                {#if listing.landmark}
                  <br />Landmark: {listing.landmark}
                {/if}
              </p>

              <div class="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${listing.title}, ${listing.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                >
                  <Navigation class="h-3.5 w-3.5" /> Open in Google Maps
                </a>

                {#if listing.website}
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <Globe class="h-3.5 w-3.5 text-muted-foreground" /> Visit Official Website
                  </a>
                {/if}
              </div>
            </div>
          </section>
        </div>

        <!-- Right Rail Column (Desktop Sticky Lead Dock) -->
        <div class="space-y-6">
          <ListingStickyLeadCard
            listingId={listing.id}
            businessTitle={listing.title}
            phone={listing.phone}
            whatsapp={listing.whatsapp}
            prefilledService={selectedServiceName}
          />
        </div>
      </div>
    </div>
  </div>
{/if}
