<script lang="ts">
  import {
    ArrowLeft,
    Eye,
    TrendingUp,
    TrendingDown,
    ExternalLink,
    Zap,
    Users,
    Phone,
    MessageCircle,
    Navigation,
    Inbox,
    Globe,
    BarChart3,
  } from "lucide-svelte";
  import AnalyticsAreaChart from "$lib/components/analytics/AnalyticsAreaChart.svelte";
  import AnalyticsBreakdownBar from "$lib/components/analytics/AnalyticsBreakdownBar.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let listing = $derived(data.listing);
  let analytics = $derived(data.analytics);
  let days = $derived(data.days);
</script>

<svelte:head>
  <title>Analytics: {listing.title} | Merchant Dashboard</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 pb-16">
  <!-- Top Breadcrumb & Title Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <a
        href="/dashboard/listings"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-1"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Back to My Listings</span>
      </a>
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          {listing.title}
        </h1>
        <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
          Analytics
        </span>
      </div>
      <p class="text-xs text-slate-500">
        Locality: <strong class="text-slate-700">{listing.locality || "Local Area"}</strong> • Status:
        <span class="capitalize font-semibold text-emerald-600">{listing.status}</span>
      </p>
    </div>

    <!-- Actions & Timeframe Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="flex items-center bg-slate-200/70 p-1 rounded-2xl">
        {#each [7, 30, 90] as d}
          <a
            href="?days={d}"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all {days === d
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'}"
          >
            {d} Days
          </a>
        {/each}
      </div>

      <a
        href="/listing/{listing.slug}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition"
      >
        <span>View Public Profile</span>
        <ExternalLink class="h-3.5 w-3.5 text-slate-400" />
      </a>
    </div>
  </div>

  <!-- 4-Column Executive KPI Metric Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Total Storefront Impressions -->
    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-blue-600">
        <span class="text-xs font-bold uppercase tracking-wider">Storefront Views</span>
        <div class="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Eye class="h-4 w-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900 tabular-nums">
          {analytics.totals.views}
        </span>
        {#if analytics.deltas.viewsPct !== 0}
          <span
            class="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full {analytics.deltas.viewsPct > 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'}"
          >
            {#if analytics.deltas.viewsPct > 0}
              <TrendingUp class="h-3 w-3" />
            {:else}
              <TrendingDown class="h-3 w-3" />
            {/if}
            {Math.abs(analytics.deltas.viewsPct)}%
          </span>
        {/if}
      </div>
      <p class="text-[11px] text-slate-500 font-medium">
        {analytics.totals.uniqueVisitors} unique customer devices
      </p>
    </div>

    <!-- Card 2: High-Intent Actions / Conversions -->
    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-emerald-600">
        <span class="text-xs font-bold uppercase tracking-wider">Direct Customer Actions</span>
        <div class="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Zap class="h-4 w-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900 tabular-nums">
          {analytics.totals.ctas}
        </span>
        {#if analytics.deltas.ctasPct !== 0}
          <span
            class="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full {analytics.deltas.ctasPct > 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'}"
          >
            {#if analytics.deltas.ctasPct > 0}
              <TrendingUp class="h-3 w-3" />
            {:else}
              <TrendingDown class="h-3 w-3" />
            {/if}
            {Math.abs(analytics.deltas.ctasPct)}%
          </span>
        {/if}
      </div>
      <p class="text-[11px] text-slate-500 font-medium">
        Calls, WhatsApp, Maps & enquiries
      </p>
    </div>

    <!-- Card 3: Action Conversion Rate -->
    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-purple-600">
        <span class="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
        <div class="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center">
          <TrendingUp class="h-4 w-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900 tabular-nums">
          {analytics.totals.conversionRate}%
        </span>
        {#if analytics.deltas.conversionRatePct !== 0}
          <span
            class="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full {analytics.deltas.conversionRatePct > 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'}"
          >
            {analytics.deltas.conversionRatePct > 0 ? "+" : ""}{analytics.deltas.conversionRatePct}%
          </span>
        {/if}
      </div>
      <p class="text-[11px] text-slate-500 font-medium">
        Visitors contacting your business
      </p>
    </div>

    <!-- Card 4: Top Contact Channel -->
    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-amber-600">
        <span class="text-xs font-bold uppercase tracking-wider">Primary Channel</span>
        <div class="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <Phone class="h-4 w-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-black text-slate-900 truncate">
          {#if analytics.totals.calls >= analytics.totals.whatsapps && analytics.totals.calls > 0}
            Phone Calls ({analytics.totals.calls})
          {:else if analytics.totals.whatsapps > 0}
            WhatsApp ({analytics.totals.whatsapps})
          {:else if analytics.totals.directions > 0}
            Directions ({analytics.totals.directions})
          {:else if analytics.totals.enquiries > 0}
            Leads ({analytics.totals.enquiries})
          {:else}
            Awaiting Traffic
          {/if}
        </span>
      </div>
      <p class="text-[11px] text-slate-500 font-medium">
        Most popular way customers reach you
      </p>
    </div>
  </div>

  <!-- Interactive Area Chart Section -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h2 class="text-base font-black text-slate-900 tracking-tight">Performance Velocity</h2>
        <p class="text-xs text-slate-500">Daily customer discovery and direct lead inquiries over the last {days} days.</p>
      </div>
      <div class="text-[11px] font-semibold text-slate-400">
        Data normalized per day (DPDP privacy compliant)
      </div>
    </div>

    <AnalyticsAreaChart
      data={analytics.timeSeries}
      primaryKey="views"
      secondaryKey="ctas"
      primaryLabel="Views"
      secondaryLabel="Customer Actions"
      height={260}
    />
  </div>

  <!-- Click-to-Action Breakdown Section -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
    <div class="border-b border-slate-100 pb-4">
      <h2 class="text-base font-black text-slate-900 tracking-tight">Channel Conversion Breakdown</h2>
      <p class="text-xs text-slate-500">Distribution of customer actions across all contact touchpoints.</p>
    </div>

    <AnalyticsBreakdownBar totals={analytics.totals} />
  </div>
</div>
