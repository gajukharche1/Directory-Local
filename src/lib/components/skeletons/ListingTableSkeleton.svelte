<script lang="ts">
  import Skeleton from "$lib/components/ui/Skeleton.svelte";

  let { rows = 6 }: { rows?: number } = $props();
</script>

<div class="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-0">
  <!-- Table Header Skeleton -->
  <div class="bg-slate-50/75 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <Skeleton variant="rectangle" class="h-4 w-4 rounded-md" />
      <Skeleton variant="text" class="w-32" />
    </div>
    <div class="hidden sm:flex items-center gap-8">
      <Skeleton variant="text" class="w-20" />
      <Skeleton variant="text" class="w-20" />
      <Skeleton variant="text" class="w-16" />
    </div>
  </div>

  <!-- Table Rows Skeleton -->
  <div class="divide-y divide-slate-100">
    {#each Array(rows) as _, i}
      <div class="px-5 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton variant="rectangle" class="h-4 w-4 rounded-md shrink-0" />
          <Skeleton variant="circle" class="h-10 w-10 shrink-0" />
          <div class="space-y-1.5 min-w-0 flex-1 max-w-sm">
            <Skeleton variant="text" class="w-3/4 h-3.5" />
            <Skeleton variant="text" class="w-1/2 h-2.5 opacity-70" />
          </div>
        </div>

        <div class="hidden md:flex items-center gap-2">
          <Skeleton variant="text" class="w-24 h-3" />
        </div>

        <div class="hidden sm:flex items-center gap-2">
          <Skeleton variant="rectangle" class="w-20 h-6 rounded-full" />
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <Skeleton variant="rectangle" class="h-8 w-8 rounded-xl" />
          <Skeleton variant="rectangle" class="h-8 w-8 rounded-xl" />
        </div>
      </div>
    {/each}
  </div>
</div>
