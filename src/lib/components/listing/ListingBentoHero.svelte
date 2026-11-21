<script lang="ts">
  import { Camera, Image as ImageIcon, Sparkles } from "lucide-svelte";
  import ListingLightboxModal from "./ListingLightboxModal.svelte";

  interface MediaItem {
    url: string;
    altText?: string | null;
    key?: string;
  }

  interface Props {
    images: MediaItem[];
    businessTitle: string;
    categoryName?: string;
  }

  let { images = [], businessTitle, categoryName = "Local Business" }: Props = $props();

  let lightboxOpen = $state(false);
  let activeImageIndex = $state(0);

  function openLightbox(index: number) {
    activeImageIndex = index;
    lightboxOpen = true;
  }

  // Pre-fill or normalize up to 5 slots for Bento
  let hasImages = $derived(images.length > 0);
  let displayImages = $derived(images.slice(0, 5));
  let remainingCount = $derived(Math.max(0, images.length - 5));
</script>

<!-- Bento Grid Container -->
<div class="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
  {#if !hasImages}
    <!-- Zero State Fallback Banner -->
    <div class="relative w-full h-72 sm:h-96 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div class="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
        <ImageIcon class="h-8 w-8 text-indigo-300" />
      </div>
      <h2 class="text-xl sm:text-2xl font-bold tracking-tight">{businessTitle}</h2>
      <p class="text-xs text-indigo-200/80 mt-1 max-w-sm">
        {categoryName} • Official Business Profile
      </p>
    </div>
  {:else if images.length === 1}
    <!-- Single Hero Image Layout -->
    <div
      role="button"
      tabindex="0"
      class="group relative w-full h-72 sm:h-[420px] overflow-hidden cursor-pointer bg-slate-950"
      onclick={() => openLightbox(0)}
      onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(0)}
    >
      <img
        src={images[0].url}
        alt={images[0].altText || businessTitle}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    </div>
  {:else}
    <!-- Desktop 5-Tile Bento Grid (hidden on mobile, visible sm+) -->
    <div class="hidden sm:grid sm:grid-cols-4 sm:grid-rows-2 gap-2 h-[420px] p-2 bg-slate-950">
      <!-- Main Showcase Tile (Spans 2 cols & 2 rows) -->
      <div
        role="button"
        tabindex="0"
        class="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
        onclick={() => openLightbox(0)}
        onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(0)}
      >
        <img
          src={displayImages[0].url}
          alt={displayImages[0].altText || `${businessTitle} Main`}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <!-- Tile 2 (Top Middle) -->
      {#if displayImages[1]}
        <div
          role="button"
          tabindex="0"
          class="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
          onclick={() => openLightbox(1)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(1)}
        >
          <img
            src={displayImages[1].url}
            alt={displayImages[1].altText || `${businessTitle} 2`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      {/if}

      <!-- Tile 3 (Top Right) -->
      {#if displayImages[2]}
        <div
          role="button"
          tabindex="0"
          class="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
          onclick={() => openLightbox(2)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(2)}
        >
          <img
            src={displayImages[2].url}
            alt={displayImages[2].altText || `${businessTitle} 3`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      {/if}

      <!-- Tile 4 (Bottom Middle) -->
      {#if displayImages[3]}
        <div
          role="button"
          tabindex="0"
          class="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
          onclick={() => openLightbox(3)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(3)}
        >
          <img
            src={displayImages[3].url}
            alt={displayImages[3].altText || `${businessTitle} 4`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      {/if}

      <!-- Tile 5 (Bottom Right - with +N overlay if more) -->
      {#if displayImages[4]}
        <div
          role="button"
          tabindex="0"
          class="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
          onclick={() => openLightbox(4)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(4)}
        >
          <img
            src={displayImages[4].url}
            alt={displayImages[4].altText || `${businessTitle} 5`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {#if remainingCount > 0}
            <div class="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 group-hover:bg-black/70 transition-colors">
              <Camera class="h-6 w-6 mb-1 text-white" />
              <span class="text-sm font-bold font-mono">+{remainingCount} Photos</span>
              <span class="text-[10px] text-white/80">View all</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Mobile Horizontal Snap Carousel (visible < sm) -->
    <div class="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-72">
      {#each images as img, idx}
        <div
          role="button"
          tabindex="0"
          class="w-full h-full shrink-0 snap-center relative cursor-pointer"
          onclick={() => openLightbox(idx)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(idx)}
        >
          <img
            src={img.url}
            alt={img.altText || `${businessTitle} ${idx + 1}`}
            class="w-full h-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
            {idx + 1} / {images.length}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Floating "View All Photos" Pill Badge (bottom-right) -->
  {#if hasImages}
    <button
      type="button"
      class="absolute bottom-4 right-4 z-10 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-semibold shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
      onclick={() => openLightbox(0)}
    >
      <Camera class="h-4 w-4 text-primary" />
      <span>View All {images.length} Photos</span>
    </button>
  {/if}
</div>

<!-- Fullscreen Lightbox Modal -->
<ListingLightboxModal
  images={images}
  initialIndex={activeImageIndex}
  isOpen={lightboxOpen}
  onclose={() => (lightboxOpen = false)}
/>
