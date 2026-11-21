<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { navigating } from "$app/state";
  import type { PageData } from "./$types";
  import {
    Search,
    ExternalLink,
    Star,
    Pencil,
    Store,
    CheckCircle2,
    Clock,
    Filter,
    MapPin,
    ArrowUpRight,
    Sparkles,
    ShieldAlert,
    Trash2,
    Check,
    Plus,
    FolderTree,
    X,
    FileText,
    Archive,
    XCircle
  } from "lucide-svelte";
  import { createBulkSelection } from "$lib/components/ui/bulk-select/bulk-select.svelte";
  import BulkSelectCheckbox from "$lib/components/ui/bulk-select/BulkSelectCheckbox.svelte";
  import BulkSelectToolbar from "$lib/components/ui/bulk-select/BulkSelectToolbar.svelte";
  import BulkConfirmModal from "$lib/components/ui/bulk-select/BulkConfirmModal.svelte";
  import ListingTableSkeleton from "$lib/components/skeletons/ListingTableSkeleton.svelte";
  import Pagination from "$lib/components/ui/Pagination.svelte";

  let { data }: { data: PageData } = $props();

  const selection = createBulkSelection();
  let visibleIds = $derived(data.listings.map((l) => l.id));

  let showDeleteModal = $state(false);
  let showCategoryModal = $state(false);
  let showLocationModal = $state(false);
  let selectedCategoryId = $state("");
  let selectedLocationId = $state("");
  let isProcessing = $state(false);
  let feedbackMessage = $state("");

  let isNavigating = $derived(Boolean(navigating.current));

  let statusTabs = $derived([
    { label: "All", value: "", count: data.totalCount },
    { label: "Published", value: "published", count: data.publishedCount },
    { label: "Pending", value: "pending_review", count: data.pendingCount },
    { label: "Draft", value: "draft", count: data.draftCount },
    { label: "Rejected", value: "rejected" },
    { label: "Archived", value: "archived" },
  ]);

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
        feedbackMessage = "Selected listings deleted successfully";
        await invalidateAll();
        setTimeout(() => (feedbackMessage = ""), 4000);
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>Directory Listings | Admin Console</title>
</svelte:head>

