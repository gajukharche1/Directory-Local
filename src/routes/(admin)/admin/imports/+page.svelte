<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import {
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileText,
    Building2,
    FolderTree,
    MapPin,
    Download,
    Sparkles,
    Trash2,
    Eye,
    X,
    ShieldCheck,
    AlertTriangle,
    ArrowRight,
    Check,
    Database,
  } from "lucide-svelte";
  import {
    type ImportEntityType,
    type ParsedCsvResult,
    validateCsvInput,
    downloadSampleCsv,
    SAMPLE_TEMPLATES,
  } from "$lib/utils/csv-parser";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Active Tab
  let activeTab = $state<ImportEntityType>("listings");

  // CSV content state per entity
  let csvInputs = $state<Record<ImportEntityType, string>>({
    listings: "",
    categories: "",
    locations: "",
  });

  // Listing publication status option
  let listingStatus = $state<"draft" | "published">("draft");

  // Drag and drop state
  let isDragging = $state(false);
  let uploadedFiles = $state<Record<ImportEntityType, { name: string; size: string } | null>>({
    listings: null,
    categories: null,
    locations: null,
  });

  // Pre-flight inspection modal state
  let isInspectModalOpen = $state(false);
  let inspectionResult = $state<ParsedCsvResult | null>(null);
  let isSubmitting = $state(false);

  // Stats calculation
  const currentCsv = $derived(csvInputs[activeTab]);
  const estimatedRows = $derived(
    currentCsv.trim() ? Math.max(0, currentCsv.trim().split(/\r?\n/).filter((l) => l.trim()).length - 1) : 0
  );

  function setTab(tab: ImportEntityType) {
    activeTab = tab;
  }

  function handleLoadSample() {
    csvInputs[activeTab] = SAMPLE_TEMPLATES[activeTab];
    uploadedFiles[activeTab] = {
      name: `demo-${activeTab}-template.csv`,
      size: `${(SAMPLE_TEMPLATES[activeTab].length / 1024).toFixed(1)} KB`,
    };
  }

  function handleClear() {
    csvInputs[activeTab] = "";
    uploadedFiles[activeTab] = null;
    inspectionResult = null;
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      processFile(target.files[0]!);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]!);
    }
  }

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        csvInputs[activeTab] = content;
        uploadedFiles[activeTab] = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        };
      }
    };
    reader.readAsText(file);
  }

  function openInspectionModal() {
    if (!currentCsv.trim()) return;
    inspectionResult = validateCsvInput(currentCsv, activeTab);
    isInspectModalOpen = true;
  }

  function closeInspectionModal() {
    isInspectModalOpen = false;
  }

  const tabConfigs = [
    {
      id: "listings" as const,
      label: "Listings",
      icon: Building2,
      count: data.totalListings,
      description: "Bulk import business listings with address, contact details, opening hours, and taxonomy mapping.",
      actionName: "importListings",
      manageUrl: "/admin/listings",
    },
    {
      id: "categories" as const,
      label: "Categories",
      icon: FolderTree,
      count: data.totalCategories,
      description: "Import business categories with parent taxonomy, slug formatting, and homepage visibility.",
      actionName: "importCategories",
      manageUrl: "/admin/categories",
    },
    {
      id: "locations" as const,
      label: "Locations",
      icon: MapPin,
      count: data.totalLocations,
      description: "Import neighborhoods, sub-cities, and pin coordinates with parent-child hierarchical trees.",
      actionName: "importLocations",
      manageUrl: "/admin/locations",
    },
  ];

  const currentConfig = $derived(tabConfigs.find((t) => t.id === activeTab)!);
</script>

<svelte:head>
  <title>Multi-Entity CSV Import Hub | Admin Console</title>
</svelte:head>

