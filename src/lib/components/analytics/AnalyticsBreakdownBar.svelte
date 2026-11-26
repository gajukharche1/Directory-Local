<script lang="ts">
  import { Phone, MessageCircle, Navigation, Globe, Mail, Share2 } from "lucide-svelte";

  interface Props {
    totals: {
      calls: number;
      whatsapps: number;
      directions: number;
      websites: number;
      enquiries: number;
      shares?: number;
    };
  }

  let { totals }: Props = $props();

  const grandTotal = $derived(
    (totals.calls || 0) +
      (totals.whatsapps || 0) +
      (totals.directions || 0) +
      (totals.websites || 0) +
      (totals.enquiries || 0) +
      (totals.shares || 0)
  );

  const channels = $derived([
    {
      id: "calls",
      label: "Phone Calls",
      count: totals.calls || 0,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
      icon: Phone,
      pct: grandTotal > 0 ? Number(((totals.calls / grandTotal) * 100).toFixed(1)) : 0,
    },
    {
      id: "whatsapps",
      label: "WhatsApp Chats",
      count: totals.whatsapps || 0,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
      icon: MessageCircle,
      pct: grandTotal > 0 ? Number(((totals.whatsapps / grandTotal) * 100).toFixed(1)) : 0,
    },
    {
      id: "directions",
      label: "Map Directions",
      count: totals.directions || 0,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
      icon: Navigation,
      pct: grandTotal > 0 ? Number(((totals.directions / grandTotal) * 100).toFixed(1)) : 0,
    },
    {
      id: "enquiries",
      label: "Leads / Quotes",
      count: totals.enquiries || 0,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgLight: "bg-purple-50",
      icon: Mail,
      pct: grandTotal > 0 ? Number(((totals.enquiries / grandTotal) * 100).toFixed(1)) : 0,
    },
    {
      id: "websites",
      label: "Website Visits",
      count: totals.websites || 0,
      color: "bg-indigo-500",
      textColor: "text-indigo-700",
      bgLight: "bg-indigo-50",
      icon: Globe,
      pct: grandTotal > 0 ? Number(((totals.websites / grandTotal) * 100).toFixed(1)) : 0,
    },
    {
      id: "shares",
      label: "Profile Shares",
      count: totals.shares || 0,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
      icon: Share2,
      pct: grandTotal > 0 ? Number((((totals.shares || 0) / grandTotal) * 100).toFixed(1)) : 0,
    },
  ]);
</script>

<div class="space-y-4">
  <!-- Segmented Percentage Progress Bar -->
  <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
    {#if grandTotal === 0}
      <div class="h-full w-full bg-slate-200/60"></div>
    {:else}
      {#each channels as ch}
        {#if ch.pct > 0}
          <div
            class="h-full {ch.color} transition-all duration-300"
            style="width: {ch.pct}%;"
            title="{ch.label}: {ch.count} ({ch.pct}%)"
          ></div>
        {/if}
      {/each}
    {/if}
  </div>

  <!-- Channel Legend Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {#each channels as ch}
      <div class="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-white">
        <div class="h-7 w-7 rounded-lg {ch.bgLight} {ch.textColor} flex items-center justify-center shrink-0">
          <ch.icon class="h-3.5 w-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold text-slate-500 truncate">{ch.label}</p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm font-extrabold text-slate-900 tabular-nums">{ch.count.toLocaleString()}</span>
            <span class="text-[10px] font-bold text-slate-400">({ch.pct}%)</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
