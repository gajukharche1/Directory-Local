<script lang="ts">
  import { Check, Minus } from "lucide-svelte";

  let {
    checked = false,
    indeterminate = false,
    disabled = false,
    ariaLabel = "Select item",
    onchange,
  }: {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    onchange?: (e: MouseEvent) => void;
  } = $props();

  let inputEl: HTMLInputElement | null = $state(null);

  $effect(() => {
    if (inputEl) {
      inputEl.indeterminate = indeterminate;
    }
  });
</script>

<label
  class="relative inline-flex items-center justify-center cursor-pointer select-none {disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''}"
>
  <input
    bind:this={inputEl}
    type="checkbox"
    class="sr-only"
    {checked}
    {disabled}
    aria-label={ariaLabel}
    onclick={(e) => {
      if (!disabled && onchange) {
        onchange(e as MouseEvent);
      }
    }}
  />

  <div
    class="h-4 w-4 rounded-md border transition-all flex items-center justify-center {checked || indeterminate
      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
      : 'border-slate-300 bg-white hover:border-slate-400'}"
  >
    {#if indeterminate}
      <Minus class="h-3 w-3 stroke-[3]" />
    {:else if checked}
      <Check class="h-3 w-3 stroke-[3]" />
    {/if}
  </div>
</label>
