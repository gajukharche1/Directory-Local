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
    Sparkles,
    ChevronRight,
    Building2,
    ShieldCheck
  } from "lucide-svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Sliders },
    { label: "Moderation Queue", href: "/admin/moderation", icon: ShieldAlert },
    { label: "Listings Directory", href: "/admin/listings", icon: Store },
    { label: "Media Console", href: "/admin/media", icon: ImageIcon },
    { label: "CSV Import / Export", href: "/admin/imports", icon: Upload },
  ];
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-[#F6F7FC] text-slate-800">
  <!-- Modern Admin Sidebar (Inspired by Clean Pastel Dashboard) -->
  <aside class="w-full md:w-68 bg-white border-r border-slate-200/70 flex flex-col justify-between shrink-0 shadow-[2px_0_24px_rgba(0,0,0,0.02)]">
    <div class="p-5 space-y-6">
      <!-- App Brand Header -->
      <a href="/admin" class="flex items-center gap-3 group">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
          <Building2 class="h-5 w-5" />
        </div>
        <div>
          <span class="font-extrabold tracking-tight text-sm text-slate-900 block leading-tight">
            LocalDirectory
          </span>
          <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Admin Console
          </span>
        </div>
      </a>

      <!-- Navigation Section -->
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
        <nav class="space-y-1.5">
          {#each navItems as item}
            {@const Icon = item.icon}
            {@const isActive = item.href === "/admin" ? page.url.pathname === "/admin" : page.url.pathname.startsWith(item.href)}
            <a
              href={item.href}
              class="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all {isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'}"
            >
              <div class="flex items-center gap-3">
                <Icon class="h-4 w-4 shrink-0 {isActive ? 'text-white' : 'text-slate-400'}" />
                <span>{item.label}</span>
              </div>
              {#if isActive}
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
              {/if}
            </a>
          {/each}
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

  <!-- Admin Main Content -->
  <main class="flex-1 p-5 sm:p-7 md:p-9 max-w-7xl w-full mx-auto overflow-y-auto">
    {@render children()}
  </main>
</div>
