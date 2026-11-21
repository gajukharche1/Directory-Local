<script lang="ts">
  import LanguageSelector from "$lib/components/ui/LanguageSelector.svelte";
  import UserProfileDropdown from "$lib/components/ui/UserProfileDropdown.svelte";
  import type { AuthenticatedUser } from "$lib/auth/session";
  import type { SiteSettingsData } from "$lib/services/settings.service";

  let {
    user,
    siteSettings,
  }: {
    user?: AuthenticatedUser | null;
    siteSettings?: Partial<SiteSettingsData> | null;
  } = $props();

  const brandName = $derived(siteSettings?.siteName || "Local Business");
  const brandTagline = $derived(siteSettings?.siteTagline || "Local Directory");
</script>

<header class="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-3">
      {#if siteSettings?.logoUrl}
        <img
          src={siteSettings.logoUrl}
          alt={brandName}
          class="h-9 w-auto max-w-[140px] object-contain rounded-xl"
        />
      {:else}
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm shrink-0">
          {brandName.slice(0, 2).toUpperCase()}
        </div>
      {/if}
      <div>
        <span class="font-extrabold tracking-tight text-base text-slate-900 block leading-none">
          {brandName}
        </span>
        <span class="text-[10px] font-semibold text-slate-400 tracking-wider uppercase line-clamp-1 max-w-xs">
          {brandTagline}
        </span>
      </div>
    </a>

    <!-- Nav Links & Actions -->
    <div class="flex items-center gap-4 sm:gap-6">
      <nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
        <a href="/search" class="hover:text-blue-600 transition">Explore Directory</a>
        <a href="/pricing" class="hover:text-blue-600 transition">Pricing Plans</a>
      </nav>

      <LanguageSelector />

      <div class="flex items-center gap-2.5">
        {#if user}
          <UserProfileDropdown {user} align="right" />
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
          class="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          + Add Business
        </a>
      </div>
    </div>
  </div>
</header>
