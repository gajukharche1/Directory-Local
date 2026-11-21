<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import type { PageData, ActionData } from "./$types";
  import {
    ArrowLeft,
    ExternalLink,
    Save,
    Sparkles,
    Trash2,
    Plus,
    Upload,
    Image as ImageIcon,
    ShieldCheck,
    MapPin,
    Phone,
    Globe,
    Check,
    AlertCircle,
  } from "lucide-svelte";
  import MediaPickerModal from "$lib/components/media/MediaPickerModal.svelte";
  import MediaDropzone from "$lib/components/media/MediaDropzone.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let listing = $derived(data.listing);
  let categories = $derived(data.categories);
  let locations = $derived(data.locations);

  let activeTab = $state("general");
  let showMediaPicker = $state(false);
  let showUploader = $state(false);
  let isSaving = $state(false);

  // Selected category & location IDs
  let selectedCategoryIds = $state<string[]>(
    data.listing.categories.map((c: any) => c.categoryId)
  );
  let selectedLocationIds = $state<string[]>(
    data.listing.locations.map((l: any) => l.locationId)
  );

  let amenitiesText = $state(
    (data.listing.amenities || []).join(", ")
  );

  const commonAmenities = [
    "Air Conditioned",
    "Free Wi-Fi",
    "Valet Parking",
    "Cards Accepted",
    "Wheelchair Accessible",
    "Home Delivery",
    "Online Booking",
    "Pet Friendly",
  ];

  function addAmenity(name: string) {
    const list = amenitiesText
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    if (!list.includes(name)) {
      list.push(name);
      amenitiesText = list.join(", ");
    }
  }

  async function handleMediaSelected(selectedMedia: any[]) {
    showMediaPicker = false;
    if (selectedMedia.length === 0) return;

    const mediaIds = selectedMedia.map((m) => m.id);
    const fd = new FormData();
    fd.append("mediaIds", JSON.stringify(mediaIds));

    await fetch("?/attachMedia", {
      method: "POST",
      body: fd,
    });
    await invalidateAll();
  }
</script>

