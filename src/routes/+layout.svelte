<script lang="ts">
  import "./layout.css";
  import SkipLink from "$lib/components/ui/SkipLink.svelte";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>{data.siteSettings?.siteName || "Local Business Directory"} | {data.siteSettings?.siteTagline || "Find Top Services Nearby"}</title>
  <meta
    name="description"
    content={data.siteSettings?.siteTagline || "Discover verified local businesses, restaurants, healthcare, clinics, and professional services across your city and neighborhood."}
  />
  {#if data.siteSettings?.faviconUrl}
    <link rel="icon" href={data.siteSettings.faviconUrl} />
  {/if}
</svelte:head>

<div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500/20">
  <SkipLink />
  <div id="main-content" tabindex="-1" class="focus:outline-none">
    {@render children()}
  </div>
</div>
