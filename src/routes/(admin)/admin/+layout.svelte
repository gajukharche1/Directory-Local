<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { page } from "$app/state";
  import { Sliders, ShieldAlert, Store, Upload, ArrowLeft, LogOut } from "lucide-svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  const navItems = [
    { label: "Dashboard & Health", href: "/admin", icon: Sliders },
    { label: "Moderation Queue", href: "/admin/moderation", icon: ShieldAlert },
    { label: "Listings Directory", href: "/admin/listings", icon: Store },
    { label: "CSV Import / Export", href: "/admin/imports", icon: Upload },
  ];
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-muted/20">
  <!-- Admin Sidebar -->
  <aside class="w-full md:w-64 border-r bg-card flex flex-col justify-between shrink-0">
    <div>
      <!-- Header -->
      <div class="p-4 border-b">
        <a href="/admin" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm">
            PS
          </div>
          <div>
            <span class="font-bold tracking-tight text-sm text-foreground block leading-none">
              Local Business
            </span>
            <span class="text-[10px] text-red-600 uppercase font-bold tracking-wider">
              Admin Console
            </span>
          </div>
        </a>
      </div>

      <!-- Admin User Info -->
      <div class="p-4 border-b bg-muted/30">
        <p class="font-bold text-xs text-foreground truncate">{data.user.name}</p>
        <p class="text-[11px] text-muted-foreground truncate">{data.user.email}</p>
        <span class="inline-block mt-1.5 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full uppercase">
          {data.user.role} Privilege
        </span>
      </div>

      <!-- Nav Items -->
      <nav class="p-3 space-y-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          {@const isActive = item.href === "/admin" ? page.url.pathname === "/admin" : page.url.pathname.startsWith(item.href)}
          <a
            href={item.href}
            class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition {isActive
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
          >
            <Icon class="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </a>
        {/each}
      </nav>
    </div>

    <!-- Footer -->
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

  <!-- Admin Main Content -->
  <main class="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">
    {@render children()}
  </main>
</div>