<svelte:head>
  <title>Edit {listing.title} | Admin Portal</title>
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Navigation & Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <a href="/admin/listings" class="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft class="h-3.5 w-3.5" /> Back to Listings
        </a>
        <span>/</span>
        <span class="text-foreground font-medium">Edit Listing</span>
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground truncate max-w-xl">
        {listing.title}
      </h1>
      <p class="text-xs text-muted-foreground">
        ID: <span class="font-mono text-foreground">{listing.id}</span> • Slug: <span class="font-mono text-primary">{listing.slug}</span>
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <a
        href={`/listing/${listing.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
      >
        <span>View Live Profile</span>
        <ExternalLink class="h-3.5 w-3.5 text-muted-foreground" />
      </a>

      <button
        type="submit"
        form="editListingForm"
        disabled={isSaving}
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer disabled:opacity-50"
      >
        <Save class="h-3.5 w-3.5" />
        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  </div>

  <!-- Status Notification Banners -->
  {#if form?.success}
    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
      <Check class="h-4 w-4" />
      <span>{form.message || "Listing updated successfully!"}</span>
    </div>
  {:else if form?.error}
    <div class="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-in fade-in">
      <AlertCircle class="h-4 w-4" />
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Main Edit Form -->
  <form
    id="editListingForm"
    method="POST"
    action="?/update"
    use:enhance={() => {
      isSaving = true;
      return async ({ update }) => {
        isSaving = false;
        await update();
      };
    }}
    class="space-y-6"
  >
    <!-- Section 1: Core Details & Moderation -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground">1. Core Details & Moderation</h2>
        {#if listing.owner}
          <div class="text-xs text-muted-foreground">
            Owner: <span class="text-foreground font-semibold">{listing.owner.email}</span>
          </div>
        {:else}
          <span class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
            Unclaimed Business
          </span>
        {/if}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Title -->
        <div class="md:col-span-2">
          <label for="title" class="block text-xs font-semibold text-foreground mb-1">
            Business Title <span class="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={listing.title}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Moderation Status -->
        <div>
          <label for="status" class="block text-xs font-semibold text-foreground mb-1">
            Publication Status
          </label>
          <select
            id="status"
            name="status"
            value={listing.status}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold uppercase outline-none focus:border-primary"
          >
            <option value="published">Published</option>
            <option value="pending_review">Pending Review</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Featured & Priority -->
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label for="priority" class="block text-xs font-semibold text-foreground mb-1">
              Priority Rank (Higher = Top of Search)
            </label>
            <input
              id="priority"
              type="number"
              name="priority"
              value={listing.priority}
              class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
            />
          </div>

          <div class="pt-5">
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                name="featured"
                value="true"
                checked={listing.featured}
                class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span class="inline-flex items-center gap-1 text-amber-600">
                <Sparkles class="h-3.5 w-3.5" /> Featured Spotlight
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Categories & Locations -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <h2 class="text-sm font-bold text-foreground pb-3 border-b border-border/60">
        2. Categories & Assigned Locations
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Categories Multi-select -->
        <div>
          <span class="block text-xs font-semibold text-foreground mb-2">
            Categories (Select all applicable)
          </span>
          <div class="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-xl border border-border/60 bg-muted/20">
            {#each categories as cat (cat.id)}
              <label class="flex items-center gap-2 text-xs text-foreground hover:bg-muted/50 p-1 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={cat.id}
                  checked={selectedCategoryIds.includes(cat.id)}
                  onchange={(e) => {
                    if (e.currentTarget.checked) {
                      selectedCategoryIds = [...selectedCategoryIds, cat.id];
                    } else {
                      selectedCategoryIds = selectedCategoryIds.filter((id) => id !== cat.id);
                    }
                  }}
                  class="rounded border-border text-primary focus:ring-primary"
                />
                <span>{cat.name}</span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Locations Multi-select -->
        <div>
          <span class="block text-xs font-semibold text-foreground mb-2">
            Localities / City Areas
          </span>
          <div class="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-xl border border-border/60 bg-muted/20">
            {#each locations as loc (loc.id)}
              <label class="flex items-center gap-2 text-xs text-foreground hover:bg-muted/50 p-1 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="locationIds"
                  value={loc.id}
                  checked={selectedLocationIds.includes(loc.id)}
                  onchange={(e) => {
                    if (e.currentTarget.checked) {
                      selectedLocationIds = [...selectedLocationIds, loc.id];
                    } else {
                      selectedLocationIds = selectedLocationIds.filter((id) => id !== loc.id);
                    }
                  }}
                  class="rounded border-border text-primary focus:ring-primary"
                />
                <span>{loc.name}</span>
              </label>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Contact & Spatial Coordinates -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <h2 class="text-sm font-bold text-foreground pb-3 border-b border-border/60">
        3. Contact Info & Location Coordinates
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="phone" class="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={listing.phone || ""}
            placeholder="e.g. +91 98765 43210"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="whatsapp" class="block text-xs font-semibold text-foreground mb-1">WhatsApp Number</label>
          <input
            id="whatsapp"
            type="text"
            name="whatsapp"
            value={listing.whatsapp || ""}
            placeholder="e.g. +91 98765 43210"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="email" class="block text-xs font-semibold text-foreground mb-1">Contact Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={listing.email || ""}
            placeholder="contact@business.com"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="website" class="block text-xs font-semibold text-foreground mb-1">Website URL</label>
          <input
            id="website"
            type="url"
            name="website"
            value={listing.website || ""}
            placeholder="https://business.com"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div class="md:col-span-2">
          <label for="address" class="block text-xs font-semibold text-foreground mb-1">
            Street Address <span class="text-destructive">*</span>
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={listing.address}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="locality" class="block text-xs font-semibold text-foreground mb-1">
            Locality / Neighborhood <span class="text-destructive">*</span>
          </label>
          <input
            id="locality"
            type="text"
            name="locality"
            value={listing.locality}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="landmark" class="block text-xs font-semibold text-foreground mb-1">Landmark</label>
          <input
            id="landmark"
            type="text"
            name="landmark"
            value={listing.landmark || ""}
            placeholder="e.g. Near Metro Station"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="latitude" class="block text-xs font-semibold text-foreground mb-1">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="any"
            name="latitude"
            value={listing.latitude ? Number(listing.latitude) : ""}
            placeholder="18.5204"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="longitude" class="block text-xs font-semibold text-foreground mb-1">Longitude</label>
          <input
            id="longitude"
            type="number"
            step="any"
            name="longitude"
            value={listing.longitude ? Number(listing.longitude) : ""}
            placeholder="73.8567"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>

    <!-- Section 4: Details, Pricing & Amenities -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <h2 class="text-sm font-bold text-foreground pb-3 border-b border-border/60">
        4. Profile Attributes, Price Tier & Amenities
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="yearEstablished" class="block text-xs font-semibold text-foreground mb-1">Year Established</label>
          <input
            id="yearEstablished"
            type="number"
            name="yearEstablished"
            value={listing.yearEstablished || ""}
            placeholder="e.g. 2012"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="priceRange" class="block text-xs font-semibold text-foreground mb-1">Price Range</label>
          <select
            id="priceRange"
            name="priceRange"
            value={listing.priceRange || 1}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary"
          >
            <option value="1">₹ (Budget / Economy)</option>
            <option value="2">₹₹ (Moderate)</option>
            <option value="3">₹₹₹ (Premium)</option>
            <option value="4">₹₹₹₹ (Luxury)</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label for="amenities" class="block text-xs font-semibold text-foreground mb-1">
            Amenities & Features (Comma-separated)
          </label>
          <input
            id="amenities"
            type="text"
            name="amenities"
            bind:value={amenitiesText}
            placeholder="e.g. Air Conditioned, Free Wi-Fi, Parking Available"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />

          <!-- Quick suggestion pills -->
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <span class="text-[11px] text-muted-foreground mr-1">Quick Add:</span>
            {#each commonAmenities as am}
              <button
                type="button"
                class="px-2 py-0.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[10px] text-foreground transition-colors cursor-pointer"
                onclick={() => addAmenity(am)}
              >
                + {am}
              </button>
            {/each}
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="description" class="block text-xs font-semibold text-foreground mb-1">
            Rich Business Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            value={listing.description}
            class="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary leading-relaxed font-sans"
          ></textarea>
        </div>
      </div>
    </div>
  </form>

  <!-- Section 5: Attached Photos & Media Hub Integration -->
  <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
      <div>
        <h2 class="text-sm font-bold text-foreground">5. Storefront Photos & Media</h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          Attach photos to populate the Bento Hero mosaic and storefront gallery ({listing.media?.length || 0} attached)
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
          onclick={() => (showMediaPicker = true)}
        >
          <ImageIcon class="h-3.5 w-3.5 text-primary" />
          <span>Pick from Media Hub</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold cursor-pointer"
          onclick={() => (showUploader = !showUploader)}
        >
          <Upload class="h-3.5 w-3.5" />
          <span>{showUploader ? "Hide Uploader" : "Upload New"}</span>
        </button>
      </div>
    </div>

    <!-- Direct Upload Dropzone (if toggled) -->
    {#if showUploader}
      <div class="p-4 rounded-2xl border border-border/80 bg-muted/20">
        <MediaDropzone
          listingId={listing.id}
          onUploadSuccess={() => invalidateAll()}
        />
      </div>
    {/if}

    <!-- Attached Media Grid -->
    {#if !listing.media || listing.media.length === 0}
      <div class="p-10 text-center rounded-2xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
        No photos attached yet. Pick from the enterprise Media Hub or upload new photos.
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {#each listing.media as item (item.id)}
          <div class="group relative aspect-square rounded-2xl border border-border/80 overflow-hidden bg-muted/40 shadow-xs flex flex-col justify-between">
            <img
              src={item.url}
              alt={item.altText || "Listing Photo"}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <!-- Detach Button -->
            <form
              method="POST"
              action="?/detachMedia"
              use:enhance={() => {
                return async ({ update }) => {
                  await update();
                };
              }}
              class="absolute top-2 right-2"
            >
              <input type="hidden" name="mediaId" value={item.id} />
              <button
                type="submit"
                class="h-6 w-6 rounded-full bg-black/60 text-white hover:bg-destructive flex items-center justify-center transition-colors cursor-pointer shadow-md"
                title="Detach from listing"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </form>

            <div class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white">
              {(item.bytes / 1024).toFixed(0)} KB
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Sticky Bottom Save Bar -->
  <div class="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 flex items-center justify-between shadow-2xl">
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
      <div class="text-xs text-muted-foreground">
        Editing <span class="font-bold text-foreground">{listing.title}</span>
      </div>

      <button
        type="submit"
        form="editListingForm"
        disabled={isSaving}
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
      >
        <Save class="h-4 w-4" />
        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  </div>
</div>

<!-- Media Picker Modal (Phase 03 integration) -->
<MediaPickerModal
  isOpen={showMediaPicker}
  multiSelect={true}
  onclose={() => (showMediaPicker = false)}
  onselect={handleMediaSelected}
/>
