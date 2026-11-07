<script lang="ts">
  import { Mail, ArrowLeft } from "lucide-svelte";
  let submitted = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    submitted = true;
  }
</script>

<svelte:head>
  <title>Reset Password | Pimple Saudagar Directory</title>
</svelte:head>

<div>
  <div class="mb-6">
    <h2 class="text-xl font-bold tracking-tight text-foreground">Reset your password</h2>
    <p class="text-xs text-muted-foreground mt-1">
      Enter your registered email address to receive a secure password reset link
    </p>
  </div>

  {#if submitted}
    <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 text-center">
      If an account exists with that email address, you will receive password reset instructions shortly.
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="reset-email" class="block text-xs font-semibold text-foreground mb-1">Email address</label>
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="reset-email"
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary-600"
      >
        Send Reset Link
      </button>
    </form>
  {/if}

  <div class="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
    <a
      href="/login"
      class="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
    >
      <ArrowLeft class="h-3 w-3" />
      <span>Back to Sign In</span>
    </a>
  </div>
</div>
