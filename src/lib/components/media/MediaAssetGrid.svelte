<script lang="ts">
  import { Check, Image as ImageIcon, ShieldAlert } from "lucide-svelte";

  interface MediaItem {
    id: string;
    key: string;
    url: string;
    altText?: string | null;
    mimeType: string;
    bytes: number;
    isQuarantined?: boolean;
    createdAt?: string | Date;
  }

  interface Props {
    assets: MediaItem[];
    selectedIds: Set<string>;
    ontoggle: (asset: MediaItem) => void;
    multiSelect?: boolean;
  }

  let { assets, selectedIds, ontoggle, multiSelect = true }: Props = $props();

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getExt(mime: string): string {
    const parts = mime.split("/");
    return (parts[1] || "img").toUpperCase();
  }
</script>

{#if assets.length === 0}
  <div class="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20">
    <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
      <ImageIcon class="h-6 w-6" />
    </div>
    <h3 class="mt-3 text-sm font-semibold text-foreground">No media assets found</h3>
    <p class="mt-1 text-xs text-muted-foreground">
      Upload photos or adjust your search filters to view files.
    </p>
  </div>
{:else}
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {#each assets as asset (asset.id)}
      {@const isSelected = selectedIds.has(asset.id)}
      <div
        role="button"
        tabindex="0"
        class={`group relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer select-none bg-muted/40 ${
          isSelected
            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md"
            : "border-border/70 hover:border-primary/50 hover:shadow-sm hover:scale-[1.02]"
        }`}
        onclick={() => ontoggle(asset)}
        onkeydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            ontoggle(asset);
          }
        }}
        aria-pressed={isSelected}
      >
        <!-- Thumbnail Image -->
        <img
          src={asset.url}
          alt={asset.altText || "Business photo"}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <!-- Format Badge -->
        <div class="absolute bottom-1.5 left-1.5 flex items-center gap-1">
          <span class="rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono font-medium text-white uppercase">
            {getExt(asset.mimeType)}
          </span>
          <span class="rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
            {formatBytes(asset.bytes)}
          </span>
        </div>

        <!-- Quarantined Overlay -->
        {#if asset.isQuarantined}
          <div class="absolute inset-0 bg-destructive/80 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2">
            <ShieldAlert class="h-5 w-5 mb-1" />
            <span class="text-[10px] font-bold uppercase tracking-wider">Quarantined</span>
          </div>
        {/if}

        <!-- Selection Check Circle -->
        <div
          class={`absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? "bg-primary text-primary-foreground shadow-sm scale-100"
              : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 scale-95"
          }`}
        >
          <Check class="h-3 w-3 stroke-[3]" />
        </div>
      </div>
    {/each}
  </div>
{/if}
