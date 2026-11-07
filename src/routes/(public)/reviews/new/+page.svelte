<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import ReviewForm from "$lib/components/reviews/ReviewForm.svelte";
  import { ArrowLeft, ShieldCheck, Check } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let listing = $derived(data.listing);
</script>

<svelte:head>
  <title>Write a Review for {listing.title} | Local Business Directory</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <!-- Header -->
  <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
    <div class="container mx-auto px-4 flex h-14 items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
          PS
        </div>
        <span class="font-bold tracking-tight text-sm text-foreground">
          Local Business Directory
        </span>
      </a>
      <a
        href="/listing/{listing.slug}"
        class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Back to Listing</span>
      </a>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl flex-1">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <ReviewForm
          listingId={listing.id}
          listingTitle={listing.title}
          slug={listing.slug}
          initialName={data.user?.name || ""}
          initialEmail={data.user?.email || ""}
          {form}
        />
      </div>

      <div class="space-y-4">
        <div class="rounded-xl border bg-card p-5 shadow-card space-y-3">
          <div class="flex items-center gap-2 pb-2 border-b">
            <ShieldCheck class="h-4 w-4 text-primary" />
            <h4 class="font-bold text-sm text-foreground">Review Guidelines</h4>
          </div>
          <ul class="space-y-2 text-xs text-muted-foreground">
            <li class="flex items-start gap-2">
              <Check class="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Share genuine feedback based on personal customer experience.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Be constructive, polite, and detailed regarding service quality.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Avoid advertising links, phone numbers, or promotional text.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>One review per person per business to maintain neighborhood trust.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</div>
