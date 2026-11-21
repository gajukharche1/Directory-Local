<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import {
    Upload,
    Folder,
    FolderPlus,
    Trash2,
    Search,
    ExternalLink,
    HardDrive,
    Layers,
    X,
    Check,
    Copy,
    Image as ImageIcon,
  } from "lucide-svelte";
  import MediaDropzone from "$lib/components/media/MediaDropzone.svelte";
  import MediaAssetGrid from "$lib/components/media/MediaAssetGrid.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let showUploader = $state(false);
  let showNewFolderModal = $state(false);
  let newFolderName = $state("");
  let selectedMap = $state<Map<string, any>>(new Map());
  let copiedId = $state<string | null>(null);

  let selectedIds = $derived(new Set(selectedMap.keys()));
  let selectedCount = $derived(selectedMap.size);

  function handleToggle(asset: any) {
    if (selectedMap.has(asset.id)) {
      selectedMap.delete(asset.id);
      selectedMap = new Map(selectedMap);
    } else {
      selectedMap.set(asset.id, asset);
      selectedMap = new Map(selectedMap);
    }
  }

  function handleSelectAll() {
    if (selectedMap.size === data.media.items.length) {
      selectedMap.clear();
      selectedMap = new Map();
    } else {
      for (const item of data.media.items) {
        selectedMap.set(item.id, item);
      }
      selectedMap = new Map(selectedMap);
    }
  }

  async function copyToClipboard(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      copiedId = id;
      setTimeout(() => (copiedId = null), 2000);
    } catch {
      // Fallback
    }
  }
</script>

<svelte:head>
  <title>Media File Hub | Merchant Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Media Asset Hub</h1>
      <p class="text-xs text-muted-foreground mt-0.5">
        Organize your storefront photos, banners, and menus in one centralized library
      </p>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
        onclick={() => (showNewFolderModal = true)}
      >
        <FolderPlus class="h-3.5 w-3.5 text-primary" /> New Folder
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
        onclick={() => (showUploader = !showUploader)}
      >
        <Upload class="h-3.5 w-3.5" />
        {showUploader ? "Hide Uploader" : "Upload Media"}
      </button>
    </div>
  </div>

  <!-- Storage Quota Meter & Overview Card -->
  <div class="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <HardDrive class="h-5 w-5" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground">Storage Quota & Utilization</h3>
          <p class="text-xs text-muted-foreground mt-0.5 font-mono tabular-nums">
            {(data.media.totalBytesUsed / 1024 / 1024).toFixed(2)} MB of {(data.media.maxStorageBytes / 1024 / 1024).toFixed(0)} MB used ({data.media.quotaPercentage}%)
          </p>
        </div>
      </div>

      <div class="w-full sm:w-64">
        <div class="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1">
          <span>{data.media.totalCount} Total Photos</span>
          <span class="font-mono">{data.media.quotaPercentage}%</span>
        </div>
        <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            class={`h-full transition-all duration-300 ${
              data.media.quotaPercentage > 90 ? "bg-rose-500" : "bg-primary"
            }`}
            style={`width: ${data.media.quotaPercentage}%`}
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Collapsible Uploader Drawer -->
  {#if showUploader}
    <div class="rounded-2xl border border-primary/30 bg-primary/5 p-6 animate-in slide-in-from-top-2 duration-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
          <Upload class="h-4 w-4 text-primary" /> Direct Cloud Upload
        </h3>
        <button
          type="button"
          class="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          onclick={() => (showUploader = false)}
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <MediaDropzone
        folderId={data.activeFolderId || undefined}
        onUploadSuccess={() => {
          // Refresh page after upload
          window.location.reload();
        }}
      />
    </div>
  {/if}

  <!-- Folders and Filtering Navigation Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
    <!-- Folder Tabs -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
      <a
        href="/dashboard/media"
        class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
          !data.activeFolderId
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Layers class="h-3.5 w-3.5" /> All Assets ({data.media.totalCount})
      </a>

      {#each data.folders as folder}
        <a
          href={`/dashboard/media?folderId=${folder.id}`}
          class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
            data.activeFolderId === folder.id
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Folder class="h-3.5 w-3.5" /> {folder.name} ({folder._count?.media || 0})
        </a>
      {/each}
    </div>

    <!-- Search Form -->
    <form method="GET" class="relative w-full sm:w-60">
      <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        name="q"
        value={data.searchQuery}
        placeholder="Filter photos..."
        class="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {#if data.activeFolderId}
        <input type="hidden" name="folderId" value={data.activeFolderId} />
      {/if}
    </form>
  </div>

  <!-- Multi-Action Floating Toolbar for Merchant Media -->
  {#if selectedCount > 0}
    <div class="p-3 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-2 duration-200">
      <div class="flex items-center gap-2">
        <span class="font-bold text-foreground">{selectedCount}</span> photos selected
        <button
          type="button"
          class="text-primary hover:underline font-medium cursor-pointer ml-1"
          onclick={handleSelectAll}
        >
          {selectedCount === data.media.items.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <!-- Delete Selected Form -->
        <form method="POST" action="?/deleteMedia" use:enhance>
          {#each Array.from(selectedMap.keys()) as mId}
            <input type="hidden" name="mediaId" value={mId} />
          {/each}
          <button
            type="submit"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors font-medium cursor-pointer"
          >
            <Trash2 class="h-3.5 w-3.5" /> Delete
          </button>
        </form>
      </div>
    </div>
  {/if}

  <!-- Media Assets Grid -->
  <MediaAssetGrid
    assets={data.media.items}
    {selectedIds}
    ontoggle={handleToggle}
  />
</div>

<!-- New Folder Modal -->
{#if showNewFolderModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl">
      <h3 class="text-base font-bold text-foreground">Create Virtual Folder</h3>
      <p class="text-xs text-muted-foreground mt-1">
        Group your photos logically (e.g. "Storefront", "Menu", "Ambience").
      </p>

      <form method="POST" action="?/createFolder" use:enhance class="mt-4 space-y-3">
        <div>
          <label for="folder-name-input" class="text-xs font-semibold text-foreground block mb-1">
            Folder Name
          </label>
          <input
            id="folder-name-input"
            type="text"
            name="name"
            bind:value={newFolderName}
            placeholder="e.g. Dining Area"
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted cursor-pointer"
            onclick={() => (showNewFolderModal = false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-1.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
            onclick={() => (showNewFolderModal = false)}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
