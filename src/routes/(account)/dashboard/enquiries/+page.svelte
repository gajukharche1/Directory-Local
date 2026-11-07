<script lang="ts">
  import type { PageData } from "./$types";
  import { Inbox, Phone, Mail, Calendar, Building2 } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Customer Leads & Enquiries | Business Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-foreground">Customer Leads & Inquiries</h1>
    <p class="text-xs text-muted-foreground mt-0.5">
      Direct messages and contact requests submitted by residents in the local area
    </p>
  </div>

  {#if data.enquiries.length === 0}
    <div class="rounded-xl border border-dashed bg-card p-12 text-center shadow-card">
      <Inbox class="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
      <h3 class="font-bold text-sm text-foreground">Inbox is empty</h3>
      <p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
        You have not received any customer enquiries yet. Make sure your business profile has updated phone and address details.
      </p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.enquiries as enquiry (enquiry.id)}
        <div
          class="rounded-xl border bg-card p-5 shadow-card transition-all {!enquiry.isRead
            ? 'border-l-4 border-l-primary'
            : ''}"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b mb-3">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-foreground">{enquiry.name}</span>
              {#if !enquiry.isRead}
                <span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  New Lead
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar class="h-3.5 w-3.5" />
              <span>{new Date(enquiry.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <!-- Message Body -->
          <p class="text-xs text-foreground leading-relaxed whitespace-pre-wrap mb-4">
            {enquiry.message}
          </p>

          <!-- Contact & Listing Reference -->
          <div class="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div class="flex flex-wrap items-center gap-4">
              <a
                href="mailto:{enquiry.email}"
                class="flex items-center gap-1.5 hover:text-primary transition font-medium"
              >
                <Mail class="h-3.5 w-3.5" />
                <span>{enquiry.email}</span>
              </a>

              {#if enquiry.phone}
                <a
                  href="tel:{enquiry.phone.replace(/\D/g, '')}"
                  class="flex items-center gap-1.5 hover:text-primary transition font-medium"
                >
                  <Phone class="h-3.5 w-3.5" />
                  <span>{enquiry.phone}</span>
                </a>
              {/if}
            </div>

            <div class="flex items-center gap-1 text-[11px] font-medium text-foreground bg-muted px-2.5 py-1 rounded-md">
              <Building2 class="h-3 w-3 text-primary" />
              <span>{enquiry.listing.title}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
