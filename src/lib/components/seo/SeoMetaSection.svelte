<script lang="ts">
  import {
    Search,
    Wand2,
    Share2,
    Image as ImageIcon,
    Sparkles,
    Check,
    Globe
  } from "lucide-svelte";

  let {
    seoTitle = $bindable(""),
    seoDescription = $bindable(""),
    seoKeywords = $bindable(""),
    ogImage = $bindable(""),
    entityName = "",
    entityDescription = "",
    entityType = "Category",
    parentName = "",
    badgeLabel = "DIRECTORY HUB"
  }: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
    entityName?: string;
    entityDescription?: string;
    entityType?: "Category" | "Location" | "Listing";
    parentName?: string;
    badgeLabel?: string;
  } = $props();

  let autoFilledToast = $state(false);

  function handleAutoFill() {
    const name = entityName.trim() || entityType;
    const parent = parentName ? ` in ${parentName.trim()}` : " in Pune";

    if (entityType === "Category") {
      seoTitle = `${name}${parent} - Top Verified Businesses & Reviews | Local Directory`.slice(0, 70);
      seoDescription = (entityDescription.trim() ||
        `Discover top-rated ${name} services, verified businesses, ratings, contact numbers, and special deals in ${parentName || "Pune"}. Browse reviews and get instant quotes.`).slice(0, 160);
      seoKeywords = `${name.toLowerCase()}, ${name.toLowerCase()}${parent.toLowerCase()}, best ${name.toLowerCase()}, top ${name.toLowerCase()} pune, verified reviews, contact numbers, local directory`;
    } else if (entityType === "Location") {
      seoTitle = `${name} Local Business Directory - Shops, Services & Hubs | Pune`.slice(0, 70);
      seoDescription = (entityDescription.trim() ||
        `Explore verified local businesses, restaurants, doctors, fitness, shopping, and home services in ${name}, Pune. Read authentic reviews and local recommendations.`).slice(0, 160);
      seoKeywords = `${name.toLowerCase()}, ${name.toLowerCase()} pune, shops in ${name.toLowerCase()}, services in ${name.toLowerCase()}, business directory ${name.toLowerCase()}, verified listings`;
    } else {
      seoTitle = `${name}${parent}`.slice(0, 70);
      seoDescription = (entityDescription.trim() || `Explore ${name} services, deals, contact details and customer reviews.`).slice(0, 160);
      seoKeywords = `${name.toLowerCase()}, ${name.toLowerCase()} reviews, contact ${name.toLowerCase()}`;
    }

    autoFilledToast = true;
    setTimeout(() => {
      autoFilledToast = false;
    }, 2500);
  }
</script>

<!-- SEO Section Card Container -->
<div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-6">
  <!-- Section Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
    <div class="flex items-start gap-3">
      <div class="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
        <Search class="h-4 w-4" />
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Search Engine Optimization (SEO & Meta Tags)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Configure search engine title, meta description, and keywords for Google indexation
        </p>
      </div>
    </div>

    <!-- Auto-fill Action Button -->
    <div class="flex items-center gap-2 self-start sm:self-auto">
      {#if autoFilledToast}
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 animate-in fade-in">
          <Check class="h-3 w-3" /> Auto-filled!
        </span>
      {/if}
      <button
        type="button"
        onclick={handleAutoFill}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200/70 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
      >
        <Wand2 class="h-3.5 w-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
        <span>Auto-fill from Content</span>
      </button>
    </div>
  </div>

  <!-- Form Fields -->
  <div class="space-y-4">
    <!-- Field 1: SEO Meta Title -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <label for="seoTitle" class="font-bold text-slate-700">SEO Meta Title</label>
        <span class="text-[11px] text-slate-400 font-medium">
          {seoTitle?.length || 0} / 60 recommended <span class="text-slate-300">(max 120)</span>
        </span>
      </div>
      <input
        id="seoTitle"
        name="seoTitle"
        type="text"
        maxlength="120"
        bind:value={seoTitle}
        placeholder="e.g. Best Cafes & Restaurants in Pimple Saudagar | Verified Reviews"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
      />
    </div>

    <!-- Field 2: SEO Meta Description -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <label for="seoDescription" class="font-bold text-slate-700">SEO Meta Description</label>
        <span class="text-[11px] text-slate-400 font-medium">
          {seoDescription?.length || 0} / 160 recommended <span class="text-slate-300">(max 320)</span>
        </span>
      </div>
      <textarea
        id="seoDescription"
        name="seoDescription"
        rows="3"
        maxlength="320"
        bind:value={seoDescription}
        placeholder="Short, high-converting summary that appears under Google search results..."
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium resize-none leading-relaxed"
      ></textarea>
    </div>

    <!-- Field 3: SEO Keywords -->
    <div class="space-y-1.5">
      <label for="seoKeywords" class="text-xs font-bold text-slate-700">
        SEO Keywords (Comma Separated)
      </label>
      <input
        id="seoKeywords"
        name="seoKeywords"
        type="text"
        bind:value={seoKeywords}
        placeholder="e.g. dental clinic, pimple saudagar, root canal, teeth whitening, best dentist pune"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
      />
    </div>

    <!-- Field 4: Open Graph Social Share Banner -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <label for="ogImage" class="font-bold text-slate-700 flex items-center gap-1.5">
          <Share2 class="h-3.5 w-3.5 text-slate-400" />
          <span>Open Graph Social Share Banner (WhatsApp, Twitter, LinkedIn)</span>
        </label>
        <span class="text-[11px] text-slate-400 font-medium">Optimal: 1200x630px</span>
      </div>
      <div class="flex items-center gap-2">
        <input
          id="ogImage"
          name="ogImage"
          type="url"
          bind:value={ogImage}
          placeholder="https://... image URL or banner asset"
          class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
        {#if ogImage}
          <button
            type="button"
            onclick={() => (ogImage = "")}
            class="px-3 py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors cursor-pointer"
          >
            Clear
          </button>
        {/if}
      </div>
    </div>

    <!-- Field 5: Social Media Card Preview (Matching Uploaded Screenshot) -->
    <div class="pt-2 space-y-2">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Share2 class="h-3 w-3" /> Social Media (Open Graph / WhatsApp / Twitter) Preview
      </span>

      <div class="max-w-md rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
        <!-- Banner Image Area -->
        <div class="w-full aspect-[1.91/1] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
          {#if ogImage}
            <img
              src={ogImage}
              alt="Social Share Banner Preview"
              class="w-full h-full object-cover"
              onerror={(e) => {
                // If invalid image, clear or fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          {:else}
            <div class="flex flex-col items-center justify-center text-slate-400 p-4 space-y-1.5">
              <div class="h-10 w-10 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-400">
                <ImageIcon class="h-5 w-5" />
              </div>
              <span class="text-xs font-semibold text-slate-400">No OpenGraph Banner Selected</span>
            </div>
          {/if}
        </div>

        <!-- Meta Text Preview -->
        <div class="p-4 space-y-1.5">
          <p class="font-bold text-xs text-slate-900 line-clamp-1">
            {seoTitle || entityName || `New ${entityType}`}
          </p>
          <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {seoDescription || entityDescription || `Explore verified ${entityName || entityType} details, directory information, and ratings.`}
          </p>
          <div class="pt-1.5 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span>LOCALDIRECTORY.IN • {badgeLabel}</span>
            <span class="flex items-center gap-1 text-emerald-600">
              <Globe class="h-2.5 w-2.5" /> Ready to Index
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
