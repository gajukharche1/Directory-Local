<script lang="ts">
  import type { PageData } from "./$types";
  import { Store, ExternalLink, Calendar, Plus } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>My Listings | Business Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">My Business Listings</h1>
      <p class="text-xs text-muted-foreground mt-0.5">
        Manage your directory profiles, opening hours, and contact details
      </p>
    </div>

    <a
      href="/submit"
      class="inline-flex items-center gap-1.5 rounded-lg bg-primary py-2 px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition shadow-xs self-start"
    >
      <Plus class="h-3.5 w-3.5" />
      <span>Add New Business</span>
    </a>
  </div>

  {#if data.listings.length === 0}
    <div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">
      <Store class="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
      <h3 class="font-bold text-sm text-foreground">No listings found</h3>
      <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        You have not listed or claimed any business in the local area yet.
      </p>
      <a
        href="/submit"
        class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
      >
        Create Your First Listing
      </a>
    </div>
  {:else}
    <div class="rounded-xl border bg-card shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b bg-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th class="p-4">Business Name</th>
              <th class="p-4">Locality</th>
              <th class="p-4">Status</th>
              <th class="p-4">Current Plan</th>
              <th class="p-4">Views</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each data.listings as l (l.id)}
              <tr class="hover:bg-muted/30 transition">
                <td class="p-4 font-bold text-foreground max-w-xs truncate">
                  {l.title}
                </td>
                <td class="p-4 text-muted-foreground">{l.locality}</td>
                <td class="p-4">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase {l.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : l.status === 'pending_review'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-muted text-muted-foreground'}"
                  >
                    {l.status.replace("_", " ")}
                  </span>
                </td>
                <td class="p-4">
                  <span class="font-semibold text-primary">
                    {l.plan?.name || "Free Plan"}
                  </span>
                  {#if l.planExpiresAt}
                    <span class="block text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar class="h-3 w-3" />
                      <span>Exp: {new Date(l.planExpiresAt).toLocaleDateString()}</span>
                    </span>
                  {/if}
                </td>
                <td class="p-4 font-medium text-foreground">{Number(l.viewCount)}</td>
                <td class="p-4 text-right">
                  <a
                    href="/listing/{l.slug}"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>View Live</span>
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
