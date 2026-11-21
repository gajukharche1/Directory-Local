<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { page, navigating } from "$app/state";
  import { browser } from "$app/environment";
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
    FolderTree,
    FolderPlus,
    MapPin,
    MapPinPlus,
    PlusCircle,
    BarChart3,
    Settings,
    Layers,
    ListOrdered,
    Loader2,
    PanelLeftClose,
    PanelLeft,
    Users,
    Menu,
    X,
  } from "lucide-svelte";
  import UserProfileDropdown from "$lib/components/ui/UserProfileDropdown.svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  // Collapsible sidebar state with localStorage persistence
  let isCollapsed = $state(false);

  // Accordion state with Svelte 5 runes
  let openSections = $state<Record<string, boolean>>({
    listing: true,
    categories: false,
    locations: false,
  });

  // Mobile sidebar drawer state
  let mobileDrawerOpen = $state(false);

  // Flyout menu state for compact mode
  let hoveredItem = $state<string | null>(null);

  // Sync localStorage on mount
  $effect(() => {
    if (browser) {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved === "true") {
        isCollapsed = true;
      }
    }
  });

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

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    if (browser) {
      localStorage.setItem("admin_sidebar_collapsed", isCollapsed ? "true" : "false");
    }
  }

  function toggleSection(sectionKey: "listing" | "categories" | "locations") {
    if (isCollapsed) {
      isCollapsed = false;
      if (browser) localStorage.setItem("admin_sidebar_collapsed", "false");
    }
    openSections[sectionKey] = !openSections[sectionKey];
  }

  function isActive(href: string, exact = false) {
    if (exact || href === "/admin") {
      return page.url.pathname === href;
    }
    return page.url.pathname.startsWith(href);
  }

  function isGroupActive(prefix: string) {
    return page.url.pathname.startsWith(prefix);
  }

  function isNavigatingTo(href: string) {
    return navigating.current?.to?.url.pathname === href;
  }
</script>

