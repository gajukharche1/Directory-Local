<script lang="ts">
  import { Camera, ImageOff } from "lucide-svelte";

  interface MediaItem {
    id: string;
    url: string;
    altText: string | null;
  }

  let { media = [], title }: { media?: MediaItem[]; title: string } = $props();

  let primaryPhoto = $derived(media[0]);
  let sidePhotos = $derived(media.slice(1, 5));
</script>

{#if media.length === 0}
  <div class="relative h-64 sm:h-96 w-full rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
    <ImageOff class="h-10 w-10 mb-2 stroke-1 text-slate-300" />
    <span class="text-sm font-medium">No business photos uploaded yet</span>
  </div>
{:else}
  <div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
      <!-- Main Cover Photo -->
      <div class="relative h-72 md:h-[400px] overflow-hidden rounded-xl {sidePhotos.length > 0 ? 'md:col-span-3' : 'md:col-span-4'}">
        <img
          src={primaryPhoto?.url || ""}
          alt={primaryPhoto?.altText || title}
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <!-- Side Thumbnails -->
      {#if sidePhotos.length > 0}
        <div class="hidden md:grid grid-rows-2 gap-2">
          {#each sidePhotos.slice(0, 2) as item, idx}
            <div class="relative h-[195px] overflow-hidden rounded-xl">
              <img
                src={item.url}
                alt={item.altText || `${title} photo ${idx + 2}`}
                class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5 border border-slate-200">
      <Camera class="h-3.5 w-3.5 text-indigo-600" />
      <span>{media.length} {media.length === 1 ? "Photo" : "Photos"}</span>
    </div>
  </div>
{/if}
