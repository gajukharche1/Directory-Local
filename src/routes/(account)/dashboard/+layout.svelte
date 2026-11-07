<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { page } from "$app/state";
  import {
    LayoutDashboard,
    Store,
    Inbox,
    Star,
    CreditCard,
    LogOut,
    ArrowLeft,
  } from "lucide-svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/dashboard/listings", icon: Store },
    { label: "Leads & Enquiries", href: "/dashboard/enquiries", icon: Inbox },
    { label: "Customer Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Plan & Billing", href: "/dashboard/billing", icon: CreditCard },
  ];
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-muted/20">
  <!-- Sidebar Navigation -->
  <aside class="w-full md:w-64 border-r bg-card flex flex-col justify-between shrink-0">
    <div>
      <!-- Top Brand -->
      <div class="p-4 border-b">
        <a href="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
            PS
          </div>
          <div>
            <span class="font-bold tracking-tight text-sm text-foreground block leading-none">
              Pimple Saudagar
            </span>
            <span class="text-[10px] text-muted-foreground uppercase font-semibold">
              Owner Dashboard
            </span>
          </div>
        </a>
      </div>

      <!-- User Profile Summary -->
      <div class="p-4 border-b bg-muted/30">
        <p class="font-bold text-xs text-foreground truncate">{data.user.name}</p>
        <p class="text-[11px] text-muted-foreground truncate">{data.user.email}</p>
        <span class="inline-block mt-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
          {data.user.role} Account
        </span>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3 space-y-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          {@const isActive = item.href === "/dashboard" ? page.url.pathname === "/dashboard" : page.url.pathname.startsWith(item.href)}
          <a
            href={item.href}
            class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition {isActive
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
          >
            <Icon class="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </a>
        {/each}
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-3 border-t space-y-1">
      <a
        href="/"
        class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-muted"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Public Directory</span>
      </a>

      <a
        href="/logout"
        class="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition rounded-lg"
      >
        <LogOut class="h-3.5 w-3.5" />
        <span>Sign Out</span>
      </a>
    </div>
  </aside>

  <!-- Main Content Body -->
  <main class="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">
    {@render children()}
  </main>
</div>
