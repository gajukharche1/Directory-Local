<script lang="ts">
  import {
    Sliders,
    ShieldAlert,
    Store,
    FolderTree,
    MapPin,
    UploadCloud,
    Users,
    LayoutDashboard,
    Globe,
    LogOut,
    ChevronDown,
    Shield,
    ExternalLink,
    Sparkles,
  } from "lucide-svelte";

  let {
    user,
    align = "right",
  }: {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
      avatar?: string | null;
    };
    align?: "left" | "right";
  } = $props();

  let isOpen = $state(false);

  const isAdminOrMod = $derived(
    user?.role === "admin" || user?.role === "moderator"
  );

  const initials = $derived(
    user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "AD"
  );

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative inline-block text-left">
  <!-- Trigger Capsule -->
  <button
    type="button"
    onclick={() => (isOpen = !isOpen)}
    class="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <div
      class="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs shrink-0"
    >
      {initials}
    </div>

    <div class="text-left hidden sm:block max-w-[120px] truncate">
      <p class="text-xs font-bold text-slate-900 leading-tight truncate">
        {user?.name || "Account"}
      </p>
    </div>

    {#if user?.role}
      <span
        class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 {user.role === 'admin'
          ? 'bg-rose-100 text-rose-700'
          : user.role === 'moderator'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-blue-100 text-blue-700'}"
      >
        {user.role}
      </span>
    {/if}

    <ChevronDown
      class="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 {isOpen
        ? 'rotate-180'
        : ''}"
    />
  </button>

  {#if isOpen}
    <!-- Backdrop to close on click outside -->
    <button
      type="button"
      tabindex="-1"
      aria-label="Close user dropdown"
      class="fixed inset-0 z-40 cursor-default bg-transparent"
      onclick={() => (isOpen = false)}
    ></button>

    <!-- Dropdown Popover Card -->
    <div
      class="absolute {align === 'right' ? 'right-0' : 'left-0'} mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
      role="menu"
    >
      <!-- User Identification Header -->
      <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs"
        >
          {initials}
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900 text-sm leading-tight truncate">
            {user?.name || "User"}
          </p>
          <p class="text-[11px] text-slate-400 truncate mt-0.5">
            {user?.email || ""}
          </p>
          <span
            class="inline-block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider {user?.role === 'admin'
              ? 'bg-rose-100 text-rose-700'
              : user?.role === 'moderator'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'}"
          >
            {user?.role || "visitor"} privileges
          </span>
        </div>
      </div>

      <!-- Admin / Moderator Quick Launch Privileges -->
      {#if isAdminOrMod}
        <div class="p-2 border-b border-slate-100">
          <div class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield class="h-3 w-3 text-blue-600" />
            <span>Admin Quick Privileges</span>
          </div>

          <div class="space-y-0.5 mt-1">
            <a
              href="/admin"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <Sliders class="h-3.5 w-3.5 text-blue-600" />
                <span>Admin Console</span>
              </div>
              <span class="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">Console</span>
            </a>

            <a
              href="/admin/moderation"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <ShieldAlert class="h-3.5 w-3.5 text-amber-600" />
                <span>Moderation Queue</span>
              </div>
            </a>

            <a
              href="/admin/listings"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <Store class="h-3.5 w-3.5 text-emerald-600" />
                <span>Manage Listings</span>
              </div>
            </a>

            <a
              href="/admin/categories"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <FolderTree class="h-3.5 w-3.5 text-teal-600" />
                <span>Categories Taxonomy</span>
              </div>
            </a>

            <a
              href="/admin/locations"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <MapPin class="h-3.5 w-3.5 text-rose-600" />
                <span>Locations Engine</span>
              </div>
            </a>

            <a
              href="/admin/imports"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <UploadCloud class="h-3.5 w-3.5 text-indigo-600" />
                <span>CSV Import Hub</span>
              </div>
            </a>

            <a
              href="/admin/settings?tab=users"
              onclick={() => (isOpen = false)}
              class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
            >
              <div class="flex items-center gap-2">
                <Users class="h-3.5 w-3.5 text-purple-600" />
                <span>User Dashboard</span>
              </div>
              <span class="text-[9px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">RBAC</span>
            </a>
          </div>
        </div>
      {/if}

      <!-- General Links -->
      <div class="p-2 border-b border-slate-100 space-y-0.5">
        <a
          href="/dashboard"
          onclick={() => (isOpen = false)}
          class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
        >
          <LayoutDashboard class="h-3.5 w-3.5 text-slate-500" />
          <span>Owner Dashboard</span>
        </a>

        <a
          href="/"
          onclick={() => (isOpen = false)}
          class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium transition"
        >
          <Globe class="h-3.5 w-3.5 text-slate-500" />
          <span>Public Directory</span>
        </a>
      </div>

      <!-- Sign Out -->
      <div class="p-2">
        <a
          href="/logout"
          onclick={() => (isOpen = false)}
          class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition"
        >
          <LogOut class="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </a>
      </div>
    </div>
  {/if}
</div>