<div class="space-y-6 max-w-6xl">
  <!-- Page Header & Global Entity Stats -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <Database class="h-4 w-4" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Multi-Entity CSV Import Hub</h1>
      </div>
      <p class="text-xs text-slate-500 mt-1 max-w-2xl">
        Bulk onboard listings, categories, and geographic locations with automatic slug generation, opening hours normalization, and client-side pre-flight schema inspection.
      </p>
    </div>

    <!-- Quick Database Health Counters -->
    <div class="flex items-center gap-2 sm:gap-3 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold">
      <div class="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center gap-2">
        <Building2 class="h-3.5 w-3.5 text-blue-600" />
        <span class="text-slate-500">Listings:</span>
        <span class="font-bold text-slate-900">{data.totalListings}</span>
      </div>
      <div class="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center gap-2">
        <FolderTree class="h-3.5 w-3.5 text-emerald-600" />
        <span class="text-slate-500">Categories:</span>
        <span class="font-bold text-slate-900">{data.totalCategories}</span>
      </div>
      <div class="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center gap-2">
        <MapPin class="h-3.5 w-3.5 text-amber-600" />
        <span class="text-slate-500">Locations:</span>
        <span class="font-bold text-slate-900">{data.totalLocations}</span>
      </div>
    </div>
  </div>

  <!-- Import Status Notifications -->
  {#if form?.success}
    <div class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs space-y-3">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 class="h-5 w-5" />
          </div>
          <div>
            <h3 class="font-bold text-sm text-slate-900">Batch Import Successfully Completed</h3>
            <p class="text-xs text-slate-600 mt-0.5">
              Successfully persisted <strong>{form.importedCount}</strong> new records into the directory database.
              {#if form.failedCount && form.failedCount > 0}
                <span class="text-rose-600 font-semibold ml-1">({form.failedCount} rows skipped due to schema errors)</span>
              {/if}
            </p>
          </div>
        </div>

        {#if form.entityType}
          <a
            href="/admin/{form.entityType}"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 rounded-xl transition"
          >
            <span>View {form.entityType}</span>
            <ArrowRight class="h-3 w-3" />
          </a>
        {/if}
      </div>

      {#if form.errors && form.errors.length > 0}
        <div class="rounded-xl bg-white/80 border border-emerald-200/60 p-3">
          <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Skipped Row Details:</p>
          <ul class="text-xs text-rose-600 list-disc list-inside space-y-0.5">
            {#each form.errors as err}
              <li>{err}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  {#if form?.error}
    <div class="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 flex items-start gap-3 shadow-xs">
      <AlertCircle class="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
      <div>
        <h4 class="font-bold text-sm">Batch Import Failed</h4>
        <p class="mt-0.5 text-rose-600">{form.error}</p>
      </div>
    </div>
  {/if}

  <!-- Entity Segmented Tabs Selector -->
  <div class="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
    {#each tabConfigs as tab}
      <button
        type="button"
        onclick={() => setTab(tab.id)}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all {activeTab === tab.id
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'}"
      >
        <tab.icon class="h-4 w-4 {activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}" />
        <span>{tab.label}</span>
        <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full {activeTab === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-300/60 text-slate-600'}">
          {tab.count}
        </span>
      </button>
    {/each}
  </div>

  <!-- Tab Content Card -->
  <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
    <!-- Tab Header & Quick Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
      <div>
        <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <currentConfig.icon class="h-4 w-4 text-blue-600" />
          <span>Import {currentConfig.label}</span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">{currentConfig.description}</p>
      </div>

      <div class="flex items-center flex-wrap gap-2">
        <button
          type="button"
          onclick={() => downloadSampleCsv(activeTab)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          title="Download official sample CSV schema"
        >
          <Download class="h-3.5 w-3.5 text-slate-600" />
          <span>Sample CSV</span>
        </button>

        <button
          type="button"
          onclick={handleLoadSample}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
          title="Fill editor with pre-made valid mock records"
        >
          <Sparkles class="h-3.5 w-3.5 text-blue-600" />
          <span>Load Demo Data</span>
        </button>

        {#if currentCsv.trim()}
          <button
            type="button"
            onclick={handleClear}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition"
            title="Clear current input"
          >
            <Trash2 class="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- Listings-Only Options: Publication Status -->
    {#if activeTab === "listings"}
      <div class="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="text-xs font-bold text-slate-900 block">Default Status for Imported Listings</span>
          <span class="text-[11px] text-slate-500 block">
            Choose whether newly imported listings are queued as Drafts for review or Published immediately.
          </span>
        </div>

        <div class="inline-flex p-1 bg-slate-200/70 rounded-xl text-xs font-bold">
          <button
            type="button"
            onclick={() => (listingStatus = "draft")}
            class="px-3 py-1 rounded-lg transition-all {listingStatus === 'draft'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'}"
          >
            Draft (Review First)
          </button>
          <button
            type="button"
            onclick={() => (listingStatus = "published")}
            class="px-3 py-1 rounded-lg transition-all {listingStatus === 'published'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'}"
          >
            Published (Live)
          </button>
        </div>
      </div>
    {/if}

    <!-- File Drag & Drop Zone -->
    <div
      role="region"
      aria-label="CSV file drop zone"
      ondragover={(e) => {
        e.preventDefault();
        isDragging = true;
      }}
      ondragleave={() => (isDragging = false)}
      ondrop={handleDrop}
      class="border-2 border-dashed rounded-2xl p-6 text-center transition-all {isDragging
        ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'}"
    >
      <input
        type="file"
        id="fileInput"
        accept=".csv,text/csv,text/plain"
        onchange={handleFileSelect}
        class="hidden"
      />

      <div class="flex flex-col items-center justify-center gap-2">
        <div class="h-10 w-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <UploadCloud class="h-5 w-5" />
        </div>

        <div>
          <label
            for="fileInput"
            class="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Click to browse CSV file
          </label>
          <span class="text-xs text-slate-500"> or drag and drop here</span>
        </div>

        <p class="text-[11px] text-slate-400">
          Supports comma-separated (,), semicolon (;), and tab-delimited text up to 5,000 rows.
        </p>

        {#if uploadedFiles[activeTab]}
          <div class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <Check class="h-3.5 w-3.5 text-emerald-600" />
            <span>{uploadedFiles[activeTab]?.name}</span>
            <span class="text-[10px] text-emerald-600/80">({uploadedFiles[activeTab]?.size})</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Manual Raw Textarea -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <label for="csvEditor" class="font-bold text-slate-700 flex items-center gap-1.5">
          <FileText class="h-3.5 w-3.5 text-slate-500" />
          <span>Or Paste Raw CSV Data Directly</span>
        </label>
        <span class="text-[11px] font-semibold text-slate-400">
          {estimatedRows} rows detected • {currentCsv.length} characters
        </span>
      </div>

      <textarea
        id="csvEditor"
        bind:value={csvInputs[activeTab]}
        rows="9"
        placeholder="Paste your CSV headers and records here..."
        class="w-full font-mono text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-inner leading-relaxed"
      ></textarea>
    </div>

    <!-- Main Inspection & Execution Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck class="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Pre-flight inspection checks headers, required fields, and format before database commit.</span>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={openInspectionModal}
          disabled={!currentCsv.trim()}
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/10 hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye class="h-4 w-4" />
          <span>Inspect & Preview CSV</span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Pre-Flight Inspection Modal / Drawer -->
{#if isInspectModalOpen && inspectionResult}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck class="h-5 w-5" />
          </div>
          <div>
            <h3 class="font-extrabold text-sm text-slate-900">Pre-Flight Schema Inspection</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Reviewing parsed records for <strong>{currentConfig.label}</strong> import.
            </p>
          </div>
        </div>

        <button
          type="button"
          onclick={closeInspectionModal}
          class="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          aria-label="Close inspection modal"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Inspection Summary Metrics -->
      <div class="p-5 border-b border-slate-100 grid grid-cols-3 gap-3 bg-white">
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Parsed</span>
          <span class="text-xl font-black text-slate-900 mt-0.5 block">{inspectionResult.totalCount}</span>
        </div>

        <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
          <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Valid Rows</span>
          <span class="text-xl font-black text-emerald-700 mt-0.5 block">{inspectionResult.validCount}</span>
        </div>

        <div class="p-3 rounded-2xl {inspectionResult.invalidCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'} text-center">
          <span class="text-[11px] font-bold {inspectionResult.invalidCount > 0 ? 'text-rose-700' : 'text-slate-400'} uppercase tracking-wider block">Errors</span>
          <span class="text-xl font-black {inspectionResult.invalidCount > 0 ? 'text-rose-700' : 'text-slate-400'} mt-0.5 block">
            {inspectionResult.invalidCount}
          </span>
        </div>
      </div>

      <!-- Error Alerts Breakdown if any -->
      {#if inspectionResult.invalidCount > 0}
        <div class="px-5 py-3 bg-rose-50 border-b border-rose-100 flex items-start gap-2.5 text-xs text-rose-700">
          <AlertTriangle class="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div class="min-w-0">
            <span class="font-bold">Schema validation issues detected in {inspectionResult.invalidCount} row(s).</span>
            <p class="text-[11px] text-rose-600 mt-0.5">
              These rows will be skipped during execution, while the {inspectionResult.validCount} valid row(s) will be imported safely.
            </p>
          </div>
        </div>
      {/if}

      <!-- Interactive Table Preview -->
      <div class="flex-1 overflow-auto p-5">
        <div class="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0 z-10">
              <tr>
                <th class="py-2.5 px-3 w-16">Row</th>
                <th class="py-2.5 px-3 w-24">Status</th>
                {#each inspectionResult.headers as header}
                  <th class="py-2.5 px-3 font-semibold uppercase text-[10px] text-slate-400 tracking-wider">
                    {header}
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              {#each inspectionResult.rows as row}
                <tr class="{row.isValid ? 'hover:bg-slate-50/60' : 'bg-rose-50/40 hover:bg-rose-50/70'} transition">
                  <td class="py-2 px-3 font-mono text-[11px] text-slate-400 font-semibold">{row.rowNumber}</td>
                  <td class="py-2 px-3">
                    {#if row.isValid}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Check class="h-2.5 w-2.5" />
                        <span>Valid</span>
                      </span>
                    {:else}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800" title={row.errors.map(e => e.message).join("; ")}>
                        <X class="h-2.5 w-2.5" />
                        <span>Error</span>
                      </span>
                    {/if}
                  </td>
                  {#each inspectionResult.headers as header}
                    <td class="py-2 px-3 text-slate-700 max-w-xs truncate font-mono text-[11px]">
                      {row.data[header] || "—"}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Footer Execution Actions -->
      <div class="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onclick={closeInspectionModal}
          class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition"
        >
          Cancel & Edit Input
        </button>

        <form
          method="POST"
          action="?/{currentConfig.actionName}"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ update }) => {
              isSubmitting = false;
              isInspectModalOpen = false;
              await update();
            };
          }}
          class="inline-flex"
        >
          <input type="hidden" name="csvData" value={currentCsv} />
          {#if activeTab === "listings"}
            <input type="hidden" name="status" value={listingStatus} />
          {/if}

          <button
            type="submit"
            disabled={isSubmitting || inspectionResult.validCount === 0}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/10 hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <Loader2 class="h-4 w-4 animate-spin" />
              <span>Importing {inspectionResult.validCount} Records...</span>
            {:else}
              <UploadCloud class="h-4 w-4" />
              <span>Confirm & Execute Import ({inspectionResult.validCount} valid rows)</span>
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
