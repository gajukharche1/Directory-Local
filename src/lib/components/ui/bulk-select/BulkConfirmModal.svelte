<script lang="ts">
  import { AlertTriangle, Trash2, X } from "lucide-svelte";

  let {
    isOpen = false,
    title = "Confirm Action",
    message = "Are you sure you want to proceed with this bulk action?",
    confirmLabel = "Confirm",
    confirmVariant = "destructive",
    isProcessing = false,
    selectedCount,
    entityType,
    isDangerous,
    onconfirm,
    oncancel,
    onclose,
  }: {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    confirmVariant?: "destructive" | "primary";
    isProcessing?: boolean;
    selectedCount?: number;
    entityType?: string;
    isDangerous?: boolean;
    onconfirm: () => void;
    oncancel?: () => void;
    onclose?: () => void;
  } = $props();

  function handleCancel() {
    if (oncancel) oncancel();
    else if (onclose) onclose();
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-[2px] transition-all"
    onclick={(e) => {
      if (e.target === e.currentTarget && !isProcessing) handleCancel();
    }}
    onkeydown={(e) => {
      if (e.key === "Escape" && !isProcessing) handleCancel();
    }}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="w-full max-w-md rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-slate-800 animate-in zoom-in-95 space-y-4"
    >
      <div class="flex items-start gap-3.5">
        <div
          class="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 {confirmVariant === 'destructive'
            ? 'bg-rose-50 text-rose-600 border border-rose-100'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}"
        >
          <AlertTriangle class="h-5 w-5" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-bold text-slate-900">{title}</h3>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          class="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          onclick={handleCancel}
          disabled={isProcessing}
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
        <button
          type="button"
          class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          onclick={handleCancel}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 {confirmVariant === 'destructive'
            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            : 'bg-slate-900 hover:bg-slate-800'}"
          onclick={onconfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
