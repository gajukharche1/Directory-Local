<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/components/ui/Header.svelte";
</script>

<Header user={null} />

<div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
  <div class="rounded-full bg-indigo-50 p-4 text-indigo-600 mb-4 text-4xl font-extrabold">
    {page.status}
  </div>
  <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mb-2">
    {page.error?.message || "Something went wrong"}
  </h1>
  <p class="text-sm text-slate-500 max-w-md mb-8">
    We couldn't load the requested page. Please return to the homepage or explore available listings.
  </p>
  <a
    href="/"
    class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition"
  >
    Back to Homepage
  </a>
</div>
