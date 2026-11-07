<script lang="ts">
  import type { PageData } from "./$types";
  import { Store, Star, Clock, Users, ShieldAlert, ArrowRight } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let hasPendingItems = $derived(
    data.pendingReviews > 0 || data.pendingClaims > 0 || data.pendingListings > 0
  );
</script>

<svelte:head>
  <title>Admin Overview | Local Business Directory</title>
</svelte:head>

<div class="space-y-8">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">
      System Overview & Operations
    </h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      Directory health, moderation queue status, and community activity for the local area
    </p>
  </div>

  <!-- KPI Stats -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Published Listings</span>
        <div class="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Store class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.publishedListings}</p>
      <span class="text-[11px] text-muted-foreground mt-0.5 block">Live in directory</span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Pending Reviews</span>
        <div class="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
          <Star class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.pendingReviews}</p>
      <span class="text-[11px] text-amber-600 font-semibold mt-0.5 block">
        Awaiting approval
      </span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Claim Requests</span>
        <div class="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
          <Clock class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.pendingClaims}</p>
      <span class="text-[11px] text-blue-600 font-semibold mt-0.5 block">
        Ownership proof checks
      </span>
    </div>

    <div class="rounded-xl border bg-card p-5 shadow-card">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-muted-foreground">Registered Users</span>
        <div class="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
          <Users class="h-4 w-4" />
        </div>
      </div>
      <p class="text-2xl font-extrabold text-foreground mt-3">{data.totalUsers}</p>
      <span class="text-[11px] text-muted-foreground mt-0.5 block">
        Residents & merchants
      </span>
    </div>
  </div>

  <!-- Moderation Alert Card -->
  {#if hasPendingItems}
    <div class="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <ShieldAlert class="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h3 class="font-bold text-sm text-foreground">
            Items Pending Human Review
          </h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            There are {data.pendingReviews} customer reviews and {data.pendingClaims} ownership claim requests waiting in the queue.
          </p>
        </div>
      </div>

      <a
        href="/admin/moderation"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition shrink-0"
      >
        <span>Open Moderation Queue</span>
        <ArrowRight class="h-3.5 w-3.5" />
      </a>
    </div>
  {/if}
</div>
