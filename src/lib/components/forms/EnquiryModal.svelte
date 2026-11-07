<script lang="ts">
  import { Mail, X, Loader2, CheckCircle2, AlertCircle } from "lucide-svelte";

  let { listingId, listingTitle }: { listingId: string; listingTitle: string } = $props();

  let isOpen = $state(false);
  let formLoadedAt = $state(0);
  let isPending = $state(false);
  let result = $state<{ success?: boolean; message?: string; error?: string } | null>(null);

  function openModal() {
    isOpen = true;
    formLoadedAt = Date.now();
    result = null;
  }

  function closeModal() {
    isOpen = false;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isPending = true;
    result = null;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      result = data;
    } catch {
      result = { error: "Network error. Please try again." };
    } finally {
      isPending = false;
    }
  }
</script>

<button
  type="button"
  onclick={openModal}
  class="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-800 shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition"
>
  <Mail class="h-3.5 w-3.5" />
  <span>Send Enquiry</span>
</button>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
    <div class="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
      <button
        type="button"
        onclick={closeModal}
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md"
        aria-label="Close dialog"
      >
        <X class="h-4 w-4" />
      </button>

      <div class="mb-4 pr-6">
        <h3 class="font-bold text-base text-slate-900">Contact {listingTitle}</h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Send a direct message to request pricing, appointments, or availability.
        </p>
      </div>

      {#if result?.success}
        <div class="py-6 text-center">
          <CheckCircle2 class="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h4 class="font-bold text-sm text-slate-900">Enquiry Sent!</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {result.message}
          </p>
          <button
            type="button"
            onclick={closeModal}
            class="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-3.5">
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="form_loaded_at" value={formLoadedAt} />

          <!-- Honeypot field disguised as website_url -->
          <div style="display: none;" aria-hidden="true">
            <label for="website_url">Leave this empty</label>
            <input type="text" id="website_url" name="website_url" tabindex="-1" autocomplete="off" />
          </div>

          {#if result?.error}
            <div class="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle class="h-4 w-4 shrink-0" />
              <span>{result.error}</span>
            </div>
          {/if}

          <div>
            <label for="enquiry-name" class="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
            <input
              id="enquiry-name"
              type="text"
              name="name"
              required
              placeholder="e.g. Ramesh Patil"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label for="enquiry-email" class="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
            <input
              id="enquiry-email"
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label for="enquiry-phone" class="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
            <input
              id="enquiry-phone"
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label for="enquiry-message" class="block text-xs font-semibold text-slate-700 mb-1">Message</label>
            <textarea
              id="enquiry-message"
              name="message"
              required
              rows={3}
              placeholder="Describe your requirement, preferred timings, or questions..."
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-y"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isPending}
            class="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {#if isPending}
              <Loader2 class="mr-2 h-3.5 w-3.5 animate-spin" />
              <span>Sending message...</span>
            {:else}
              <span>Submit Enquiry</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </div>
{/if}
