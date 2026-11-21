<script lang="ts">
  import { ShieldAlert, RefreshCw, Mail } from "lucide-svelte";
</script>

<svelte:head>
  <title>Under Scheduled Maintenance | Local Business Directory</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
  <div class="max-w-md w-full text-center space-y-6">
    <div class="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg">
      <ShieldAlert class="h-8 w-8" />
    </div>

    <div class="space-y-2">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Scheduled System Maintenance
      </span>
      <h1 class="text-2xl font-black tracking-tight text-white">We'll be right back</h1>
      <p class="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
        Our administrative team is performing routine database optimizations and upgrades. We apologize for the inconvenience and will resume service shortly.
      </p>
    </div>

    <div class="pt-4 flex items-center justify-center gap-3">
      <a
        href="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
      >
        <RefreshCw class="h-3.5 w-3.5" />
        <span>Check Status</span>
      </a>

      <a
        href="/login"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
      >
        <span>Staff Sign In</span>
      </a>
    </div>

    <p class="text-[11px] text-slate-500 pt-6">
      Need urgent support? Contact <a href="mailto:support@pimplesaudagar.local" class="text-slate-400 underline">support@pimplesaudagar.local</a>
    </p>
  </div>
</div>
