<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    activeSection?: string;
  }

  let { activeSection = "overview" }: Props = $props();

  let currentActive = $state("overview");

  $effect(() => {
    if (activeSection) {
      currentActive = activeSection;
    }
  });

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services & Rates" },
    { id: "photos", label: "Photos" },
    { id: "reviews", label: "Reviews" },
    { id: "location", label: "Location & Hours" },
  ];

  function scrollToSection(id: string) {
    currentActive = id;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // offset for sticky nav bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            currentActive = entry.target.id;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });
</script>

<div class="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-y border-border py-2 px-2 shadow-xs transition-colors">
  <div class="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none px-2">
    {#each sections as s (s.id)}
      <button
        type="button"
        class={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
          currentActive === s.id
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        onclick={() => scrollToSection(s.id)}
      >
        {s.label}
      </button>
    {/each}
  </div>
</div>
