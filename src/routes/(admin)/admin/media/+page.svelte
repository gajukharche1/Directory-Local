<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import {
    ShieldAlert,
    ShieldCheck,
    Search,
    Trash2,
    HardDrive,
    ExternalLink,
    Filter,
    Check,
    Image as ImageIcon,
  } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<svelte:head>
  <title>Global Media Console | Admin Portal</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Global Media Console</h1>
      <p class="text-xs text-muted-foreground mt-0.5">
        Directory-wide audit, quarantine governance, and asset storage inspection
      </p>
    </div>

    <!-- Quick Metrics Pill -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs">
        <HardDrive class="h-3.5 w-3.5 text-primary" />
        <span class="font-mono font-bold text-foreground">
          {formatBytes(data.media.totalBytesSystem)}
        </span>
        <span class="text-muted-foreground">across {data.media.totalCount} files</span>
      </div>
    </div>
  </div>

  <!-- Filters & Search Toolbar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
    <!-- Status Filter Pills -->
    <div class="flex items-center gap-1.5 text-xs">
      <a
        href="/admin/media"
        class={`px-3 py-1.5 rounded-xl font-medium transition-all ${
          !data.statusFilter
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All Media
      </a>
      <a
        href="/admin/media?status=clean"
        class={`px-3 py-1.5 rounded-xl font-medium transition-all ${
          data.statusFilter === "clean"
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        Clean Assets
      </a>
      <a
        href="/admin/media?status=quarantined"
        class={`px-3 py-1.5 rounded-xl font-medium transition-all ${
          data.statusFilter === "quarantined"
            ? "bg-rose-600 text-white shadow-xs"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        Quarantined
      </a>
    </div>

    <!-- Search Input -->
    <form method="GET" class="relative w-full sm:w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        name="q"
        value={data.searchQuery}
        placeholder="Search filename, alt text, or owner email..."
        class="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {#if data.statusFilter}
        <input type="hidden" name="status" value={data.statusFilter} />
      {/if}
    </form>
  </div>

  <!-- Admin Asset Grid -->
  {#if data.media.items.length === 0}
    <div class="p-16 text-center rounded-2xl border border-dashed border-border/80 bg-card">
      <ImageIcon class="h-10 w-10 mx-auto text-muted-foreground mb-2" />
      <p class="text-sm font-semibold text-foreground">No media assets found</p>
      <p class="text-xs text-muted-foreground mt-0.5">Try clearing filters or search keywords.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {#each data.media.items as item (item.id)}
        <div class="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div class="relative aspect-video bg-muted overflow-hidden">
            <img
              src={item.url}
              alt={item.altText || "Directory asset"}
              class="w-full h-full object-cover"
              loading="lazy"
            />
            {#if item.isQuarantined}
              <div class="absolute inset-0 bg-destructive/85 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider gap-1.5">
                <ShieldAlert class="h-4 w-4" /> Quarantined
              </div>
            {/if}
          </div>

          <div class="p-3.5 space-y-2">
            <div>
              <p class="text-xs font-bold text-foreground truncate" title={item.altText || item.key}>
                {item.altText || item.key.split("/").pop()}
              </p>
              <p class="text-[10px] text-muted-foreground truncate font-mono mt-0.5">
                {formatBytes(item.bytes)} • {item.mimeType}
              </p>
            </div>

            {#if item.owner}
              <div class="pt-1 border-t border-border/60 text-[11px] text-muted-foreground truncate">
                Owner: <span class="text-foreground font-medium">{item.owner.email}</span>
              </div>
            {/if}

            {#if item.listing}
              <div class="text-[11px] text-muted-foreground truncate">
                Listing: <a href={`/listing/${item.listing.slug}`} target="_blank" class="text-primary hover:underline font-medium">{item.listing.title}</a>
              </div>
            {/if}

            <!-- Moderator Action Buttons -->
            <div class="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
              <form method="POST" action="?/toggleQuarantine" use:enhance class="flex-1">
                <input type="hidden" name="mediaId" value={item.id} />
                <input type="hidden" name="isQuarantined" value={item.isQuarantined ? "false" : "true"} />
                <button
                  type="submit"
                  class={`w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                    item.isQuarantined
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                      : "bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white"
                  }`}
                >
                  {#if item.isQuarantined}
                    <ShieldCheck class="h-3 w-3" /> Restore
                  {:else}
                    <ShieldAlert class="h-3 w-3" /> Quarantine
                  {/if}
                </button>
              </form>

              <form method="POST" action="?/deleteMedia" use:enhance>
                <input type="hidden" name="mediaId" value={item.id} />
                <button
                  type="submit"
                  class="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  title="Permanently remove"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
