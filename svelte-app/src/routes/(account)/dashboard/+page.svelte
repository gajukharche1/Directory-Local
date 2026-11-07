<script lang="ts">
  import type { PageData } from "./$types";
  import { Store, Eye, Inbox, Star, ArrowRight, Sparkles, ExternalLink } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Dashboard Overview | Pimple Saudagar Directory</title>
</svelte:head>

<div class="space-y-8">
  <!-- Welcome Banner -->
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">
      Welcome back, {data.listings ? "" : ""}Owner
    </h1>
    <p class="text-xs text-muted-foreground mt-1">
      Here is your business performance summary in Pimple Saudagar
    </p>
  </div>

  <!-- KPI Stats Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">My Listings</span>
        <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Store class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.listings.length}</p>
      <span class="text-[11px] text-muted-foreground mt-0.5 block">Active directory profiles</span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Total Views</span>
        <div class="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
          <Eye class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.totalViews.toLocaleString()}</p>
      <span class="text-[11px] text-muted-foreground mt-0.5 block">Resident profile views</span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Customer Leads</span>
        <div class="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Inbox class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.enquiries.length}</p>
      <span class="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
        {data.unreadEnquiries} new unread enquiries
      </span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Reviews</span>
        <div class="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
          <Star class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.totalReviews}</p>
      <span class="text-[11px] text-muted-foreground mt-0.5 block">Verified neighbor ratings</span>
    </div>
  </div>

  <!-- Two Column Section -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Listings Summary -->
    <div class="lg:col-span-2 rounded-xl border bg-card p-6 shadow-card space-y-4">
      <div class="flex items-center justify-between pb-3 border-b">
        <div>
          <h3 class="font-bold text-base text-foreground">Your Business Listings</h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Profiles managed under this account
          </p>
        </div>
        <a
          href="/dashboard/listings"
          class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight class="h-3 w-3" />
        </a>
      </div>

      {#if data.listings.length === 0}
        <div class="py-8 text-center">
          <p class="text-xs text-muted-foreground">No listings managed yet.</p>
        </div>
      {:else}
        <div class="divide-y divide-border">
          {#each data.listings as listing (listing.id)}
            <div class="py-3 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <a
                  href="/listing/{listing.slug}"
                  target="_blank"
                  class="font-semibold text-xs text-foreground hover:text-primary transition truncate block"
                >
                  {listing.title}
                </a>
                <span class="text-[11px] text-muted-foreground">
                  {listing.locality} • {listing.plan?.name || "Free Tier"}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full {listing.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}"
                >
                  {listing.status.replace("_", " ")}
                </span>
                <a
                  href="/listing/{listing.slug}"
                  target="_blank"
                  class="text-muted-foreground hover:text-foreground"
                  aria-label="View live listing"
                >
                  <ExternalLink class="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Upgrade / Pro Callout -->
    <div class="rounded-xl border bg-gradient-to-br from-primary/10 via-background to-card p-6 shadow-card flex flex-col justify-between">
      <div class="space-y-3">
        <div class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-full">
          <Sparkles class="h-3.5 w-3.5" />
          <span>BOOST VISIBILITY</span>
        </div>
        <h4 class="font-bold text-base text-foreground">
          Reach More Local Customers
        </h4>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Upgrade to Standard or Premium to appear in featured carousels, show top-ranked search results, and receive direct WhatsApp customer leads.
        </p>
      </div>

      <div class="pt-6">
        <a
          href="/pricing"
          class="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition shadow-xs"
        >
          <span>View Promotion Plans</span>
          <ArrowRight class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </div>
</div>
