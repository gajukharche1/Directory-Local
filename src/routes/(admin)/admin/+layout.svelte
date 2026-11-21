<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { page } from "$app/state";
  import {
    Sliders,
    ShieldAlert,
    Store,
    Upload,
    ArrowLeft,
    LogOut,
    Image as ImageIcon,
    ChevronDown,
    Building2,
    ShieldCheck,
    FolderTree,
    FolderPlus,
    MapPin,
    MapPinPlus,
    PlusCircle,
    BarChart3,
    Settings,
    Layers,
    ListOrdered,
    ExternalLink
  } from "lucide-svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  // Accordion state with Svelte 5 runes
  let openSections = $state<Record<string, boolean>>({
    listing: true,
    categories: false,
    locations: false
  });

  // Top header user menu dropdown state
  let userMenuOpen = $state(false);

  // Auto-expand accordion when a child route is active
  $effect(() => {
    const pathname = page.url.pathname;
    if (pathname.startsWith("/admin/listings")) {
      openSections.listing = true;
    }
    if (pathname.startsWith("/admin/categories")) {
      openSections.categories = true;
    }
    if (pathname.startsWith("/admin/locations")) {
      openSections.locations = true;
    }
  });

  function toggleSection(sectionKey: "listing" | "categories" | "locations") {
    openSections[sectionKey] = !openSections[sectionKey];
  }
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-[#F6F7FC] text-slate-800">
  <!-- Modern Admin Sidebar (Inspired by Clean Pastel Dashboard & Reference UI) -->
  <aside class="w-full md:w-68 bg-white border-r border-slate-200/70 flex flex-col justify-between shrink-0 shadow-[2px_0_24px_rgba(0,0,0,0.02)] min-h-screen">
    <div class="p-4 sm:p-5 space-y-6">
      <!-- App Brand Header -->
      <a href="/admin" class="flex items-center gap-3 group">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
          <Building2 class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <span class="font-extrabold tracking-tight text-sm text-slate-900 block leading-tight truncate">
            LocalDirectory
          </span>
          <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Admin Console
          </span>
        </div>
      </a>

      <!-- Navigation Section -->
      <div class="space-y-4">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">Navigation</p>
        
        <nav class="space-y-1">
          <!-- 1. Dashboard Link -->
          {@const isDashboardActive = page.url.pathname === "/admin"}
          <a
            href="/admin"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isDashboardActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <Sliders class="h-4 w-4 shrink-0 {isDashboardActive ? 'text-white' : 'text-slate-400'}" />
              <span>Dashboard</span>
            </div>
            {#if isDashboardActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>

          <!-- 2. Moderation Queue Link -->
          {@const isModerationActive = page.url.pathname.startsWith("/admin/moderation")}
          <a
            href="/admin/moderation"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isModerationActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <ShieldAlert class="h-4 w-4 shrink-0 {isModerationActive ? 'text-white' : 'text-slate-400'}" />
              <span>Moderation Queue</span>
            </div>
            {#if isModerationActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>

          <!-- 3. Accordion Group: Listing -->
          {@const isListingGroupActive = page.url.pathname.startsWith("/admin/listings")}
          <div>
            <button
              type="button"
              onclick={() => toggleSection("listing")}
              class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isListingGroupActive && !openSections.listing
                ? 'bg-slate-100/80 text-slate-900 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
            >
              <div class="flex items-center gap-3">
                <Store class="h-4 w-4 shrink-0 {isListingGroupActive ? 'text-slate-900' : 'text-slate-400'}" />
                <span>Listing</span>
              </div>
              <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.listing ? 'rotate-180' : ''}" />
            </button>

            <!-- Collapsible Submenu -->
            <div class="grid transition-all duration-200 ease-in-out {openSections.listing ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
              <div class="overflow-hidden">
                <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                  {@const isAllListingActive = page.url.pathname === "/admin/listings"}
                  <a
                    href="/admin/listings"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isAllListingActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <Layers class="h-3.5 w-3.5 shrink-0 {isAllListingActive ? 'text-white' : 'text-slate-400'}" />
                    <span>All Listing</span>
                  </a>

                  {@const isNewListingActive = page.url.pathname === "/admin/listings/new"}
                  <a
                    href="/admin/listings/new"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isNewListingActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <PlusCircle class="h-3.5 w-3.5 shrink-0 {isNewListingActive ? 'text-white' : 'text-slate-400'}" />
                    <span>Add New Listing</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Accordion Group: Categories -->
          {@const isCategoriesGroupActive = page.url.pathname.startsWith("/admin/categories")}
          <div>
            <button
              type="button"
              onclick={() => toggleSection("categories")}
              class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isCategoriesGroupActive && !openSections.categories
                ? 'bg-slate-100/80 text-slate-900 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
            >
              <div class="flex items-center gap-3">
                <FolderTree class="h-4 w-4 shrink-0 {isCategoriesGroupActive ? 'text-slate-900' : 'text-slate-400'}" />
                <span>Categories</span>
              </div>
              <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.categories ? 'rotate-180' : ''}" />
            </button>

            <!-- Collapsible Submenu -->
            <div class="grid transition-all duration-200 ease-in-out {openSections.categories ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
              <div class="overflow-hidden">
                <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                  {@const isAllCatActive = page.url.pathname === "/admin/categories"}
                  <a
                    href="/admin/categories"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isAllCatActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <ListOrdered class="h-3.5 w-3.5 shrink-0 {isAllCatActive ? 'text-white' : 'text-slate-400'}" />
                    <span>All Categories</span>
                  </a>

                  {@const isNewCatActive = page.url.pathname === "/admin/categories/new"}
                  <a
                    href="/admin/categories/new"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isNewCatActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <FolderPlus class="h-3.5 w-3.5 shrink-0 {isNewCatActive ? 'text-white' : 'text-slate-400'}" />
                    <span>Add New Category</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Accordion Group: Locations -->
          {@const isLocationsGroupActive = page.url.pathname.startsWith("/admin/locations")}
          <div>
            <button
              type="button"
              onclick={() => toggleSection("locations")}
              class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isLocationsGroupActive && !openSections.locations
                ? 'bg-slate-100/80 text-slate-900 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
            >
              <div class="flex items-center gap-3">
                <MapPin class="h-4 w-4 shrink-0 {isLocationsGroupActive ? 'text-slate-900' : 'text-slate-400'}" />
                <span>Locations</span>
              </div>
              <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.locations ? 'rotate-180' : ''}" />
            </button>

            <!-- Collapsible Submenu -->
            <div class="grid transition-all duration-200 ease-in-out {openSections.locations ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
              <div class="overflow-hidden">
                <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                  {@const isAllLocActive = page.url.pathname === "/admin/locations"}
                  <a
                    href="/admin/locations"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isAllLocActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <ListOrdered class="h-3.5 w-3.5 shrink-0 {isAllLocActive ? 'text-white' : 'text-slate-400'}" />
                    <span>All Locations</span>
                  </a>

                  {@const isNewLocActive = page.url.pathname === "/admin/locations/new"}
                  <a
                    href="/admin/locations/new"
                    class="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all {isNewLocActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                  >
                    <MapPinPlus class="h-3.5 w-3.5 shrink-0 {isNewLocActive ? 'text-white' : 'text-slate-400'}" />
                    <span>Add New Location</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. CSV Import / Export -->
          {@const isImportsActive = page.url.pathname.startsWith("/admin/imports")}
          <a
            href="/admin/imports"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isImportsActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <Upload class="h-4 w-4 shrink-0 {isImportsActive ? 'text-white' : 'text-slate-400'}" />
              <span>CSV Import / Export</span>
            </div>
            {#if isImportsActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>

          <!-- 7. Media Library -->
          {@const isMediaActive = page.url.pathname.startsWith("/admin/media")}
          <a
            href="/admin/media"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isMediaActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <ImageIcon class="h-4 w-4 shrink-0 {isMediaActive ? 'text-white' : 'text-slate-400'}" />
              <span>Media Library</span>
            </div>
            {#if isMediaActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>

          <!-- 8. Directory Analytics -->
          {@const isAnalyticsActive = page.url.pathname.startsWith("/admin/analytics")}
          <a
            href="/admin/analytics"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isAnalyticsActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <BarChart3 class="h-4 w-4 shrink-0 {isAnalyticsActive ? 'text-white' : 'text-slate-400'}" />
              <span>Directory Analytics</span>
            </div>
            {#if isAnalyticsActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>

          <!-- 9. Site & Settings -->
          {@const isSettingsActive = page.url.pathname.startsWith("/admin/settings")}
          <a
            href="/admin/settings"
            class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isSettingsActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
          >
            <div class="flex items-center gap-3">
              <Settings class="h-4 w-4 shrink-0 {isSettingsActive ? 'text-white' : 'text-slate-400'}" />
              <span>Site & Settings</span>
            </div>
            {#if isSettingsActive}
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            {/if}
          </a>
        </nav>
      </div>
    </div>

    <!-- User Profile & Quick Actions Footer -->
    <div class="p-4 border-t border-slate-100 space-y-3">
      <!-- User Profile Capsule -->
      <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
        <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
          {data.user.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-xs text-slate-900 truncate leading-tight">{data.user.name}</p>
          <p class="text-[10px] text-slate-400 truncate">{data.user.email}</p>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 uppercase tracking-wider shrink-0">
          Admin
        </span>
      </div>

      <div class="flex items-center gap-2 pt-1 text-xs">
        <a
          href="/"
          class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-[11px] font-medium"
        >
          <ArrowLeft class="h-3.5 w-3.5" />
          <span>Public Site</span>
        </a>

        <a
          href="/logout"
          class="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </aside>

  <!-- Main Area with Top Operational Status Bar -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top Operational Status Header Bar -->
    <header class="h-16 px-5 sm:px-7 md:px-9 border-b border-slate-200/70 bg-white flex items-center justify-between shrink-0 sticky top-0 z-30">
      <!-- Left: Operational Status Indicator -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-xs font-bold text-slate-800 tracking-tight">Operational Status</span>
        <span class="text-slate-300">·</span>
        <span class="text-[11px] font-medium text-slate-500 hidden sm:inline">Level 2 RBAC Guard Active</span>
      </div>

      <!-- Right: User Dropdown Capsule -->
      <div class="relative">
        <button
          type="button"
          onclick={() => (userMenuOpen = !userMenuOpen)}
          class="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer group shadow-2xs"
          aria-expanded={userMenuOpen}
        >
          <div class="h-7 w-7 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
            {data.user.name?.slice(0, 2)?.toUpperCase() || "DA"}
          </div>
          <div class="text-left hidden md:block">
            <p class="text-xs font-bold text-slate-900 leading-tight">
              {data.user.name || "Directory Admin"}
            </p>
          </div>
          <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">
            ADMIN
          </span>
          <ChevronDown class="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 {userMenuOpen ? 'rotate-180' : ''}" />
        </button>

        {#if userMenuOpen}
          <!-- Backdrop -->
          <button
            type="button"
            tabindex="-1"
            aria-label="Close user menu"
            class="fixed inset-0 z-40 cursor-default bg-transparent"
            onclick={() => (userMenuOpen = false)}
          ></button>

          <!-- Dropdown Menu -->
          <div class="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="font-bold text-slate-900">{data.user.name}</p>
              <p class="text-[11px] text-slate-400 truncate">{data.user.email}</p>
            </div>
            <div class="p-1 space-y-0.5">
              <a
                href="/"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              >
                <ArrowLeft class="h-3.5 w-3.5 text-slate-400" />
                <span>Public Directory</span>
              </a>
              <a
                href="/admin/settings"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              >
                <Settings class="h-3.5 w-3.5 text-slate-400" />
                <span>Site & Settings</span>
              </a>
              <a
                href="/logout"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold"
              >
                <LogOut class="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        {/if}
      </div>
    </header>

    <!-- Admin Main Content -->
    <main class="flex-1 p-5 sm:p-7 md:p-9 max-w-7xl w-full mx-auto overflow-y-auto">
      {@render children()}
    </main>
  </div>
</div>
