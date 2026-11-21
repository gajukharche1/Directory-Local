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
    TrendingUp,
    ShieldCheck,
    Layers,
    FolderTree,
    MapPin,
    UploadCloud,
    AlertTriangle,
    Eye,
    Check,
    Settings,
    Activity,
    Server,
  } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  const m = $derived(data.metrics);
  const hasPendingTriage = $derived(m.totalTriage > 0);

  function formatDate(d: Date | string | null | undefined): string {
    if (!d) return "Just now";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
</script>

<svelte:head>
  <title>Admin Executive Overview | Local Directory Console</title>
</svelte:head>

<div class="space-y-7 pb-12">
  <!-- Top Welcome Header & Quick Action Buttons -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <Activity class="h-4 w-4" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">
          Executive Operations Overview
        </h1>
      </div>
      <p class="text-xs text-slate-500 mt-1 font-medium max-w-xl">
        Real-time situational dashboard for {data.siteSettings.siteName}. Monitor moderation queues, business verification claims, and catalog health.
      </p>
    </div>

    <div class="flex items-center gap-2.5 flex-wrap">
      {#if data.siteSettings.maintenanceMode}
        <a
          href="/admin/settings"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold"
        >
          <span class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Maintenance Active</span>
        </a>
      {/if}

      <a
        href="/admin/listings/new"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
      >
        <Store class="h-3.5 w-3.5" />
        <span>+ Add Listing</span>
      </a>

      <a
        href="/admin/imports"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
      >
        <UploadCloud class="h-3.5 w-3.5" />
        <span>Import CSV</span>
      </a>
    </div>
  </div>

  <!-- 4-Column Modern Executive KPI Card Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Published Listings (Primary Blue/Slate) -->
    <a
      href="/admin/listings"
      class="group relative overflow-hidden rounded-3xl p-5 border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-500 tracking-wide">
          Published Listings
        </span>
        <div class="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Store class="h-4 w-4" />
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900">{m.publishedListings}</span>
          <span class="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live
          </span>
        </div>
        <p class="text-[11px] text-slate-400">Indexed across {m.totalLocations} neighborhoods</p>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:underline">
        <span>View Catalog</span>
        <ArrowRight class="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>

    <!-- Card 2: Action Triage Queue (Amber Attention Alert) -->
    <a
      href="/admin/moderation"
      class="group relative overflow-hidden rounded-3xl p-5 border {m.totalTriage > 0 ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300' : 'border-slate-200/80 bg-white hover:border-slate-300'} hover:shadow-md transition-all flex flex-col justify-between space-y-3"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold {m.totalTriage > 0 ? 'text-amber-800' : 'text-slate-500'} tracking-wide">
          Pending Triage Queue
        </span>
        <div class="h-9 w-9 rounded-xl {m.totalTriage > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ShieldAlert class="h-4 w-4" />
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black {m.totalTriage > 0 ? 'text-amber-900' : 'text-slate-900'}">{m.totalTriage}</span>
          {#if m.totalTriage > 0}
            <span class="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Action Needed
            </span>
          {:else}
            <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Clear
            </span>
          {/if}
        </div>
        <p class="text-[11px] text-slate-400">
          {m.pendingReviews} reviews · {m.pendingClaims} claims · {m.pendingListings} drafts
        </p>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700 group-hover:underline">
        <span>Open Moderation</span>
        <ArrowRight class="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>

    <!-- Card 3: Directory Taxonomy & Media Assets (Emerald Asset Theme) -->
    <a
      href="/admin/categories"
      class="group relative overflow-hidden rounded-3xl p-5 border border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-500 tracking-wide">
          Taxonomy & Categories
        </span>
        <div class="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FolderTree class="h-4 w-4" />
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900">{m.totalCategories}</span>
          <span class="text-xs font-semibold text-emerald-700">Categories</span>
        </div>
        <p class="text-[11px] text-slate-400">{m.totalMedia} Cloud media assets stored</p>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700 group-hover:underline">
        <span>Manage Taxonomy</span>
        <ArrowRight class="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>

    <!-- Card 4: Registered Users & RBAC (Purple Audience Theme) -->
    <a
      href="/admin/settings?tab=users"
      class="group relative overflow-hidden rounded-3xl p-5 border border-slate-200/80 bg-white hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-500 tracking-wide">
          Registered Accounts
        </span>
        <div class="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Users class="h-4 w-4" />
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900">{m.totalUsers}</span>
          <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
            Directory
          </span>
        </div>
        <p class="text-[11px] text-slate-400">Admins, merchants, and visitors</p>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700 group-hover:underline">
        <span>User Dashboard</span>
        <ArrowRight class="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>
  </div>

  <!-- Operational Health Banner & System Integrity -->
  <div class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
        <ShieldCheck class="h-5 w-5" />
      </div>
      <div>
        <h3 class="text-xs font-black text-slate-900 flex items-center gap-2">
          <span>PostgreSQL & Prisma Engine Healthy</span>
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </h3>
        <p class="text-[11px] text-slate-500 mt-0.5">
          Currency: <strong>{data.siteSettings.currencySymbol} ({data.siteSettings.currencyCode})</strong> · Search Radius: <strong>{data.siteSettings.defaultRadiusKm} km</strong> · Level 2 ASVS RBAC Active
        </p>
      </div>
    </div>

    <a
      href="/admin/settings"
      class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition self-start sm:self-auto"
    >
      <Settings class="h-3.5 w-3.5 text-slate-600" />
      <span>System Settings</span>
    </a>
  </div>

  <!-- Main 2-Column Section: Triage Queue & Recent Listings -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Left Column: Pending Triage Items (Reviews & Claims) -->
    <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <ShieldAlert class="h-4 w-4 text-amber-600" />
          <h2 class="text-sm font-extrabold text-slate-900">Pending Triage Items</h2>
        </div>
        <a href="/admin/moderation" class="text-xs font-bold text-blue-600 hover:underline">
          View All ({m.totalTriage})
        </a>
      </div>

      {#if !hasPendingTriage}
        <div class="py-10 text-center space-y-2">
          <div class="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 class="h-6 w-6" />
          </div>
          <p class="text-xs font-black text-slate-800">All Queues Completely Clear</p>
          <p class="text-[11px] text-slate-400 max-w-xs mx-auto">
            No customer reviews, merchant claims, or listing submissions are currently awaiting approval.
          </p>
        </div>
      {:else}
        <div class="space-y-3">
          <!-- Pending Reviews Slice -->
          {#each data.pendingReviewItems as review}
            <div class="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-3">
              <div class="space-y-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs text-slate-900 truncate">{review.authorName}</span>
                  <span class="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                    ★ {review.rating}/5
                  </span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-1 italic">"{review.comment}"</p>
                <p class="text-[10px] text-slate-400">For listing: {review.listing.title}</p>
              </div>

              <a
                href="/admin/moderation"
                class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shrink-0"
              >
                Review
              </a>
            </div>
          {/each}

          <!-- Pending Claims Slice -->
          {#each data.pendingClaimItems as claim}
            <div class="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/70 flex items-start justify-between gap-3">
              <div class="space-y-1 min-w-0">
                <span class="font-bold text-xs text-slate-900 truncate block">Business Claim: {claim.businessName}</span>
                <p class="text-[11px] text-slate-500 font-mono">Claimant: {claim.claimantName} ({claim.claimantEmail})</p>
              </div>

              <a
                href="/admin/moderation"
                class="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shrink-0 shadow-xs"
              >
                Verify
              </a>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Right Column: Recent Additions & Directory Activity -->
    <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <Store class="h-4 w-4 text-slate-900" />
          <h2 class="text-sm font-extrabold text-slate-900">Recently Onboarded Businesses</h2>
        </div>
        <a href="/admin/listings" class="text-xs font-bold text-blue-600 hover:underline">
          All Listings ({m.publishedListings})
        </a>
      </div>

      <div class="space-y-2.5">
        {#each data.recentListings as listing}
          <div class="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                {listing.title?.charAt(0) || "B"}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-xs text-slate-900 truncate">{listing.title}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] text-slate-400 font-medium">{listing.locality || "Local"}</span>
                  {#if listing.categories?.[0]?.category?.name}
                    <span class="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold truncate">
                      {listing.categories[0].category.name}
                    </span>
                  {/if}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full {listing.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                {listing.status}
              </span>
              <a
                href="/listings/{listing.slug}"
                target="_blank"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition"
                title="View Public Storefront"
              >
                <Eye class="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
