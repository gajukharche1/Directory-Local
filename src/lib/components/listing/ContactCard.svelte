<script lang="ts">
  import { Phone, MessageCircle, MapPin, Globe, ShieldCheck, Flag } from "lucide-svelte";
  import type { ClaimStatus } from "@prisma/client";
  import EnquiryModal from "$lib/components/forms/EnquiryModal.svelte";

  interface Props {
    listingId: string;
    title?: string;
    slug: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    address: string;
    locality: string;
    landmark: string | null;
    claimStatus: ClaimStatus;
    callAllowed: boolean;
    whatsappAllowed: boolean;
  }

  let {
    listingId,
    title = "Business",
    slug,
    phone,
    whatsapp,
    website,
    address,
    locality,
    landmark,
    claimStatus,
    callAllowed,
    whatsappAllowed,
  }: Props = $props();

  let cleanPhone = $derived(phone?.replace(/\D/g, ""));
  let cleanWhatsapp = $derived((whatsapp || phone)?.replace(/\D/g, ""));
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
    <h3 class="font-bold text-sm text-slate-900">Contact & Location</h3>
    {#if claimStatus === "verified"}
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
        <ShieldCheck class="h-3 w-3" />
        <span>Verified Business</span>
      </span>
    {/if}
  </div>

  <!-- Action CTA Buttons -->
  <div class="grid grid-cols-2 gap-2">
    {#if callAllowed && phone}
      <a
        href={`tel:${cleanPhone}`}
        class="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Phone class="h-3.5 w-3.5" />
        <span>Call Now</span>
      </a>
    {:else}
      <button
        disabled
        class="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 px-3 text-xs font-semibold text-slate-400 cursor-not-allowed"
      >
        <Phone class="h-3.5 w-3.5" />
        <span>Phone Hidden</span>
      </button>
    {/if}

    {#if whatsappAllowed && cleanWhatsapp}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=Hi%2C%20I%20found%20your%20business%20on%20Pimple%20Saudagar%20Directory`}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <MessageCircle class="h-3.5 w-3.5" />
        <span>WhatsApp</span>
      </a>
    {:else}
      <button
        disabled
        class="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 px-3 text-xs font-semibold text-slate-400 cursor-not-allowed"
      >
        <MessageCircle class="h-3.5 w-3.5" />
        <span>Chat Unavailable</span>
      </button>
    {/if}
  </div>

  <!-- Direct Enquiry Modal Trigger -->
  <EnquiryModal {listingId} listingTitle={title} />

  <!-- Physical Address Details -->
  <div class="space-y-3 text-xs">
    <div class="flex items-start gap-2.5">
      <MapPin class="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
      <div>
        <p class="font-semibold text-slate-900">{locality}</p>
        <p class="text-slate-500 mt-0.5 leading-relaxed">{address}</p>
        {#if landmark}
          <p class="text-[11px] text-slate-400 mt-0.5 font-medium">
            Landmark: {landmark}
          </p>
        {/if}
      </div>
    </div>

    {#if website}
      <div class="flex items-center gap-2.5 pt-2 border-t border-slate-100">
        <Globe class="h-4 w-4 text-slate-400 shrink-0" />
        <a
          href={website}
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="text-indigo-600 hover:underline font-medium truncate"
        >
          Visit Official Website
        </a>
      </div>
    {/if}
  </div>

  <!-- Unclaimed Notice & Claim CTA -->
  {#if claimStatus === "unclaimed"}
    <div class="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs space-y-1.5">
      <div class="flex items-center gap-1.5 font-semibold text-amber-900">
        <Flag class="h-3.5 w-3.5" />
        <span>Is this your business?</span>
      </div>
      <p class="text-amber-800 text-[11px] leading-relaxed">
        Claim this listing to update hours, add photos, reply to reviews, and receive inquiries.
      </p>
      <a
        href={`/claim/${slug}`}
        class="inline-block font-semibold text-indigo-600 underline text-[11px] hover:text-indigo-800"
      >
        Claim Business Profile →
      </a>
    </div>
  {/if}
</div>
