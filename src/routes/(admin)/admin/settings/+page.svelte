<script lang="ts">
  import {
    Settings,
    Building2,
    ShieldCheck,
    Bell,
    Globe,
    Palette,
    Check,
    Save,
    AlertTriangle
  } from "lucide-svelte";

  let savedNotice = $state(false);

  function handleSave() {
    savedNotice = true;
    setTimeout(() => {
      savedNotice = false;
    }, 3000);
  }
</script>

<svelte:head>
  <title>Site & Operational Settings | Local Directory Admin</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        <Settings class="h-6 w-6 text-slate-900" />
        Site & Directory Settings
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        Configure portal branding, operational guards, maintenance mode, and SEO defaults.
      </p>
    </div>

    {#if savedNotice}
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-in fade-in">
        <Check class="h-3.5 w-3.5" /> Settings saved!
      </div>
    {/if}
  </div>

  <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] space-y-7">
    <!-- Section 1: General Brand Identity -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Building2 class="h-4 w-4 text-slate-700" />
        <h2 class="text-sm font-bold text-slate-900">Portal Branding & Metadata</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="dirName" class="text-xs font-bold text-slate-700">Directory Brand Name</label>
          <input
            id="dirName"
            type="text"
            value="Pimple Saudagar Local Directory"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>

        <div class="space-y-1.5">
          <label for="supportEmail" class="text-xs font-bold text-slate-700">Support / Contact Email</label>
          <input
            id="supportEmail"
            type="email"
            value="support@pimplesaudagar.local"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Operational Governance & Guards -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <ShieldCheck class="h-4 w-4 text-slate-700" />
        <h2 class="text-sm font-bold text-slate-900">Operational Governance</h2>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-800">Auto-Approve Verified Merchant Claims</p>
            <p class="text-[11px] text-slate-500">Fast-track ownership claims with verified GSTIN or official business domain.</p>
          </div>
          <input type="checkbox" checked class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300" />
        </div>

        <div class="border-t border-slate-200/60 pt-3 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-800">Require Phone OTP on Customer Reviews</p>
            <p class="text-[11px] text-slate-500">Prevent spam submissions by enforcing WhatsApp / SMS OTP verification.</p>
          </div>
          <input type="checkbox" checked class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300" />
        </div>
      </div>
    </div>

    <!-- Section 3: Save Button -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
      <button
        type="button"
        onclick={handleSave}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
      >
        <Save class="h-4 w-4" />
        <span>Save Directory Configuration</span>
      </button>
    </div>
  </div>
</div>
