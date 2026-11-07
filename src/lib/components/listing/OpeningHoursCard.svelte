<script lang="ts">
  import { Clock, CheckCircle2, XCircle } from "lucide-svelte";
  import { getOpeningStatus, type WeekSchedule } from "$lib/utils/opening-hours";

  let { openingHours }: { openingHours: unknown } = $props();

  const daysDisplay: Array<{ key: keyof WeekSchedule; label: string }> = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  function formatTime12h(time24: string): string {
    const [hStr, mStr] = time24.split(":");
    const h = parseInt(hStr || "0", 10);
    const m = mStr || "00";
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
  }

  let status = $derived(getOpeningStatus(openingHours));
  let schedule = $derived(openingHours as Partial<WeekSchedule> | null);
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <Clock class="h-4 w-4 text-indigo-600" />
      <h3 class="font-bold text-sm text-slate-900">Business Hours</h3>
    </div>

    <span
      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold {status.isOpen
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-rose-50 text-rose-700 border border-rose-200'}"
    >
      {#if status.isOpen}
        <CheckCircle2 class="h-3 w-3" />
      {:else}
        <XCircle class="h-3 w-3" />
      {/if}
      <span>{status.statusText}</span>
    </span>
  </div>

  {#if schedule}
    <div class="space-y-2 text-xs">
      {#each daysDisplay as { key, label }}
        {@const day = schedule[key]}
        {@const isClosed = !day || day.closed}
        <div class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
          <span class="font-medium text-slate-800">{label}</span>
          <span class={isClosed ? "text-rose-600 font-semibold" : "text-slate-500"}>
            {isClosed ? "Closed" : `${formatTime12h(day!.open)} - ${formatTime12h(day!.close)}`}
          </span>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-xs text-slate-400">Opening hours not provided by owner.</p>
  {/if}
</div>
