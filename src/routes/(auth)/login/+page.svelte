<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import { Loader2, Lock, Mail, AlertCircle } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let isPending = $state(false);
</script>

<svelte:head>
  <title>Sign In | Local Business Directory</title>
</svelte:head>

<div>
  <div class="mb-6">
    <h2 class="text-xl font-bold tracking-tight text-foreground">Sign in to your account</h2>
    <p class="text-xs text-muted-foreground mt-1">
      Access your listings, reviews, and community dashboard
    </p>
  </div>

  {#if form?.error}
    <div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">
      <AlertCircle class="h-4 w-4 mt-0.5 shrink-0" />
      <span>{form.error}</span>
    </div>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      isPending = true;
      return async ({ update }) => {
        isPending = false;
        await update();
      };
    }}
    class="space-y-4"
  >
    <input type="hidden" name="redirectTo" value={data.redirectTo} />

    <div>
      <label for="email" class="block text-xs font-semibold text-foreground mb-1">Email address</label>
      <div class="relative">
        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="email"
          type="email"
          name="email"
          required
          autocomplete="email"
          placeholder="name@example.com"
          class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      {#if form?.fieldErrors?.email}
        <p class="mt-1 text-xs text-destructive">{form.fieldErrors.email[0]}</p>
      {/if}
    </div>

    <div>
      <div class="flex items-center justify-between mb-1">
        <label for="password" class="block text-xs font-semibold text-foreground">Password</label>
        <a
          href="/forgot-password"
          class="text-xs text-primary hover:underline font-medium"
        >
          Forgot password?
        </a>
      </div>
      <div class="relative">
        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="password"
          type="password"
          name="password"
          required
          autocomplete="current-password"
          placeholder="••••••••••••"
          class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      {#if form?.fieldErrors?.password}
        <p class="mt-1 text-xs text-destructive">{form.fieldErrors.password[0]}</p>
      {/if}
    </div>

    <button
      type="submit"
      disabled={isPending}
      class="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary-600 disabled:opacity-50"
    >
      {#if isPending}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        <span>Verifying credentials...</span>
      {:else}
        <span>Sign In</span>
      {/if}
    </button>
  </form>

  <div class="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
    <span>Don&apos;t have an account yet? </span>
    <a href="/register" class="font-semibold text-primary hover:underline">
      Create an account
    </a>
  </div>
</div>
