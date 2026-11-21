<script lang="ts">
  let {
    checked = $bindable(false),
    name,
    disabled = false,
    label,
    description,
    onchange,
  }: {
    checked: boolean;
    name?: string;
    disabled?: boolean;
    label?: string;
    description?: string;
    onchange?: (val: boolean) => void;
  } = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div class="flex items-center justify-between gap-4 py-1">
  {#if label || description}
    <div class="space-y-0.5">
      {#if label}
        <span class="text-xs font-bold text-slate-800 block">{label}</span>
      {/if}
      {#if description}
        <p class="text-[11px] text-slate-500 max-w-md leading-relaxed">{description}</p>
      {/if}
    </div>
  {/if}

  {#if name}
    <input type="hidden" {name} value={checked ? "true" : "false"} />
  {/if}

  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    tabindex={disabled ? -1 : 0}
    {disabled}
    onclick={toggle}
    onkeydown={handleKeydown}
    class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {checked
      ? 'bg-blue-600'
      : 'bg-slate-200'}"
  >
    <span
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out {checked
        ? 'translate-x-5'
        : 'translate-x-0'}"
    ></span>
  </button>
</div>
