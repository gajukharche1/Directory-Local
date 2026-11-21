<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
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
    ShieldAlert,
    ShieldCheck,
    Eye,
    Maximize2,
  } from "lucide-svelte";
  import MediaDropzone from "$lib/components/media/MediaDropzone.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let showUploader = $state(false);
  let showNewFolderModal = $state(false);
  let newFolderName = $state("");
  let selectedMap = $state<Map<string, any>>(new Map());
  let copiedId = $state<string | null>(null);
  let previewAsset = $state<any | null>(null);

  let selectedIds = $derived(new Set(selectedMap.keys()));
  let selectedCount = $derived(selectedMap.size);

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getExt(mime: string): string {
    const parts = mime.split("/");
    return (parts[1] || "img").toUpperCase();
  }

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
  <title>Global Media Console | Admin Portal</title>
</svelte:head>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Global Media Asset Hub</h1>
      <p class="text-xs text-muted-foreground mt-0.5">
        Directory-wide asset library, direct cloud upload, folder management, and quarantine governance
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

  <!-- Storage Quota & Utilization Card -->
  <div class="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <HardDrive class="h-5 w-5" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground">Storage Quota & Utilization</h3>
          <p class="text-xs text-muted-foreground mt-0.5 font-mono tabular-nums">
            {(data.media.totalBytesSystem / 1024 / 1024).toFixed(2)} MB of {(data.media.maxStorageBytes / 1024 / 1024).toFixed(0)} MB used ({data.media.quotaPercentage}%)
          </p>
        </div>
      </div>

      <div class="w-full sm:w-72">
        <div class="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1">
          <span>{data.media.totalCount} Total Photos</span>
          <span class="font-mono">{data.media.quotaPercentage}%</span>
        </div>
        <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-500"
            style={`width: ${data.media.quotaPercentage}%`}
          ></div>
        </div>
        <div class="flex items-center justify-between mt-2 text-[10px]">
          <span class="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck class="h-3 w-3" /> {data.media.cleanCount} Clean
          </span>
          <span class="inline-flex items-center gap-1 text-rose-600 font-medium">
            <ShieldAlert class="h-3 w-3" /> {data.media.quarantinedCount} Quarantined
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Collapsible Direct Cloud Upload Area -->
  {#if showUploader}
    <div class="rounded-2xl border border-border/80 bg-card p-5 shadow-xs relative transition-all">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
          <Upload class="h-4 w-4 text-primary" /> Direct Cloud Upload
        </h3>
        <button
          type="button"
          class="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          onclick={() => (showUploader = false)}
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <MediaDropzone
        folderId={data.activeFolderId}
        onUploadSuccess={() => invalidateAll()}
      />
    </div>
  {/if}

  <!-- Folders Navigation Bar -->
  <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
    <a
      href="/admin/media{data.statusFilter ? `?status=${data.statusFilter}` : ''}"
      class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
        !data.activeFolderId
          ? "bg-primary text-primary-foreground shadow-xs"
          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Layers class="h-3.5 w-3.5" /> All Assets ({data.media.totalCount})
    </a>

    {#each data.folders as folder (folder.id)}
      <div class="inline-flex items-center shrink-0 rounded-xl border border-border/80 overflow-hidden bg-card">
        <a
          href={`/admin/media?folderId=${folder.id}${data.statusFilter ? `&status=${data.statusFilter}` : ''}`}
          class={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            data.activeFolderId === folder.id
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Folder class="h-3.5 w-3.5 text-amber-500" />
          <span>{folder.name}</span>
          <span class="text-[10px] opacity-70">({folder._count.media})</span>
        </a>

        <form method="POST" action="?/deleteFolder" use:enhance>
          <input type="hidden" name="folderId" value={folder.id} />
          <button
            type="submit"
            class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer border-l border-border/60"
            title="Delete Folder"
          >
            <Trash2 class="h-3 w-3" />
          </button>
        </form>
      </div>
    {/each}
  </div>

  <!-- Filters & Search Toolbar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
    <!-- Status Filter Pills -->
    <div class="flex items-center gap-1.5 text-xs">
      <a
        href={`/admin/media${data.activeFolderId ? `?folderId=${data.activeFolderId}` : ''}`}
        class={`px-3 py-1.5 rounded-xl font-medium transition-all ${
          !data.statusFilter
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All Media
      </a>
      <a
        href={`/admin/media?status=clean${data.activeFolderId ? `&folderId=${data.activeFolderId}` : ''}`}
        class={`px-3 py-1.5 rounded-xl font-medium transition-all ${
          data.statusFilter === "clean"
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        Clean Assets
      </a>
      <a
        href={`/admin/media?status=quarantined${data.activeFolderId ? `&folderId=${data.activeFolderId}` : ''}`}
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
        placeholder="Filter photos or search owner, alt text..."
        class="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {#if data.statusFilter}
        <input type="hidden" name="status" value={data.statusFilter} />
      {/if}
      {#if data.activeFolderId}
        <input type="hidden" name="folderId" value={data.activeFolderId} />
      {/if}
    </form>
  </div>

  <!-- Multi-Selection Floating Action Dock -->
  {#if selectedCount > 0}
    <div class="sticky top-4 z-30 p-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
          {selectedCount}
        </span>
        <span class="text-xs font-medium text-foreground">assets selected</span>
        <button
          type="button"
          class="text-xs text-muted-foreground hover:text-foreground underline ml-2 cursor-pointer"
          onclick={handleSelectAll}
        >
          {selectedCount === data.media.items.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Move to Folder Form -->
        <form method="POST" action="?/moveMedia" use:enhance class="flex items-center gap-1.5">
          <input type="hidden" name="mediaIds" value={JSON.stringify(Array.from(selectedIds))} />
          <select
            name="targetFolderId"
            class="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
          >
            <option value="root">Move to Root</option>
            {#each data.folders as f (f.id)}
              <option value={f.id}>Folder: {f.name}</option>
            {/each}
          </select>
          <button
            type="submit"
            class="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            Move
          </button>
        </form>

        <!-- Batch Quarantine Form -->
        <form method="POST" action="?/batchQuarantine" use:enhance>
          <input type="hidden" name="mediaIds" value={JSON.stringify(Array.from(selectedIds))} />
          <input type="hidden" name="isQuarantined" value="true" />
          <button
            type="submit"
            class="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <ShieldAlert class="h-3.5 w-3.5" /> Quarantine
          </button>
        </form>

        <!-- Batch Restore Form -->
        <form method="POST" action="?/batchQuarantine" use:enhance>
          <input type="hidden" name="mediaIds" value={JSON.stringify(Array.from(selectedIds))} />
          <input type="hidden" name="isQuarantined" value="false" />
          <button
            type="submit"
            class="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <ShieldCheck class="h-3.5 w-3.5" /> Restore Clean
          </button>
        </form>

        <!-- Batch Delete Form -->
        <form method="POST" action="?/batchDeleteMedia" use:enhance>
          <input type="hidden" name="mediaIds" value={JSON.stringify(Array.from(selectedIds))} />
          <button
            type="submit"
            class="px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Trash2 class="h-3.5 w-3.5" /> Delete
          </button>
        </form>
      </div>
    </div>
  {/if}

  <!-- Media Assets Grid -->
  {#if data.media.items.length === 0}
    <div class="p-16 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20">
      <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
        <ImageIcon class="h-6 w-6" />
      </div>
      <h3 class="text-sm font-semibold text-foreground">No media assets found</h3>
      <p class="text-xs text-muted-foreground mt-0.5">
        Upload photos or adjust your search and quarantine filters.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
      {#each data.media.items as item (item.id)}
        {@const isSelected = selectedIds.has(item.id)}
        <div
          class={`group relative rounded-2xl border overflow-hidden bg-card flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
            isSelected
              ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "border-border/80 hover:border-primary/40"
          }`}
        >
          <!-- Thumbnail & Badges Container -->
          <div class="relative aspect-square bg-muted/40 overflow-hidden cursor-pointer">
            <img
              src={item.url}
              alt={item.altText || "Business photo"}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            <!-- Selection Checkbox Button -->
            <button
              type="button"
              class={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm scale-100"
                  : "bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:scale-110"
              }`}
              onclick={(e) => {
                e.stopPropagation();
                handleToggle(item);
              }}
              aria-label="Select asset"
            >
              <Check class="h-3.5 w-3.5 stroke-[3]" />
            </button>

            <!-- Lightbox Preview Trigger -->
            <button
              type="button"
              class="absolute top-2 left-2 h-6 w-6 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
              onclick={() => (previewAsset = item)}
              title="Preview Image"
            >
              <Maximize2 class="h-3.5 w-3.5" />
            </button>

            <!-- Bottom Pills (Format + Size) -->
            <div class="absolute bottom-2 left-2 flex items-center gap-1">
              <span class="rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono font-medium text-white uppercase">
                {getExt(item.mimeType)}
              </span>
              <span class="rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
                {formatBytes(item.bytes)}
              </span>
            </div>

            <!-- Quarantined Overlay -->
            {#if item.isQuarantined}
              <div class="absolute inset-0 bg-destructive/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 z-5">
                <ShieldAlert class="h-6 w-6 mb-1" />
                <span class="text-[11px] font-bold uppercase tracking-wider">Quarantined</span>
                <span class="text-[9px] opacity-80 mt-0.5">Hidden from public view</span>
              </div>
            {/if}
          </div>

          <!-- Card Content / Metadata -->
          <div class="p-3 space-y-2">
            <div>
              <p class="text-xs font-semibold text-foreground truncate" title={item.altText || item.key}>
                {item.altText || item.key.split("/").pop()}
              </p>
              {#if item.folder}
                <span class="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <Folder class="h-3 w-3 text-amber-500" /> {item.folder.name}
                </span>
              {/if}
            </div>

            <!-- Owner & Listing Badges -->
            <div class="text-[10px] space-y-0.5 text-muted-foreground">
              {#if item.owner}
                <div class="truncate">
                  By: <span class="text-foreground font-medium">{item.owner.email}</span>
                </div>
              {/if}
              {#if item.listing}
                <div class="truncate">
                  Listing: <a href={`/listing/${item.listing.slug}`} target="_blank" class="text-primary hover:underline">{item.listing.title}</a>
                </div>
              {/if}
            </div>

            <!-- Action Buttons Row -->
            <div class="pt-2 border-t border-border/60 flex items-center justify-between gap-1.5">
              <!-- Copy URL -->
              <button
                type="button"
                class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                onclick={() => copyToClipboard(item.url, item.id)}
                title="Copy public URL"
              >
                {#if copiedId === item.id}
                  <Check class="h-3.5 w-3.5 text-emerald-600" />
                {:else}
                  <Copy class="h-3.5 w-3.5" />
                {/if}
              </button>

              <!-- Quarantine Toggle -->
              <form method="POST" action="?/toggleQuarantine" use:enhance class="flex-1">
                <input type="hidden" name="mediaId" value={item.id} />
                <input type="hidden" name="isQuarantined" value={item.isQuarantined ? "false" : "true"} />
                <button
                  type="submit"
                  class={`w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
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

              <!-- Delete Asset -->
              <form method="POST" action="?/deleteMedia" use:enhance>
                <input type="hidden" name="mediaId" value={item.id} />
                <button
                  type="submit"
                  class="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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

<!-- Modal: New Folder -->
{#if showNewFolderModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
    <div class="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl animate-in zoom-in-95">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
          <FolderPlus class="h-4 w-4 text-primary" /> Create Virtual Folder
        </h3>
        <button
          type="button"
          class="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          onclick={() => (showNewFolderModal = false)}
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <form
        method="POST"
        action="?/createFolder"
        use:enhance={() => {
          return async ({ result, update }) => {
            await update();
            if (result.type === "success") {
              showNewFolderModal = false;
              newFolderName = "";
            }
          };
        }}
        class="space-y-4"
      >
        <div>
          <label for="folderName" class="block text-xs font-medium text-foreground mb-1">
            Folder Name
          </label>
          <input
            id="folderName"
            type="text"
            name="name"
            bind:value={newFolderName}
            placeholder="e.g. Platform Banners, Verified Listings..."
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted cursor-pointer"
            onclick={() => (showNewFolderModal = false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-1.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Modal: Lightbox Asset Preview -->
{#if previewAsset}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
    <div class="relative max-w-3xl w-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl flex flex-col max-h-[90vh]">
      <div class="flex items-center justify-between p-3.5 border-b border-border bg-muted/40">
        <div class="truncate">
          <p class="text-xs font-bold text-foreground truncate">{previewAsset.altText || previewAsset.key}</p>
          <p class="text-[10px] text-muted-foreground font-mono">{formatBytes(previewAsset.bytes)} • {previewAsset.mimeType}</p>
        </div>
        <button
          type="button"
          class="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          onclick={() => (previewAsset = null)}
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="p-4 flex items-center justify-center bg-black/40 overflow-auto max-h-[65vh]">
        <img
          src={previewAsset.url}
          alt={previewAsset.altText || "Preview"}
          class="max-h-full max-w-full object-contain rounded-lg shadow-md"
        />
      </div>

      <div class="p-3 border-t border-border flex items-center justify-between text-xs bg-muted/20">
        <a
          href={previewAsset.url}
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          <ExternalLink class="h-3.5 w-3.5" /> Open Full Resolution
        </a>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-medium cursor-pointer"
            onclick={() => (previewAsset = null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
