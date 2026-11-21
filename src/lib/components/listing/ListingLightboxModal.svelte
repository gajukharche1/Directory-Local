<script lang="ts">
  import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-svelte";

  interface MediaItem {
    url: string;
    altText?: string | null;
    key?: string;
  }

  interface Props {
    images: MediaItem[];
    initialIndex?: number;
    isOpen: boolean;
    onclose: () => void;
  }

  let { images = [], initialIndex = 0, isOpen = false, onclose }: Props = $props();

  let currentIndex = $state(0);

  $effect(() => {
    if (isOpen) {
      currentIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
    }
  });

  let currentImage = $derived(images[currentIndex] || null);

  function prev() {
    if (images.length === 0) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  function next() {
    if (images.length === 0) return;
    currentIndex = (currentIndex + 1) % images.length;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "Escape") {
      onclose();
    } else if (e.key === "ArrowLeft") {
      prev();
    } else if (e.key === "ArrowRight") {
      next();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && currentImage}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white backdrop-blur-md select-none animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    aria-label="Photo Lightbox"
  >
    <!-- Top Action Bar -->
    <div class="flex items-center justify-between px-6 py-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
      <!-- Counter & Title -->
      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono font-medium tracking-wider">
          {currentIndex + 1} / {images.length}
        </span>
        {#if currentImage.altText}
          <span class="text-xs text-white/80 max-w-sm truncate hidden sm:inline-block">
            {currentImage.altText}
          </span>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <a
          href={currentImage.url}
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Open original image"
        >
          <ExternalLink class="h-4 w-4" />
        </a>
        <button
          type="button"
          class="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          onclick={onclose}
          aria-label="Close Lightbox"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Center Stage -->
    <div class="relative flex-1 flex items-center justify-center p-4 sm:p-12 overflow-hidden">
      <!-- Previous Arrow -->
      {#if images.length > 1}
        <button
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all shadow-lg hover:scale-110 cursor-pointer"
          onclick={prev}
          aria-label="Previous photo"
        >
          <ChevronLeft class="h-6 w-6" />
        </button>
      {/if}

      <!-- Main Photo -->
      <div class="relative max-h-full max-w-full flex items-center justify-center">
        <img
          src={currentImage.url}
          alt={currentImage.altText || "Listing photo"}
          class="max-h-[78vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-200"
        />
      </div>

      <!-- Next Arrow -->
      {#if images.length > 1}
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all shadow-lg hover:scale-110 cursor-pointer"
          onclick={next}
          aria-label="Next photo"
        >
          <ChevronRight class="h-6 w-6" />
        </button>
      {/if}
    </div>

    <!-- Bottom Thumbnail Strip -->
    {#if images.length > 1}
      <div class="px-6 py-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2 overflow-x-auto scrollbar-none z-10">
        {#each images as img, i}
          <button
            type="button"
            class={`relative h-12 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
              i === currentIndex ? "border-primary scale-105 shadow-md" : "border-white/20 opacity-50 hover:opacity-100"
            }`}
            onclick={() => (currentIndex = i)}
            aria-label={`Jump to photo ${i + 1}`}
          >
            <img src={img.url} alt="" class="h-full w-full object-cover" loading="lazy" />
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
