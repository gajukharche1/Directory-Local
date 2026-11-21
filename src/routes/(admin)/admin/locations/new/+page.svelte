<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import { MapPin, ArrowLeft, Check, Sparkles, Compass } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let nameValue = $state("");
  let slugValue = $state("");
  let isSubmitting = $state(false);

  function handleNameChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    nameValue = val;
    slugValue = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
</script>

<svelte:head>
  <title>Add New Location | Local Directory Admin</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
  <!-- Header -->
  <div class="space-y-1">
    <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
      <a href="/admin/locations" class="hover:text-slate-900 transition-colors flex items-center gap-1">
        <ArrowLeft class="h-3.5 w-3.5" /> Back to Locations
      </a>
      <span>/</span>
      <span class="text-slate-900 font-semibold">New Location</span>
    </div>
    <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
      <MapPin class="h-6 w-6 text-slate-900" />
      Create Location Hub
    </h1>
    <p class="text-xs text-slate-500">
      Define a neighborhood, commercial zone, or landmark for geographical indexing.
    </p>
  </div>

  {#if form?.error}
    <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      {form.error}
    </div>
  {/if}

  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ update }) => {
        isSubmitting = false;
        await update();
      };
    }}
    class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-5"
  >
    <div class="space-y-1.5">
      <label for="name" class="text-xs font-bold text-slate-700">
        Location / Neighborhood Name <span class="text-rose-500">*</span>
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        bind:value={nameValue}
        oninput={handleNameChange}
        placeholder="e.g. Pimple Saudagar"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
      />
    </div>

    <div class="space-y-1.5">
      <label for="slug" class="text-xs font-bold text-slate-700">
        URL Slug <span class="text-slate-400 font-normal">(auto-generated)</span>
      </label>
      <input
        id="slug"
        name="slug"
        type="text"
        bind:value={slugValue}
        placeholder="pimple-saudagar"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
      />
    </div>

    <div class="space-y-1.5">
      <label for="parentId" class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Compass class="h-3.5 w-3.5 text-slate-400" /> Parent City / Zone (Optional)
      </label>
      <select
        id="parentId"
        name="parentId"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
      >
        <option value="">— None (Root City / Territory) —</option>
        {#each data.parentLocations as parent}
          <option value={parent.id}>{parent.name}</option>
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label for="latitude" class="text-xs font-bold text-slate-700">Latitude (Optional)</label>
        <input
          id="latitude"
          name="latitude"
          type="number"
          step="0.00000001"
          placeholder="18.5987"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>

      <div class="space-y-1.5">
        <label for="longitude" class="text-xs font-bold text-slate-700">Longitude (Optional)</label>
        <input
          id="longitude"
          name="longitude"
          type="number"
          step="0.00000001"
          placeholder="73.7978"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>
    </div>

    <div class="space-y-1.5">
      <label for="description" class="text-xs font-bold text-slate-700">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows="3"
        placeholder="Short description of this locality or commercial region..."
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium resize-none"
      ></textarea>
    </div>

    <div class="pt-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
      <div class="space-y-0.5">
        <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sparkles class="h-3.5 w-3.5 text-amber-500" /> Featured Location
        </span>
        <p class="text-[11px] text-slate-500">Show this neighborhood on homepage location quick filters.</p>
      </div>
      <input
        type="checkbox"
        id="featured"
        name="featured"
        class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
      />
    </div>

    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <a
        href="/admin/locations"
        class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
      >
        Cancel
      </a>
      <button
        type="submit"
        disabled={isSubmitting}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
      >
        {#if isSubmitting}
          <span class="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Creating...</span>
        {:else}
          <Check class="h-4 w-4" />
          <span>Save Location</span>
        {/if}
      </button>
    </div>
  </form>
</div>
