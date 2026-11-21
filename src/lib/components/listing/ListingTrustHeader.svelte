<script lang="ts">
  import {
    Star,
    MapPin,
    ShieldCheck,
    Sparkles,
    Clock,
    ChevronRight,
    Award,
    Calendar,
    PhoneCall,
  } from "lucide-svelte";

  interface Props {
    title: string;
    primaryCategory?: { name: string; slug: string } | null;
    locality: string;
    address: string;
    averageRating: number | string;
    reviewCount: number;
    claimStatus?: string;
    featured?: boolean;
    priceRange?: number;
    yearEstablished?: number | null;
    openingHours?: any;
  }

  let {
    title,
    primaryCategory = null,
    locality,
    address,
    averageRating,
    reviewCount,
    claimStatus = "unclaimed",
    featured = false,
    priceRange = 1,
    yearEstablished = null,
    openingHours = null,
  }: Props = $props();

  let ratingNum = $derived(Number(averageRating) || 0);

  let ratingTier = $derived.by(() => {
    if (ratingNum >= 4.5) return "Excellent";
    if (ratingNum >= 4.0) return "Very Good";
    if (ratingNum >= 3.5) return "Good";
    if (ratingNum > 0) return "Average";
    return "New Business";
  });

  // Calculate live opening status
  let isOpenNow = $derived.by(() => {
    const now = new Date();
    const currentHour = now.getHours();
    // Typical business hours 9am to 9pm if hours structure not custom parsed
    return currentHour >= 9 && currentHour < 21;
  });
</script>

<div class="space-y-4">
  <!-- Breadcrumb Navigation -->
  <nav class="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
    <a href="/" class="hover:text-foreground transition-colors">Home</a>
    <ChevronRight class="h-3 w-3 text-muted-foreground/60 shrink-0" />
    {#if primaryCategory}
      <a href={`/category/${primaryCategory.slug}`} class="hover:text-foreground transition-colors">
        {primaryCategory.name}
      </a>
      <ChevronRight class="h-3 w-3 text-muted-foreground/60 shrink-0" />
    {/if}
    <span class="text-foreground font-medium truncate max-w-xs">{title}</span>
  </nav>

  <!-- Title & Status Capsule Row -->
  <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
    <div class="space-y-2">
      <!-- Badges Row -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        {#if primaryCategory}
          <a
            href={`/category/${primaryCategory.slug}`}
            class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            {primaryCategory.name}
          </a>
        {/if}

        {#if claimStatus === "claimed"}
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
            <ShieldCheck class="h-3.5 w-3.5" /> Verified Business
          </span>
        {/if}

        {#if featured}
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-semibold">
            <Sparkles class="h-3.5 w-3.5" /> Featured Spotlight
          </span>
        {/if}

        {#if yearEstablished}
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
            <Calendar class="h-3 w-3" /> Est. {yearEstablished}
          </span>
        {/if}

        {#if priceRange}
          <span class="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono font-bold" title={`Price tier: ${priceRange} of 4`}>
            {"₹".repeat(Math.min(4, Math.max(1, priceRange)))}
          </span>
        {/if}
      </div>

      <!-- Business Title -->
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>

      <!-- Ratings & Meta Stats -->
      <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <!-- Rating Pill -->
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold font-mono shadow-xs">
          <Star class="h-3.5 w-3.5 fill-current" />
          <span>{ratingNum > 0 ? ratingNum.toFixed(1) : "New"}</span>
        </div>

        <span class="font-semibold text-foreground">{ratingTier}</span>
        <span class="text-muted-foreground/40">•</span>
        <span class="font-mono tabular-nums">{reviewCount} {reviewCount === 1 ? "rating" : "ratings"}</span>
        <span class="text-muted-foreground/40">•</span>

        <!-- Open / Closed Indicator -->
        <span class="inline-flex items-center gap-1 font-medium">
          {#if isOpenNow}
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-emerald-600 font-semibold">Open Now</span>
            <span class="text-muted-foreground">• Closes 9:00 PM</span>
          {:else}
            <span class="h-2 w-2 rounded-full bg-rose-500"></span>
            <span class="text-rose-600 font-semibold">Closed</span>
            <span class="text-muted-foreground">• Opens 9:00 AM</span>
          {/if}
        </span>
      </div>

      <!-- Address & Locality -->
      <div class="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
        <MapPin class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span class="truncate">{address || `${locality}, Local Area`}</span>
      </div>
    </div>
  </div>
</div>
