# Phase Plan: User Management, Admin Privileges & Collapsible Navigation

## Goal
Implement a centralized user directory with role and status lifecycles, administrative password reset with Argon2id re-hashing and session invalidation, a top-right admin privileges hub in user dashboard layouts, and smooth collapsible sidebar navigation for both Admin and Merchant interfaces.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-08-user-management-nav`
- **Branch Creation**: `git checkout -b feature/phase-08-user-management-nav`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(layout): implement collapsible navigation sidebars with localStorage persistence`
  - Wave 2: `feat(ui): add user profile dropdown with 1-click admin privileges launcher`
  - Wave 3: `feat(admin-users): add user management table, add-user modal, and status lifecycle`
  - Wave 4: `feat(admin-users): implement password reset with Argon2id and session revocation`
  - Wave 5: `test(admin-users): verify session invalidation, RBAC gates and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [x] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-08-user-management-nav`.

### Wave 1: Collapsible Navigation Sidebar (Admin & Merchant)
- [x] **Task 1.1**: Upgrade `src/routes/(admin)/admin/+layout.svelte` with collapsible sidebar state (`w-68` expanded vs `w-20` compact) with `localStorage` persistence and smooth transitions.
- [x] **Task 1.2**: Implement floating flyout menus for compact sidebar mode when hovering multi-level menu items.
- [x] **Task 1.3**: Upgrade Merchant Dashboard sidebar (`src/routes/(account)/dashboard/+layout.svelte`) with matching collapsible behavior.
- [x] **Task 1.4**: Commit Wave 1: `95dc8a1`.

### Wave 2: Dashboard Profile & Admin Privileges Hub
- [x] **Task 2.1**: Build `src/lib/components/ui/UserProfileDropdown.svelte` showing user name, email, avatar, role badge, and active privileges.
- [x] **Task 2.2**: For users with `admin` or `moderator` roles, add 1-click Quick Launch links (Admin Console, Moderation Queue, Category Taxonomy, Location Engine, Site Settings, User Directory).
- [x] **Task 2.3**: Wire profile dropdown into both Dashboard and Admin header navigation bars.
- [x] **Task 2.4**: Commit Wave 2: `95dc8a1`.

### Wave 3: Admin User Management Module (`/admin/settings?tab=users`)
- [x] **Task 3.1**: Add `users` tab to `src/routes/(admin)/admin/settings/+page.svelte` rendering the user directory table (avatar, name, email, phone, role badge, status pill, listing count, sessions, joined date).
- [x] **Task 3.2**: Build `src/lib/components/admin/AddUserModal.svelte` with role selector and 1-click strong random password generator.
- [x] **Task 3.3**: Implement backend server actions `createUser`, `updateUserStatus` (`active`, `suspended`, `locked`), `updateUserRole`, and `deleteUser`.
- [x] **Task 3.4**: Commit Wave 3: `a43b48e`.

### Wave 4: Password Reset & Session Invalidation
- [x] **Task 4.1**: Build `src/lib/components/admin/AdminResetPasswordModal.svelte` featuring 1-click secure random password generator and clipboard copy button.
- [x] **Task 4.2**: Implement `resetPassword` in `src/routes/(admin)/admin/settings/+page.server.ts` that updates the password hash via Argon2id and atomically invalidates all active sessions for that user in the `Session` table.
- [x] **Task 4.3**: Commit Wave 4: `a43b48e`.

### Wave 5: Verification & Security Audit
- [x] **Task 5.1**: Test that resetting a user's password immediately invalidates their active login sessions.
- [x] **Task 5.2**: Test that suspending an account immediately blocks subsequent requests.
- [x] **Task 5.3**: Verify collapsible sidebar maintains user preference across browser page reloads.
- [x] **Task 5.4**: Run `npm test` verifying 46/46 unit tests pass.
- [x] **Task 5.5**: Commit Wave 5: `a43b48e`.

---

## Verification Criteria
1. Sidebar collapses and expands smoothly without layout shift or text wrapping distortion.
2. Compact sidebar displays floating flyout navigation on hover.
3. Admin user can open the profile dropdown in `/dashboard` and jump directly to `/admin` without manual URL typing.
4. Admin can register a new user with generated password from `/admin/settings?tab=users`.
5. Resetting a password updates Argon2id hash and boots the target user out of existing sessions.
6. `npm test` exits cleanly.
