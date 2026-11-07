<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import { Star, MessageSquare, Building2, Calendar, Loader2 } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let activeReplyId = $state<string | null>(null);
  let isSubmitting = $state(false);
</script>

<svelte:head>
  <title>Customer Reviews | Business Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">Customer Reviews</h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      Read neighbor ratings and submit official owner replies to customer feedback
    </p>
  </div>

  {#if data.reviews.length === 0}
    <div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">
      <Star class="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
      <h3 class="font-bold text-sm text-foreground">No customer reviews yet</h3>
      <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        Reviews left by verified neighborhood residents will appear here for you to read and reply.
      </p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.reviews as rev (rev.id)}
        <div class="rounded-xl border bg-card p-5 shadow-card space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-0.5">
                {#each Array.from({ length: rev.rating }) as _}
                  <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {/each}
              </div>
              <span class="font-bold text-sm text-foreground">{rev.reviewerName}</span>
              <span
                class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full {rev.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}"
              >
                {rev.status}
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <div class="flex items-center gap-1 font-medium text-foreground bg-muted px-2 py-0.5 rounded">
                <Building2 class="h-3 w-3 text-primary" />
                <span>{rev.listing.title}</span>
              </div>
              <span>•</span>
              <div class="flex items-center gap-1">
                <Calendar class="h-3 w-3" />
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-xs text-foreground mb-1">{rev.title}</h4>
            <p class="text-xs text-muted-foreground leading-relaxed">{rev.body}</p>
          </div>

          <!-- Owner Reply Block -->
          {#if rev.ownerReply}
            <div class="rounded-lg bg-muted/60 p-3 text-xs border-l-2 border-primary space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-foreground text-[11px]">Your Response:</span>
                {#if rev.ownerReplyAt}
                  <span class="text-[10px] text-muted-foreground">
                    {new Date(rev.ownerReplyAt).toLocaleDateString()}
                  </span>
                {/if}
              </div>
              <p class="text-muted-foreground">{rev.ownerReply}</p>
            </div>
          {:else if activeReplyId === rev.id}
            <form
              method="POST"
              action="?/reply"
              use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                  isSubmitting = false;
                  activeReplyId = null;
                  await update();
                };
              }}
              class="pt-2 border-t space-y-2"
            >
              <input type="hidden" name="reviewId" value={rev.id} />
              <textarea
                name="replyText"
                required
                rows="2"
                placeholder="Write a professional and polite response to this customer review..."
                class="w-full rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              ></textarea>
              <div class="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  class="rounded-lg bg-primary py-1.5 px-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary-600 transition disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {#if isSubmitting}
                    <Loader2 class="h-3 w-3 animate-spin" />
                    <span>Posting...</span>
                  {:else}
                    <span>Post Response</span>
                  {/if}
                </button>
                <button
                  type="button"
                  onclick={() => (activeReplyId = null)}
                  class="text-xs text-muted-foreground hover:text-foreground py-1.5 px-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          {:else}
            <button
              type="button"
              onclick={() => (activeReplyId = rev.id)}
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <MessageSquare class="h-3.5 w-3.5" />
              <span>Reply as Business Owner</span>
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
