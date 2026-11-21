<script lang="ts">
  import Skeleton from "$lib/components/ui/Skeleton.svelte";

  let { count = 4 }: { count?: number } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {#each Array(count) as _}
    <div class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-3">
      <div class="flex items-center justify-between">
        <Skeleton variant="circle" class="h-10 w-10" />
        <Skeleton variant="rectangle" class="w-14 h-5 rounded-full" />
      </div>
      <Skeleton variant="text" class="w-3/4 h-4" />
      <Skeleton variant="text" class="w-full h-3 opacity-70" />
    </div>
  {/each}
</div>
