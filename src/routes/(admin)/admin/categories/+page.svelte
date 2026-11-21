<script lang="ts">
  import type { PageData } from "./$types";
  import {
    FolderTree,
    Plus,
    Search,
    Sparkles,
    Layers,
    Tag,
    ChevronRight,
    ExternalLink
  } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let searchQuery = $state("");

  let filteredCategories = $derived(
    data.categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.parent?.name && cat.parent.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );
</script>

<svelte:head>
  <title>Manage Categories | Local Directory Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header with Add Action -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <FolderTree class="h-6 w-6 text-slate-900" />
        Categories & Taxonomy
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Organize directory industries, parent-child hierarchies, and homepage badges.
      </p>
    </div>

    <a
      href="/admin/categories/new"
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
    >
      <Plus class="h-4 w-4" />
      <span>Add New Category</span>
    </a>
  </div>

  <!-- Metric KPI Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Total Categories -->
    <div class="rounded-3xl p-5 border border-blue-100 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-blue-900/70">Total Categories</span>
        <p class="text-2xl font-black text-slate-900">{data.totalCategories}</p>
        <span class="text-[10px] font-semibold text-blue-700 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          All Taxonomies
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xs border border-blue-200/60">
        <FolderTree class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 2: Parent Categories -->
    <div class="rounded-3xl p-5 border border-purple-100 bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-purple-900/70">Root Categories</span>
        <p class="text-2xl font-black text-slate-900">{data.parentCategoriesCount}</p>
        <span class="text-[10px] font-semibold text-purple-700 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          Top-Level Groups
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-purple-700 flex items-center justify-center shadow-xs border border-purple-200/60">
        <Layers class="h-5 w-5" />
      </div>
    </div>

    <!-- Card 3: Featured on Home -->
    <div class="rounded-3xl p-5 border border-amber-100 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 flex items-center justify-between shadow-2xs">
      <div class="space-y-1">
        <span class="text-xs font-bold text-amber-900/70">Featured on Home</span>
        <p class="text-2xl font-black text-slate-900">{data.featuredCount}</p>
        <span class="text-[10px] font-semibold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full inline-block">
          Spotlight Chips
        </span>
      </div>
      <div class="h-11 w-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60">
        <Sparkles class="h-5 w-5" />
      </div>
    </div>
  </div>

  <!-- Search Filter -->
  <div class="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex items-center gap-2">
    <Search class="h-4 w-4 text-slate-400 ml-2 shrink-0" />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search categories by name, slug or parent group..."
      class="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
    />
  </div>

  <!-- Categories Table Card -->
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600 border-collapse">
        <thead>
          <tr class="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th class="py-3.5 px-5">Category Name</th>
            <th class="py-3.5 px-4">Slug</th>
            <th class="py-3.5 px-4">Parent Level</th>
            <th class="py-3.5 px-4 text-center">Subcategories</th>
            <th class="py-3.5 px-4 text-center">Listings</th>
            <th class="py-3.5 px-4 text-center">Featured</th>
            <th class="py-3.5 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 font-medium">
          {#if filteredCategories.length === 0}
            <tr>
              <td colspan="7" class="py-12 text-center text-slate-400 text-xs">
                No categories match your search.
              </td>
            </tr>
          {:else}
            {#each filteredCategories as category}
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <span class="font-bold text-slate-900 block leading-tight">{category.name}</span>
                      {#if category.description}
                        <span class="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{category.description}</span>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                  {category.slug}
                </td>
                <td class="py-3.5 px-4">
                  {#if category.parent}
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {category.parent.name}
                    </span>
                  {:else}
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Root
                    </span>
                  {/if}
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-700">
                  {category.subcategoriesCount}
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-900">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                    {category.listingCount}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  {#if category.featuredOnHome}
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Sparkles class="h-2.5 w-2.5 text-amber-500" /> Yes
                    </span>
                  {:else}
                    <span class="text-[11px] text-slate-400">—</span>
                  {/if}
                </td>
                <td class="py-3.5 px-5 text-right">
                  <a
                    href="/categories/{category.slug}"
                    target="_blank"
                    class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors inline-flex"
                    title="View public category page"
                  >
                    <ExternalLink class="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
