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
</script>

<button
  type="button"
  role="checkbox"
  aria-checked={indeterminate ? "mixed" : checked}
  aria-label={ariaLabel}
  {disabled}
  class="h-4 w-4 rounded-md border transition-all flex items-center justify-center cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 {disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''} {checked || indeterminate
    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
    : 'border-slate-300 bg-white hover:border-slate-400'}"
  onclick={(e) => {
    if (!disabled && onchange) {
      e.stopPropagation();
      onchange(e);
    }
  }}
>
  {#if indeterminate}
    <Minus class="h-3 w-3 stroke-[3]" />
  {:else if checked}
    <Check class="h-3 w-3 stroke-[3]" />
  {/if}
</button>
