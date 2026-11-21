<script lang="ts">
  import { X, Search, Check, Upload, Folder, Layers, RefreshCw } from "lucide-svelte";
  import MediaDropzone from "./MediaDropzone.svelte";
  import MediaAssetGrid from "./MediaAssetGrid.svelte";

  interface Props {
    isOpen: boolean;
    listingId?: string;
    folderId?: string;
    maxSelect?: number;
    title?: string;
    onselect: (selected: any[]) => void;
    onclose: () => void;
  }

  let {
    isOpen,
    listingId,
    folderId,
    maxSelect = 1,
    title = "Select Media Assets",
    onselect,
    onclose,
  }: Props = $props();

  let activeTab = $state<"library" | "upload">("library");
  let searchQuery = $state("");
  let isLoading = $state(false);
  let assets = $state<any[]>([]);
  let selectedMap = $state<Map<string, any>>(new Map());

  let selectedIds = $derived(new Set(selectedMap.keys()));
  let selectedCount = $derived(selectedMap.size);

  let filteredAssets = $derived(
    assets.filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (a.altText && a.altText.toLowerCase().includes(q)) ||
        (a.key && a.key.toLowerCase().includes(q))
      );
    })
  );

  $effect(() => {
    if (isOpen) {
      loadMedia();
    } else {
      selectedMap.clear();
      searchQuery = "";
    }
  });

  $effect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isOpen && e.key === "Escape") {
        onclose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function loadMedia() {
    isLoading = true;
    try {
      const res = await fetch(`/api/media/list?limit=60${listingId ? `&listingId=${listingId}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        assets = data.items || [];
      }
    } catch {
      // Fallback empty
    } finally {
      isLoading = false;
    }
  }

  function handleToggle(asset: any) {
    if (selectedMap.has(asset.id)) {
      selectedMap.delete(asset.id);
      selectedMap = new Map(selectedMap);
    } else {
      if (maxSelect === 1) {
        selectedMap = new Map([[asset.id, asset]]);
      } else if (selectedMap.size < maxSelect) {
        selectedMap.set(asset.id, asset);
        selectedMap = new Map(selectedMap);
      }
    }
  }

  function handleConfirm() {
    const selectedArray = Array.from(selectedMap.values());
    onselect(selectedArray);
    onclose();
  }

  function handleUploadSuccess(newMedia: any) {
    assets = [newMedia, ...assets];
    handleToggle(newMedia);
    activeTab = "library";
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    aria-labelledby="media-picker-title"
  >
    <div
      class="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden text-foreground"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
        <div>
          <h2 id="media-picker-title" class="text-base font-bold tracking-tight">
            {title}
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            {#if maxSelect === 1}
              Select 1 photo to attach
            {:else}
              Select up to {maxSelect} photos ({selectedCount} selected)
            {/if}
          </p>
        </div>

        <button
          type="button"
          class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          onclick={onclose}
          aria-label="Close modal"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Tab Switcher & Search Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 px-6 py-3 bg-card">
        <div class="flex items-center gap-1 p-1 bg-muted/60 rounded-xl">
          <button
            type="button"
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "library"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onclick={() => (activeTab = "library")}
          >
            <Layers class="h-3.5 w-3.5" /> Media Library ({assets.length})
          </button>
          <button
            type="button"
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onclick={() => (activeTab = "upload")}
          >
            <Upload class="h-3.5 w-3.5" /> Upload New
          </button>
        </div>

        {#if activeTab === "library"}
          <div class="flex items-center gap-2">
            <div class="relative w-full sm:w-64">
              <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search files by name..."
                class="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              class="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              onclick={loadMedia}
              title="Refresh library"
            >
              <RefreshCw class={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>
        {/if}
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 min-h-[360px]">
        {#if activeTab === "upload"}
          <div class="max-w-xl mx-auto py-4">
            <MediaDropzone
              {listingId}
              {folderId}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        {:else}
          <MediaAssetGrid
            assets={filteredAssets}
            {selectedIds}
            ontoggle={handleToggle}
            multiSelect={maxSelect > 1}
          />
        {/if}
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between border-t border-border/80 px-6 py-3.5 bg-muted/10">
        <div class="text-xs text-muted-foreground">
          {#if selectedCount > 0}
            <span class="font-medium text-foreground">{selectedCount}</span> asset{selectedCount > 1 ? "s" : ""} selected
          {:else}
            No assets selected
          {/if}
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            onclick={onclose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            class="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            onclick={handleConfirm}
          >
            <Check class="h-3.5 w-3.5" /> Attach Selected
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
