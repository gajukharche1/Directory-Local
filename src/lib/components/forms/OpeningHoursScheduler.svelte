<script lang="ts">
  import {
    Clock,
    Sparkles,
    Calendar,
    Check,
    RotateCcw,
    Wand2
  } from "lucide-svelte";
  import {
    DAYS_OF_WEEK,
    DAY_LABELS,
    getDefaultSchedule,
    get24x7Schedule,
    getStandardOfficeSchedule,
    parseOpeningHours,
    type DayOfWeek,
    type WeekSchedule
  } from "$lib/utils/opening-hours-parser";

  let {
    value,
    name = "openingHours",
  }: {
    value?: unknown;
    name?: string;
  } = $props();

  let schedule = $state<WeekSchedule>(parseOpeningHours(value));
  let quickParseInput = $state("");
  let parseFeedback = $state("");

  // 30-minute interval options
  const TIME_OPTIONS: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = h.toString().padStart(2, "0");
    TIME_OPTIONS.push(`${hh}:00`);
    TIME_OPTIONS.push(`${hh}:30`);
  }
  TIME_OPTIONS.push("23:59");

  function applyPreset(presetType: "retail" | "office" | "247") {
    if (presetType === "retail") schedule = getDefaultSchedule();
    else if (presetType === "office") schedule = getStandardOfficeSchedule();
    else if (presetType === "247") schedule = get24x7Schedule();
  }

  function handleQuickParse() {
    if (!quickParseInput.trim()) return;
    schedule = parseOpeningHours(quickParseInput);
    parseFeedback = "Schedule updated from text!";
    setTimeout(() => (parseFeedback = ""), 3000);
  }

  function toggleDay(day: DayOfWeek) {
    schedule[day].isOpen = !schedule[day].isOpen;
  }
</script>

<div class="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
  <!-- Hidden Form Input for SSR Form Submission -->
  <input type="hidden" {name} value={JSON.stringify(schedule)} />

  <!-- Header & Presets -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
    <div class="flex items-center gap-2.5">
      <div class="h-9 w-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60 shadow-xs">
        <Clock class="h-4.5 w-4.5" />
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Operating & Opening Hours</span>
          <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Live Schedule
          </span>
        </h3>
        <p class="text-xs text-slate-500">Configure business weekly timetable or apply rapid 1-click presets.</p>
      </div>
    </div>

    <!-- 1-Click Preset Buttons -->
    <div class="flex items-center flex-wrap gap-1.5">
      <button
        type="button"
        onclick={() => applyPreset("retail")}
        class="px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
        title="Mon-Sat 9 AM - 9 PM, Sunday Closed"
      >
        Retail (9am - 9pm)
      </button>
      <button
        type="button"
        onclick={() => applyPreset("office")}
        class="px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
        title="Mon-Fri 9 AM - 6 PM, Weekend Closed"
      >
        Office (Mon-Fri)
      </button>
      <button
        type="button"
        onclick={() => applyPreset("247")}
        class="px-2.5 py-1 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[11px] font-semibold text-amber-800 transition-colors cursor-pointer inline-flex items-center gap-1"
      >
        <Sparkles class="h-3 w-3 text-amber-500" />
        <span>24/7 Always Open</span>
      </button>
    </div>
  </div>

  <!-- Smart Shorthand Natural Language Quick Parse Bar -->
  <div class="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70 space-y-1.5">
    <div class="flex items-center gap-2">
      <Wand2 class="h-3.5 w-3.5 text-indigo-500 shrink-0 ml-1" />
      <span class="text-[11px] font-bold text-slate-700">Natural Language Shorthand Input</span>
      {#if parseFeedback}
        <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 animate-in fade-in">
          {parseFeedback}
        </span>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      <input
        type="text"
        bind:value={quickParseInput}
        placeholder="e.g. Mon-Sat: 10am-8pm, Sun: Closed or 24/7"
        class="w-full text-xs bg-white rounded-xl border border-slate-200 px-3 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        onkeydown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleQuickParse();
          }
        }}
      />
      <button
        type="button"
        onclick={handleQuickParse}
        class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
      >
        Apply
      </button>
    </div>
  </div>

  <!-- 7-Day Matrix Rows -->
  <div class="divide-y divide-slate-100">
    {#each DAYS_OF_WEEK as day}
      {@const item = schedule[day]}
      <div class="py-2.5 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 px-2 rounded-xl">
        <!-- Day Label & Toggle Switch -->
        <div class="flex items-center gap-3 w-32 sm:w-36 shrink-0">
          <button
            type="button"
            onclick={() => toggleDay(day)}
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden {item.isOpen
              ? 'bg-emerald-600'
              : 'bg-slate-300'}"
            role="switch"
            aria-checked={item.isOpen}
            aria-label={`Toggle open status for ${DAY_LABELS[day]}`}
          >
            <span
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out {item.isOpen
                ? 'translate-x-4'
                : 'translate-x-0'}"
            ></span>
          </button>
          <span class="text-xs font-bold text-slate-800 select-none {item.isOpen ? '' : 'text-slate-400'}">
            {DAY_LABELS[day]}
          </span>
        </div>

        <!-- Hours Controls or Closed Badge -->
        <div class="flex items-center justify-end gap-2 flex-1">
          {#if item.isOpen}
            <div class="flex items-center gap-1.5 animate-in fade-in duration-150">
              <select
                bind:value={item.openTime}
                class="text-xs font-mono font-medium py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                {#each TIME_OPTIONS as time}
                  <option value={time}>{time}</option>
                {/each}
              </select>

              <span class="text-xs text-slate-400 font-medium px-0.5">to</span>

              <select
                bind:value={item.closeTime}
                class="text-xs font-mono font-medium py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                {#each TIME_OPTIONS as time}
                  <option value={time}>{time}</option>
                {/each}
              </select>
            </div>
          {:else}
            <span class="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider select-none animate-in fade-in duration-150">
              Closed
            </span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
