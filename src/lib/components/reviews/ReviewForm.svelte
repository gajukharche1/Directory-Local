<script lang="ts">
  import { Star, Loader2, CheckCircle2, AlertCircle } from "lucide-svelte";
  import { enhance } from "$app/forms";

  interface Props {
    listingId: string;
    listingTitle: string;
    slug?: string;
    initialName?: string;
    initialEmail?: string;
    form?: any;
  }

  let {
    listingId,
    listingTitle,
    slug,
    initialName = "",
    initialEmail = "",
    form = null,
  }: Props = $props();

  let rating = $state(5);
  let hoverRating = $state(0);
  let isPending = $state(false);
</script>

{#if form?.success}
  <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
    <CheckCircle2 class="h-10 w-10 text-emerald-600 mx-auto mb-2" />
    <h3 class="font-bold text-base text-slate-900 mb-1">Review Submitted!</h3>
    <p class="text-xs text-slate-600 max-w-sm mx-auto">
      {form.message}
    </p>
  </div>
{:else}
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 pb-3 border-b border-slate-100">
      <h3 class="font-bold text-base text-slate-900">Write a Review for {listingTitle}</h3>
      <p class="text-xs text-slate-500 mt-0.5">
        Share your verified experience to help neighbors in the local area
      </p>
    </div>

    {#if form?.error}
      <div class="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2">
        <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
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
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="rating" value={rating} />
      {#if slug}
        <input type="hidden" name="slug" value={slug} />
      {/if}

      <!-- Interactive Star Rating -->
      <div>
        <label for="review-rating" class="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Overall Rating
        </label>
        <div id="review-rating" class="flex items-center gap-1.5">
          {#each [1, 2, 3, 4, 5] as star}
            <button
              type="button"
              onclick={() => (rating = star)}
              onmouseenter={() => (hoverRating = star)}
              onmouseleave={() => (hoverRating = 0)}
              class="p-1 hover:scale-110 transition-transform focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                class="h-7 w-7 transition-colors {(hoverRating || rating) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200'}"
              />
            </button>
          {/each}
          <span class="ml-2 text-xs font-semibold text-slate-700">
            {rating === 5
              ? "5.0 - Excellent"
              : rating === 4
              ? "4.0 - Very Good"
              : rating === 3
              ? "3.0 - Average"
              : rating === 2
              ? "2.0 - Poor"
              : "1.0 - Terrible"}
          </span>
        </div>
      </div>

      <!-- Review Title -->
      <div>
        <label for="review-title" class="block text-xs font-semibold text-slate-700 mb-1">
          Review Headline
        </label>
        <input
          id="review-title"
          type="text"
          name="title"
          required
          placeholder="e.g. Delicious food and great outdoor ambiance!"
          class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
        {#if form?.fieldErrors?.title}
          <p class="mt-1 text-xs text-rose-600">{form.fieldErrors.title[0]}</p>
        {/if}
      </div>

      <!-- Review Body -->
      <div>
        <label for="review-body" class="block text-xs font-semibold text-slate-700 mb-1">
          Detailed Review
        </label>
        <textarea
          id="review-body"
          name="body"
          required
          rows={4}
          placeholder="What did you like or dislike? How was the service, hygiene, pricing, and staff behavior?"
          class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-y"
        ></textarea>
        {#if form?.fieldErrors?.body}
          <p class="mt-1 text-xs text-rose-600">{form.fieldErrors.body[0]}</p>
        {/if}
      </div>

      <!-- Reviewer Details -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="reviewer-name" class="block text-xs font-semibold text-slate-700 mb-1">
            Your Full Name
          </label>
          <input
            id="reviewer-name"
            type="text"
            name="reviewerName"
            value={initialName}
            required
            placeholder="e.g. Pooja Sharma"
            class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          {#if form?.fieldErrors?.reviewerName}
            <p class="mt-1 text-xs text-rose-600">{form.fieldErrors.reviewerName[0]}</p>
          {/if}
        </div>

        <div>
          <label for="reviewer-email" class="block text-xs font-semibold text-slate-700 mb-1">
            Email Address (Private & Hashed)
          </label>
          <input
            id="reviewer-email"
            type="email"
            name="reviewerEmail"
            value={initialEmail}
            required
            placeholder="name@example.com"
            class="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          {#if form?.fieldErrors?.reviewerEmail}
            <p class="mt-1 text-xs text-rose-600">{form.fieldErrors.reviewerEmail[0]}</p>
          {/if}
        </div>
      </div>

      <p class="text-[11px] text-slate-400">
        🔒 Your email is cryptographically hashed with server pepper under DPDP Act 2023. We never display or sell your email address.
      </p>

      <button
        type="submit"
        disabled={isPending}
        class="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {#if isPending}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          <span>Submitting review...</span>
        {:else}
          <span>Submit Customer Review</span>
        {/if}
      </button>
    </form>
  </div>
{/if}
