<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { Search, ExternalLink, Star } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  const statusTabs = [
    { label: "All", value: "" },
    { label: "Published", value: "published" },
    { label: "Pending Review", value: "pending_review" },
    { label: "Draft", value: "draft" },
    { label: "Rejected", value: "rejected" },
    { label: "Archived", value: "archived" },
  ];
</script>

<svelte:head>
  <title>Directory Listings | Admin Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Directory Listings</h1>
      <p class="text-xs text-muted-foreground mt-0.5">
        Manage and moderate all {data.totalCount} businesses registered in Pimple Saudagar
      </p>
    </div>

    <!-- Search Form -->
    <form method="GET" class="relative w-full sm:w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        name="q"
        value={data.query}
        placeholder="Filter by title or address..."
        class="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {#if data.statusFilter}
        <input type="hidden" name="status" value={data.statusFilter} />
      {/if}
    </form>
  </div>

  <!-- Status Filter Tabs -->
  <div class="flex items-center gap-1 overflow-x-auto pb-1 border-b text-xs">
    {#each statusTabs as tab}
      <a
        href="/admin/listings?status={tab.value}{data.query ? `&q=${encodeURIComponent(data.query)}` : ''}"
        class="px-3 py-1.5 font-semibold rounded-lg transition whitespace-nowrap {data.statusFilter === tab.value
          ? 'bg-red-600 text-white shadow-xs'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
      >
        {tab.label}
      </a>
    {/each}
  </div>

  <!-- Listings Table -->
  {#if data.listings.length === 0}
    <div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">
      <p class="text-xs text-muted-foreground">No listings match the selected filters.</p>
    </div>
  {:else}
    <div class="rounded-xl border bg-card shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b bg-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th class="p-3.5">Business Name</th>
              <th class="p-3.5">Category</th>
              <th class="p-3.5">Locality</th>
              <th class="p-3.5">Rating</th>
              <th class="p-3.5">Moderation Status</th>
              <th class="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each data.listings as listing (listing.id)}
              <tr class="hover:bg-muted/30 transition">
                <td class="p-3.5 font-bold text-foreground max-w-xs truncate">
                  {listing.title}
                </td>
                <td class="p-3.5 text-muted-foreground">
                  {#if listing.categories.length > 0}
                    <span class="bg-muted px-2 py-0.5 rounded text-[11px] font-medium text-foreground">
                      {listing.categories[0].category.name}
                    </span>
                  {:else}
                    <span class="text-muted-foreground text-[11px]">—</span>
                  {/if}
                </td>
                <td class="p-3.5 text-muted-foreground">{listing.locality}</td>
                <td class="p-3.5">
                  <div class="flex items-center gap-1 font-semibold text-foreground">
                    <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{listing.averageRating.toFixed(1)}</span>
                    <span class="text-muted-foreground text-[10px]">({listing.reviewCount})</span>
                  </div>
                </td>
                <td class="p-3.5">
                  <form method="POST" action="?/updateStatus" use:enhance class="inline-block">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <select
                      name="status"
                      value={listing.status}
                      onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
                      class="text-[11px] font-bold uppercase rounded-md border bg-background py-1 px-2 outline-none focus:border-primary {listing.status === 'published'
                        ? 'text-emerald-700 dark:text-emerald-400 border-emerald-300'
                        : listing.status === 'pending_review'
                        ? 'text-amber-700 dark:text-amber-400 border-amber-300'
                        : 'text-muted-foreground border-border'}"
                    >
                      <option value="published">Published</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="draft">Draft</option>
                      <option value="rejected">Rejected</option>
                      <option value="archived">Archived</option>
                    </select>
                  </form>
                </td>
                <td class="p-3.5 text-right">
                  <a
                    href="/listing/{listing.slug}"
                    target="_blank"
                    class="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>View</span>
                    <ExternalLink class="h-3 w-3" />
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
