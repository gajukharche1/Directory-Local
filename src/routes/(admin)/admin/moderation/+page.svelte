<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import {
    Star,
    ShieldAlert,
    FileText,
    Building2,
    Calendar,
    CheckCircle2,
    Check,
    X,
    Loader2,
  } from "lucide-svelte";

  let { data }: { data: PageData } = $props();

  let pendingActionId = $state<string | null>(null);
</script>

<svelte:head>
  <title>Content Moderation Queue | Admin Console</title>
</svelte:head>

<div class="space-y-10">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">Content Moderation Queue</h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      Review, approve, or reject customer ratings and business ownership verification requests
    </p>
  </div>

  <!-- Section 1: Pending Customer Reviews -->
  <section class="space-y-4">
    <div class="flex items-center justify-between pb-2 border-b">
      <div class="flex items-center gap-2">
        <Star class="h-4 w-4 text-amber-500" />
        <h2 class="text-base font-bold text-foreground">
          Customer Reviews ({data.pendingReviews.length})
        </h2>
      </div>
      <span class="text-xs text-muted-foreground">Auto-aggregates average rating on approval</span>
    </div>

    {#if data.pendingReviews.length === 0}
      <div class="rounded-xl border border-dashed bg-card p-8 text-center shadow-xs">
        <CheckCircle2 class="h-8 w-8 text-emerald-600 mx-auto mb-2" />
        <p class="text-xs font-semibold text-foreground">All customer reviews are moderated</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each data.pendingReviews as rev (rev.id)}
          <div class="rounded-xl border bg-card p-5 shadow-card space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5">
                  {#each Array.from({ length: rev.rating }) as _}
                    <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {/each}
                </div>
                <span class="font-bold text-sm text-foreground">{rev.reviewerName}</span>
                <span class="text-xs text-muted-foreground">
                  (Hashed: {rev.reviewerEmailHash.substring(0, 10)}...)
                </span>
              </div>

              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <div class="flex items-center gap-1 bg-muted px-2 py-0.5 rounded font-medium text-foreground">
                  <Building2 class="h-3 w-3 text-primary" />
                  <span>{rev.listing.title}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-1">
                  <Calendar class="h-3 w-3" />
                  <span>{new Date(rev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-xs text-foreground mb-1">{rev.title}</h4>
              <p class="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {rev.body}
              </p>
            </div>

            <div class="pt-2 border-t flex justify-end gap-2">
              <form
                method="POST"
                action="?/approveReview"
                use:enhance={() => {
                  pendingActionId = `approve-${rev.id}`;
                  return async ({ update }) => {
                    pendingActionId = null;
                    await update();
                  };
                }}
              >
                <input type="hidden" name="reviewId" value={rev.id} />
                <button
                  type="submit"
                  disabled={pendingActionId === `approve-${rev.id}`}
                  class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {#if pendingActionId === `approve-${rev.id}`}
                    <Loader2 class="h-3 w-3 animate-spin" />
                  {:else}
                    <Check class="h-3 w-3" />
                  {/if}
                  <span>Approve</span>
                </button>
              </form>

              <form
                method="POST"
                action="?/rejectReview"
                use:enhance={() => {
                  pendingActionId = `reject-${rev.id}`;
                  return async ({ update }) => {
                    pendingActionId = null;
                    await update();
                  };
                }}
              >
                <input type="hidden" name="reviewId" value={rev.id} />
                <button
                  type="submit"
                  disabled={pendingActionId === `reject-${rev.id}`}
                  class="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition disabled:opacity-50"
                >
                  <X class="h-3 w-3" />
                  <span>Reject / Spam</span>
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Section 2: Pending Business Claim Requests -->
  <section class="space-y-4">
    <div class="flex items-center justify-between pb-2 border-b">
      <div class="flex items-center gap-2">
        <ShieldAlert class="h-4 w-4 text-blue-500" />
        <h2 class="text-base font-bold text-foreground">
          Ownership Verification Claims ({data.pendingClaims.length})
        </h2>
      </div>
      <span class="text-xs text-muted-foreground">Assigns ownership on approval</span>
    </div>

    {#if data.pendingClaims.length === 0}
      <div class="rounded-xl border border-dashed bg-card p-8 text-center shadow-xs">
        <CheckCircle2 class="h-8 w-8 text-emerald-600 mx-auto mb-2" />
        <p class="text-xs font-semibold text-foreground">No pending ownership claims</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each data.pendingClaims as claim (claim.id)}
          <div class="rounded-xl border bg-card p-5 shadow-card space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
              <div>
                <h3 class="font-bold text-sm text-foreground">{claim.listing.title}</h3>
                <span class="text-xs text-muted-foreground">{claim.listing.locality}</span>
              </div>

              <div class="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar class="h-3.5 w-3.5" />
                <span>{new Date(claim.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <!-- Claimant Info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-lg">
              <div>
                <span class="text-muted-foreground block text-[11px]">Claimant</span>
                <span class="font-semibold text-foreground">{claim.user.name}</span>
                <span class="text-muted-foreground block text-[11px]">{claim.user.email}</span>
              </div>

              <div>
                <span class="text-muted-foreground block text-[11px]">Claimant Phone</span>
                <span class="font-semibold text-foreground">{claim.user.phone || "Not provided"}</span>
              </div>
            </div>

            <!-- Proof link -->
            <div class="text-xs flex items-center gap-2">
              <FileText class="h-4 w-4 text-primary shrink-0" />
              <span class="font-medium text-foreground">Proof Document:</span>
              <a
                href={claim.proofFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary font-semibold hover:underline truncate max-w-md"
              >
                {claim.proofFileUrl}
              </a>
            </div>

            {#if claim.note}
              <div class="text-xs bg-muted/20 p-2.5 rounded-lg border border-dashed text-muted-foreground">
                <span class="font-semibold text-foreground block mb-0.5">Claimant Note:</span>
                {claim.note}
              </div>
            {/if}

            <div class="pt-2 border-t flex justify-end gap-2">
              <form
                method="POST"
                action="?/approveClaim"
                use:enhance={() => {
                  pendingActionId = `approveClaim-${claim.id}`;
                  return async ({ update }) => {
                    pendingActionId = null;
                    await update();
                  };
                }}
              >
                <input type="hidden" name="claimId" value={claim.id} />
                <button
                  type="submit"
                  disabled={pendingActionId === `approveClaim-${claim.id}`}
                  class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {#if pendingActionId === `approveClaim-${claim.id}`}
                    <Loader2 class="h-3 w-3 animate-spin" />
                  {:else}
                    <Check class="h-3 w-3" />
                  {/if}
                  <span>Verify & Approve</span>
                </button>
              </form>

              <form
                method="POST"
                action="?/rejectClaim"
                use:enhance={() => {
                  pendingActionId = `rejectClaim-${claim.id}`;
                  return async ({ update }) => {
                    pendingActionId = null;
                    await update();
                  };
                }}
              >
                <input type="hidden" name="claimId" value={claim.id} />
                <button
                  type="submit"
                  disabled={pendingActionId === `rejectClaim-${claim.id}`}
                  class="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition disabled:opacity-50"
                >
                  <X class="h-3 w-3" />
                  <span>Reject</span>
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
