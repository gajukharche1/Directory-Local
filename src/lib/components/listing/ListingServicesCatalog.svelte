<script lang="ts">
  import { Sparkles, Clock, CheckCircle2, ChevronRight, Search, Tag } from "lucide-svelte";

  interface ServiceItem {
    id: string;
    name: string;
    category?: string;
    price: number | string;
    duration?: string;
    description?: string;
    isPopular?: boolean;
  }

  interface Props {
    services?: ServiceItem[];
    amenities?: string[];
    categoryName?: string;
    onenquire?: (serviceName: string) => void;
  }

  let {
    services = [],
    amenities = [],
    categoryName = "General Services",
    onenquire = () => {},
  }: Props = $props();

  let activeCategory = $state("all");
  let searchQuery = $state("");

  // Default sample catalogue based on category/amenities if no explicit custom services array
  let derivedServices = $derived.by(() => {
    if (services && services.length > 0) return services;

    const baseList: ServiceItem[] = [
      {
        id: "srv-1",
        name: `${categoryName} Initial Consultation`,
        category: "Consultation",
        price: "Free",
        duration: "15-30 mins",
        description: "Speak directly with verified specialists to evaluate your specific requirements.",
        isPopular: true,
      },
      {
        id: "srv-2",
        name: `Standard Comprehensive Service`,
        category: "Core Services",
        price: "₹999 Onwards",
        duration: "1-2 hours",
        description: "End-to-end service delivery with verified quality guarantee and warranty.",
        isPopular: true,
      },
      {
        id: "srv-3",
        name: `Express / On-Demand Service`,
        category: "Core Services",
        price: "₹1,499",
        duration: "Within 4 hours",
        description: "Priority slot booking with expedited dispatch and dedicated support.",
      },
      {
        id: "srv-4",
        name: `Custom Project Assessment & Quote`,
        category: "Custom",
        price: "Custom Estimate",
        duration: "Flexible",
        description: "Customized quote tailored specifically for enterprise or bespoke scale requests.",
      },
    ];

    if (amenities && amenities.length > 0) {
      amenities.slice(0, 3).forEach((amenity, idx) => {
        baseList.push({
          id: `amenity-srv-${idx}`,
          name: `${amenity} Package`,
          category: "Specialized",
          price: "Inquire for Rate",
          duration: "Varies",
          description: `Dedicated ${amenity} provided with verified business standard certification.`,
        });
      });
    }

    return baseList;
  });

  let serviceCategories = $derived.by(() => {
    const cats = new Set<string>();
    derivedServices.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ["all", ...Array.from(cats)];
  });

  let filteredServices = $derived.by(() => {
    return derivedServices.filter((s) => {
      const matchesCategory = activeCategory === "all" || s.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  });
</script>

<div class="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-bold text-foreground">Services & Rate Card</h2>
        <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
          Verified Pricing
        </span>
      </div>
      <p class="text-xs text-muted-foreground mt-0.5">
        Browse transparent rates, packages, and instant booking options
      </p>
    </div>

    <!-- Live Service Search -->
    <div class="relative w-full sm:w-60">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search services..."
        class="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  </div>

  <!-- Category Pills -->
  <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
    {#each serviceCategories as cat}
      <button
        type="button"
        class={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
          activeCategory === cat
            ? "bg-primary text-primary-foreground shadow-xs"
            : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        onclick={() => (activeCategory = cat)}
      >
        {cat}
      </button>
    {/each}
  </div>

  <!-- Services Grid -->
  {#if filteredServices.length === 0}
    <div class="p-8 text-center rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
      No matching services found. Try adjusting your search term.
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {#each filteredServices as s (s.id)}
        <div class="relative rounded-2xl border border-border/70 hover:border-primary/40 bg-card p-4 transition-all duration-200 hover:shadow-sm flex flex-col justify-between gap-3">
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-xs font-bold text-foreground leading-snug">
                {s.name}
              </h3>
              {#if s.isPopular}
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 text-[10px] font-bold shrink-0">
                  <Sparkles class="h-3 w-3" /> Popular
                </span>
              {/if}
            </div>

            {#if s.description}
              <p class="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            {/if}
          </div>

          <div class="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            <div>
              <div class="text-xs font-bold font-mono text-foreground">
                {s.price}
              </div>
              {#if s.duration}
                <div class="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <Clock class="h-3 w-3" />
                  <span>{s.duration}</span>
                </div>
              {/if}
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              onclick={() => onenquire(s.name)}
            >
              <span>Enquire</span>
              <ChevronRight class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
