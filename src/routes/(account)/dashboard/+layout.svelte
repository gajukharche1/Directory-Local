<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { page } from "$app/state";
  import { browser } from "$app/environment";
  import {
    LayoutDashboard,
    Store,
    Inbox,
    Star,
    CreditCard,
    LogOut,
    ArrowLeft,
    Image as ImageIcon,
    PanelLeftClose,
    PanelLeft,
    Building2,
    Shield,
    BarChart3,
  } from "lucide-svelte";
  import UserProfileDropdown from "$lib/components/ui/UserProfileDropdown.svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let isCollapsed = $state(false);
  let hoveredItem = $state<string | null>(null);

  $effect(() => {
    if (browser) {
      const saved = localStorage.getItem("merchant_sidebar_collapsed");
      if (saved === "true") {
        isCollapsed = true;
      }
    }
  });

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    if (browser) {
      localStorage.setItem("merchant_sidebar_collapsed", isCollapsed ? "true" : "false");
    }
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/dashboard/listings", icon: Store },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Media Manager", href: "/dashboard/media", icon: ImageIcon },
    { label: "Leads & Enquiries", href: "/dashboard/enquiries", icon: Inbox },
    { label: "Customer Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Plan & Billing", href: "/dashboard/billing", icon: CreditCard },
  ];
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-slate-800">
  <!-- Sidebar Navigation (Collapsible: md:w-64 expanded vs md:w-20 compact) -->
  <aside
    class="hidden md:flex bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 shadow-[2px_0_24px_rgba(0,0,0,0.02)] min-h-screen sticky top-0 transition-[width] duration-300 ease-in-out {isCollapsed
      ? 'w-20'
      : 'w-64'}"
  >
    <div>
      <!-- Top Brand & Collapse Toggle -->
      <div class="p-4 border-b border-slate-100 flex items-center {isCollapsed ? 'justify-center' : 'justify-between'}">
        <a href="/" class="flex items-center gap-2.5">
          {#if page.data.siteSettings?.logoUrl}
            <div class="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-xs">
              <img
                src={page.data.siteSettings.logoUrl}
                alt={page.data.siteSettings.siteName || "Brand Logo"}
                class="max-h-full max-w-full object-contain"
              />
            </div>
          {:else}
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm shrink-0">
              <Building2 class="h-4 w-4" />
            </div>
          {/if}
          {#if !isCollapsed}
            <div class="min-w-0">
              <span class="font-extrabold tracking-tight text-sm text-slate-900 block leading-none truncate">
                {page.data.siteSettings?.siteName || "Local Business"}
              </span>
              <span class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Owner Dashboard
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
        <div class="flex justify-center pt-2">
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

      <!-- Navigation Links -->
      <nav class="p-3 space-y-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          {@const isActive = item.href === "/dashboard" ? page.url.pathname === "/dashboard" : page.url.pathname.startsWith(item.href)}
          <div
            class="relative"
            onmouseenter={() => (hoveredItem = isCollapsed ? item.href : null)}
            onmouseleave={() => (hoveredItem = null)}
          >
            <a
              href={item.href}
              class="flex items-center {isCollapsed
                ? 'justify-center p-3'
                : 'gap-3 px-3.5 py-2.5'} text-xs font-semibold rounded-xl transition {isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}"
              title={isCollapsed ? item.label : undefined}
            >
              <Icon class="h-4 w-4 shrink-0" />
              {#if !isCollapsed}
                <span>{item.label}</span>
              {/if}
            </a>

            <!-- Compact Mode Hover Tooltip -->
            {#if isCollapsed && hoveredItem === item.href}
              <div class="absolute left-16 top-0 z-50 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                {item.label}
              </div>
            {/if}
          </div>
        {/each}
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-3 border-t border-slate-100 space-y-1">
      {#if !isCollapsed}
        <a
          href="/"
          class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft class="h-3.5 w-3.5" />
          <span>Public Directory</span>
        </a>

        <a
          href="/logout"
          class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition rounded-xl"
        >
          <LogOut class="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </a>
      {:else}
        <div class="flex flex-col items-center gap-2 py-1">
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

  <!-- Main Content Wrapper with Top Header -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Merchant Top Header Bar -->
    <header class="h-16 px-5 sm:px-7 md:px-8 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={toggleSidebar}
          class="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {#if isCollapsed}
            <PanelLeft class="h-4 w-4" />
          {:else}
            <PanelLeftClose class="h-4 w-4" />
          {/if}
        </button>

        <div>
          <span class="text-xs font-bold text-slate-900 block leading-tight">Merchant Portal</span>
          <span class="text-[11px] text-slate-400 font-medium">Manage listings, leads, and store profile</span>
        </div>
      </div>

      <!-- User Profile Dropdown with 1-Click Admin Privileges launcher -->
      <UserProfileDropdown user={data.user} align="right" />
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 p-5 sm:p-7 md:p-9 max-w-6xl w-full mx-auto overflow-y-auto">
      {@render children()}
    </main>
  </div>
</div>
