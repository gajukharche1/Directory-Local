<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, AlertCircle, Loader2, UploadCloud } from "lucide-svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let listing = $derived(data.listing);
  let isAlreadyClaimed = $derived(data.isAlreadyClaimed);
  let currentUser = $derived(data.user);

  let isSubmitting = $state(false);
</script>

<svelte:head>
  <title>Claim & Verify {listing.title} | Pimple Saudagar Directory</title>
  <meta
    name="description"
    content="Claim ownership of {listing.title} in {listing.locality}, Pimple Saudagar. Manage reviews, update business hours, and connect with local customers."
  />
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
          Pimple Saudagar Directory
        </span>
      </a>
      <a
        href="/listing/{listing.slug}"
        class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Back to Business Profile</span>
      </a>
    </div>
  </header>

  <main class="container mx-auto px-4 py-12 max-w-4xl flex-1">
    {#if isAlreadyClaimed}
      <div class="rounded-2xl border bg-card p-10 text-center shadow-card max-w-lg mx-auto">
        <CheckCircle2 class="h-12 w-12 text-primary mx-auto mb-3" />
        <h2 class="text-xl font-bold text-foreground">Business Already Claimed</h2>
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          <strong>{listing.title}</strong> has already been claimed and verified by its registered owner. If you believe this is in error, please contact directory support.
        </p>
        <a
          href="/listing/{listing.slug}"
          class="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
        >
          Return to Business Profile
        </a>
      </div>
    {:else if !currentUser}
      <div class="rounded-2xl border bg-card p-10 text-center shadow-card max-w-lg mx-auto">
        <ShieldCheck class="h-12 w-12 text-primary mx-auto mb-3" />
        <h2 class="text-xl font-bold text-foreground">Sign In to Claim This Business</h2>
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          To verify and manage <strong>{listing.title}</strong>, please sign in or register a free Business Owner account.
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <a
            href="/login?redirectTo=/claim/{listing.slug}"
            class="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            class="rounded-lg border bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            Create Account
          </a>
        </div>
      </div>
    {:else if form?.success}
      <div class="rounded-2xl border bg-card p-10 text-center shadow-card max-w-lg mx-auto">
        <CheckCircle2 class="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
        <h2 class="text-xl font-bold text-foreground">Verification Request Submitted!</h2>
        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">
          {form.message}
        </p>
        <a
          href="/listing/{listing.slug}"
          class="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-600 transition"
        >
          Return to Business Profile
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="mb-6">
            <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-2">
              <ShieldCheck class="h-3.5 w-3.5" />
              <span>Official Ownership Verification</span>
            </div>
            <h1 class="text-2xl font-bold text-foreground">
              Claim Ownership of {listing.title}
            </h1>
            <p class="text-xs text-muted-foreground mt-1">
              Located at {listing.address}, {listing.locality}, Pimple Saudagar
            </p>
          </div>

          <div class="rounded-xl border bg-card p-6 shadow-card">
            {#if form?.error}
              <div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
                <span>{form.error}</span>
              </div>
            {/if}

            <form
              method="POST"
              use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                  isSubmitting = false;
                  await update();
                };
              }}
              class="space-y-4"
            >
              <input type="hidden" name="listingId" value={listing.id} />
              <input type="hidden" name="slug" value={listing.slug} />

              <div>
                <label for="proofFileUrl" class="block text-xs font-semibold text-foreground mb-1">
                  Proof Document URL (Google Drive, Dropbox, or Image link)
                </label>
                <div class="relative">
                  <UploadCloud class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="proofFileUrl"
                    type="url"
                    name="proofFileUrl"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    class="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <p class="mt-1 text-[11px] text-muted-foreground">
                  Please make sure document sharing permissions are set to &quot;Anyone with the link can view&quot;.
                </p>
              </div>

              <div>
                <label for="note" class="block text-xs font-semibold text-foreground mb-1">
                  Additional Verification Note (Optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows="3"
                  placeholder="e.g. I am the proprietor Rajesh Kulkarni; contact phone matches registration."
                  class="w-full rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary-600 transition disabled:opacity-50"
              >
                {#if isSubmitting}
                  <Loader2 class="mr-2 h-3.5 w-3.5 animate-spin" />
                  <span>Submitting claim...</span>
                {:else}
                  <span>Submit Verification Request</span>
                {/if}
              </button>
            </form>
          </div>
        </div>

        <!-- Verification Checklist -->
        <div class="space-y-4">
          <div class="rounded-xl border bg-card p-5 shadow-card space-y-3">
            <div class="flex items-center gap-2 pb-2 border-b">
              <FileText class="h-4 w-4 text-primary" />
              <h4 class="font-bold text-sm text-foreground">Accepted Proof Documents</h4>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Provide a document link or cloud drive URL demonstrating business affiliation:
            </p>
            <ul class="space-y-2 text-xs text-muted-foreground">
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold">•</span>
                <span>Electricity / MSEB utility bill matching business name</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold">•</span>
                <span>GST Registration Certificate or Udyam Aadhar</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold">•</span>
                <span>Shop Act License (Gumasta) issued in PCMC</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold">•</span>
                <span>Visiting card showing owner name & matching phone</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
