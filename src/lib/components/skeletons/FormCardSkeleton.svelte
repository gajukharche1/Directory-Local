<script lang="ts">
  import Skeleton from "$lib/components/ui/Skeleton.svelte";
</script>

<div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-6">
  <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
    <Skeleton variant="circle" class="h-9 w-9" />
    <div class="space-y-1.5 flex-1">
      <Skeleton variant="text" class="w-48 h-4" />
      <Skeleton variant="text" class="w-72 h-2.5 opacity-70" />
    </div>
  </div>

  <div class="space-y-4">
    <div class="space-y-2">
      <Skeleton variant="text" class="w-32 h-3" />
      <Skeleton variant="rectangle" class="w-full h-10 rounded-xl" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Skeleton variant="text" class="w-24 h-3" />
        <Skeleton variant="rectangle" class="w-full h-10 rounded-xl" />
      </div>
      <div class="space-y-2">
        <Skeleton variant="text" class="w-28 h-3" />
        <Skeleton variant="rectangle" class="w-full h-10 rounded-xl" />
      </div>
    </div>

    <div class="space-y-2">
      <Skeleton variant="text" class="w-28 h-3" />
      <Skeleton variant="rectangle" class="w-full h-24 rounded-xl" />
    </div>
  </div>
</div>
