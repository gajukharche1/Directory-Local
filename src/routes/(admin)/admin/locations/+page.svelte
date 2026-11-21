<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import type { PageData } from "./$types";
  import {
    MapPin,
    Plus,
    Search,
    Sparkles,
    Layers,
    Compass,
    ExternalLink,
    Edit,
    Trash2,
    Check,
    CheckCircle2
  } from "lucide-svelte";
  import { createBulkSelection } from "$lib/components/ui/bulk-select/bulk-select.svelte";
  import BulkSelectCheckbox from "$lib/components/ui/bulk-select/BulkSelectCheckbox.svelte";
  import BulkSelectToolbar from "$lib/components/ui/bulk-select/BulkSelectToolbar.svelte";
  import BulkConfirmModal from "$lib/components/ui/bulk-select/BulkConfirmModal.svelte";
  import Pagination from "$lib/components/ui/Pagination.svelte";

  let { data }: { data: PageData } = $props();

  const selection = createBulkSelection();
  let visibleIds = $derived(data.locations.map((l) => l.id));

  let showDeleteModal = $state(false);
  let isProcessing = $state(false);
  let feedbackMessage = $state("");
  let searchQuery = $state(data.query || "");

  let filteredLocations = $derived(
    data.locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.parent?.name && loc.parent.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  async function handleBulkDelete() {
    isProcessing = true;
    const formData = new FormData();
    formData.set("ids", JSON.stringify(selection.selectedArray));

    try {
      const response = await fetch("?/bulkDelete", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showDeleteModal = false;
        selection.deselectAll();
        feedbackMessage = "Selected locations deleted successfully";
        await invalidateAll();
        setTimeout(() => (feedbackMessage = ""), 4000);
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>Manage Locations | Local Directory Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Feedback Banner -->
  {#if feedbackMessage}
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
      <div class="flex items-center gap-2">
        <Check class="h-4 w-4 text-emerald-600" />
        <span>{feedbackMessage}</span>
      </div>
      <button
        type="button"
        class="text-xs text-emerald-600 hover:text-emerald-900 font-bold"
        onclick={() => (feedbackMessage = "")}
      >
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Header with Add Action -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <MapPin class="h-6 w-6 text-slate-900" />
        Geographic Locations & Hubs
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Configure neighborhoods, commercial hubs, landmarks, and spatial coordinates.
      </p>
    </div>

    <a
      href="/admin/locations/new"
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
    >
      <Plus class="h-4 w-4" />
      <span>Add New Location</span>
    </a>
  </div>

  <!-- Metric KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Total Locations -->
    <div class="rounded-3xl p-5 border border-emerald-100 bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-emerald-900/70">Total Hubs</span>
        <p class="text-2xl font-black text-slate-900">{data.totalLocations}</p>
        <span class="text-[10px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          All Zones
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-200/60">
        <MapPin class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Root Cities / Neighborhoods -->
    <div class="rounded-3xl p-5 border border-indigo-100 bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-indigo-900/70">Primary Hubs</span>
        <p class="text-2xl font-black text-slate-900">{data.rootLocationsCount}</p>
        <span class="text-[10px] font-semibold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          Top-Level Hubs
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-xs border border-indigo-200/60">
        <Compass class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 3: Featured Locations -->
    <div class="rounded-3xl p-5 border border-amber-100 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-amber-900/70">Featured Hubs</span>
        <p class="text-2xl font-black text-slate-900">{data.featuredCount}</p>
        <span class="text-[10px] font-semibold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          Quick Access
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60">
        <Sparkles class="h-5 w-5" />
      </div>
    </div>
  </div>

  <!-- Search Filter -->
  <form method="GET" class="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex items-center gap-2">
    <Search class="h-4 w-4 text-slate-400 ml-2 shrink-0" />
    <input
      type="text"
      name="q"
      bind:value={searchQuery}
      placeholder="Search locations by neighborhood name, slug or parent zone (Press Enter to search all)..."
      class="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
    />
    {#if searchQuery}
      <a
        href="/admin/locations"
        class="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
        onclick={() => (searchQuery = "")}
      >
        Clear
      </a>
    {/if}
  </form>

  <!-- Locations Table Card -->
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600 border-collapse">
        <thead>
          <tr class="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th class="py-3.5 px-4 w-12 text-center">
              <BulkSelectCheckbox
                checked={selection.isAllSelected(visibleIds)}
                indeterminate={selection.isIndeterminate(visibleIds)}
                ariaLabel="Select all locations on page"
                onchange={() => selection.toggleAll(visibleIds)}
              />
            </th>
            <th class="py-3.5 px-5">Location Name</th>
            <th class="py-3.5 px-4">Slug</th>
            <th class="py-3.5 px-4">Parent Zone</th>
            <th class="py-3.5 px-4">Coordinates (Lat, Long)</th>
            <th class="py-3.5 px-4 text-center">Listings</th>
            <th class="py-3.5 px-4 text-center">Featured</th>
            <th class="py-3.5 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 font-medium">
          {#if filteredLocations.length === 0}
            <tr>
              <td colspan="8" class="py-12 text-center text-slate-400 text-xs">
                No locations match your search.
              </td>
            </tr>
          {:else}
            {#each filteredLocations as location, index}
              <tr
                class="hover:bg-slate-50/80 transition-colors {selection.isSelected(location.id) ? 'bg-indigo-50/40' : ''}"
              >
                <td class="py-3.5 px-4 text-center">
                  <BulkSelectCheckbox
                    checked={selection.isSelected(location.id)}
                    ariaLabel={`Select ${location.name}`}
                    onchange={(e) => {
                      selection.toggle(location.id, {
                        range: (e as any).shiftKey,
                        allIds: visibleIds,
                        currentIndex: index,
                      });
                    }}
                  />
                </td>
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      {location.name.charAt(0)}
                    </div>
                    <div>
                      <span class="font-bold text-slate-900 block leading-tight">{location.name}</span>
                      {#if location.description}
                        <span class="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{location.description}</span>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                  {location.slug}
                </td>
                <td class="py-3.5 px-4">
                  {#if location.parent}
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {location.parent.name}
                    </span>
                  {:else}
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      City Root
                    </span>
                  {/if}
                </td>
                <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                  {#if location.latitude && location.longitude}
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  {:else}
                    <span class="text-slate-400 font-sans italic text-[10px]">Unset</span>
                  {/if}
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-900">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                    {location.listingCount}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  {#if location.featured}
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Sparkles class="h-2.5 w-2.5 text-amber-500" /> Yes
                    </span>
                  {:else}
                    <span class="text-[11px] text-slate-400">—</span>
                  {/if}
                </td>
                <td class="py-3.5 px-5 text-right">
                  <div class="inline-flex items-center gap-1">
                    <a
                      href="/admin/locations/{location.id}"
                      class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors inline-flex"
                      title="Edit Location & SEO"
                    >
                      <Edit class="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="/locations/{location.slug}"
                      target="_blank"
                      class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors inline-flex"
                      title="View public location page"
                    >
                      <ExternalLink class="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <Pagination
      currentPage={data.page}
      totalPages={data.totalPages}
      totalItems={data.totalLocations}
      pageSize={data.pageSize}
      baseUrl="/admin/locations"
      extraParams={{ q: data.query }}
    />
  </div>

  <!-- Bulk Selection Action Dock Toolbar -->
  <BulkSelectToolbar
    selectedCount={selection.selectedCount}
    totalCount={visibleIds.length}
    entityName="locations"
    onClear={() => selection.deselectAll()}
  >
    {#snippet actions()}
      <!-- Bulk Feature -->
      <form
        method="POST"
        action="?/bulkFeature"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected locations marked as featured";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="featured" value="true" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles class="h-3.5 w-3.5" />
          <span>Feature All</span>
        </button>
      </form>

      <!-- Bulk Unfeature -->
      <form
        method="POST"
        action="?/bulkFeature"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected locations unfeatured";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="featured" value="false" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        >
          <Sparkles class="h-3.5 w-3.5 text-slate-400" />
          <span>Unfeature All</span>
        </button>
      </form>

      <!-- Bulk Delete Trigger Button -->
      <button
        type="button"
        onclick={() => (showDeleteModal = true)}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
      >
        <Trash2 class="h-3.5 w-3.5" />
        <span>Delete</span>
      </button>
    {/snippet}
  </BulkSelectToolbar>

  <!-- Bulk Delete Confirmation Safety Modal -->
  <BulkConfirmModal
    isOpen={showDeleteModal}
    selectedCount={selection.selectedCount}
    entityType="locations"
    isDangerous={true}
    isProcessing={isProcessing}
    onclose={() => (showDeleteModal = false)}
    onconfirm={handleBulkDelete}
  />
</div>
