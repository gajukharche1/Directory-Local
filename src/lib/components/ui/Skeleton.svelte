<script lang="ts">
  let {
    class: className = "",
    variant = "rectangle",
    width,
    height
  }: {
    class?: string;
    variant?: "rectangle" | "circle" | "text";
    width?: string;
    height?: string;
  } = $props();

  let variantClass = $derived(
    variant === "circle"
      ? "rounded-full shrink-0"
      : variant === "text"
      ? "rounded-md h-3.5"
      : "rounded-xl"
  );
</script>

<div
  class="animate-shimmer {variantClass} {className}"
  style:width={width}
  style:height={height}
  aria-hidden="true"
></div>
