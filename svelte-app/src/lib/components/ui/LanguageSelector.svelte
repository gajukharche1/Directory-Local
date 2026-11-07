<script lang="ts">
  import { LOCALES, type Locale } from "$lib/i18n/translations";
  import { Globe } from "lucide-svelte";

  let currentLocale = $state<Locale>("en");

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    currentLocale = target.value as Locale;
    document.cookie = `NEXT_LOCALE=${currentLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }
</script>

<div class="flex items-center gap-1.5 text-xs text-slate-500">
  <Globe class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
  <select
    value={currentLocale}
    onchange={handleChange}
    aria-label="Select language"
    class="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
  >
    {#each LOCALES as loc}
      <option value={loc.code}>
        {loc.nativeName} ({loc.label})
      </option>
    {/each}
  </select>
</div>
