<script lang="ts">
  import type { PageData } from "./$types";
  import { Check, Sparkles, HelpCircle } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Business Pricing Plans | Local Business Directory</title>
  <meta
    name="description"
    content="Explore transparent pricing plans for local businesses in the local area. Boost your neighborhood reach, leads, and customer reviews."
  />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <main class="container mx-auto px-4 py-16 max-w-6xl flex-1">
    <!-- Title Header -->
    <div class="text-center max-w-2xl mx-auto mb-16">
      <div class="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
        <Sparkles class="h-3.5 w-3.5" />
        <span>TRANSPARENT NEIGHBORHOOD PRICING</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        Promote Your Business in the local area
      </h1>
      <p class="mt-3 text-sm text-muted-foreground">
        Choose the right visibility plan to connect with thousands of local residents and high-intent customers in Kokane Chowk, Kunal Icon Rd, and Shivar Chowk.
      </p>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
      {#each data.plans as plan (plan.id)}
        {@const isPopular = plan.slug === "standard"}
        <div
          class="relative rounded-2xl border bg-card p-8 shadow-card flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover {isPopular
            ? 'border-primary ring-2 ring-primary/20 md:-translate-y-2'
            : 'hover:border-primary/40'}"
        >
          {#if isPopular}
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Most Popular
            </div>
          {/if}

          <div>
            <h3 class="font-bold text-xl text-foreground">{plan.name}</h3>
            <p class="text-xs text-muted-foreground mt-1 min-h-[32px]">
              {plan.description}
            </p>

            <div class="my-6 pb-6 border-b">
              <span class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {plan.priceMinor === 0
                  ? "₹0"
                  : `₹${(plan.priceMinor / 100).toLocaleString("en-IN")}`}
              </span>
              <span class="text-xs text-muted-foreground font-medium ml-1.5">
                {plan.priceMinor === 0 ? "forever free" : "/ year"}
              </span>
            </div>

            <!-- Entitlements Checklist -->
            <ul class="space-y-3 text-xs mb-8">
              <li class="flex items-center gap-2.5">
                <Check class="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Up to <strong>{plan.maxPhotos}</strong> business photos</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check class="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Listed in up to <strong>{plan.maxCategories}</strong> categories</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check class="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Coverage across <strong>{plan.maxLocations}</strong> localities</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check class="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct <strong>Call & WhatsApp</strong> action buttons</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check
                  class="h-4 w-4 shrink-0 {plan.badgeVisible ? 'text-emerald-600' : 'text-muted-foreground/30'}"
                />
                <span class={plan.badgeVisible ? "font-semibold" : "text-muted-foreground line-through"}>
                  Verified Business Trust Badge
                </span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check
                  class="h-4 w-4 shrink-0 {plan.featuredAllowed ? 'text-emerald-600' : 'text-muted-foreground/30'}"
                />
                <span class={plan.featuredAllowed ? "font-semibold text-amber-600 dark:text-amber-400" : "text-muted-foreground line-through"}>
                  Homepage Spotlight & Top Search Placement
                </span>
              </li>
            </ul>
          </div>

          <a
            href="/submit?plan={plan.slug}"
            class="w-full text-center py-3 px-4 rounded-xl text-xs font-bold transition shadow-xs block {isPopular
              ? 'bg-primary text-primary-foreground hover:bg-primary-600'
              : 'bg-muted hover:bg-muted/80 text-foreground'}"
          >
            {plan.priceMinor === 0 ? "List Business for Free" : `Select ${plan.name}`}
          </a>
        </div>
      {/each}
    </div>

    <!-- FAQs -->
    <div class="max-w-3xl mx-auto rounded-2xl border bg-card p-8 shadow-card">
      <div class="flex items-center gap-2 mb-6 pb-3 border-b">
        <HelpCircle class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
      </div>

      <div class="space-y-4 text-xs">
        <div>
          <h4 class="font-bold text-foreground mb-1">
            How does business verification work in the local area?
          </h4>
          <p class="text-muted-foreground leading-relaxed">
            When you claim or submit a business listing, our local moderation team verifies the physical address and contact phone in the local area within 24 hours before activating the Verified badge.
          </p>
        </div>

        <div class="pt-3 border-t">
          <h4 class="font-bold text-foreground mb-1">
            Can I upgrade or downgrade my plan later?
          </h4>
          <p class="text-muted-foreground leading-relaxed">
            Yes. You can upgrade from the Free tier to Standard or Premium at any time from your Business Owner Dashboard. Pro-rated duration is applied automatically.
          </p>
        </div>

        <div class="pt-3 border-t">
          <h4 class="font-bold text-foreground mb-1">
            What payment methods are supported?
          </h4>
          <p class="text-muted-foreground leading-relaxed">
            We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay, and all major Indian Credit & Debit Cards via our secure payment gateway.
          </p>
        </div>
      </div>
    </div>
  </main>
</div>
