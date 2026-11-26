<script lang="ts">
  import { onMount } from "svelte";
  import { trackAnalyticsEvent } from "./track-event";

  interface Props {
    listingId: string;
  }

  let { listingId }: Props = $props();

  onMount(() => {
    if (listingId) {
      trackAnalyticsEvent(listingId, "PAGE_VIEW");
    }
  });
</script>

<!-- Headless analytics beacon listener -->
