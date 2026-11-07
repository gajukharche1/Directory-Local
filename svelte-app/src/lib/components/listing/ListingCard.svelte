<script lang="ts">
  import { Star, MapPin, Phone, MessageCircle, Sparkles, ShieldCheck } from "lucide-svelte";
  import { getOpeningStatus } from "$lib/utils/opening-hours";
  import type { Prisma } from "@prisma/client";

  interface ListingProps {
    id: string;
    slug: string;
    title: string;
    locality: string;
    averageRating: Prisma.Decimal | number;
    reviewCount: number;
    featured: boolean;
    claimStatus: string;
    phone: string | null;
    whatsapp: string | null;
    openingHours: unknown;
    categories?: Array<{
      category: {
        name: string;
        slug: string;
      };
    }>;
    media?: Array<{
      url: string;
      altText: string | null;
    }>;
    plan?: {
      callButtonAllowed: boolean;
      whatsappAllowed: boolean;
    } | null;
  }

  let { listing }: { listing: ListingProps } = $props();

  let rating = $derived(Number(listing.averageRating));
  let openStatus = $derived(getOpeningStatus(listing.openingHours));
  let photo = $derived(listing.media?.[0]?.url);
  let primaryCategory = $derived(listing.categories?.[0]?.category);

  let cleanPhone = $derived(listing.phone?.replace(/\D/g, ""));
  let cleanWhatsapp = $derived((listing.whatsapp || listing.phone)?.replace(/\D/g, ""));
  let canCall = $derived((listing.plan?.callButtonAllowed ?? true) && cleanPhone);
  let canWhatsapp = $derived((listing.plan?.whatsappAllowed ?? true) && cleanWhatsapp);
</script>

<div class="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300 flex flex-col justify-between">
  <div>
    <!-- Cover Photo -->
    <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
      {#if photo}
        <img
          src={photo}
          alt={listing.title}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      {:else}
        <div class="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400 text-xs font-semibold">
          <span>{listing.title.substring(0, 2).toUpperCase()}</span>
        </div>
      {/if}

      <!-- Badges Overlay -->
      <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
        {#if listing.featured}
          <span class="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Sparkles class="h-3 w-3" />
            <span>Featured</span>
          </span>
        {/if}
        {#if listing.claimStatus === "verified"}
          <span class="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <ShieldCheck class="h-3 w-3" />
            <span>Verified</span>
          </span>
        {/if}
      </div>

      <!-- Open Now Pill -->
      <div class="absolute bottom-2.5 left-2.5">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm {openStatus.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-white/90 text-slate-600'}"
        >
          {openStatus.isOpen ? "Open Now" : "Closed"}
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 space-y-2">
      {#if primaryCategory}
        <span class="text-[11px] font-medium text-slate-500 block truncate">
          {primaryCategory.name}
        </span>
      {/if}

      <a href={`/listing/${listing.slug}`} class="block group-hover:text-indigo-600 transition-colors">
        <h3 class="font-bold text-base text-slate-900 line-clamp-1 leading-snug">
          {listing.title}
        </h3>
      </a>

      <div class="flex items-center gap-2 text-xs">
        <div class="flex items-center gap-1 font-semibold text-slate-800">
          <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
        </div>
        <span class="text-slate-400 text-[11px]">
          ({listing.reviewCount} {listing.reviewCount === 1 ? "review" : "reviews"})
        </span>
        <span class="text-slate-300">•</span>
        <div class="flex items-center gap-1 text-slate-500 text-[11px] truncate">
          <MapPin class="h-3 w-3 shrink-0" />
          <span class="truncate">{listing.locality}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Action Footer -->
  <div class="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      {#if canCall}
        <a
          href={`tel:${cleanPhone}`}
          class="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          title="Call Business"
        >
          <Phone class="h-3.5 w-3.5" />
        </a>
      {/if}
      {#if canWhatsapp}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=Hi%2C%20found%20your%20business%20on%20Pimple%20Saudagar%20Directory`}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
          title="WhatsApp Chat"
        >
          <MessageCircle class="h-3.5 w-3.5" />
        </a>
      {/if}
    </div>

    <a
      href={`/listing/${listing.slug}`}
      class="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
    >
      View Profile →
    </a>
  </div>
</div>
