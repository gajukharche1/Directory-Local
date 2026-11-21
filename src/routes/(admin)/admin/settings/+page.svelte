<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import type { PageData, ActionData } from "./$types";
  import {
    Settings,
    Building2,
    ShieldCheck,
    Bell,
    Globe,
    Palette,
    Check,
    Save,
    AlertTriangle,
    Users,
    UserPlus,
    KeyRound,
    Search,
    Shield,
    ShieldAlert,
    Copy,
    Store,
    Trash2,
    Lock,
    Unlock,
    MoreVertical,
    CheckCircle2,
    ExternalLink,
    Laptop,
  } from "lucide-svelte";
  import AddUserModal from "$lib/components/admin/AddUserModal.svelte";
  import AdminResetPasswordModal from "$lib/components/admin/AdminResetPasswordModal.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Active Tab state (synced with query param ?tab=users)
  let activeTab = $state<"general" | "users">(
    page.url.searchParams.get("tab") === "users" ? "users" : "general"
  );

  // Search & Filters for User Directory
  let searchQuery = $state("");
  let selectedRole = $state("all");
  let selectedStatus = $state("all");

  // Modals state
  let isAddUserModalOpen = $state(false);
  let targetResetUser = $state<{ id: string; name: string; email: string } | null>(null);

  // Action popover open per row
  let activeActionRow = $state<string | null>(null);

  // Copy email feedback
  let copiedEmail = $state<string | null>(null);

  // General settings feedback
  let generalSavedNotice = $state(false);

  function handleGeneralSave() {
    generalSavedNotice = true;
    setTimeout(() => {
      generalSavedNotice = false;
    }, 3000);
  }

  function handleCopyEmail(email: string) {
    navigator.clipboard.writeText(email);
    copiedEmail = email;
    setTimeout(() => {
      copiedEmail = null;
    }, 2000);
  }

  // Filtered users list
  const filteredUsers = $derived(
    data.users.filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q);

      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    })
  );

  function formatDate(d: Date | string | null | undefined): string {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
</script>

<svelte:head>
  <title>User Directory & System Settings | Admin Console</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 pb-12">
  <!-- Header & Segmented Tabs Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
        {#if activeTab === "users"}
          <Users class="h-6 w-6 text-purple-600" />
          <span>User Directory & Privileges</span>
        {:else}
          <Settings class="h-6 w-6 text-slate-900" />
          <span>Site & Operational Settings</span>
        {/if}
      </h1>
      <p class="text-xs text-slate-500 mt-1 font-medium">
        {#if activeTab === "users"}
          Manage directory accounts, assign role permissions, update account status, and perform administrative password resets.
        {:else}
          Configure portal branding, operational guards, maintenance mode, and SEO defaults.
        {/if}
      </p>
    </div>

    <!-- Segmented Tab Switcher -->
    <div class="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
      <button
        type="button"
        onclick={() => (activeTab = "general")}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all {activeTab === 'general'
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'}"
      >
        <Settings class="h-4 w-4 {activeTab === 'general' ? 'text-slate-900' : 'text-slate-400'}" />
        <span>General Settings</span>
      </button>

      <button
        type="button"
        onclick={() => (activeTab = "users")}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all {activeTab === 'users'
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'}"
      >
        <Users class="h-4 w-4 {activeTab === 'users' ? 'text-purple-600' : 'text-slate-400'}" />
        <span>User Directory</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full {activeTab === 'users' ? 'bg-purple-100 text-purple-700' : 'bg-slate-300/60 text-slate-600'}">
          {data.stats.total}
        </span>
      </button>
    </div>
  </div>

  <!-- Action Feedback Notifications -->
  {#if form?.success && form?.message}
    <div class="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-xs flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
      <div class="flex items-center gap-2.5">
        <CheckCircle2 class="h-5 w-5 text-emerald-600 shrink-0" />
        <span class="font-bold">{form.message}</span>
      </div>
    </div>
  {/if}

  {#if form?.error}
    <div class="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
      <AlertTriangle class="h-5 w-5 text-rose-600 shrink-0" />
      <span class="font-bold">{form.error}</span>
    </div>
  {/if}

  <!-- TAB 1: USER DIRECTORY & PRIVILEGES -->
  {#if activeTab === "users"}
    <div class="space-y-5 animate-in fade-in duration-200">
      <!-- Quick Stats KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
            <Users class="h-4 w-4 text-slate-400" />
          </div>
          <p class="text-2xl font-black text-slate-900">{data.stats.total}</p>
        </div>

        <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-emerald-600">
            <span class="text-[11px] font-bold uppercase tracking-wider">Active</span>
            <CheckCircle2 class="h-4 w-4" />
          </div>
          <p class="text-2xl font-black text-emerald-700">{data.stats.active}</p>
        </div>

        <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-rose-600">
            <span class="text-[11px] font-bold uppercase tracking-wider">Suspended</span>
            <ShieldAlert class="h-4 w-4" />
          </div>
          <p class="text-2xl font-black text-rose-700">{data.stats.suspended}</p>
        </div>

        <div class="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-purple-600">
            <span class="text-[11px] font-bold uppercase tracking-wider">Admins & Staff</span>
            <Shield class="h-4 w-4" />
          </div>
          <p class="text-2xl font-black text-purple-700">{data.stats.admins}</p>
        </div>
      </div>

      <!-- Search, Filter & Add User Action Bar -->
      <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
          <!-- Search Input -->
          <div class="relative flex-1 max-w-sm">
            <Search class="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search by name, email, or phone..."
              class="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          <!-- Role Filter -->
          <select
            bind:value={selectedRole}
            class="px-3 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="moderator">Moderator</option>
            <option value="owner">Business Owner</option>
            <option value="visitor">Visitor</option>
          </select>

          <!-- Status Filter -->
          <select
            bind:value={selectedStatus}
            class="px-3 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        {#if data.currentUser.role === "admin"}
          <button
            type="button"
            onclick={() => (isAddUserModalOpen = true)}
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <UserPlus class="h-4 w-4" />
            <span>Add New User</span>
          </button>
        {/if}
      </div>

      <!-- Users Data Table -->
      <div class="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50/60 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4 w-12 text-center">#</th>
                <th class="py-3 px-4">User</th>
                <th class="py-3 px-4">Contact & Email</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Listings</th>
                <th class="py-3 px-4 text-center">Sessions</th>
                <th class="py-3 px-4">Joined</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              {#if filteredUsers.length === 0}
                <tr>
                  <td colspan="9" class="py-12 text-center text-slate-400">
                    <p class="text-sm font-semibold">No users matching search filters.</p>
                    <p class="text-xs mt-0.5">Try clearing the search query or role dropdown.</p>
                  </td>
                </tr>
              {:else}
                {#each filteredUsers as user, idx}
                  <tr class="hover:bg-slate-50/60 transition group">
                    <td class="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>

                    <!-- User Name & Avatar -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="h-9 w-9 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 {user.role === 'admin'
                            ? 'bg-gradient-to-tr from-rose-500 to-red-600'
                            : user.role === 'moderator'
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                              : user.role === 'owner'
                                ? 'bg-gradient-to-tr from-blue-500 to-indigo-600'
                                : 'bg-gradient-to-tr from-slate-500 to-slate-700'}"
                        >
                          {user.name?.slice(0, 2)?.toUpperCase() || "US"}
                        </div>
                        <div class="min-w-0">
                          <p class="font-bold text-slate-900 text-xs leading-tight truncate">
                            {user.name}
                            {#if user.id === data.currentUser.id}
                              <span class="ml-1 text-[10px] font-black px-1 py-0.5 rounded bg-blue-100 text-blue-700">YOU</span>
                            {/if}
                          </p>
                          <span class="text-[10px] text-slate-400 font-mono block truncate mt-0.5">
                            ID: {user.id.slice(0, 10)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Contact & Email -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-1.5">
                        <span class="text-slate-800 font-medium truncate max-w-[160px]">{user.email}</span>
                        <button
                          type="button"
                          onclick={() => handleCopyEmail(user.email)}
                          class="p-1 text-slate-400 hover:text-slate-700 transition rounded"
                          title="Copy email address"
                        >
                          {#if copiedEmail === user.email}
                            <Check class="h-3 w-3 text-emerald-600" />
                          {:else}
                            <Copy class="h-3 w-3" />
                          {/if}
                        </button>
                      </div>
                      <span class="text-[11px] text-slate-400 font-mono block">
                        {user.phone || "No phone added"}
                      </span>
                    </td>

                    <!-- Role Badge -->
                    <td class="py-3 px-4">
                      <span
                        class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider {user.role === 'admin'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : user.role === 'moderator'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : user.role === 'owner'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'}"
                      >
                        {user.role}
                      </span>
                    </td>

                    <!-- Status Pill -->
                    <td class="py-3 px-4">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize {user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user.status === 'suspended'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'}"
                      >
                        <span
                          class="h-1.5 w-1.5 rounded-full {user.status === 'active'
                            ? 'bg-emerald-500'
                            : user.status === 'suspended'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'}"
                        ></span>
                        <span>{user.status}</span>
                      </span>
                    </td>

                    <!-- Listings Count -->
                    <td class="py-3 px-4 text-center">
                      <a
                        href="/admin/listings"
                        class="inline-block px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition"
                      >
                        {user._count.listings}
                      </a>
                    </td>

                    <!-- Active Sessions Count -->
                    <td class="py-3 px-4 text-center">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold {user._count.sessions > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-50 text-slate-400'}"
                      >
                        <Laptop class="h-3 w-3" />
                        <span>{user._count.sessions}</span>
                      </span>
                    </td>

                    <!-- Joined Date -->
                    <td class="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    <!-- Actions Dropdown -->
                    <td class="py-3 px-4 text-right">
                      <div class="relative inline-block text-left">
                        <button
                          type="button"
                          onclick={() => (activeActionRow = activeActionRow === user.id ? null : user.id)}
                          class="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Actions menu"
                        >
                          <MoreVertical class="h-4 w-4" />
                        </button>

                        {#if activeActionRow === user.id}
                          <!-- Backdrop -->
                          <button
                            type="button"
                            tabindex="-1"
                            aria-label="Close action menu"
                            class="fixed inset-0 z-30 cursor-default bg-transparent"
                            onclick={() => (activeActionRow = null)}
                          ></button>

                          <div class="absolute right-0 mt-1 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-150">
                            <!-- Reset Password -->
                            <button
                              type="button"
                              onclick={() => {
                                activeActionRow = null;
                                targetResetUser = { id: user.id, name: user.name, email: user.email };
                              }}
                              class="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 font-medium"
                            >
                              <KeyRound class="h-3.5 w-3.5 text-blue-600" />
                              <span>Reset Password</span>
                            </button>

                            <!-- Toggle Status Form -->
                            {#if user.id !== data.currentUser.id}
                              <form
                                method="POST"
                                action="?/updateUserStatus"
                                use:enhance={() => {
                                  activeActionRow = null;
                                  return async ({ update }) => {
                                    await update();
                                  };
                                }}
                              >
                                <input type="hidden" name="userId" value={user.id} />
                                <input
                                  type="hidden"
                                  name="status"
                                  value={user.status === "active" ? "suspended" : "active"}
                                />
                                <button
                                  type="submit"
                                  class="w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 font-medium"
                                >
                                  {#if user.status === "active"}
                                    <Lock class="h-3.5 w-3.5 text-amber-600" />
                                    <span>Suspend Account</span>
                                  {:else}
                                    <Unlock class="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Activate Account</span>
                                  {/if}
                                </button>
                              </form>

                              <!-- Delete / Purge Form -->
                              <form
                                method="POST"
                                action="?/deleteUser"
                                onsubmit={(e) => {
                                  if (!confirm(`Are you sure you want to deactivate ${user.name}'s account?`)) {
                                    e.preventDefault();
                                  }
                                }}
                                use:enhance={() => {
                                  activeActionRow = null;
                                  return async ({ update }) => {
                                    await update();
                                  };
                                }}
                              >
                                <input type="hidden" name="userId" value={user.id} />
                                <button
                                  type="submit"
                                  class="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                                >
                                  <Trash2 class="h-3.5 w-3.5" />
                                  <span>Deactivate User</span>
                                </button>
                              </form>
                            {/if}
                          </div>
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- TAB 2: GENERAL SETTINGS -->
  {#if activeTab === "general"}
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-7 animate-in fade-in duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Portal Branding & Metadata</h2>
          <p class="text-xs text-slate-500">Global configurations for SEO, business notifications, and public directory headers.</p>
        </div>

        {#if generalSavedNotice}
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-in fade-in">
            <Check class="h-3.5 w-3.5" /> Settings saved!
          </div>
        {/if}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="dirName" class="text-xs font-bold text-slate-700">Directory Brand Name</label>
          <input
            id="dirName"
            type="text"
            value="Pimple Saudagar Local Directory"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>

        <div class="space-y-1.5">
          <label for="supportEmail" class="text-xs font-bold text-slate-700">Support / Contact Email</label>
          <input
            id="supportEmail"
            type="email"
            value="support@pimplesaudagar.local"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
          />
        </div>
      </div>

      <div class="space-y-4 pt-2">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck class="h-4 w-4 text-slate-700" />
          <h3 class="text-sm font-bold text-slate-900">Operational Governance</h3>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-800">Auto-Approve Verified Merchant Claims</p>
              <p class="text-[11px] text-slate-500">Fast-track ownership claims with verified GSTIN or official business domain.</p>
            </div>
            <input type="checkbox" checked class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300" />
          </div>

          <div class="border-t border-slate-200/60 pt-3 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-800">Require Phone OTP on Customer Reviews</p>
              <p class="text-[11px] text-slate-500">Prevent spam submissions by enforcing WhatsApp / SMS OTP verification.</p>
            </div>
            <input type="checkbox" checked class="h-4 w-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300" />
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          onclick={handleGeneralSave}
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Save class="h-4 w-4" />
          <span>Save Directory Configuration</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- Add User Modal -->
<AddUserModal bind:isOpen={isAddUserModalOpen} />

<!-- Admin Reset Password Modal -->
<AdminResetPasswordModal bind:user={targetResetUser} />
