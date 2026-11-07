<script lang="ts">
  import type { PageData } from "./$types";
  import { CreditCard, Sparkles, Calendar } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Plan & Billing | Business Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">Plan & Billing</h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      View subscription status, benefits, and renewal dates for your business listings
    </p>
  </div>

  {#if data.listings.length === 0}
    <div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">
      <CreditCard class="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
      <h3 class="font-bold text-sm text-foreground">No active business listings</h3>
      <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        Once you claim or create a business listing, its subscription tier and renewal status will be shown here.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each data.listings as l (l.id)}
        <div class="rounded-xl border bg-card p-6 shadow-card space-y-4">
          <div class="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 class="font-bold text-sm text-foreground">{l.title}</h3>
              <span class="text-[11px] text-muted-foreground">{l.locality}</span>
            </div>

            <span class="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {l.plan?.name || "Free Directory"}
            </span>
          </div>

          <!-- Status details -->
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between text-muted-foreground">
              <span>Billing Period</span>
              <span class="font-semibold text-foreground">
                {l.plan?.billingPeriodDays || 365} Days
              </span>
            </div>

            <div class="flex items-center justify-between text-muted-foreground">
              <span>Photo Limit</span>
              <span class="font-semibold text-foreground">
                Up to {l.plan?.maxPhotos || 4} Photos
              </span>
            </div>

            <div class="flex items-center justify-between text-muted-foreground">
              <span>Category Limit</span>
              <span class="font-semibold text-foreground">
                Up to {l.plan?.maxCategories || 1} Categories
              </span>
            </div>

            {#if l.planExpiresAt}
              <div class="flex items-center justify-between text-muted-foreground pt-2 border-t">
                <span class="flex items-center gap-1">
                  <Calendar class="h-3.5 w-3.5" />
                  <span>Valid Until</span>
                </span>
                <span class="font-semibold text-foreground">
                  {new Date(l.planExpiresAt).toLocaleDateString()}
                </span>
              </div>
            {/if}
          </div>

          <!-- Upgrade CTA -->
          <div class="pt-3 border-t">
            <a
              href="/pricing"
              class="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition shadow-xs"
            >
              <Sparkles class="h-3.5 w-3.5" />
              <span>Upgrade / Renew Plan</span>
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