<!-- Top Indeterminate Progress Rail -->
{#if navigating.current}
  <div class="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-blue-100 shadow-xs">
    <div class="h-full bg-blue-600 animate-[shimmer-wave_1.2s_infinite_ease-in-out] w-full"></div>
  </div>
{/if}

<div class="min-h-screen flex flex-col md:flex-row bg-[#F6F7FC] text-slate-800">
  <!-- Modern Admin Sidebar (Collapsible: md:w-68 expanded vs md:w-20 compact) -->
  <aside
    class="hidden md:flex bg-white border-r border-slate-200/70 flex-col justify-between shrink-0 shadow-[2px_0_24px_rgba(0,0,0,0.02)] min-h-screen sticky top-0 transition-[width] duration-300 ease-in-out {isCollapsed
      ? 'w-20'
      : 'w-68'}"
  >
    <div class="{isCollapsed ? 'p-3' : 'p-4 sm:p-5'} space-y-6">
      <!-- App Brand Header & Toggle Button -->
      <div class="flex items-center {isCollapsed ? 'justify-center' : 'justify-between'} gap-2">
        <a href="/admin" class="flex items-center gap-3 group min-w-0" title="LocalDirectory Admin">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform shrink-0"
          >
            <Building2 class="h-5 w-5" />
          </div>
          {#if !isCollapsed}
            <div class="min-w-0 animate-in fade-in duration-200">
              <span class="font-extrabold tracking-tight text-sm text-slate-900 block leading-tight truncate">
                LocalDirectory
              </span>
              <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Admin Console
              </span>
            </div>
          {/if}
        </a>

        {#if !isCollapsed}
          <button
            type="button"
            onclick={toggleSidebar}
            class="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose class="h-4 w-4" />
          </button>
        {/if}
      </div>

      {#if isCollapsed}
        <!-- Centered Expand Button in Compact Mode -->
        <div class="flex justify-center pt-1">
          <button
            type="button"
            onclick={toggleSidebar}
            class="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <PanelLeft class="h-4 w-4" />
          </button>
        </div>
      {/if}

      <!-- Navigation Section -->
      <div class="space-y-4">
        {#if !isCollapsed}
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">Navigation</p>
        {/if}

        <nav class="space-y-1">
          <!-- 1. Dashboard Link -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "dashboard" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin', true)
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "Dashboard" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <Sliders class="h-4 w-4 shrink-0 {isActive('/admin', true) ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>Dashboard</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin', true)}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            <!-- Compact Mode Hover Flyout -->
            {#if isCollapsed && hoveredItem === "dashboard"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                Dashboard
              </div>
            {/if}
          </div>

          <!-- 2. Moderation Queue Link -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "moderation" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/moderation"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/moderation')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "Moderation Queue" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin/moderation')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <ShieldAlert class="h-4 w-4 shrink-0 {isActive('/admin/moderation') ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>Moderation Queue</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/moderation')}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "moderation"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                Moderation Queue
              </div>
            {/if}
          </div>

          <!-- 3. Accordion Group: Listing -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "listing" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            {#if isCollapsed}
              <a
                href="/admin/listings"
                class="flex items-center justify-center p-3 text-xs font-semibold rounded-2xl transition-all {isGroupActive('/admin/listings')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
                title="Listings"
              >
                <Store class="h-4 w-4 shrink-0 {isGroupActive('/admin/listings') ? 'text-white' : 'text-slate-400'}" />
              </a>

              <!-- Flyout Submenu on Hover in Compact Mode -->
              {#if hoveredItem === "listing"}
                <div class="absolute left-16 top-0 z-50 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-48 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <p class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listings</p>
                  <a
                    href="/admin/listings"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/listings', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <Layers class="h-3.5 w-3.5" />
                    <span>All Listings</span>
                  </a>
                  <a
                    href="/admin/listings/new"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/listings/new', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <PlusCircle class="h-3.5 w-3.5" />
                    <span>Add New Listing</span>
                  </a>
                </div>
              {/if}
            {:else}
              <button
                type="button"
                onclick={() => toggleSection("listing")}
                class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isGroupActive('/admin/listings') && !openSections.listing
                  ? 'bg-slate-100/80 text-slate-900 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
              >
                <div class="flex items-center gap-3">
                  <Store class="h-4 w-4 shrink-0 {isGroupActive('/admin/listings') ? 'text-slate-900' : 'text-slate-400'}" />
                  <span>Listing</span>
                </div>
                <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.listing ? 'rotate-180' : ''}" />
              </button>

              <div class="grid transition-all duration-200 ease-in-out {openSections.listing ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
                <div class="overflow-hidden">
                  <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                    <a
                      href="/admin/listings"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/listings', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <Layers class="h-3.5 w-3.5 shrink-0 {isActive('/admin/listings', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>All Listing</span>
                      </div>
                      {#if isNavigatingTo('/admin/listings')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>

                    <a
                      href="/admin/listings/new"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/listings/new', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <PlusCircle class="h-3.5 w-3.5 shrink-0 {isActive('/admin/listings/new', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>Add New Listing</span>
                      </div>
                      {#if isNavigatingTo('/admin/listings/new')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- 4. Accordion Group: Categories -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "categories" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            {#if isCollapsed}
              <a
                href="/admin/categories"
                class="flex items-center justify-center p-3 text-xs font-semibold rounded-2xl transition-all {isGroupActive('/admin/categories')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
                title="Categories"
              >
                <FolderTree class="h-4 w-4 shrink-0 {isGroupActive('/admin/categories') ? 'text-white' : 'text-slate-400'}" />
              </a>

              {#if hoveredItem === "categories"}
                <div class="absolute left-16 top-0 z-50 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-48 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <p class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</p>
                  <a
                    href="/admin/categories"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/categories', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <ListOrdered class="h-3.5 w-3.5" />
                    <span>All Categories</span>
                  </a>
                  <a
                    href="/admin/categories/new"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/categories/new', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <FolderPlus class="h-3.5 w-3.5" />
                    <span>Add New Category</span>
                  </a>
                </div>
              {/if}
            {:else}
              <button
                type="button"
                onclick={() => toggleSection("categories")}
                class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isGroupActive('/admin/categories') && !openSections.categories
                  ? 'bg-slate-100/80 text-slate-900 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
              >
                <div class="flex items-center gap-3">
                  <FolderTree class="h-4 w-4 shrink-0 {isGroupActive('/admin/categories') ? 'text-slate-900' : 'text-slate-400'}" />
                  <span>Categories</span>
                </div>
                <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.categories ? 'rotate-180' : ''}" />
              </button>

              <div class="grid transition-all duration-200 ease-in-out {openSections.categories ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
                <div class="overflow-hidden">
                  <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                    <a
                      href="/admin/categories"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/categories', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <ListOrdered class="h-3.5 w-3.5 shrink-0 {isActive('/admin/categories', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>All Categories</span>
                      </div>
                      {#if isNavigatingTo('/admin/categories')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>

                    <a
                      href="/admin/categories/new"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/categories/new', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <FolderPlus class="h-3.5 w-3.5 shrink-0 {isActive('/admin/categories/new', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>Add New Category</span>
                      </div>
                      {#if isNavigatingTo('/admin/categories/new')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- 5. Accordion Group: Locations -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "locations" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            {#if isCollapsed}
              <a
                href="/admin/locations"
                class="flex items-center justify-center p-3 text-xs font-semibold rounded-2xl transition-all {isGroupActive('/admin/locations')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
                title="Locations"
              >
                <MapPin class="h-4 w-4 shrink-0 {isGroupActive('/admin/locations') ? 'text-white' : 'text-slate-400'}" />
              </a>

              {#if hoveredItem === "locations"}
                <div class="absolute left-16 top-0 z-50 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-48 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <p class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Locations</p>
                  <a
                    href="/admin/locations"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/locations', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <ListOrdered class="h-3.5 w-3.5" />
                    <span>All Locations</span>
                  </a>
                  <a
                    href="/admin/locations/new"
                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold {isActive('/admin/locations/new', true)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'}"
                  >
                    <MapPinPlus class="h-3.5 w-3.5" />
                    <span>Add New Location</span>
                  </a>
                </div>
              {/if}
            {:else}
              <button
                type="button"
                onclick={() => toggleSection("locations")}
                class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-colors cursor-pointer {isGroupActive('/admin/locations') && !openSections.locations
                  ? 'bg-slate-100/80 text-slate-900 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'}"
              >
                <div class="flex items-center gap-3">
                  <MapPin class="h-4 w-4 shrink-0 {isGroupActive('/admin/locations') ? 'text-slate-900' : 'text-slate-400'}" />
                  <span>Locations</span>
                </div>
                <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 {openSections.locations ? 'rotate-180' : ''}" />
              </button>

              <div class="grid transition-all duration-200 ease-in-out {openSections.locations ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'}">
                <div class="overflow-hidden">
                  <div class="ml-4 pl-3.5 border-l-2 border-slate-200/80 space-y-1 py-0.5">
                    <a
                      href="/admin/locations"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/locations', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <ListOrdered class="h-3.5 w-3.5 shrink-0 {isActive('/admin/locations', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>All Locations</span>
                      </div>
                      {#if isNavigatingTo('/admin/locations')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>

                    <a
                      href="/admin/locations/new"
                      class="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all {isActive('/admin/locations/new', true)
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 font-medium'}"
                    >
                      <div class="flex items-center gap-2.5">
                        <MapPinPlus class="h-3.5 w-3.5 shrink-0 {isActive('/admin/locations/new', true) ? 'text-white' : 'text-slate-400'}" />
                        <span>Add New Location</span>
                      </div>
                      {#if isNavigatingTo('/admin/locations/new')}
                        <Loader2 class="h-3 w-3 animate-spin text-blue-500" />
                      {/if}
                    </a>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- 6. CSV Import Hub -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "imports" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/imports"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/imports')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "CSV Import Hub" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin/imports')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <Upload class="h-4 w-4 shrink-0 {isActive('/admin/imports') ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>CSV Import Hub</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/imports')}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "imports"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                CSV Import Hub
              </div>
            {/if}
          </div>

          <!-- 7. Media Library -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "media" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/media"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/media')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "Media Library" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin/media')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <ImageIcon class="h-4 w-4 shrink-0 {isActive('/admin/media') ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>Media Library</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/media')}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "media"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                Media Library
              </div>
            {/if}
          </div>

          <!-- 8. Directory Analytics -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "analytics" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/analytics"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/analytics')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "Directory Analytics" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin/analytics')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <BarChart3 class="h-4 w-4 shrink-0 {isActive('/admin/analytics') ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>Directory Analytics</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/analytics')}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "analytics"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                Directory Analytics
              </div>
            {/if}
          </div>

          <!-- 9. Users & Privileges -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "users" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/settings?tab=users"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/settings') && page.url.searchParams.get('tab') === 'users'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "User" : undefined}
            >
              <div class="flex items-center gap-3">
                <Users class="h-4 w-4 shrink-0 {isActive('/admin/settings') && page.url.searchParams.get('tab') === 'users' ? 'text-white' : 'text-slate-400'}" />
                {#if !isCollapsed}
                  <span>User</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/settings') && page.url.searchParams.get('tab') === 'users'}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "users"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                User Dashboard
              </div>
            {/if}
          </div>

          <!-- 10. Site Settings -->
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? "settings" : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href="/admin/settings"
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'justify-between px-3.5 py-2.5'} text-xs font-semibold rounded-2xl transition-all {isActive('/admin/settings') && page.url.searchParams.get('tab') !== 'users'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
              title={isCollapsed ? "Site Settings" : undefined}
            >
              <div class="flex items-center gap-3">
                {#if isNavigatingTo('/admin/settings')}
                  <Loader2 class="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                {:else}
                  <Settings class="h-4 w-4 shrink-0 {isActive('/admin/settings') && page.url.searchParams.get('tab') !== 'users' ? 'text-white' : 'text-slate-400'}" />
                {/if}
                {#if !isCollapsed}
                  <span>Site & Settings</span>
                {/if}
              </div>
              {#if !isCollapsed && isActive('/admin/settings') && page.url.searchParams.get('tab') !== 'users'}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>

            {#if isCollapsed && hoveredItem === "settings"}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                Site & Directory Settings
              </div>
            {/if}
          </div>
        </nav>
      </div>
    </div>

    <!-- User Profile Footer in Sidebar -->
    <div class="{isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-100 space-y-3">
      {#if !isCollapsed}
        <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {data.user.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-xs text-slate-900 truncate leading-tight">{data.user.name}</p>
            <p class="text-[10px] text-slate-400 truncate">{data.user.email}</p>
          </div>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 uppercase tracking-wider shrink-0">
            {data.user.role || "Admin"}
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
      {:else}
        <!-- Compact Mode Sign Out Icon -->
        <div class="flex flex-col items-center gap-2 py-2">
          <a
            href="/"
            class="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Public Directory"
          >
            <ArrowLeft class="h-4 w-4" />
          </a>
          <a
            href="/logout"
            class="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <LogOut class="h-4 w-4" />
          </a>
        </div>
      {/if}
    </div>
  </aside>

  <!-- Mobile Top Nav Bar -->
  <div class="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
    <a href="/admin" class="flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white font-black text-sm">
        <Building2 class="h-4 w-4" />
      </div>
      <span class="font-extrabold text-sm text-slate-900">LocalDirectory Admin</span>
    </a>
    <button
      type="button"
      onclick={() => (mobileDrawerOpen = !mobileDrawerOpen)}
      class="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
      aria-label="Toggle Mobile Menu"
    >
      {#if mobileDrawerOpen}
        <X class="h-5 w-5" />
      {:else}
        <Menu class="h-5 w-5" />
      {/if}
    </button>
  </div>

  <!-- Mobile Drawer Menu -->
  {#if mobileDrawerOpen}
    <div class="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top-2">
      <a href="/admin" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Dashboard</a>
      <a href="/admin/moderation" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Moderation Queue</a>
      <a href="/admin/listings" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">All Listings</a>
      <a href="/admin/categories" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Categories</a>
      <a href="/admin/locations" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Locations</a>
      <a href="/admin/imports" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">CSV Import Hub</a>
      <a href="/admin/media" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Media Library</a>
      <a href="/admin/settings?tab=users" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">User</a>
      <a href="/admin/settings" onclick={() => (mobileDrawerOpen = false)} class="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Settings</a>
    </div>
  {/if}

  <!-- Main Area with Top Operational Status Bar & User Profile Dropdown -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Top Operational Status Header Bar -->
    <header class="h-16 px-4 sm:px-6 md:px-8 border-b border-slate-200/70 bg-white flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      <!-- Left: Operational Status Indicator & Quick Toggle -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={toggleSidebar}
          class="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label="Toggle Sidebar"
        >
          {#if isCollapsed}
            <PanelLeft class="h-4 w-4" />
          {:else}
            <PanelLeftClose class="h-4 w-4" />
          {/if}
        </button>

        <div class="flex items-center gap-2 sm:gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold text-slate-800 tracking-tight">Operational Status</span>
          <span class="text-slate-300">·</span>
          <span class="text-[11px] font-medium text-slate-500 hidden sm:inline">Level 2 RBAC Guard Active</span>
        </div>
      </div>

      <!-- Right: User Dropdown with 1-Click Admin Privileges Hub -->
      <UserProfileDropdown user={data.user} align="right" />
    </header>

    <!-- Admin Main Content -->
    <main class="flex-1 p-5 sm:p-7 md:p-9 max-w-7xl w-full mx-auto overflow-y-auto">
      {@render children()}
    </main>
  </div>
</div>
