<script lang="ts">
  import LanguageSelector from "$lib/components/ui/LanguageSelector.svelte";
  import type { AuthenticatedUser } from "$lib/auth/session";

  let { user }: { user?: AuthenticatedUser | null } = $props();
</script>

<header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm">
        PS
      </div>
      <div>
        <span class="font-extrabold tracking-tight text-base text-slate-900 block leading-none">
          Pimple Saudagar
        </span>
        <span class="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
          Local Directory
        </span>
      </div>
    </a>

    <!-- Nav Links & Actions -->
    <div class="flex items-center gap-4 sm:gap-6">
      <nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
        <a href="/search" class="hover:text-indigo-600 transition">Explore Directory</a>
        <a href="/pricing" class="hover:text-indigo-600 transition">Pricing Plans</a>
      </nav>

      <LanguageSelector />

      <div class="flex items-center gap-2">
        {#if user}
          <a
            href={["admin", "moderator"].includes(user.role) ? "/admin" : "/dashboard"}
            class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-300 transition"
          >
            {["admin", "moderator"].includes(user.role) ? "Admin Back-Office" : "Dashboard"}
          </a>
        {:else}
          <a
            href="/login"
            class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition"
          >
            Sign In
          </a>
        {/if}

        <a
          href="/pricing"
          class="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          + Add Business
        </a>
      </div>
    </div>
  </div>
</header>
