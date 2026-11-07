<script lang="ts">
  import { Utensils, Stethoscope, Wrench, Dumbbell, Folder, ChevronRight } from "lucide-svelte";

  interface CategoryProps {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    icon: string | null;
    listingCount: number;
    children?: Array<{
      id: string;
      slug: string;
      name: string;
    }>;
  }

  let { category }: { category: CategoryProps } = $props();

  const iconMap: Record<string, any> = {
    Utensils,
    Stethoscope,
    Wrench,
    Dumbbell,
  };

  let IconComponent = $derived((category.icon && iconMap[category.icon]) || Folder);
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between">
  <div>
    <div class="flex items-center justify-between mb-3">
      <div class="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <IconComponent class="h-5 w-5" />
      </div>
      <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
        {category.listingCount} {category.listingCount === 1 ? "listing" : "listings"}
      </span>
    </div>

    <a href={`/category/${category.slug}`} class="group">
      <h3 class="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
        <span>{category.name}</span>
        <ChevronRight class="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
    </a>

    {#if category.description}
      <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
        {category.description}
      </p>
    {/if}
  </div>

  {#if category.children && category.children.length > 0}
    <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
      {#each category.children as child}
        <a
          href={`/category/${category.slug}/${child.slug}`}
          class="text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-0.5 rounded-lg transition"
        >
          {child.name}
        </a>
      {/each}
    </div>
  {/if}
</div>
