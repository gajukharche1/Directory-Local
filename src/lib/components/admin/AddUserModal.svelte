<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    UserPlus,
    X,
    Sparkles,
    Copy,
    Check,
    Eye,
    EyeOff,
    Loader2,
    Shield,
  } from "lucide-svelte";
  import { generateSecurePassword } from "$lib/utils/password-generator";

  let {
    isOpen = $bindable(false),
    onSuccess,
  }: {
    isOpen: boolean;
    onSuccess?: () => void;
  } = $props();

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let role = $state("owner");
  let status = $state("active");
  let password = $state("");
  let showPassword = $state(false);
  let copied = $state(false);
  let isSubmitting = $state(false);
  let errorMessage = $state("");

  function handleGeneratePassword() {
    password = generateSecurePassword(16);
    showPassword = true;
  }

  function handleCopyPassword() {
    if (!password) return;
    navigator.clipboard.writeText(password);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function handleClose() {
    isOpen = false;
    errorMessage = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && isOpen) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus class="h-5 w-5" />
          </div>
          <div>
            <h3 class="font-black text-sm text-slate-900">Register New User</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Create an administrative, merchant, or visitor directory account.
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
        action="?/createUser"
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
        {#if errorMessage}
          <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        {/if}

        <div class="space-y-1.5">
          <label for="userName" class="text-xs font-bold text-slate-700">Full Name</label>
          <input
            id="userName"
            name="name"
            type="text"
            required
            bind:value={name}
            placeholder="e.g. Vikram Joshi"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label for="userEmail" class="text-xs font-bold text-slate-700">Email Address</label>
            <input
              id="userEmail"
              name="email"
              type="email"
              required
              bind:value={email}
              placeholder="vikram@example.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            />
          </div>

          <div class="space-y-1.5">
            <label for="userPhone" class="text-xs font-bold text-slate-700">Phone Number (Optional)</label>
            <input
              id="userPhone"
              name="phone"
              type="tel"
              bind:value={phone}
              placeholder="+91 98220 11223"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label for="userRole" class="text-xs font-bold text-slate-700">Assigned Role</label>
            <select
              id="userRole"
              name="role"
              bind:value={role}
              class="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            >
              <option value="owner">Business Owner (Merchant)</option>
              <option value="moderator">Moderator (Queue Review)</option>
              <option value="admin">Platform Administrator</option>
              <option value="visitor">Regular Visitor</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label for="userStatus" class="text-xs font-bold text-slate-700">Initial Status</label>
            <select
              id="userStatus"
              name="status"
              bind:value={status}
              class="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
            >
              <option value="active">Active (Immediate Login)</option>
              <option value="suspended">Suspended (Blocked)</option>
            </select>
          </div>
        </div>

        <!-- Password Generator Field -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between">
            <label for="userPassword" class="text-xs font-bold text-slate-700">Account Password</label>
            <button
              type="button"
              onclick={handleGeneratePassword}
              class="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles class="h-3 w-3" />
              <span>Generate Strong Password</span>
            </button>
          </div>

          <div class="relative flex items-center">
            <input
              id="userPassword"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minlength="8"
              bind:value={password}
              placeholder="Minimum 8 characters"
              class="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />

            <div class="absolute right-2 flex items-center gap-1">
              {#if password}
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
          <p class="text-[11px] text-slate-400">
            Password is protected with native Argon2id cryptographic salt and hashing.
          </p>
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
            disabled={isSubmitting || !name || !email || !password}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {#if isSubmitting}
              <Loader2 class="h-3.5 w-3.5 animate-spin" />
              <span>Creating Account...</span>
            {:else}
              <UserPlus class="h-3.5 w-3.5" />
              <span>Create User Account</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
