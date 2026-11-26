<script lang="ts">
  import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    PhoneCall,
    Share2,
    Eye,
    Calendar,
    Zap,
    ExternalLink,
    Store,
    Sparkles,
    ShieldCheck,
  } from "lucide-svelte";
  import AnalyticsAreaChart from "$lib/components/analytics/AnalyticsAreaChart.svelte";
  import AnalyticsBreakdownBar from "$lib/components/analytics/AnalyticsBreakdownBar.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let analytics = $derived(data.analytics);
  let days = $derived(data.days);
  let totals = $derived(analytics.totals);
  let deltas = $derived(analytics.deltas);
  let timeSeries = $derived(analytics.timeSeries);
  let topListings = $derived(analytics.topListings || []);
</script>

<svelte:head>
  <title>Directory Analytics & Platform Telemetry | Admin Console</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 pb-16">
  <!-- Top Header & Filter Controls -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <BarChart3 class="h-6 w-6 text-slate-900" />
        <span>Directory Performance & Telemetry</span>
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Platform-wide DPDP-compliant visitor telemetry, merchant discovery views, and high-intent customer CTAs.
      </p>
    </div>

    <!-- Timeframe Filter Buttons -->
    <div class="flex items-center gap-2">
      <div class="flex items-center bg-slate-200/70 p-1 rounded-2xl">
        {#each [7, 30, 90] as d}
          <a
            href="?days={d}"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all {days === d
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'}"
          >
            {d} Days
          </a>
        {/each}
      </div>
    </div>
  </div>

  <!-- Metric KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Total Views -->
    <div class="rounded-3xl p-5 border border-blue-100 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-blue-900/70">Total Pageviews</span>
        <p class="text-2xl font-black text-slate-900 tabular-nums">{totals.views.toLocaleString()}</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold {deltas.viewsPct >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} px-2 py-0.5 rounded-full">
          {#if deltas.viewsPct >= 0}
            <TrendingUp class="h-3 w-3" /> +{deltas.viewsPct}%
          {:else}
            <TrendingDown class="h-3 w-3" /> {deltas.viewsPct}%
          {/if}
          <span>vs prev {days}d</span>
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xs border border-blue-200/60">
        <Eye class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Unique Visitors -->
    <div class="rounded-3xl p-5 border border-purple-100 bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-purple-900/70">Unique Visitors</span>
        <p class="text-2xl font-black text-slate-900 tabular-nums">{totals.uniqueVisitors.toLocaleString()}</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold {deltas.uniqueVisitorsPct >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} px-2 py-0.5 rounded-full">
          {#if deltas.uniqueVisitorsPct >= 0}
            <TrendingUp class="h-3 w-3" /> +{deltas.uniqueVisitorsPct}%
          {:else}
            <TrendingDown class="h-3 w-3" /> {deltas.uniqueVisitorsPct}%
          {/if}
          <span>vs prev {days}d</span>
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-purple-600 flex items-center justify-center shadow-xs border border-purple-200/60">
        <Users class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 3: Total CTAs -->
    <div class="rounded-3xl p-5 border border-emerald-100 bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-emerald-900/70">Customer Direct CTAs</span>
        <p class="text-2xl font-black text-slate-900 tabular-nums">{totals.ctas.toLocaleString()}</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold {deltas.ctasPct >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} px-2 py-0.5 rounded-full">
          {#if deltas.ctasPct >= 0}
            <TrendingUp class="h-3 w-3" /> +{deltas.ctasPct}%
          {:else}
            <TrendingDown class="h-3 w-3" /> {deltas.ctasPct}%
          {/if}
          <span>vs prev {days}d</span>
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-200/60">
        <Zap class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 4: Platform Conversion Rate -->
    <div class="rounded-3xl p-5 border border-amber-100 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-amber-900/70">Conversion Rate</span>
        <p class="text-2xl font-black text-slate-900 tabular-nums">{totals.conversionRate}%</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold {deltas.conversionRatePct >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} px-2 py-0.5 rounded-full">
          {#if deltas.conversionRatePct >= 0}
            <TrendingUp class="h-3 w-3" /> +{deltas.conversionRatePct}%
          {:else}
            <TrendingDown class="h-3 w-3" /> {deltas.conversionRatePct}%
          {/if}
          <span>vs prev {days}d</span>
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60">
        <Sparkles class="h-5 w-5" />
      </div>
    </div>
  </div>

  <!-- Interactive SVG Trend Chart -->
  <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h2 class="text-base font-extrabold text-slate-900">Traffic & Conversion Trajectory</h2>
        <p class="text-xs text-slate-500">Daily breakdown of directory pageviews vs high-intent customer actions.</p>
      </div>
      <div class="flex items-center gap-4 text-xs font-semibold">
        <span class="flex items-center gap-1.5 text-blue-600">
          <span class="h-2 w-2 rounded-full bg-blue-600"></span> Total Views
        </span>
        <span class="flex items-center gap-1.5 text-emerald-600">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Direct Conversions
        </span>
      </div>
    </div>

    <AnalyticsAreaChart
      data={timeSeries}
      primaryKey="views"
      secondaryKey="ctas"
      height={260}
      primaryLabel="Views"
      secondaryLabel="Customer Actions"
    />
  </div>

  <!-- Two-Column Breakdown: Channel Distribution & Top Listings Leaderboard -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Channel Breakdown Card (1 Col) -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <div>
        <h2 class="text-base font-extrabold text-slate-900">Conversion Channels</h2>
        <p class="text-xs text-slate-500">Distribution across calls, chats, directions, and inquiries.</p>
      </div>

      <AnalyticsBreakdownBar {totals} />

      <div class="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck class="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Salted SHA-256 daily hashing protects visitor identity in compliance with India DPDP Act.</span>
      </div>
    </div>

    <!-- Top Businesses Leaderboard (2 Cols) -->
    <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-extrabold text-slate-900">Top Performing Local Businesses</h2>
          <p class="text-xs text-slate-500">Ranked by customer discovery conversions in the last {days} days.</p>
        </div>
        <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
          Top {topListings.length}
        </span>
      </div>

      {#if topListings.length === 0}
        <div class="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
          <Store class="h-8 w-8 text-slate-400 mx-auto" />
          <p class="text-xs font-bold text-slate-700">No telemetry recorded yet in this timeframe.</p>
          <p class="text-[11px] text-slate-500">Events will appear automatically as visitors browse listings.</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th class="pb-3 pl-2">#</th>
                <th class="pb-3">Business Profile</th>
                <th class="pb-3 text-right">Views</th>
                <th class="pb-3 text-right">Calls</th>
                <th class="pb-3 text-right">WhatsApp</th>
                <th class="pb-3 text-right">Total CTAs</th>
                <th class="pb-3 text-right pr-2">Conversion</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              {#each topListings as item, idx}
                <tr class="hover:bg-slate-50/70 transition">
                  <td class="py-3 pl-2 text-slate-400 font-bold">{idx + 1}</td>
                  <td class="py-3">
                    <div class="space-y-0.5">
                      <a
                        href={item.slug ? `/listing/${item.slug}` : `/dashboard/listings/${item.id}/analytics`}
                        class="font-extrabold text-slate-900 hover:text-blue-600 transition flex items-center gap-1.5"
                      >
                        <span>{item.title}</span>
                        <ExternalLink class="h-3 w-3 text-slate-400" />
                      </a>
                      <span class="text-[11px] text-slate-500">
                        {item.locality || "Local Area"} • <span class="text-blue-600 font-semibold">{item.categoryName}</span>
                      </span>
                    </div>
                  </td>
                  <td class="py-3 text-right tabular-nums">{item.views.toLocaleString()}</td>
                  <td class="py-3 text-right tabular-nums text-emerald-600 font-bold">{item.calls.toLocaleString()}</td>
                  <td class="py-3 text-right tabular-nums text-green-600 font-bold">{item.whatsapps.toLocaleString()}</td>
                  <td class="py-3 text-right tabular-nums font-black text-slate-900">{item.ctas.toLocaleString()}</td>
                  <td class="py-3 text-right pr-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                      {item.conversionRate}%
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
