<script lang="ts">
  import "./layout.css";
  import SkipLink from "$lib/components/ui/SkipLink.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>Local Business Directory | Find Top Services Nearby</title>
  <meta
    name="description"
    content="Discover verified local businesses, restaurants, healthcare, clinics, and professional services across your city and neighborhood."
  />
</svelte:head>

<div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500/20">
  <SkipLink />
  <div id="main-content" tabindex="-1" class="focus:outline-none">
    {@render children()}
  </div>
</div>
