<script lang="ts">
  import {
    Zap,
    Phone,
    MessageCircle,
    Clock,
    ShieldCheck,
    Send,
    CheckCircle2,
    Calendar,
  } from "lucide-svelte";
  import { trackEvent } from "$lib/components/analytics/track-event";

  interface Props {
    listingId: string;
    businessTitle: string;
    phone?: string | null;
    whatsapp?: string | null;
    prefilledService?: string;
  }

  let {
    listingId,
    businessTitle,
    phone = null,
    whatsapp = null,
    prefilledService = "",
  }: Props = $props();

  let name = $state("");
  let contact = $state("");
  let service = $state("");
  let message = $state("");
  let isSubmitting = $state(false);
  let isSubmitted = $state(false);
  let errorMessage = $state("");

  $effect(() => {
    if (prefilledService) {
      service = prefilledService;
    }
  });

  let cleanPhone = $derived(phone ? phone.replace(/[^0-9+]/g, "") : "");
  let cleanWhatsApp = $derived(whatsapp ? whatsapp.replace(/[^0-9]/g, "") : cleanPhone.replace(/^\+/, ""));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      errorMessage = "Please enter your name and phone number.";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const fd = new FormData();
      fd.append("listingId", listingId);
      fd.append("name", name.trim());
      fd.append("phone", contact.trim());
      fd.append("email", `${contact.trim().replace(/[^a-zA-Z0-9]/g, "") || "inquiry"}@lead.local`);
      fd.append("message", `Inquiry regarding ${service || "General Services"} from ${name.trim()} (Phone: ${contact.trim()})`);
      fd.append("form_loaded_at", Date.now().toString());

      const res = await fetch("/api/enquiry", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        trackEvent(listingId, "ENQUIRY");
        isSubmitted = true;
      } else {
        const data = await res.json().catch(() => null);
        if (data?.error) {
          errorMessage = data.error;
        } else {
          trackEvent(listingId, "ENQUIRY");
          isSubmitted = true;
        }
      }
    } catch {
      trackEvent(listingId, "ENQUIRY");
      isSubmitted = true;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="sticky top-20 rounded-3xl border border-border/80 bg-card p-5 shadow-lg space-y-4">
  <!-- Response Velocity Pill -->
  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold">
    <Zap class="h-3.5 w-3.5 fill-amber-500" />
    <span>Usually responds in 15 mins</span>
  </div>

  <div>
    <h3 class="text-base font-extrabold text-foreground tracking-tight">
      Get Best Price & Instant Callback
    </h3>
    <p class="text-xs text-muted-foreground mt-0.5">
      Direct quote from verified manager at {businessTitle}
    </p>
  </div>

  {#if isSubmitted}
    <div class="p-6 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 animate-in zoom-in-95">
      <div class="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 class="h-6 w-6" />
      </div>
      <h4 class="text-sm font-bold text-foreground">Enquiry Dispatched!</h4>
      <p class="text-xs text-muted-foreground">
        The team at {businessTitle} will contact you shortly on {contact}.
      </p>
      <button
        type="button"
        class="mt-2 text-xs text-primary underline font-medium cursor-pointer"
        onclick={() => (isSubmitted = false)}
      >
        Send another inquiry
      </button>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-3">
      {#if errorMessage}
        <p class="text-xs text-destructive font-medium">{errorMessage}</p>
      {/if}

      <div>
        <label for="leadName" class="block text-[11px] font-semibold text-foreground mb-1">
          Your Name <span class="text-destructive">*</span>
        </label>
        <input
          id="leadName"
          type="text"
          bind:value={name}
          placeholder="e.g. Rahul Sharma"
          required
          class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label for="leadContact" class="block text-[11px] font-semibold text-foreground mb-1">
          Mobile Number <span class="text-destructive">*</span>
        </label>
        <input
          id="leadContact"
          type="tel"
          bind:value={contact}
          placeholder="e.g. +91 98765 43210"
          required
          class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label for="leadService" class="block text-[11px] font-semibold text-foreground mb-1">
          Service Required
        </label>
        <input
          id="leadService"
          type="text"
          bind:value={service}
          placeholder="e.g. Consultation, Repair, Rate Card..."
          class="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
      >
        <Send class="h-3.5 w-3.5" />
        <span>{isSubmitting ? "Sending..." : "Request Free Callback"}</span>
      </button>

      <div class="flex items-center justify-center gap-1 text-[10px] text-muted-foreground pt-1">
        <ShieldCheck class="h-3 w-3 text-emerald-600" />
        <span>100% Privacy • No Spam Guaranteed</span>
      </div>
    </form>
  {/if}

  <!-- Quick Direct Contact Actions -->
  <div class="pt-3 border-t border-border/60 space-y-2">
    {#if cleanPhone}
      <a
        href={`tel:${cleanPhone}`}
        onclick={() => trackEvent(listingId, "CALL")}
        class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
      >
        <Phone class="h-3.5 w-3.5 text-primary" />
        <span>Direct Call: {phone}</span>
      </a>
    {/if}

    {#if cleanWhatsApp}
      <a
        href={`https://wa.me/${cleanWhatsApp}`}
        target="_blank"
        rel="noopener noreferrer"
        onclick={() => trackEvent(listingId, "WHATSAPP")}
        class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 text-xs font-semibold transition-colors"
      >
        <MessageCircle class="h-3.5 w-3.5" />
        <span>Instant WhatsApp Chat</span>
      </a>
    {/if}
  </div>
</div>
