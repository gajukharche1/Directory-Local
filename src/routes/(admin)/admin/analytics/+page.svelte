<script lang="ts">
  import {
    BarChart3,
    TrendingUp,
    Users,
    MousePointerClick,
    PhoneCall,
    Share2,
    Eye,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles
  } from "lucide-svelte";
</script>

<svelte:head>
  <title>Directory Analytics | Local Directory Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <BarChart3 class="h-6 w-6 text-slate-900" />
        Directory Performance & Telemetry
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Monitor merchant impression metrics, phone click-to-call events, and discovery conversion.
      </p>
    </div>

    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-600 shadow-2xs">
      <Calendar class="h-3.5 w-3.5 text-slate-400" />
      <span>Last 30 Days</span>
    </div>
  </div>

  <!-- Metric KPI Pastel Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Total Views -->
    <div class="rounded-3xl p-5 border border-blue-100 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-blue-900/70">Directory Pageviews</span>
        <p class="text-2xl font-black text-slate-900">18,420</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight class="h-3 w-3" /> +14.2% vs last mo
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xs border border-blue-200/60">
        <Eye class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Click-to-Calls -->
    <div class="rounded-3xl p-5 border border-rose-100 bg-gradient-to-br from-[#FEF2F4] via-[#FFF1F2] to-[#FFE4E6] flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-rose-900/70">Click-to-Call Leads</span>
        <p class="text-2xl font-black text-slate-900">1,248</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight class="h-3 w-3" /> +8.7% intent
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-xs border border-rose-200/60">
        <PhoneCall class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 3: Directions & Map Clicks -->
    <div class="rounded-3xl p-5 border border-purple-100 bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-purple-900/70">Map Inquiries</span>
        <p class="text-2xl font-black text-slate-900">892</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight class="h-3 w-3" /> +19.4% visits
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-purple-700 flex items-center justify-center shadow-xs border border-purple-200/60">
        <MousePointerClick class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 4: Verified Merchant Conversions -->
    <div class="rounded-3xl p-5 border border-amber-100 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-amber-900/70">Conversion Rate</span>
        <p class="text-2xl font-black text-slate-900">6.8%</p>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full">
          <Sparkles class="h-3 w-3" /> High Intent
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60">
        <TrendingUp class="h-5 w-5" />
      </div>
    </div>
  </div>

  <!-- Telemetry Graph Placeholder Card -->
  <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-6">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div>
        <h2 class="text-sm font-bold text-slate-900">Daily Customer Engagement Trajectory</h2>
        <p class="text-xs text-slate-400 mt-0.5">Impressions vs high-intent actions (calls, WhatsApp, bookings)</p>
      </div>
      <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
        Real-time telemetry active
      </span>
    </div>

    <!-- Visual Chart Representation -->
    <div class="h-64 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-100">
      {#each [35, 45, 60, 48, 72, 85, 92, 68, 74, 88, 95, 110, 82, 70] as val, i}
        <div class="flex-1 flex flex-col items-center gap-2 group">
          <div
            class="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl group-hover:from-blue-700 group-hover:to-indigo-500 transition-all shadow-xs"
            style="height: {val * 1.8}px;"
          ></div>
          <span class="text-[10px] text-slate-400 font-mono">D{i + 1}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
