<script lang="ts">
  import { UploadCloud, FileImage, AlertCircle, CheckCircle2, Loader2, X } from "lucide-svelte";
  import { uploadMediaFile, type UploadProgressEvent } from "$lib/utils/media-uploader";

  interface Props {
    listingId?: string;
    folderId?: string;
    onUploadSuccess?: (uploadedMedia: any) => void;
    onUploadError?: (error: string) => void;
  }

  let { listingId, folderId, onUploadSuccess, onUploadError }: Props = $props();

  interface UploadQueueItem {
    id: string;
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
    result?: any;
  }

  let isDragging = $state(false);
  let queue = $state<UploadQueueItem[]>([]);
  let fileInput = $state<HTMLInputElement | null>(null);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }

  function handleFileInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      processFiles(Array.from(target.files));
      target.value = ""; // Reset
    }
  }

  async function processFiles(files: File[]) {
    const newItems: UploadQueueItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      status: "pending",
      progress: 0,
    }));

    queue = [...queue, ...newItems];

    for (const item of newItems) {
      await uploadItem(item);
    }
  }

  async function uploadItem(item: UploadQueueItem) {
    const current = queue.find((q) => q.id === item.id);
    if (!current) return;

    current.status = "uploading";

    try {
      const media = await uploadMediaFile(current.file, {
        listingId,
        folderId,
        onProgress: (p: UploadProgressEvent) => {
          current.progress = p.percentage;
        },
      });

      current.status = "success";
      current.progress = 100;
      current.result = media;
      onUploadSuccess?.(media);
    } catch (err: any) {
      current.status = "error";
      current.error = err.message || "Upload failed";
      onUploadError?.(current.error!);
    }
  }

  function removeItem(id: string) {
    queue = queue.filter((q) => q.id !== id);
  }
</script>

<div class="space-y-4">
  <!-- Drag and Drop Target -->
  <div
    role="region"
    aria-label="File upload dropzone"
    class={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 ${
      isDragging
        ? "border-primary bg-primary/10 scale-[1.01]"
        : "border-border/80 hover:border-primary/50 hover:bg-muted/40 bg-card"
    }`}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={() => fileInput?.click()}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput?.click();
      }
    }}
    tabindex="0"
  >
    <input
      bind:this={fileInput}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
      multiple
      class="hidden"
      onchange={handleFileInputChange}
    />

    <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <UploadCloud class="h-6 w-6" />
    </div>

    <div>
      <p class="text-sm font-semibold text-foreground">
        Click to upload or drag and drop photos
      </p>
      <p class="text-xs text-muted-foreground mt-1">
        PNG, JPG, WebP, AVIF or SVG (Max 10 MB per file)
      </p>
    </div>
  </div>

  <!-- Upload Queue List -->
  {#if queue.length > 0}
    <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
      {#each queue as item (item.id)}
        <div class="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card text-xs">
          <div class="flex items-center gap-3 min-w-0 flex-1 pr-3">
            <FileImage class="h-4 w-4 text-muted-foreground shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="font-medium truncate text-foreground">{item.file.name}</p>
              <p class="text-[10px] text-muted-foreground font-mono tabular-nums">
                {(item.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            {#if item.status === "uploading"}
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all duration-150"
                    style={`width: ${item.progress}%`}
                  ></div>
                </div>
                <Loader2 class="h-3.5 w-3.5 text-primary animate-spin" />
              </div>
            {:else if item.status === "success"}
              <span class="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 class="h-3.5 w-3.5" /> Done
              </span>
            {:else if item.status === "error"}
              <span class="flex items-center gap-1 text-destructive font-medium" title={item.error}>
                <AlertCircle class="h-3.5 w-3.5" /> Error
              </span>
            {/if}

            <button
              type="button"
              class="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
              onclick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              aria-label="Remove item"
            >
              <X class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
