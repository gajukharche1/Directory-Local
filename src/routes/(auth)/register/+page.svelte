<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import { Loader2, Lock, Mail, User, Phone, Store, UserCheck, AlertCircle } from "lucide-svelte";

  let { form }: { form: ActionData } = $props();

  let role = $state<"visitor" | "owner">("visitor");
  let isPending = $state(false);
</script>

<svelte:head>
  <title>Create an Account | Local Business Directory</title>
</svelte:head>

<div>
  <div class="mb-6">
    <h2 class="text-xl font-bold tracking-tight text-foreground">Create your account</h2>
    <p class="text-xs text-muted-foreground mt-1">
      Join the Local Business local business community
    </p>
  </div>

  {#if form?.error}
    <div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2">
      <AlertCircle class="h-4 w-4 mt-0.5 shrink-0" />
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Account Type Toggle -->
  <div class="mb-5 grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
    <button
      type="button"
      onclick={() => (role = "visitor")}
      class="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all {role === 'visitor'
        ? 'bg-card text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'}"
    >
      <UserCheck class="h-3.5 w-3.5" />
      <span>Resident / Visitor</span>
    </button>
    <button
      type="button"
      onclick={() => (role = "owner")}
      class="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all {role === 'owner'
        ? 'bg-card text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'}"
    >
      <Store class="h-3.5 w-3.5" />
      <span>Business Owner</span>
    </button>
  </div>

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
    <input type="hidden" name="role" value={role} />

    <div>
      <label for="name" class="block text-xs font-semibold text-foreground mb-1">Full Name</label>
      <div class="relative">
        <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="name"
          type="text"
          name="name"
          required
          placeholder={role === "owner" ? "e.g. Rajesh Kulkarni" : "e.g. Pooja Sharma"}
          class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      {#if form?.fieldErrors?.name}
        <p class="mt-1 text-xs text-destructive">{form.fieldErrors.name[0]}</p>
      {/if}
    </div>

    <div>
      <label for="reg-email" class="block text-xs font-semibold text-foreground mb-1">Email address</label>
      <div class="relative">
        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="reg-email"
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      {#if form?.fieldErrors?.email}
        <p class="mt-1 text-xs text-destructive">{form.fieldErrors.email[0]}</p>
      {/if}
    </div>

    <div>
      <label for="phone" class="block text-xs font-semibold text-foreground mb-1">
        Mobile Number {role === "owner" ? "(Required for lead notifications)" : "(Optional)"}
      </label>
      <div class="relative">
        <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+919876543210"
          required={role === "owner"}
          class="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
      {#if form?.fieldErrors?.phone}
        <p class="mt-1 text-xs text-destructive">{form.fieldErrors.phone[0]}</p>
      {/if}
    </div>

    <div>
      <label for="reg-password" class="block text-xs font-semibold text-foreground mb-1">Password</label>
      <div class="relative">
        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="reg-password"
          type="password"
          name="password"
          required
          placeholder="Min. 8 characters with 1 uppercase & 1 number"
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
        <span>Creating account...</span>
      {:else}
        <span>Create {role === "owner" ? "Business" : ""} Account</span>
      {/if}
    </button>
  </form>

  <div class="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
    <span>Already registered? </span>
    <a href="/login" class="font-semibold text-primary hover:underline">
      Sign in
    </a>
  </div>
</div>
