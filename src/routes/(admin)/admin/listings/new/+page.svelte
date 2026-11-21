<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import {
    Store,
    ArrowLeft,
    Sparkles,
    Building2,
    MapPin,
    FolderTree,
    Phone,
    Mail,
    FileText,
    ShieldCheck,
    Check
  } from "lucide-svelte";
  import OpeningHoursScheduler from "$lib/components/forms/OpeningHoursScheduler.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let isSubmitting = $state(false);
</script>

<svelte:head>
  <title>Add New Listing | Local Directory Admin</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Breadcrumb & Header -->
  <div class="flex items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/admin/listings" class="hover:text-slate-900 transition-colors flex items-center gap-1">
          <ArrowLeft class="h-3.5 w-3.5" /> Back to All Listings
        </a>
        <span>/</span>
        <span class="text-slate-900 font-semibold">New Listing</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <Store class="h-6 w-6 text-slate-900" />
        Register New Local Business
      </h1>
      <p class="text-xs text-slate-500">
        Create a new listing draft. You will be redirected to the 10-section listing editor upon creation.
      </p>
    </div>
  </div>

  {#if form?.error}
    <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Creation Card Form -->
  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ update }) => {
        isSubmitting = false;
        await update();
      };
    }}
    class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-6"
  >
    <!-- Section 1: Core Details -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Building2 class="h-4 w-4 text-slate-700" />
        <h2 class="text-sm font-bold text-slate-900">Basic Merchant Identity</h2>
      </div>

      <div class="space-y-1.5">
        <label for="title" class="text-xs font-bold text-slate-700">
          Business Name <span class="text-rose-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Apex Multispecialty Dental & Implant Clinic"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>

      <div class="space-y-1.5">
        <label for="tagline" class="text-xs font-bold text-slate-700">
          Tagline / Catchphrase
        </label>
        <input
          id="tagline"
          name="tagline"
          type="text"
          placeholder="e.g. Pune's leading premier laser dental center"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="categoryId" class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FolderTree class="h-3.5 w-3.5 text-slate-400" /> Primary Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          >
            <option value="">— Select Category —</option>
            {#each data.categories as cat}
              <option value={cat.id}>{cat.name}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1.5">
          <label for="locationId" class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin class="h-3.5 w-3.5 text-slate-400" /> Primary Location
          </label>
          <select
            id="locationId"
            name="locationId"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          >
            <option value="">— Select Location —</option>
            {#each data.locations as loc}
              <option value={loc.id}>{loc.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Section 2: Contact & Address -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Phone class="h-4 w-4 text-slate-700" />
        <h2 class="text-sm font-bold text-slate-900">Contact & Address</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="phone" class="text-xs font-bold text-slate-700">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+91 98220 12345"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>

        <div class="space-y-1.5">
          <label for="email" class="text-xs font-bold text-slate-700">Contact Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="care@apexclinic.com"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="locality" class="text-xs font-bold text-slate-700">Locality / Landmark</label>
          <input
            id="locality"
            name="locality"
            type="text"
            placeholder="e.g. Near Rose Icon Commercial, Pimple Saudagar"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>

        <div class="space-y-1.5">
          <label for="address" class="text-xs font-bold text-slate-700">Full Postal Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Shop 104, 1st Floor, Kunal Icon Road"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="description" class="text-xs font-bold text-slate-700">Short Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Brief description of business operations, certifications, and highlights..."
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium resize-none"
        ></textarea>
      </div>
    </div>

    <!-- Section 3: Operating Hours -->
    <div class="space-y-4">
      <OpeningHoursScheduler />
    </div>

    <!-- Submit Action Bar -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <a
        href="/admin/listings"
        class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
      >
        Cancel
      </a>
      <button
        type="submit"
        disabled={isSubmitting}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
      >
        {#if isSubmitting}
          <span class="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Creating Listing...</span>
        {:else}
          <Check class="h-4 w-4" />
          <span>Create & Continue to Editor</span>
        {/if}
      </button>
    </div>
  </form>
</div>
