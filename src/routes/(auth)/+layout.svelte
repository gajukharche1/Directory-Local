<script lang="ts">
  import type { Snippet } from "svelte";
  import { ShieldCheck, ArrowLeft } from "lucide-svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/20">
  <div class="sm:mx-auto sm:w-full sm:max-w-md px-4">
    <a
      href="/"
      class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft class="h-3.5 w-3.5" />
      <span>Back to Local Business Directory</span>
    </a>

    <div class="flex items-center gap-2 mb-2">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
        PS
      </div>
      <div>
        <span class="font-bold tracking-tight text-lg text-foreground block leading-none">
          Local Business
        </span>
        <span class="text-[10px] tracking-wider text-muted-foreground uppercase font-semibold">
          Hyperlocal Business Directory
        </span>
      </div>
    </div>
  </div>

  <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4">
    <div class="bg-card py-8 px-6 shadow-card rounded-xl border border-border sm:px-10">
      {@render children()}
    </div>

    <div class="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <ShieldCheck class="h-4 w-4 text-emerald-600" />
      <span>End-to-End Secure Auth & Argon2id Password Encryption</span>
    </div>
  </div>
</div>
