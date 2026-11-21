<script lang="ts">
  import {
    Star,
    CheckCircle,
    MessageSquare,
    CornerDownRight,
    Filter,
    ShieldCheck,
  } from "lucide-svelte";

  interface ReviewItem {
    id: string;
    rating: number;
    title: string;
    body: string;
    reviewerName: string;
    verifiedVisit?: boolean;
    ownerReply?: string | null;
    ownerReplyAt?: string | Date | null;
    createdAt?: string | Date;
  }

  interface Props {
    reviews: ReviewItem[];
    averageRating: number | string;
    reviewCount: number;
    listingId: string;
    listingSlug: string;
  }

  let {
    reviews = [],
    averageRating = 0,
    reviewCount = 0,
    listingId,
    listingSlug,
  }: Props = $props();

  let selectedRatingFilter = $state<number | null>(null);

  let ratingNum = $derived(Number(averageRating) || 0);

  // Compute 5-star histogram distribution
  let histogram = $derived.by(() => {
    const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
      counts[idx]++;
    });

    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star - 1];
      const percent = Math.round((count / total) * 100);
      return { star, count, percent };
    });
  });

  let filteredReviews = $derived.by(() => {
    if (!selectedRatingFilter) return reviews;
    return reviews.filter((r) => Math.round(r.rating) === selectedRatingFilter);
  });
</script>

<div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
  <!-- Rating Overview & Histogram Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
    <!-- Big Rating Score Capsule -->
    <div class="flex items-center gap-4">
      <div class="h-20 w-20 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md">
        <span class="text-3xl font-extrabold font-mono tracking-tight leading-none">
          {ratingNum > 0 ? ratingNum.toFixed(1) : "—"}
        </span>
        <div class="flex items-center gap-0.5 mt-1">
          {#each Array(5) as _, i}
            <Star class={`h-3 w-3 ${i < Math.round(ratingNum) ? "fill-white text-white" : "text-white/40"}`} />
          {/each}
        </div>
      </div>

      <div>
        <h3 class="text-base font-bold text-foreground">Verified Customer Ratings</h3>
        <p class="text-xs text-muted-foreground mt-0.5 font-mono">
          Based on {reviewCount} verified consumer experiences
        </p>
        <a
          href={`/reviews/new?listingId=${listingId}&slug=${listingSlug}`}
          class="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          ★ Rate & Write a Review
        </a>
      </div>
    </div>

    <!-- Rating Histogram Bars -->
    <div class="w-full md:w-72 space-y-1.5">
      {#each histogram as item}
        <button
          type="button"
          class={`w-full flex items-center gap-2 text-xs group cursor-pointer transition-opacity ${
            selectedRatingFilter && selectedRatingFilter !== item.star ? "opacity-40" : "opacity-100"
          }`}
          onclick={() => {
            selectedRatingFilter = selectedRatingFilter === item.star ? null : item.star;
          }}
        >
          <span class="w-12 text-left font-mono font-medium text-muted-foreground group-hover:text-foreground">
            {item.star} Star
          </span>
          <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={`width: ${item.percent}%`}
            ></div>
          </div>
          <span class="w-8 text-right font-mono text-[11px] text-muted-foreground">
            {item.count}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Review Cards Section -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xs font-bold text-foreground">
        {selectedRatingFilter ? `${selectedRatingFilter} Star Reviews` : "Recent Feedback"} ({filteredReviews.length})
      </h4>
      {#if selectedRatingFilter}
        <button
          type="button"
          class="text-xs text-primary underline cursor-pointer"
          onclick={() => (selectedRatingFilter = null)}
        >
          Clear filter
        </button>
      {/if}
    </div>

    {#if filteredReviews.length === 0}
      <div class="p-8 text-center rounded-2xl border border-dashed border-border/80 text-xs text-muted-foreground">
        No reviews recorded for this filter. Be the first to share your experience!
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredReviews as review (review.id)}
          <div class="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2.5">
            <!-- Reviewer Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center font-mono uppercase">
                  {review.reviewerName ? review.reviewerName[0] : "C"}
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-foreground">{review.reviewerName || "Customer"}</span>
                    {#if review.verifiedVisit}
                      <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold">
                        <ShieldCheck class="h-3 w-3" /> Verified Visit
                      </span>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="flex items-center gap-0.5">
                {#each Array(5) as _, i}
                  <Star class={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                {/each}
              </div>
            </div>

            <!-- Review Title & Body -->
            <div class="space-y-1">
              {#if review.title}
                <p class="text-xs font-bold text-foreground">{review.title}</p>
              {/if}
              <p class="text-xs text-muted-foreground leading-relaxed">
                {review.body}
              </p>
            </div>

            <!-- Owner Response Thread -->
            {#if review.ownerReply}
              <div class="mt-3 p-3 rounded-xl bg-card border border-border/70 flex items-start gap-2 text-xs">
                <CornerDownRight class="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div class="space-y-0.5">
                  <p class="font-bold text-foreground text-[11px]">Response from Owner</p>
                  <p class="text-muted-foreground leading-relaxed">{review.ownerReply}</p>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
