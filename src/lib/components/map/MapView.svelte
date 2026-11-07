<script lang="ts">
  import { onMount } from "svelte";
  import { Star, MapPin, ExternalLink } from "lucide-svelte";
  import type { Prisma } from "@prisma/client";

  interface MapListing {
    id: string;
    slug: string;
    title: string;
    locality: string;
    latitude: Prisma.Decimal | number | null;
    longitude: Prisma.Decimal | number | null;
    averageRating: Prisma.Decimal | number;
  }

  interface Props {
    listings: MapListing[];
    center?: [number, number];
    zoom?: number;
    height?: string;
  }

  let {
    listings = [],
    center = [18.5987, 73.7978],
    zoom = 14,
    height = "450px",
  }: Props = $props();

  let mapContainer: HTMLDivElement | undefined = $state();
  let selectedListing = $state<MapListing | null>(null);

  onMount(() => {
    if (!mapContainer) return;

    let mapInstance: any = null;

    // Inject Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamic import to prevent SSR errors
    import("leaflet").then((L) => {
      if (!mapContainer) return;
      mapContainer.innerHTML = "";

      const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map(mapContainer).setView(center, zoom);
      mapInstance = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const validMarkers: [number, number][] = [];

      listings.forEach((listing) => {
        const lat = listing.latitude ? Number(listing.latitude) : null;
        const lng = listing.longitude ? Number(listing.longitude) : null;

        if (lat && lng) {
          validMarkers.push([lat, lng]);
          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
          marker.on("click", () => {
            selectedListing = listing;
          });
        }
      });

      if (validMarkers.length > 1) {
        map.fitBounds(validMarkers, { padding: [40, 40] });
      }
    });

    return () => {
      if (mapInstance && typeof mapInstance.remove === "function") {
        mapInstance.remove();
      }
    };
  });
</script>

<div class="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
  <div bind:this={mapContainer} style="height: {height}; width: 100%;" class="z-10"></div>

  <!-- Selected Marker Callout Overlay -->
  {#if selectedListing}
    <div class="absolute top-4 left-4 z-20 max-w-xs rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span class="text-[10px] font-semibold text-slate-400 uppercase">
          {selectedListing.locality}
        </span>
        <button
          type="button"
          onclick={() => (selectedListing = null)}
          class="text-slate-400 hover:text-slate-700 text-xs"
        >
          ✕
        </button>
      </div>

      <h4 class="font-bold text-sm text-slate-900 line-clamp-1">
        {selectedListing.title}
      </h4>

      <div class="flex items-center gap-1 text-xs text-amber-500 font-semibold my-1.5">
        <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
        <span>{Number(selectedListing.averageRating).toFixed(1)}</span>
      </div>

      <a
        href={`/listing/${selectedListing.slug}`}
        class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
      >
        <span>View Full Details</span>
        <ExternalLink class="h-3 w-3" />
      </a>
    </div>
  {/if}

  <!-- Floating Info Pill -->
  <div class="absolute bottom-3 right-3 z-20 bg-white/90 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur flex items-center gap-1.5 border border-slate-200">
    <MapPin class="h-3 w-3 text-indigo-600" />
    <span>Pimple Saudagar, PCMC</span>
  </div>
</div>
