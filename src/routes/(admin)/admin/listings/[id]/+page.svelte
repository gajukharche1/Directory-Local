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
    Clock,
    Share2,
    MessageCircle,
    Navigation,
    Send,
    Tag,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Quote,
    Search,
    ChevronDown,
    Building2,
    CreditCard,
    Eye,
  } from "lucide-svelte";
  import MediaPickerModal from "$lib/components/media/MediaPickerModal.svelte";
  import MediaDropzone from "$lib/components/media/MediaDropzone.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let listing = $derived(data.listing);
  let categories = $derived(data.categories);
  let locations = $derived(data.locations);
  let pricingPlans = $derived(data.pricingPlans);
  let owners = $derived(data.owners);

  let isSaving = $state(false);
  let showMediaPicker = $state(false);
  let showUploader = $state(false);
  let previewDescription = $state(false);

  // Core Form Fields
  let title = $state(data.listing.title || "");
  let tagline = $state(data.listing.tagline || "");
  let description = $state(data.listing.description || "");
  let status = $state(data.listing.status || "published");
  let featured = $state(Boolean(data.listing.featured));
  let priority = $state(Number(data.listing.priority) || 0);
  let planId = $state(data.listing.planId || "none");
  let ownerId = $state(data.listing.ownerId || "unassigned");

  // Categories
  let primaryCategoryId = $state(
    data.listing.categories[0]?.categoryId || (data.categories[0]?.id || "")
  );
  let secondaryCategoryIds = $state<string[]>(
    data.listing.categories.slice(1).map((c: any) => c.categoryId)
  );

  // Contact
  let phone = $state(data.listing.phone || "");
  let whatsapp = $state(data.listing.whatsapp || "");
  let email = $state(data.listing.email || "");
  let website = $state(data.listing.website || "");

  // Location
  let address = $state(data.listing.address || "");
  let locality = $state(data.listing.locality || "");
  let landmark = $state(data.listing.landmark || "");
  let latitude = $state(data.listing.latitude ? Number(data.listing.latitude) : "");
  let longitude = $state(data.listing.longitude ? Number(data.listing.longitude) : "");

  // Profile
  let yearEstablished = $state(data.listing.yearEstablished || "");
  let priceRange = $state(data.listing.priceRange || 1);

  // Amenities
  const allAmenities = [
    "Air Conditioned",
    "Free Wi-Fi",
    "Parking Available",
    "CCTV Surveillance",
    "Wheelchair Accessible",
    "Credit / Debit Cards",
    "Online Payment Accepted",
    "Cold Storage",
    "Wholesale Billing",
    "GST Invoice Provided",
    "Loading / Unloading Staff",
    "24/7 Access",
  ];
  let selectedAmenities = $state<string[]>(data.listing.amenities || []);

  function toggleAmenity(am: string) {
    if (selectedAmenities.includes(am)) {
      selectedAmenities = selectedAmenities.filter((a) => a !== am);
    } else {
      selectedAmenities = [...selectedAmenities, am];
    }
  }

  // Operating Hours
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  let rawHours = data.listing.openingHours || {};
  let schedule = $state<Record<string, { open: string; close: string; closed: boolean }>>({
    monday: { open: rawHours.monday?.open || "09:00", close: rawHours.monday?.close || "21:00", closed: Boolean(rawHours.monday?.closed) },
    tuesday: { open: rawHours.tuesday?.open || "09:00", close: rawHours.tuesday?.close || "21:00", closed: Boolean(rawHours.tuesday?.closed) },
    wednesday: { open: rawHours.wednesday?.open || "09:00", close: rawHours.wednesday?.close || "21:00", closed: Boolean(rawHours.wednesday?.closed) },
    thursday: { open: rawHours.thursday?.open || "09:00", close: rawHours.thursday?.close || "21:00", closed: Boolean(rawHours.thursday?.closed) },
    friday: { open: rawHours.friday?.open || "09:00", close: rawHours.friday?.close || "21:00", closed: Boolean(rawHours.friday?.closed) },
    saturday: { open: rawHours.saturday?.open || "09:00", close: rawHours.saturday?.close || "21:00", closed: Boolean(rawHours.saturday?.closed) },
    sunday: { open: rawHours.sunday?.open || "10:00", close: rawHours.sunday?.close || "20:00", closed: Boolean(rawHours.sunday?.closed) },
  });

  function applyPreset(preset: "all9to9" | "monSat10to8" | "24x7") {
    if (preset === "all9to9") {
      daysOfWeek.forEach((d) => {
        schedule[d] = { open: "09:00", close: "21:00", closed: false };
      });
    } else if (preset === "monSat10to8") {
      daysOfWeek.forEach((d) => {
        schedule[d] = d === "sunday"
          ? { open: "10:00", close: "18:00", closed: true }
          : { open: "10:00", close: "20:00", closed: false };
      });
    } else if (preset === "24x7") {
      daysOfWeek.forEach((d) => {
        schedule[d] = { open: "00:00", close: "23:59", closed: false };
      });
    }
  }

  function copyMonToAll() {
    const mon = schedule.monday;
    daysOfWeek.forEach((d) => {
      schedule[d] = { ...mon };
    });
  }

  // SEO & Meta Tags
  let seoTitle = $state(data.listing.seoTitle || data.listing.title || "");
  let seoDescription = $state(
    data.listing.seoDescription || (data.listing.description ? data.listing.description.replace(/<[^>]*>/g, "").slice(0, 160) : "")
  );
  let seoKeywords = $state(data.listing.seoKeywords || "");
  let ogImage = $state(data.listing.ogImage || (data.listing.media?.[0]?.url || ""));

  function autoFillFromContent() {
    const cleanTitle = title || data.listing.title;
    const cleanLocality = locality || data.listing.locality || "Local Area";
    const primaryCat = categories.find((c: any) => c.id === primaryCategoryId)?.name || "Business";
    
    // Auto-fill Title (max 60 recommended)
    const suggestedTitle = `${cleanTitle} in ${cleanLocality} | Verified Rates & Reviews`;
    seoTitle = suggestedTitle.slice(0, 60);

    // Auto-fill Description (max 160 recommended)
    const plainDesc = (description || data.listing.description || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (plainDesc) {
      seoDescription = plainDesc.slice(0, 160);
    } else {
      seoDescription = `Find contact details, rates, customer reviews, and photos for ${cleanTitle} in ${cleanLocality}. Verified local listing.`.slice(0, 160);
    }

    // Auto-fill Keywords
    const kws = [
      cleanTitle.toLowerCase(),
      cleanLocality.toLowerCase(),
      primaryCat.toLowerCase(),
      `${primaryCat.toLowerCase()} in ${cleanLocality.toLowerCase()}`,
      `best ${primaryCat.toLowerCase()}`,
      "verified reviews",
      "contact details"
    ];
    seoKeywords = kws.join(", ");

    // Auto-fill OG Image
    if (!ogImage && data.listing.media && data.listing.media.length > 0) {
      ogImage = data.listing.media[0].url;
    }
  }

  // Custom Sections / Modular Data
  let rawSections = data.listing.customSections || {};
  let highlights = $state<Array<{ title: string; desc: string }>>(
    rawSections.highlights || [
      { title: "Certified Specialist Staff", desc: "Professionally trained and accredited specialists on premise." },
      { title: "100% Genuine Formulations", desc: "Direct manufacturer sourced and quality tested products." },
      { title: "Spotless Sanitized Ambiance", desc: "Daily medical grade sanitization protocols followed." },
    ]
  );

  // Mobile Conversion Action Toggles
  let ctaConfig = $state({
    callEnabled: rawSections.cta?.callEnabled !== false,
    whatsappEnabled: rawSections.cta?.whatsappEnabled !== false,
    whatsappMessage: rawSections.cta?.whatsappMessage || `Hi, I found ${data.listing.title} on Local Directory and want to enquire.`,
    directionsEnabled: rawSections.cta?.directionsEnabled !== false,
    enquiryEnabled: rawSections.cta?.enquiryEnabled !== false,
  });

  // Services / Rate Card Items
  let services = $state<Array<{ name: string; price: string; originalPrice?: string; duration?: string; category?: string; isPopular?: boolean }>>(
    rawSections.services || [
      { name: "Consultation & Diagnostics", price: "Free", duration: "15-30 mins", category: "General", isPopular: true },
      { name: "Standard Full Package", price: "₹999", originalPrice: "₹1,499", duration: "1 hour", category: "Core Services", isPopular: true },
    ]
  );
  let newServiceName = $state("");
  let newServicePrice = $state("");
  let newServiceDuration = $state("");

  function addService() {
    if (!newServiceName.trim()) return;
    services = [
      ...services,
      {
        name: newServiceName.trim(),
        price: newServicePrice.trim() || "Inquire for Rate",
        duration: newServiceDuration.trim() || "Varies",
        category: "Services",
        isPopular: false,
      },
    ];
    newServiceName = "";
    newServicePrice = "";
    newServiceDuration = "";
  }

  function removeService(idx: number) {
    services = services.filter((_, i) => i !== idx);
  }

  // Helpers
  function formatDate(d: string | Date | null | undefined): string {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function insertFormatting(prefix: string, suffix: string = "") {
    const el = document.getElementById("descriptionTextarea") as HTMLTextAreaElement | null;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    el.value = el.value.substring(0, start) + replacement + el.value.substring(end);
    description = el.value;
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
  <title>Edit {listing.title} | Admin Directory Manager</title>
</svelte:head>

<div class="space-y-6 pb-24 max-w-6xl mx-auto">
  <!-- Top Navigation & Title Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <a href="/admin/listings" class="inline-flex items-center gap-1 hover:text-foreground font-semibold transition-colors">
          <ArrowLeft class="h-3.5 w-3.5" /> Back to Listings
        </a>
      </div>

      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-extrabold tracking-tight text-foreground truncate max-w-xl">
          Edit Listing: {listing.title}
        </h1>
        <span class={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
          status === "published"
            ? "bg-emerald-500/15 text-emerald-600"
            : status === "pending_review"
            ? "bg-amber-500/15 text-amber-600"
            : "bg-muted text-muted-foreground"
        }`}>
          {status.replace("_", " ")}
        </span>
      </div>

      <p class="text-xs text-muted-foreground font-mono">
        Created on: {formatDate(listing.createdAt)} • ID: <span class="text-foreground font-semibold">{listing.id}</span> • Last modified: {formatDate(listing.updatedAt)}
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center gap-2.5">
      <a
        href={`/listing/${listing.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
      >
        <span>View Live Page</span>
        <ExternalLink class="h-3.5 w-3.5 text-muted-foreground" />
      </a>

      <button
        type="submit"
        form="adminListingEditForm"
        disabled={isSaving}
        class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
      >
        <Save class="h-3.5 w-3.5" />
        <span>{isSaving ? "Saving..." : "Save & Update"}</span>
      </button>
    </div>
  </div>

  <!-- Notification Banner -->
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

  <!-- Master Edit Form -->
  <form
    id="adminListingEditForm"
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
    <!-- Hidden JSON Payloads -->
    <input type="hidden" name="openingHours" value={JSON.stringify(schedule)} />
    <input
      type="hidden"
      name="customSections"
      value={JSON.stringify({
        highlights,
        cta: ctaConfig,
        services,
      })}
    />
    <input type="hidden" name="amenities" value={selectedAmenities.join(", ")} />

    <!-- Section 1: 🏢 Core Identity & Business Details -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <Building2 class="h-4 w-4 text-primary" /> 1. Core Identity & Business Details
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 1 of 8</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Business Name -->
        <div class="md:col-span-2">
          <label for="title" class="block text-xs font-bold text-foreground mb-1">
            Business Name <span class="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            bind:value={title}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Tagline / Slogan -->
        <div class="md:col-span-2">
          <label for="tagline" class="block text-xs font-semibold text-foreground mb-1">
            Tagline / Punchy Storefront Slogan
          </label>
          <input
            id="tagline"
            type="text"
            name="tagline"
            bind:value={tagline}
            placeholder="e.g. Pune's premier organic hair & beauty sanctuary"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <!-- Primary Category -->
        <div>
          <label for="primaryCategory" class="block text-xs font-bold text-foreground mb-1">
            Primary Category <span class="text-destructive">*</span>
          </label>
          <select
            id="primaryCategory"
            name="categoryIds"
            bind:value={primaryCategoryId}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
          >
            {#each categories as cat (cat.id)}
              <option value={cat.id}>{cat.name}</option>
            {/each}
          </select>
        </div>

        <!-- Secondary Categories Multi-Select -->
        <div>
          <label for="secondaryCategory" class="block text-xs font-semibold text-foreground mb-1">
            Secondary / Related Categories
          </label>
          <select
            id="secondaryCategory"
            name="categoryIds"
            multiple
            class="w-full rounded-xl border border-border bg-background p-2 text-xs outline-none focus:border-primary h-20"
          >
            {#each categories as cat (cat.id)}
              {#if cat.id !== primaryCategoryId}
                <option value={cat.id} selected={secondaryCategoryIds.includes(cat.id)}>
                  {cat.name}
                </option>
              {/if}
            {/each}
          </select>
          <span class="text-[10px] text-muted-foreground mt-0.5 block">Hold Ctrl/Cmd to select multiple</span>
        </div>

        <!-- Price Range Tier -->
        <div>
          <label for="priceRange" class="block text-xs font-semibold text-foreground mb-1">
            Price Range Tier
          </label>
          <select
            id="priceRange"
            name="priceRange"
            bind:value={priceRange}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          >
            <option value="1">₹ (Economy / Budget)</option>
            <option value="2">₹₹ (Moderate)</option>
            <option value="3">₹₹₹ (Premium)</option>
            <option value="4">₹₹₹₹ (Luxury)</option>
          </select>
        </div>

        <!-- Year Established -->
        <div>
          <label for="yearEstablished" class="block text-xs font-semibold text-foreground mb-1">
            Year Established
          </label>
          <input
            id="yearEstablished"
            type="number"
            name="yearEstablished"
            bind:value={yearEstablished}
            placeholder="e.g. 2012"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>

        <!-- Rich Description Editor with Formatting Toolbar -->
        <div class="md:col-span-2 space-y-2">
          <div class="flex items-center justify-between">
            <label for="descriptionTextarea" class="block text-xs font-bold text-foreground">
              Rich Description (Markdown / HTML)
            </label>
            <button
              type="button"
              class="text-xs text-primary underline cursor-pointer"
              onclick={() => (previewDescription = !previewDescription)}
            >
              {previewDescription ? "Edit Markdown" : "Preview Output"}
            </button>
          </div>

          <!-- Formatting Toolbar -->
          <div class="flex items-center gap-1 p-1.5 rounded-xl border border-border bg-muted/30">
            <button
              type="button"
              class="p-1 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              onclick={() => insertFormatting("**", "**")}
              title="Bold"
            >
              <Bold class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="p-1 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              onclick={() => insertFormatting("*", "*")}
              title="Italic"
            >
              <Italic class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="p-1 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              onclick={() => insertFormatting("- ")}
              title="Bullet list"
            >
              <List class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="p-1 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              onclick={() => insertFormatting("> ")}
              title="Quote"
            >
              <Quote class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="p-1 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              onclick={() => insertFormatting("[", "](https://)")}
              title="Link"
            >
              <LinkIcon class="h-3.5 w-3.5" />
            </button>
          </div>

          {#if previewDescription}
            <div class="p-4 rounded-xl border border-border bg-card prose prose-sm text-xs leading-relaxed max-w-none min-h-[140px]">
              {@html description}
            </div>
          {:else}
            <textarea
              id="descriptionTextarea"
              name="description"
              bind:value={description}
              rows="6"
              class="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary leading-relaxed font-sans"
            ></textarea>
          {/if}
        </div>

        <!-- Special Highlights Cards -->
        <div class="md:col-span-2 space-y-2">
          <span class="block text-xs font-bold text-foreground">
            Special Highlights & Key USPs (3 Feature Cards)
          </span>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            {#each highlights as hl, idx}
              <div class="p-3 rounded-2xl border border-border bg-muted/20 space-y-2">
                <input
                  type="text"
                  bind:value={hl.title}
                  placeholder={`USP ${idx + 1} Title`}
                  class="w-full text-xs font-bold bg-transparent border-b border-border/60 pb-1 outline-none text-foreground"
                />
                <textarea
                  bind:value={hl.desc}
                  rows="2"
                  placeholder="Short compelling description"
                  class="w-full text-[11px] bg-transparent outline-none resize-none text-muted-foreground leading-relaxed"
                ></textarea>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: 📍 Geolocation & Landmark (APMC Focus) -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <MapPin class="h-4 w-4 text-primary" /> 2. Geolocation & Landmark (APMC Focus)
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 2 of 8</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Locality / Sector -->
        <div>
          <label for="locality" class="block text-xs font-bold text-foreground mb-1">
            Locality / APMC Market Yard Sector <span class="text-destructive">*</span>
          </label>
          <input
            id="locality"
            type="text"
            name="locality"
            bind:value={locality}
            required
            placeholder="e.g. Market Yard, Gultekdi, Pune"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <!-- Assigned Location Taxonomy -->
        <div>
          <label for="locationTaxonomy" class="block text-xs font-semibold text-foreground mb-1">
            Assigned Region Tag
          </label>
          <select
            id="locationTaxonomy"
            name="locationIds"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          >
            {#each locations as loc (loc.id)}
              <option value={loc.id} selected={listing.locations.some((l: any) => l.locationId === loc.id)}>
                {loc.name}
              </option>
            {/each}
          </select>
        </div>

        <!-- Street Address -->
        <div class="md:col-span-2">
          <label for="address" class="block text-xs font-bold text-foreground mb-1">
            Full Physical Street Address <span class="text-destructive">*</span>
          </label>
          <input
            id="address"
            type="text"
            name="address"
            bind:value={address}
            required
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <!-- Landmark & Proximity Note -->
        <div class="md:col-span-2">
          <label for="landmark" class="block text-xs font-semibold text-foreground mb-1">
            Landmark & Proximity Note
          </label>
          <input
            id="landmark"
            type="text"
            name="landmark"
            bind:value={landmark}
            placeholder="e.g. Near Gate No. 3, opposite APMC Bank, 2 mins from Highway"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <!-- Coordinates -->
        <div>
          <label for="latitude" class="block text-xs font-semibold text-foreground mb-1">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="any"
            name="latitude"
            bind:value={latitude}
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
            bind:value={longitude}
            placeholder="73.8567"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>

    <!-- Section 3: 📞 Contact & Communication -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <Phone class="h-4 w-4 text-primary" /> 3. Contact & Direct Communication
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 3 of 8</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="phone" class="block text-xs font-bold text-foreground mb-1">
            Primary Phone Number <span class="text-destructive">*</span>
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            bind:value={phone}
            placeholder="+91 98765 43210"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
          />
        </div>

        <div>
          <label for="whatsapp" class="block text-xs font-semibold text-foreground mb-1">
            WhatsApp Business Number
          </label>
          <input
            id="whatsapp"
            type="text"
            name="whatsapp"
            bind:value={whatsapp}
            placeholder="+91 98765 43210"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
          />
        </div>

        <div>
          <label for="email" class="block text-xs font-semibold text-foreground mb-1">
            Support / Business Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            bind:value={email}
            placeholder="support@business.com"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div>
          <label for="website" class="block text-xs font-semibold text-foreground mb-1">
            Official Website or Catalog URL
          </label>
          <input
            id="website"
            type="url"
            name="website"
            bind:value={website}
            placeholder="https://business.com"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>

    <!-- Section 4: 🏷️ Amenities & Facilities -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <Tag class="h-4 w-4 text-primary" /> 4. Amenities & Commercial Facilities
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 4 of 8</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each allAmenities as am}
          {@const isChecked = selectedAmenities.includes(am)}
          <button
            type="button"
            class={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
              isChecked
                ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onclick={() => toggleAmenity(am)}
          >
            <div class={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${
              isChecked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
            }`}>
              {#if isChecked}
                <Check class="h-3 w-3 stroke-[3]" />
              {/if}
            </div>
            <span class="truncate">{am}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Section 5: 🕒 Operating Hours & Schedule -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock class="h-4 w-4 text-primary" /> 5. Operating Hours & Schedule
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Configure open timings to power the live timetable badge on public storefronts
          </p>
        </div>

        <!-- Presets -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-muted text-[11px] font-medium text-foreground cursor-pointer"
            onclick={() => applyPreset("all9to9")}
          >
            All Days 9-9
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-muted text-[11px] font-medium text-foreground cursor-pointer"
            onclick={() => applyPreset("monSat10to8")}
          >
            Mon-Sat 10-8
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-muted text-[11px] font-medium text-foreground cursor-pointer"
            onclick={() => applyPreset("24x7")}
          >
            24x7 Open
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold cursor-pointer"
            onclick={copyMonToAll}
          >
            Copy Mon to All
          </button>
        </div>
      </div>

      <div class="space-y-2">
        {#each daysOfWeek as day}
          <div class="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs gap-3">
            <div class="w-28 font-bold capitalize text-foreground">{day}</div>

            <button
              type="button"
              class={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                schedule[day].closed
                  ? "bg-rose-500/15 text-rose-600"
                  : "bg-emerald-500/15 text-emerald-600"
              }`}
              onclick={() => (schedule[day].closed = !schedule[day].closed)}
            >
              {schedule[day].closed ? "Closed" : "Open"}
            </button>

            {#if !schedule[day].closed}
              <div class="flex items-center gap-2 font-mono">
                <input
                  type="time"
                  bind:value={schedule[day].open}
                  class="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none"
                />
                <span class="text-muted-foreground">to</span>
                <input
                  type="time"
                  bind:value={schedule[day].close}
                  class="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none"
                />
              </div>
            {:else}
              <span class="text-muted-foreground font-mono italic">Weekly Off / Closed</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Section 6: 📲 Mobile-Tasked Conversion Actions (CTA Customizer) -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <MessageCircle class="h-4 w-4 text-emerald-600" /> 6. Mobile Conversion Actions & CTA Dock
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 6 of 8</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Call Button Config -->
        <div class="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone class="h-3.5 w-3.5 text-primary" /> Primary Call Action
            </span>
            <input
              type="checkbox"
              bind:checked={ctaConfig.callEnabled}
              class="h-4 w-4 rounded border-border text-primary"
            />
          </div>
          <p class="text-[11px] text-muted-foreground">Enables direct tel: click-to-call on both desktop and mobile docks.</p>
        </div>

        <!-- WhatsApp Button Config -->
        <div class="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MessageCircle class="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Chat Action
            </span>
            <input
              type="checkbox"
              bind:checked={ctaConfig.whatsappEnabled}
              class="h-4 w-4 rounded border-border text-emerald-600"
            />
          </div>
          <input
            type="text"
            bind:value={ctaConfig.whatsappMessage}
            placeholder="Pre-filled WhatsApp message"
            class="w-full rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Section 7: ⚙️ Administrative Controls & Monetization -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldCheck class="h-4 w-4 text-primary" /> 7. Administrative Controls & Monetization
        </h2>
        <span class="text-[11px] text-muted-foreground font-medium">Step 7 of 8</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status -->
        <div>
          <label for="adminStatus" class="block text-xs font-bold text-foreground mb-1">
            Publication Status
          </label>
          <select
            id="adminStatus"
            name="status"
            bind:value={status}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold uppercase outline-none focus:border-primary"
          >
            <option value="published">Published</option>
            <option value="pending_review">Pending Review</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Assigned Owner -->
        <div>
          <label for="adminOwner" class="block text-xs font-semibold text-foreground mb-1">
            Assigned Business Owner
          </label>
          <select
            id="adminOwner"
            name="ownerId"
            bind:value={ownerId}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          >
            <option value="unassigned">— Unclaimed / No Owner —</option>
            {#each owners as u (u.id)}
              <option value={u.id}>{u.name} ({u.email})</option>
            {/each}
          </select>
        </div>

        <!-- Subscription Plan -->
        <div>
          <label for="adminPlan" class="block text-xs font-semibold text-foreground mb-1">
            Subscription Pricing Plan
          </label>
          <select
            id="adminPlan"
            name="planId"
            bind:value={planId}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
          >
            <option value="none">Standard Free Directory</option>
            {#each pricingPlans as plan (plan.id)}
              <option value={plan.id}>{plan.name} (Priority {plan.searchPriority})</option>
            {/each}
          </select>
        </div>

        <!-- Featured Spotlight -->
        <div class="flex items-center gap-3 pt-2">
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
            <input
              type="checkbox"
              name="featured"
              value="true"
              bind:checked={featured}
              class="h-4 w-4 rounded border-border text-primary"
            />
            <span class="inline-flex items-center gap-1 text-amber-600">
              <Sparkles class="h-3.5 w-3.5" /> Featured Spotlight
            </span>
          </label>
        </div>

        <!-- Priority Boost -->
        <div>
          <label for="adminPriority" class="block text-xs font-semibold text-foreground mb-1">
            Search Priority Boost (0-100)
          </label>
          <input
            id="adminPriority"
            type="number"
            name="priority"
            bind:value={priority}
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>

    <!-- Section 8: 🔍 Search Engine Optimization (SEO & Meta Tags) -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h2 class="text-sm font-bold text-foreground flex items-center gap-2">
            <Search class="h-4 w-4 text-primary" /> 7. Search Engine Optimization (SEO & Meta Tags)
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Configure search engine title, meta description, and keywords for Google indexation
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          onclick={autoFillFromContent}
        >
          <Sparkles class="h-3.5 w-3.5 text-amber-500" />
          <span>Auto-fill from Content</span>
        </button>
      </div>

      <div class="space-y-4">
        <!-- SEO Meta Title -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="seoTitle" class="block text-xs font-bold text-foreground">
              SEO Meta Title
            </label>
            <span class={`text-[10px] font-mono ${seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
              {seoTitle.length} / 60 recommended (max 120)
            </span>
          </div>
          <input
            id="seoTitle"
            type="text"
            name="seoTitle"
            bind:value={seoTitle}
            placeholder="e.g. Abc Listing"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary"
          />
        </div>

        <!-- SEO Meta Description -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="seoDescription" class="block text-xs font-bold text-foreground">
              SEO Meta Description
            </label>
            <span class={`text-[10px] font-mono ${seoDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
              {seoDescription.length} / 160 recommended (max 320)
            </span>
          </div>
          <textarea
            id="seoDescription"
            name="seoDescription"
            bind:value={seoDescription}
            rows="3"
            placeholder="Compelling search snippet description for Google indexation..."
            class="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary leading-relaxed font-sans"
          ></textarea>
        </div>

        <!-- SEO Keywords (Comma Separated) -->
        <div>
          <label for="seoKeywords" class="block text-xs font-bold text-foreground mb-1">
            SEO Keywords (Comma Separated)
          </label>
          <input
            id="seoKeywords"
            type="text"
            name="seoKeywords"
            bind:value={seoKeywords}
            placeholder="e.g. dentist in pimple saudagar, dental clinic kokane chowk, teeth whitening pune"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <!-- Open Graph Social Share Banner -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="ogImage" class="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Share2 class="h-3.5 w-3.5 text-primary" />
              <span>Open Graph Social Share Banner (WhatsApp, Twitter, LinkedIn)</span>
            </label>
            <span class="text-[10px] text-muted-foreground font-mono">Optimal: 1200x630px</span>
          </div>

          <input
            id="ogImage"
            type="url"
            name="ogImage"
            bind:value={ogImage}
            placeholder="https://... or click a photo below"
            class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />

          {#if listing.media && listing.media.length > 0}
            <div class="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
              <span class="text-[10px] text-muted-foreground shrink-0">Click photo to select banner:</span>
              {#each listing.media as m (m.id)}
                <button
                  type="button"
                  class={`relative h-10 w-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    ogImage === m.url ? "border-primary scale-105 shadow-sm" : "border-border/60 opacity-60 hover:opacity-100"
                  }`}
                  onclick={() => (ogImage = m.url)}
                  title="Click to set as social share banner"
                >
                  <img src={m.url} alt="" class="h-full w-full object-cover" />
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Social Media (Open Graph) Live Preview Card -->
        <div class="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
          <div class="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Share2 class="h-3.5 w-3.5 text-primary" />
            <span>Social Media (Open Graph / WhatsApp / Twitter) Preview</span>
          </div>

          <div class="max-w-md rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            {#if ogImage}
              <div class="aspect-[1.91/1] w-full bg-slate-950 overflow-hidden">
                <img src={ogImage} alt="Social share banner" class="w-full h-full object-cover" />
              </div>
            {:else}
              <div class="aspect-[1.91/1] w-full bg-muted/40 border-b border-border/60 flex flex-col items-center justify-center text-muted-foreground text-xs font-medium">
                <ImageIcon class="h-6 w-6 mb-1 text-muted-foreground/60" />
                <span>No OpenGraph Banner Selected</span>
              </div>
            {/if}

            <div class="p-3.5 space-y-1">
              <p class="text-xs font-bold text-foreground truncate">
                {seoTitle || title || "Business Title"}
              </p>
              <p class="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {seoDescription || description || "Business description preview..."}
              </p>
              <p class="text-[9px] font-mono text-muted-foreground uppercase tracking-wider pt-1">
                LOCALDIRECTORY.IN • VERIFIED LISTING
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 9: 🧩 Services & Rate Card Catalog Management -->
    <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 class="text-sm font-bold text-foreground">
            9. Services & Rate Card Catalogue ({services.length} items)
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Powers the interactive rate card tabs on the public Bento storefront
          </p>
        </div>
      </div>

      <!-- Add New Service Row -->
      <div class="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-muted/20 border border-border">
        <input
          type="text"
          bind:value={newServiceName}
          placeholder="Service Name (e.g. Organic Facial Cleanup)"
          class="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
        />
        <input
          type="text"
          bind:value={newServicePrice}
          placeholder="Price (e.g. ₹799)"
          class="w-full sm:w-32 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none font-mono"
        />
        <input
          type="text"
          bind:value={newServiceDuration}
          placeholder="Duration (45 mins)"
          class="w-full sm:w-32 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
        />
        <button
          type="button"
          class="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shrink-0"
          onclick={addService}
        >
          Add Service
        </button>
      </div>

      <!-- Existing Services List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each services as s, idx}
          <div class="flex items-center justify-between p-3 rounded-2xl border border-border/80 bg-card text-xs">
            <div>
              <p class="font-bold text-foreground">{s.name}</p>
              <p class="text-muted-foreground font-mono text-[11px]">{s.price} • {s.duration}</p>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              onclick={() => removeService(idx)}
              title="Remove item"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  </form>

  <!-- Storefront Media Gallery & Photos (Phase 03 integration) -->
  <div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
      <div>
        <h2 class="text-sm font-bold text-foreground">
          Storefront Photos & Bento Mosaic ({listing.media?.length || 0} attached)
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          Attach photos to populate the Bento Hero 5-tile mosaic and lightbox gallery
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

    <!-- Direct Upload Dropzone -->
    {#if showUploader}
      <div class="p-4 rounded-2xl border border-border/80 bg-muted/20">
        <MediaDropzone
          listingId={listing.id}
          onUploadSuccess={() => invalidateAll()}
        />
      </div>
    {/if}

    <!-- Photos Grid -->
    {#if !listing.media || listing.media.length === 0}
      <div class="p-10 text-center rounded-2xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
        No photos attached yet. Pick from Media Hub or upload new photos.
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {#each listing.media as item, idx (item.id)}
          <div class="group relative aspect-square rounded-2xl border border-border/80 overflow-hidden bg-muted/40 shadow-xs flex flex-col justify-between">
            <img
              src={item.url}
              alt={item.altText || "Listing Photo"}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {#if idx === 0}
              <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase shadow-sm">
                Primary Hero
              </div>
            {/if}

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

  <!-- Sticky Bottom Save Dock -->
  <div class="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3.5 shadow-2xl">
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
      <div class="text-xs text-muted-foreground flex items-center gap-2">
        <span>Editing</span>
        <strong class="text-foreground">{listing.title}</strong>
        <span class="text-muted-foreground/40 hidden sm:inline">•</span>
        <span class="text-emerald-600 font-semibold hidden sm:inline">Ready to save</span>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/admin/listings"
          class="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </a>

        <button
          type="submit"
          form="adminListingEditForm"
          disabled={isSaving}
          class="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Save class="h-4 w-4" />
          <span>{isSaving ? "Saving Changes..." : "Save & Update Listing"}</span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Phase 03 Media Hub Picker Modal -->
<MediaPickerModal
  isOpen={showMediaPicker}
  multiSelect={true}
  onclose={() => (showMediaPicker = false)}
  onselect={handleMediaSelected}
/>
