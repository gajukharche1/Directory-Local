<script lang="ts">
  import {
    BarChart3,
    Eye,
    TrendingUp,
    TrendingDown,
    Zap,
    Users,
    Phone,
    MessageCircle,
    ArrowUpRight,
    Store,
    ExternalLink,
    ChevronRight,
  } from "lucide-svelte";
  import AnalyticsAreaChart from "$lib/components/analytics/AnalyticsAreaChart.svelte";
  import AnalyticsBreakdownBar from "$lib/components/analytics/AnalyticsBreakdownBar.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let analytics = $derived(data.analytics);
  let days = $derived(data.days);
  let topListings = $derived(analytics.topListings || []);
</script>

<svelte:head>
  <title>Portfolio Analytics | Merchant Dashboard</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 pb-16">
  <!-- Header & Timeframe Pills -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <BarChart3 class="h-6 w-6 text-blue-600" />
        <span>Business Discovery & Conversion Analytics</span>
      </h1>
      <p class="text-xs text-slate-500 mt-1">
        Monitor customer impressions, direct calls, WhatsApp chats, and route requests across all your local business profiles.
      </p>
    </div>

    <!-- Timeframe Filter Pills -->
    <div class="flex items-center bg-slate-200/70 p-1 rounded-2xl w-fit">
      {#each [7, 30, 90] as d}
        <a
          href="?days={d}"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all {days === d
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}"
        >
          {d} Days
        </a>
      {/each}
    </div>
  </div>

  <!-- 4-Column Executive KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-blue-600">
        <span class="text-xs font-bold uppercase tracking-wider">Portfolio Views</span>
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
        {analytics.totals.uniqueVisitors} unique customer reach
      </p>
    </div>

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
        Calls, WhatsApp chats, maps & leads
      </p>
    </div>

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
        Percentage of visits initiating contact
      </p>
    </div>

    <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div class="flex items-center justify-between text-indigo-600">
        <span class="text-xs font-bold uppercase tracking-wider">Tracked Storefronts</span>
        <div class="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Store class="h-4 w-4" />
        </div>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-black text-slate-900 tabular-nums">
          {topListings.length}
        </span>
      </div>
      <p class="text-[11px] text-slate-500 font-medium">
        Active listings in your merchant account
      </p>
    </div>
  </div>

  <!-- Performance Velocity Area Chart -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h2 class="text-base font-black text-slate-900 tracking-tight">Portfolio Velocity</h2>
        <p class="text-xs text-slate-500">Aggregate daily impressions vs customer contact actions.</p>
      </div>
      <span class="text-[11px] font-semibold text-slate-400">Past {days} days</span>
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

  <!-- Multi-channel breakdown -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
    <div class="border-b border-slate-100 pb-4">
      <h2 class="text-base font-black text-slate-900 tracking-tight">Action Touchpoints</h2>
      <p class="text-xs text-slate-500">Breakdown of customer leads generated across phone, WhatsApp, directions, and web links.</p>
    </div>

    <AnalyticsBreakdownBar totals={analytics.totals} />
  </div>

  <!-- Listings Leaderboard Table -->
  <div class="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 class="text-base font-black text-slate-900 tracking-tight">Listing Performance Comparison</h2>
        <p class="text-xs text-slate-500">Ranked by direct customer contacts generated over the past {days} days.</p>
      </div>
      <a
        href="/dashboard/listings"
        class="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
      >
        <span>Manage All Listings</span>
        <ChevronRight class="h-3.5 w-3.5" />
      </a>
    </div>

    {#if topListings.length === 0}
      <div class="p-12 text-center text-slate-400 text-xs">
        No active listings found in your account. Onboard a business listing to start collecting discovery metrics.
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
              <th class="py-3 px-4">Business Listing</th>
              <th class="py-3 px-4 text-center">Category</th>
              <th class="py-3 px-4 text-right">Views</th>
              <th class="py-3 px-4 text-right">Unique Visitors</th>
              <th class="py-3 px-4 text-right">Phone Calls</th>
              <th class="py-3 px-4 text-right">WhatsApp</th>
              <th class="py-3 px-4 text-right">Total Actions</th>
              <th class="py-3 px-4 text-right">Conversion Rate</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {#each topListings as item, idx}
              <tr class="hover:bg-slate-50/50 transition">
                <td class="py-3.5 px-4 font-bold text-slate-900">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] text-slate-400 font-mono w-4">#{idx + 1}</span>
                    <div>
                      <p class="text-xs font-bold text-slate-900">{item.title}</p>
                      <p class="text-[10px] text-slate-400 font-normal">{item.locality || "Local Area"}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {item.categoryName || "Business"}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right font-semibold text-slate-700 tabular-nums">
                  {item.views}
                </td>
                <td class="py-3.5 px-4 text-right font-semibold text-slate-700 tabular-nums">
                  {item.uniqueVisitors}
                </td>
                <td class="py-3.5 px-4 text-right font-bold text-blue-600 tabular-nums">
                  {item.calls}
                </td>
                <td class="py-3.5 px-4 text-right font-bold text-emerald-600 tabular-nums">
                  {item.whatsapps}
                </td>
                <td class="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums">
                  {item.ctas}
                </td>
                <td class="py-3.5 px-4 text-right font-bold text-purple-700 tabular-nums">
                  <span class="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {item.conversionRate}%
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <a
                    href="/dashboard/listings/{item.id}/analytics?days={days}"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition shadow-2xs"
                  >
                    <span>Detailed Stats</span>
                    <ArrowUpRight class="h-3 w-3" />
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
