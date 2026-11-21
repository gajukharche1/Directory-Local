<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
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
    Check
  } from "lucide-svelte";
  import { createBulkSelection } from "$lib/components/ui/bulk-select/bulk-select.svelte";
  import BulkSelectCheckbox from "$lib/components/ui/bulk-select/BulkSelectCheckbox.svelte";
  import BulkSelectToolbar from "$lib/components/ui/bulk-select/BulkSelectToolbar.svelte";
  import BulkConfirmModal from "$lib/components/ui/bulk-select/BulkConfirmModal.svelte";

  let { data }: { data: PageData } = $props();

  const selection = createBulkSelection();
  let visibleIds = $derived(data.listings.map((l) => l.id));

  let showDeleteModal = $state(false);
  let isProcessing = $state(false);
  let feedbackMessage = $state("");

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
      <h1 class="text-2xl font-black tracking-tight text-slate-900">
        Directory Listings
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Monitor, moderate, and optimize {data.totalCount} local businesses
      </p>
    </div>

    <!-- Search Form (Pill Styled) -->
    <div class="flex items-center gap-2.5">
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
    </div>
  </div>

  <!-- Top 3 Pastel Metric Cards (Directly matching Health/Modern Dashboard design) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Blush Pink (Total Businesses) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-rose-100/70 bg-gradient-to-br from-[#FEF2F4] via-[#FFF1F2] to-[#FFE4E6] shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-rose-900/70 tracking-wide block">
          Total Directory
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-900">{data.totalCount}</span>
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
          <span class="text-2xl font-black text-slate-900">{data.publishedCount}</span>
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

    <!-- Card 3: Soft Periwinkle / Baby Blue (Pending Action) -->
    <div class="relative overflow-hidden rounded-3xl p-5 border border-indigo-100/70 bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE] shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] flex items-center justify-between">
      <div class="space-y-1.5">
        <span class="text-xs font-bold text-indigo-900/70 tracking-wide block">
          Moderation Queue
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-900">{data.pendingCount}</span>
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
          <span class={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {tab.count}
          </span>
        {/if}
      </a>
    {/each}
  </div>

  <!-- Listings Table (Clean, Card-Wrapped Modern Container) -->
  {#if data.listings.length === 0}
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
          <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
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
              <th class="py-3.5 px-4">Business Name</th>
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
                ? 'bg-indigo-50/60 dark:bg-indigo-950/20'
                : 'hover:bg-slate-50/70'}">
                <!-- Select Checkbox -->
                <td class="py-4 pl-6 pr-2 w-10">
                  <BulkSelectCheckbox
                    checked={selection.isSelected(listing.id)}
                    ariaLabel={`Select ${listing.title}`}
                    onchange={(e) => selection.toggle(listing.id, idx, e.shiftKey, visibleIds)}
                  />
                </td>

                <!-- Business Name -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200/60 shadow-xs">
                      {listing.title?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                    <div class="min-w-0 max-w-xs">
                      <a
                        href="/admin/listings/{listing.id}"
                        class="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block text-xs"
                      >
                        {listing.title}
                      </a>
                      <p class="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {listing.phone || "No phone listed"}
                      </p>
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
                  <div class="inline-flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-full text-amber-800 font-bold text-[11px]">
                    <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{listing.averageRating.toFixed(1)}</span>
                    <span class="text-amber-600/70 font-normal">({listing.reviewCount})</span>
                  </div>
                </td>

                <!-- Moderation Status -->
                <td class="py-4 px-4">
                  <form method="POST" action="?/updateStatus" use:enhance class="inline-block">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <select
                      name="status"
                      value={listing.status}
                      onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
                      class="text-[11px] font-bold uppercase rounded-full border py-1 px-3 outline-none transition-all cursor-pointer {listing.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : listing.status === 'pending_review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}"
                    >
                      <option value="published">Published</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="draft">Draft</option>
                      <option value="rejected">Rejected</option>
                      <option value="archived">Archived</option>
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
    </div>
  {/if}

  <!-- Floating Bulk Actions Toolbar -->
  <BulkSelectToolbar
    count={selection.count}
    entityName="listings"
    ondeselect={() => selection.deselectAll()}
  >
    <!-- Bulk Status Dropdown -->
    <form
      method="POST"
      action="?/bulkUpdateStatus"
      use:enhance={() => {
        isProcessing = true;
        return async ({ result, update }) => {
          isProcessing = false;
          await update();
          if (result.type === "success") {
            selection.deselectAll();
            feedbackMessage = "Listings updated successfully";
            setTimeout(() => (feedbackMessage = ""), 4000);
          }
        };
      }}
      class="flex items-center gap-1.5"
    >
      <input type="hidden" name="ids" value={JSON.stringify(selection.selectedArray)} />
      <select
        name="status"
        disabled={isProcessing}
        onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
        class="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl py-1.5 px-3 outline-none cursor-pointer hover:border-slate-500 transition-colors"
      >
        <option value="" disabled selected>Update Status...</option>
        <option value="published">Mark as Published</option>
        <option value="pending_review">Mark as Pending</option>
        <option value="draft">Move to Draft</option>
        <option value="rejected">Mark as Rejected</option>
        <option value="archived">Archive Selected</option>
      </select>
    </form>

    <!-- Bulk Delete Trigger Button -->
    <button
      type="button"
      class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
      disabled={isProcessing}
      onclick={() => (showDeleteModal = true)}
    >
      <Trash2 class="h-3.5 w-3.5" />
      <span>Delete</span>
    </button>
  </BulkSelectToolbar>

  <!-- Delete Safety Confirmation Modal -->
  <BulkConfirmModal
    isOpen={showDeleteModal}
    title={`Delete ${selection.count} Selected Listing${selection.count > 1 ? "s" : ""}?`}
    message="This will permanently delete the selected listings, including all associated photos, reviews, enquiries, and categories. This action cannot be reversed."
    confirmLabel="Delete Forever"
    confirmVariant="destructive"
    {isProcessing}
    oncancel={() => (showDeleteModal = false)}
    onconfirm={handleBulkDelete}
  />
</div>
