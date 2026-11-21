<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import { FolderTree, ArrowLeft, Check, Sparkles, Layers, Save } from "lucide-svelte";
  import SeoMetaSection from "$lib/components/seo/SeoMetaSection.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let nameValue = $state(data.category.name);
  let slugValue = $state(data.category.slug);
  let descriptionValue = $state(data.category.description || "");
  let parentIdValue = $state(data.category.parentId || "");
  let isSubmitting = $state(false);
  let showSuccess = $state(false);

  // SEO State
  let seoTitle = $state(data.category.seoTitle || "");
  let seoDescription = $state(data.category.seoDescription || "");
  let seoKeywords = $state(data.category.seoKeywords || "");
  let ogImage = $state(data.category.ogImage || data.category.coverImage || "");

  let selectedParentName = $derived(
    data.parentCategories.find((p) => p.id === parentIdValue)?.name || ""
  );
</script>

<svelte:head>
  <title>Edit Category: {data.category.name} | Local Directory Admin</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
  <!-- Header -->
  <div class="space-y-1">
    <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
      <a href="/admin/categories" class="hover:text-slate-900 transition-colors flex items-center gap-1">
        <ArrowLeft class="h-3.5 w-3.5" /> Back to Categories
      </a>
      <span>/</span>
      <span class="text-slate-900 font-semibold">Edit {data.category.name}</span>
    </div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <FolderTree class="h-6 w-6 text-slate-900" />
        Edit Category: {data.category.name}
      </h1>
      <span class="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
        {data.category.slug}
      </span>
    </div>
  </div>

  {#if form?.error}
    <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      {form.error}
    </div>
  {/if}

  {#if form?.success || showSuccess}
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
      <Check class="h-4 w-4 text-emerald-600" />
      <span>Category and SEO metadata updated successfully!</span>
    </div>
  {/if}

  <form
    method="POST"
    action="?/update"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ update, result }) => {
        isSubmitting = false;
        if (result.type === "success") {
          showSuccess = true;
          setTimeout(() => (showSuccess = false), 3500);
        }
        await update();
      };
    }}
    class="space-y-6"
  >
    <!-- Section 1: Basic Information -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-5">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <FolderTree class="h-4 w-4 text-slate-700" />
        <h2 class="text-sm font-bold text-slate-900">Category Attributes</h2>
      </div>

      <div class="space-y-1.5">
        <label for="name" class="text-xs font-bold text-slate-700">
          Category Name <span class="text-rose-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          bind:value={nameValue}
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>

      <div class="space-y-1.5">
        <label for="slug" class="text-xs font-bold text-slate-700">
          URL Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          bind:value={slugValue}
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        />
      </div>

      <div class="space-y-1.5">
        <label for="parentId" class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Layers class="h-3.5 w-3.5 text-slate-400" /> Parent Category
        </label>
        <select
          id="parentId"
          name="parentId"
          bind:value={parentIdValue}
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
        >
          <option value="">— None (Root Category) —</option>
          {#each data.parentCategories as parent}
            <option value={parent.id}>{parent.name}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-1.5">
        <label for="description" class="text-xs font-bold text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          bind:value={descriptionValue}
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium resize-none"
        ></textarea>
      </div>

      <div class="pt-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="space-y-0.5">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles class="h-3.5 w-3.5 text-amber-500" /> Featured on Homepage
          </span>
          <p class="text-[11px] text-slate-500">Show this category in the popular quick filter chips on the homepage.</p>
        </div>
        <input
          type="checkbox"
          id="featuredOnHome"
          name="featuredOnHome"
          checked={data.category.featuredOnHome}
          class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
        />
      </div>
    </div>

    <!-- Section 2: Search Engine Optimization (SEO & Meta Tags) -->
    <SeoMetaSection
      bind:seoTitle
      bind:seoDescription
      bind:seoKeywords
      bind:ogImage
      entityName={nameValue}
      entityDescription={descriptionValue}
      entityType="Category"
      parentName={selectedParentName}
      badgeLabel="CATEGORY DIRECTORY"
    />

    <!-- Bottom Submit Actions Bar -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <a
        href="/admin/categories"
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
          <span>Saving...</span>
        {:else}
          <Save class="h-4 w-4" />
          <span>Save Changes</span>
        {/if}
      </button>
    </div>
  </form>
</div>
