# Phase 08 Research: User Management, Admin Privileges & Collapsible Navigation

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/user-management-plan.md`

---

## 1. UX Research & Administrative Workflow (`/agency-ux-researcher`)

### User Roles & Cognitive Friction
1. **The "Dual Identity" Admin Challenge**:
   - Platform administrators frequently operate both as Directory Admins (managing site-wide listings, taxonomy, and users) and as business owners (testing merchant listing features, billing, and analytics).
   - Constantly manually typing `/admin` or `/dashboard` in the browser URL bar creates high cognitive friction.
   - *UX Solution*: A persistent top-right profile capsule in both headers with a 1-click "Admin Quick Privileges" popover, giving immediate access to the Moderation Queue, Settings, Taxonomy, and User Console.
2. **Screen Real Estate on Complex Dashboards**:
   - Directory data tables and forms are information-dense. A static `w-64` sidebar takes up 20% of standard 1080p laptop displays.
   - *UX Solution*: Collapsible navigation sidebar (`w-64` expanded -> `w-20` compact icon-only) with floating flyout menus on hover and local storage persistence.

---

## 2. Technical & Security Architecture (`/agency-ux-architect`)

### Credential Reset & Session Invalidation
- **Argon2id Re-Hashing**:
  - Administrative password updates must use native Argon2id (`src/lib/auth/password.ts`) with cryptographic salt.
- **Immediate Session Revocation**:
  - When an administrator resets a user's password or switches their status to `suspended` or `locked`, all active sessions for that user in the `Session` table must be deleted immediately in the same database transaction, forcing immediate logout across all devices.
- **Sidebar State Persistence**:
  - Svelte 5 rune state synced with `localStorage.getItem("admin_sidebar_collapsed")` to prevent sidebar state snapping during page navigations.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Profile Hub & Collapsible Sidebar Tokens
- **Collapsible Sidebar Geometry**:
  - Expanded: `w-64 transition-[width] duration-200 ease-in-out`.
  - Compact: `w-20 flex flex-col items-center`.
  - Compact Flyout Menu: `fixed left-20 bg-card border border-border/80 shadow-xl rounded-xl py-2 px-3 z-50 min-w-48`.
- **Top-Right Profile Capsule**:
  - Avatar ring: `ring-2 ring-primary/20 hover:ring-primary/50 transition-all`.
  - Role Badge:
    - Admin: `bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider`
    - Moderator: `bg-amber-500/10 text-amber-600 border border-amber-500/20`
    - Owner: `bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`
- **User Directory Table (`/admin/settings?tab=users`)**:
  - Full tabular presentation with tabular numbers for listing counts and date formatting.
  - Quick action menu for Password Reset and Status Switch.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No layout shift in main header during sidebar collapse/expand.
- [ ] Random password generator produces cryptographically strong 16-char strings with 1-click clipboard copy.
- [ ] Changing user status to "suspended" displays instant feedback toast.
- [ ] Keyboard navigation: Escape closes profile dropdown and password modal.
