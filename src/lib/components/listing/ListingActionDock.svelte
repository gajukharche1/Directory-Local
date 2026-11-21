<script lang="ts">
  import {
    Phone,
    MessageCircle,
    Navigation,
    Mail,
    Share2,
    Check,
    Send,
  } from "lucide-svelte";

  interface Props {
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    address: string;
    businessTitle: string;
    onenquire?: () => void;
  }

  let {
    phone = null,
    whatsapp = null,
    email = null,
    address,
    businessTitle,
    onenquire = () => {},
  }: Props = $props();

  let copied = $state(false);

  let cleanPhone = $derived(phone ? phone.replace(/[^0-9+]/g, "") : "");
  let cleanWhatsApp = $derived(whatsapp ? whatsapp.replace(/[^0-9]/g, "") : cleanPhone.replace(/^\+/, ""));

  let mapsUrl = $derived(
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${businessTitle}, ${address}`)}`
  );

  let whatsappUrl = $derived(
    cleanWhatsApp
      ? `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi, I found ${businessTitle} on Local Directory and would like to enquire.`)}`
      : null
  );

  async function shareListing() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessTitle,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<!-- Desktop Action Bar (Visible md+) -->
<div class="hidden md:flex items-center gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
  {#if cleanPhone}
    <a
      href={`tel:${cleanPhone}`}
      class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs cursor-pointer flex-1"
    >
      <Phone class="h-4 w-4" />
      <span>Call {phone}</span>
    </a>
  {/if}

  {#if whatsappUrl}
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex-1"
    >
      <MessageCircle class="h-4 w-4" />
      <span>Chat on WhatsApp</span>
    </a>
  {/if}

  <a
    href={mapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
  >
    <Navigation class="h-4 w-4 text-primary" />
    <span>Directions</span>
  </a>

  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-bold transition-colors cursor-pointer"
    onclick={onenquire}
  >
    <Send class="h-4 w-4" />
    <span>Send Enquiry</span>
  </button>

  <button
    type="button"
    class="p-3 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    onclick={shareListing}
    title="Share Listing"
  >
    {#if copied}
      <Check class="h-4 w-4 text-emerald-600" />
    {:else}
      <Share2 class="h-4 w-4" />
    {/if}
  </button>
</div>

<!-- Mobile Sticky Bottom Action Dock (Fixed on mobile screens < md) -->
<div class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border px-3 py-2 flex items-center justify-between gap-2 shadow-2xl safe-area-pb">
  {#if cleanPhone}
    <a
      href={`tel:${cleanPhone}`}
      class="flex-1 inline-flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold min-h-[48px] active:scale-95 transition-transform"
      aria-label="Call business"
    >
      <Phone class="h-4 w-4 mb-0.5" />
      <span>Call Now</span>
    </a>
  {/if}

  {#if whatsappUrl}
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex-1 inline-flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold min-h-[48px] active:scale-95 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle class="h-4 w-4 mb-0.5" />
      <span>WhatsApp</span>
    </a>
  {/if}

  <a
    href={mapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="flex-1 inline-flex flex-col items-center justify-center py-2 px-1 rounded-xl border border-border bg-muted/60 text-foreground text-[11px] font-medium min-h-[48px] active:scale-95 transition-transform"
    aria-label="Get Directions"
  >
    <Navigation class="h-4 w-4 mb-0.5 text-primary" />
    <span>Directions</span>
  </a>

  <button
    type="button"
    class="flex-1 inline-flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-secondary text-secondary-foreground text-[11px] font-bold min-h-[48px] active:scale-95 transition-transform cursor-pointer"
    onclick={onenquire}
    aria-label="Send Enquiry"
  >
    <Send class="h-4 w-4 mb-0.5" />
    <span>Enquire</span>
  </button>
</div>