<div class="space-y-7">
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

  <!-- Top Welcome & Search Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
        <Store class="h-6 w-6 text-slate-900" />
        Directory Listings
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Monitor, moderate, and optimize {data.totalCount} registered local merchants
      </p>
    </div>

    <!-- Actions & Search Form -->
    <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
      <form method="GET" class="relative w-full sm:w-80">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          name="q"
          value={data.query}
          placeholder="Search listing, locality, or address..."
          class="w-full rounded-full border border-slate-200/80 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none shadow-xs placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
        />
        {#if data.statusFilter}
          <input type="hidden" name="status" value={data.statusFilter} />
        {/if}
      </form>

      {#if data.query}
        <a
          href="/admin/listings{data.statusFilter ? `?status=${data.statusFilter}` : ''}"
          class="text-xs text-slate-500 hover:text-slate-800 underline font-medium shrink-0"
        >
          Clear
        </a>
      {/if}

      <a
        href="/admin/listings/new"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
      >
        <Plus class="h-3.5 w-3.5" />
        <span>Add Listing</span>
      </a>
    </div>
  </div>

  <!-- Top 3 Pastel Metric Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Blush Pink (Total Businesses) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-rose-100/70 bg-gradient-to-br from-[#FEF2F4] via-[#FFF1F2] to-[#FFE4E6] shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-rose-900/70 tracking-wide block">
          Total Directory
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-900 tabular-nums font-mono">{data.totalCount}</span>
          <span class="text-xs font-semibold text-rose-700/80">Listings</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Sparkles class="h-3 w-3" /> Area Coverage
        </span>
      </div>

      <div class="h-12 w-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md shrink-0">
        <Store class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Soft Lavender (Live & Published) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-purple-100/70 bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#E9D5FF] shadow-[0_4px_20px_-4px_rgba(168,85,247,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-purple-900/70 tracking-wide block">
          Live Storefronts
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-900 tabular-nums font-mono">{data.publishedCount}</span>
          <span class="text-xs font-semibold text-purple-700/80">Active</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <CheckCircle2 class="h-3 w-3 text-purple-600" /> Public Indexed
        </span>
      </div>

      <div class="h-12 w-12 rounded-2xl bg-white text-purple-700 flex items-center justify-center shadow-sm shrink-0 border border-purple-100">
        <CheckCircle2 class="h-6 w-6 text-purple-600" />
      </div>
    </div>

    <!-- Card 3: Soft Periwinkle (Pending Action) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-indigo-100/70 bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE] shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-indigo-900/70 tracking-wide block">
          Moderation Queue
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-900 tabular-nums font-mono">{data.pendingCount}</span>
          <span class="text-xs font-semibold text-indigo-700/80">Awaiting</span>
        </div>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
          <Clock class="h-3 w-3 text-indigo-600" /> {data.draftCount} Drafts
        </span>
      </div>

      <div class="h-12 w-12 rounded-2xl bg-white text-indigo-700 flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
        <Clock class="h-6 w-6 text-indigo-600" />
      </div>
    </div>
  </div>

  <!-- Status Filter Pills -->
  <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
    {#each statusTabs as tab}
      {@const isSelected = data.statusFilter === tab.value}
      <a
        href="/admin/listings?status={tab.value}{data.query ? `&q=${encodeURIComponent(data.query)}` : ''}"
        class="inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-full transition-all whitespace-nowrap cursor-pointer {isSelected
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70 shadow-xs'}"
      >
        <span>{tab.label}</span>
        {#if tab.count !== undefined}
          <span class={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {tab.count}
          </span>
        {/if}
      </a>
    {/each}
  </div>

  <!-- Skeletons vs Data View -->
  {#if isNavigating}
    <ListingTableSkeleton rows={6} />
  {:else if data.listings.length === 0}
    <div class="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center shadow-xs">
      <div class="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
        <Store class="h-6 w-6" />
      </div>
      <p class="text-sm font-bold text-slate-800">No listings found</p>
      <p class="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
    </div>
  {:else}
    <div class="rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
      <!-- Table Header Info Bar -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <h2 class="text-sm font-bold text-slate-900">Listings Directory</h2>
          <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono tabular-nums">
            Showing {data.listings.length} of {data.totalCount}
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-100 bg-slate-50/50 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th class="py-3.5 pl-6 pr-2 w-10">
                <BulkSelectCheckbox
                  checked={selection.isAllSelected(visibleIds)}
                  indeterminate={selection.isIndeterminate(visibleIds)}
                  ariaLabel="Select all visible listings"
                  onchange={() => selection.toggleAll(visibleIds)}
                />
              </th>
              <th class="py-3.5 px-4">Business Name & ID</th>
              <th class="py-3.5 px-4">Primary Category</th>
              <th class="py-3.5 px-4">Locality</th>
              <th class="py-3.5 px-4">Rating</th>
              <th class="py-3.5 px-4">Moderation Status</th>
              <th class="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {#each data.listings as listing, idx (listing.id)}
              <tr class="transition-colors group {selection.isSelected(listing.id)
                ? 'bg-blue-50/60'
                : 'hover:bg-slate-50/70'}">
                <!-- Select Checkbox -->
                <td class="py-4 pl-6 pr-2 w-10">
                  <BulkSelectCheckbox
                    checked={selection.isSelected(listing.id)}
                    ariaLabel={`Select ${listing.title}`}
                    onchange={(e) => selection.toggle(listing.id, idx, e.shiftKey, visibleIds)}
                  />
                </td>

                <!-- Business Name & ID Badge -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200/60 shadow-xs">
                      {listing.title?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                    <div class="min-w-0 max-w-xs">
                      <a
                        href="/admin/listings/{listing.id}"
                        class="font-bold text-slate-900 hover:text-blue-600 transition-colors truncate block text-xs"
                      >
                        {listing.title}
                      </a>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[10px] text-slate-400 font-mono">
                          #{listing.id.slice(0, 8)}
                        </span>
                        {#if listing.phone}
                          <span class="text-[10px] text-slate-400 font-mono truncate">
                            · {listing.phone}
                          </span>
                        {/if}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-4 px-4 text-slate-600">
                  {#if listing.categories.length > 0}
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {listing.categories[0].category.name}
                    </span>
                  {:else}
                    <span class="text-slate-400 text-[11px]">—</span>
                  {/if}
                </td>

                <!-- Locality -->
                <td class="py-4 px-4 text-slate-600">
                  <div class="flex items-center gap-1.5 font-medium">
                    <MapPin class="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span class="truncate">{listing.locality || "Local Area"}</span>
                  </div>
                </td>

                <!-- Rating -->
                <td class="py-4 px-4">
                  <div class="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 rounded-full text-amber-800 font-bold text-[11px]">
                    <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span class="font-mono tabular-nums">{listing.averageRating.toFixed(1)}</span>
                    <span class="text-amber-600/70 font-normal font-mono tabular-nums">({listing.reviewCount})</span>
                  </div>
                </td>

                <!-- Dual-Tone Moderation Status Capsule -->
                <td class="py-4 px-4">
                  <form method="POST" action="?/updateStatus" use:enhance class="inline-block">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <select
                      name="status"
                      value={listing.status}
                      onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
                      class="text-[11px] font-bold uppercase rounded-full border py-1 px-3 outline-none transition-all cursor-pointer {listing.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
                        : listing.status === 'pending_review'
                        ? 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
                        : listing.status === 'draft'
                        ? 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200'
                        : listing.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:bg-zinc-200'}"
                    >
                      <option value="published">● Published</option>
                      <option value="pending_review">● Pending Review</option>
                      <option value="draft">● Draft</option>
                      <option value="rejected">● Rejected</option>
                      <option value="archived">● Archived</option>
                    </select>
                  </form>
                </td>

                <!-- Actions -->
                <td class="py-4 px-6 text-right whitespace-nowrap">
                  <div class="inline-flex items-center justify-end gap-2">
                    <a
                      href="/admin/listings/{listing.id}"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white text-xs font-semibold transition-all shadow-xs"
                      title="Edit listing details, photos and categories"
                    >
                      <Pencil class="h-3 w-3" />
                      <span>Edit</span>
                    </a>

                    <a
                      href="/listing/{listing.slug}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="p-1.5 rounded-xl border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="View live public storefront"
                    >
                      <ExternalLink class="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        totalItems={data.totalCount}
        pageSize={data.pageSize}
        baseUrl="/admin/listings"
        extraParams={{ q: data.query, status: data.statusFilter }}
      />
    </div>
  {/if}

  <!-- Bulk Selection Action Dock Toolbar -->
  <BulkSelectToolbar
    selectedCount={selection.selectedCount}
    totalCount={visibleIds.length}
    entityName="listings"
    onClear={() => selection.deselectAll()}
  >
    {#snippet actions()}
      <!-- Publish Action (Green Pill) -->
      <form
        method="POST"
        action="?/bulkUpdateStatus"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected listings published successfully";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="status" value="published" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
        >
          <CheckCircle2 class="h-3.5 w-3.5" />
          <span>Publish</span>
        </button>
      </form>

      <!-- Draft Action (White Pill) -->
      <form
        method="POST"
        action="?/bulkUpdateStatus"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected listings moved to draft";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="status" value="draft" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        >
          <FileText class="h-3.5 w-3.5 text-slate-500" />
          <span>Draft</span>
        </button>
      </form>

      <!-- Archive Action (White Pill) -->
      <form
        method="POST"
        action="?/bulkUpdateStatus"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected listings archived";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="status" value="archived" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        >
          <Archive class="h-3.5 w-3.5 text-slate-500" />
          <span>Archive</span>
        </button>
      </form>

      <!-- Reject Action (Soft Red Pill) -->
      <form
        method="POST"
        action="?/bulkUpdateStatus"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              feedbackMessage = "Selected listings marked as rejected";
              selection.deselectAll();
              await invalidateAll();
              setTimeout(() => (feedbackMessage = ""), 4000);
            }
          };
        }}
      >
        <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
        <input type="hidden" name="status" value="rejected" />
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-medium text-xs transition-colors cursor-pointer"
        >
          <XCircle class="h-3.5 w-3.5 text-rose-500" />
          <span>Reject</span>
        </button>
      </form>

      <!-- Assign Category Button (White Pill) -->
      <button
        type="button"
        onclick={() => (showCategoryModal = true)}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        title="Assign Category to selected listings"
      >
        <FolderTree class="h-3.5 w-3.5 text-indigo-500" />
        <span>Categories</span>
      </button>

      <!-- Assign Location Button (White Pill) -->
      <button
        type="button"
        onclick={() => (showLocationModal = true)}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        title="Assign Location to selected listings"
      >
        <MapPin class="h-3.5 w-3.5 text-teal-600" />
        <span>Location</span>
      </button>

      <!-- Delete Action (Solid Red Pill) -->
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

  <!-- Bulk Assign Category Modal -->
  {#if showCategoryModal}
    <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="h-9 w-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderTree class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Assign Category</h3>
              <p class="text-xs text-slate-500">Apply taxonomy to {selection.selectedCount} selected listings</p>
            </div>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            onclick={() => (showCategoryModal = false)}
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <form
          method="POST"
          action="?/bulkAssignCategory"
          use:enhance={() => {
            isProcessing = true;
            return async ({ result }) => {
              isProcessing = false;
              if (result.type === "success") {
                showCategoryModal = false;
                selectedCategoryId = "";
                feedbackMessage = `Category assigned to ${selection.selectedCount} listings`;
                selection.deselectAll();
                await invalidateAll();
                setTimeout(() => (feedbackMessage = ""), 4000);
              }
            };
          }}
          class="space-y-4"
        >
          <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
          <div class="space-y-1.5">
            <label for="bulk-category-select" class="text-xs font-bold text-slate-700">Select Category</label>
            <select
              id="bulk-category-select"
              name="categoryId"
              bind:value={selectedCategoryId}
              required
              class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="" disabled>Choose a category...</option>
              {#each data.allCategories as cat}
                <option value={cat.id}>{cat.name}</option>
              {/each}
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              onclick={() => (showCategoryModal = false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCategoryId || isProcessing}
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              {isProcessing ? "Assigning..." : "Assign Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Bulk Assign Location Modal -->
  {#if showLocationModal}
    <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Assign Location</h3>
              <p class="text-xs text-slate-500">Apply geographic hub to {selection.selectedCount} selected listings</p>
            </div>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            onclick={() => (showLocationModal = false)}
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <form
          method="POST"
          action="?/bulkAssignLocation"
          use:enhance={() => {
            isProcessing = true;
            return async ({ result }) => {
              isProcessing = false;
              if (result.type === "success") {
                showLocationModal = false;
                selectedLocationId = "";
                feedbackMessage = `Location assigned to ${selection.selectedCount} listings`;
                selection.deselectAll();
                await invalidateAll();
                setTimeout(() => (feedbackMessage = ""), 4000);
              }
            };
          }}
          class="space-y-4"
        >
          <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
          <div class="space-y-1.5">
            <label for="bulk-location-select" class="text-xs font-bold text-slate-700">Select Location Hub</label>
            <select
              id="bulk-location-select"
              name="locationId"
              bind:value={selectedLocationId}
              required
              class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="" disabled>Choose a location...</option>
              {#each data.allLocations as loc}
                <option value={loc.id}>{loc.name}</option>
              {/each}
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              onclick={() => (showLocationModal = false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedLocationId || isProcessing}
              class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              {isProcessing ? "Assigning..." : "Assign Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Bulk Delete Confirmation Safety Modal -->
  <BulkConfirmModal
    isOpen={showDeleteModal}
    selectedCount={selection.selectedCount}
    entityType="listings"
    isDangerous={true}
    isProcessing={isProcessing}
    onclose={() => (showDeleteModal = false)}
    onconfirm={handleBulkDelete}
  />
</div>
