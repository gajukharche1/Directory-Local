<script lang="ts">
  import type { PageData } from "./$types";
  import {
    Store,
    Star,
    Clock,
    Users,
    ShieldAlert,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    TrendingUp
  } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let hasPendingItems = $derived(
    data.pendingReviews > 0 || data.pendingClaims > 0 || data.pendingListings > 0
  );
</script>

<svelte:head>
  <title>Admin Overview | Local Business Directory</title>
</svelte:head>

<div class="space-y-7">
  <!-- Top Welcome Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black tracking-tight text-slate-900">
        System Overview & Operations
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Directory health, moderation queue status, and community activity
      </p>
    </div>

    <a
      href="/admin/listings"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
    >
      <Store class="h-3.5 w-3.5" />
      <span>Manage Listings</span>
    </a>
  </div>

  <!-- Modern Pastel Metric Cards (Matching Health/Modern Dashboard) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Blush Pink (Published Listings) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-rose-100/70 bg-gradient-to-br from-[#FEF2F4] via-[#FFF1F2] to-[#FFE4E6] shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-rose-900/70 tracking-wide block">
          Published Listings
        </span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-900">{data.publishedListings}</span>
          <span class="text-xs font-semibold text-rose-700/80">Live</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Sparkles class="h-3 w-3" /> Public Index
        </span>
      </div>

      <div class="h-11 w-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md shrink-0">
        <Store class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Soft Amber/Peach (Pending Reviews) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-amber-100/70 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-amber-900/70 tracking-wide block">
          Pending Reviews
        </span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-900">{data.pendingReviews}</span>
          <span class="text-xs font-semibold text-amber-700/80">Reviews</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Star class="h-3 w-3 fill-amber-500 text-amber-500" /> Moderation
        </span>
      </div>

      <div class="h-11 w-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-sm shrink-0 border border-amber-200/60">
        <Star class="h-5 w-5 fill-amber-500 text-amber-500" />
      </div>
    </div>

    <!-- Card 3: Soft Periwinkle/Blue (Claim Requests) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-blue-100/70 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/60 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-blue-900/70 tracking-wide block">
          Claim Requests
        </span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-900">{data.pendingClaims}</span>
          <span class="text-xs font-semibold text-blue-700/80">Claims</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Clock class="h-3 w-3" /> Owner Proof
        </span>
      </div>

      <div class="h-11 w-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm shrink-0 border border-blue-200/60">
        <Clock class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 4: Soft Lavender/Purple (Registered Users) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-purple-100/70 bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]/60 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-purple-900/70 tracking-wide block">
          Total Community
        </span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-900">{data.totalUsers}</span>
          <span class="text-xs font-semibold text-purple-700/80">Users</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Users class="h-3 w-3" /> Members
        </span>
      </div>

      <div class="h-11 w-11 rounded-2xl bg-white text-purple-700 flex items-center justify-center shadow-sm shrink-0 border border-purple-200/60">
        <Users class="h-5 w-5" />
      </div>
    </div>
  </div>

  <!-- Moderation Alert Card -->
  {#if hasPendingItems}
    <div class="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
          <ShieldAlert class="h-5 w-5" />
        </div>
        <div>
          <h3 class="font-bold text-sm text-slate-900">
            Items Pending Human Review
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            There are {data.pendingReviews} customer reviews and {data.pendingClaims} ownership claim requests waiting in the queue.
          </p>
        </div>
      </div>

      <a
        href="/admin/moderation"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <span>Open Moderation Queue</span>
        <ArrowRight class="h-3.5 w-3.5" />
      </a>
    </div>
  {/if}
</div>
