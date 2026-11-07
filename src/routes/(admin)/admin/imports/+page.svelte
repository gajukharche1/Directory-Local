<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText } from "lucide-svelte";

  let { form }: { form: ActionData } = $props();

  let csvContent = $state("");
  let isSubmitting = $state(false);

  const sampleCsv = `title,address,locality,phone,whatsapp,email,website,category,location
Saudagar Sweets,Shop 4 Kunal Icon Rd,Kunal Icon Rd,+919822011223,+919822011223,info@saudagarsweets.com,https://saudagarsweets.com,food-dining,kunal-icon-road
Kokane Dental Clinic,Opposite Shivar Garden,Kokane Chowk,+919876543210,+919876543210,drkokane@example.com,,health-medical,kokane-chowk`;

  function loadSample() {
    csvContent = sampleCsv;
  }
</script>

<svelte:head>
  <title>Bulk CSV Import | Admin Console</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">Bulk Business Import</h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      Upload or paste CSV data to quickly seed or migrate hundreds of local businesses into Pimple Saudagar.
    </p>
  </div>

  {#if form?.success}
    <div class="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 space-y-2">
      <div class="flex items-center gap-2">
        <CheckCircle2 class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <h3 class="font-bold text-sm text-foreground">Batch Import Completed Successfully!</h3>
      </div>
      <p class="text-xs text-muted-foreground">
        Imported <strong>{form.importedCount}</strong> new local businesses.
        {#if form.failedCount && form.failedCount > 0}
          <span class="text-destructive font-semibold">({form.failedCount} rows had errors)</span>
        {/if}
      </p>
      {#if form.errors && form.errors.length > 0}
        <ul class="text-xs text-destructive list-disc list-inside mt-2 space-y-1">
          {#each form.errors as err}
            <li>{err}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if form?.error}
    <div class="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-start gap-2">
      <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
      <span>{form.error}</span>
    </div>
  {/if}

  <div class="rounded-xl border bg-card p-6 shadow-card space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <FileText class="h-4 w-4 text-primary" />
        <h3 class="font-bold text-sm text-foreground">Paste CSV Records</h3>
      </div>

      <button
        type="button"
        onclick={loadSample}
        class="text-xs font-semibold text-primary hover:underline"
      >
        Load Sample Template
      </button>
    </div>

    <form
      method="POST"
      action="?/batchImport"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
          isSubmitting = false;
          await update();
        };
      }}
      class="space-y-4"
    >
      <textarea
        name="csvData"
        bind:value={csvContent}
        rows="10"
        placeholder="Paste CSV with headers: title,address,locality,phone,whatsapp,email,website,category,location..."
        class="w-full font-mono rounded-lg border bg-background p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      ></textarea>

      <button
        type="submit"
        disabled={isSubmitting || !csvContent.trim()}
        class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-red-700 transition disabled:opacity-50"
      >
        {#if isSubmitting}
          <Loader2 class="h-3.5 w-3.5 animate-spin" />
          <span>Processing Batch Import...</span>
        {:else}
          <UploadCloud class="h-3.5 w-3.5" />
          <span>Execute CSV Import</span>
        {/if}
      </button>
    </form>
  </div>
</div>
