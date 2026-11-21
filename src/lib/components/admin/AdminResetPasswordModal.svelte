<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    KeyRound,
    X,
    Sparkles,
    Copy,
    Check,
    Eye,
    EyeOff,
    Loader2,
    ShieldAlert,
  } from "lucide-svelte";
  import { generateSecurePassword } from "$lib/utils/password-generator";

  let {
    user = $bindable(null),
    onSuccess,
  }: {
    user: { id: string; name: string; email: string } | null;
    onSuccess?: () => void;
  } = $props();

  let newPassword = $state("");
  let showPassword = $state(true);
  let copied = $state(false);
  let isSubmitting = $state(false);
  let errorMessage = $state("");

  function handleGeneratePassword() {
    newPassword = generateSecurePassword(16);
    showPassword = true;
  }

  function handleCopyPassword() {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function handleClose() {
    user = null;
    newPassword = "";
    errorMessage = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && user) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if user}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <KeyRound class="h-5 w-5" />
          </div>
          <div>
            <h3 class="font-black text-sm text-slate-900">Administrative Password Reset</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Reset credentials and revoke active sessions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onclick={handleClose}
          class="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Form Body -->
      <form
        method="POST"
        action="?/resetPassword"
        use:enhance={() => {
          isSubmitting = true;
          errorMessage = "";
          return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === "failure" && result.data?.error) {
              errorMessage = String(result.data.error);
            } else if (result.type === "success") {
              handleClose();
              await update();
              onSuccess?.();
            } else {
              await update();
            }
          };
        }}
        class="p-6 space-y-4"
      >
        <input type="hidden" name="userId" value={user.id} />

        {#if errorMessage}
          <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        {/if}

        <!-- Target User Card -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Account</span>
          <p class="text-xs font-black text-slate-900 mt-0.5">{user.name}</p>
          <p class="text-[11px] text-slate-500 font-mono">{user.email}</p>
        </div>

        <!-- Security Invalidation Warning Notice -->
        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5 text-xs">
          <ShieldAlert class="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <span class="font-bold">Immediate Session Revocation</span>
            <p class="text-[11px] text-amber-700">
              Resetting this password will instantly revoke all active login sessions across all devices for this user.
            </p>
          </div>
        </div>

        <!-- Password Field with Generator -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between">
            <label for="newPassword" class="text-xs font-bold text-slate-700">New Password</label>
            <button
              type="button"
              onclick={handleGeneratePassword}
              class="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles class="h-3 w-3" />
              <span>Generate Random</span>
            </button>
          </div>

          <div class="relative flex items-center">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              minlength="8"
              bind:value={newPassword}
              placeholder="Minimum 8 characters"
              class="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />

            <div class="absolute right-2 flex items-center gap-1">
              {#if newPassword}
                <button
                  type="button"
                  onclick={handleCopyPassword}
                  class="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                  title="Copy password"
                >
                  {#if copied}
                    <Check class="h-3.5 w-3.5 text-emerald-600" />
                  {:else}
                    <Copy class="h-3.5 w-3.5" />
                  {/if}
                </button>
              {/if}

              <button
                type="button"
                onclick={() => (showPassword = !showPassword)}
                class="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {#if showPassword}
                  <EyeOff class="h-3.5 w-3.5" />
                {:else}
                  <Eye class="h-3.5 w-3.5" />
                {/if}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onclick={handleClose}
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !newPassword || newPassword.length < 8}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {#if isSubmitting}
              <Loader2 class="h-3.5 w-3.5 animate-spin" />
              <span>Resetting Credentials...</span>
            {:else}
              <KeyRound class="h-3.5 w-3.5" />
              <span>Confirm & Revoke Sessions</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
