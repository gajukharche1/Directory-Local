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
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-08-user-management-nav`.

### Wave 1: Collapsible Navigation Sidebar (Admin & Merchant)
- [ ] **Task 1.1**: Upgrade `src/routes/(admin)/admin/+layout.svelte` with collapsible sidebar state (`w-64` expanded vs `w-20` compact) with `localStorage` persistence and smooth transitions.
- [ ] **Task 1.2**: Implement floating flyout menus for compact sidebar mode when hovering multi-level menu items.
- [ ] **Task 1.3**: Upgrade Merchant Dashboard sidebar (`src/routes/(account)/dashboard/+layout.svelte`) with matching collapsible behavior.
- [ ] **Task 1.4**: Commit Wave 1: `git commit -m "feat(layout): implement collapsible navigation sidebars with localStorage persistence"`.

### Wave 2: Dashboard Profile & Admin Privileges Hub
- [ ] **Task 2.1**: Build `src/lib/components/ui/UserProfileDropdown.svelte` showing user name, email, avatar, role badge, and active sessions.
- [ ] **Task 2.2**: For users with `admin` or `moderator` roles, add 1-click Quick Launch links (Admin Console, Moderation Queue, Category Taxonomy, Location Engine, Site Settings).
- [ ] **Task 2.3**: Wire profile dropdown into both Dashboard and Admin header navigation bars.
- [ ] **Task 2.4**: Commit Wave 2: `git commit -m "feat(ui): add user profile dropdown with 1-click admin privileges launcher"`.

### Wave 3: Admin User Management Module (`/admin/settings?tab=users`)
- [ ] **Task 3.1**: Add `users` tab to `src/routes/(admin)/admin/settings/+page.svelte` rendering the user directory table (avatar, name, email, phone, role badge, status pill, listing count, joined date).
- [ ] **Task 3.2**: Build `src/lib/components/admin/AddUserModal.svelte` with Zod validation, role selector, and 1-click strong random password generator.
- [ ] **Task 3.3**: Implement backend server actions `createUserAdminAction` and `updateUserStatusAction` (`active`, `suspended`, `locked`).
- [ ] **Task 3.4**: Commit Wave 3: `git commit -m "feat(admin-users): add user management table, add-user modal, and status lifecycle"`.

### Wave 4: Password Reset & Session Invalidation
- [ ] **Task 4.1**: Build `src/lib/components/admin/AdminResetPasswordModal.svelte` featuring 1-click secure random password generator and clipboard copy button.
- [ ] **Task 4.2**: Implement `resetUserPasswordAdminAction` in `src/routes/(admin)/admin/settings/+page.server.ts` that updates the password hash via Argon2id and atomically invalidates all active sessions for that user in the `Session` table.
- [ ] **Task 4.3**: Commit Wave 4: `git commit -m "feat(admin-users): implement password reset with Argon2id and session revocation"`.

### Wave 5: Verification & Security Audit
- [ ] **Task 5.1**: Test that resetting a user's password immediately invalidates their active login sessions.
- [ ] **Task 5.2**: Test that suspending an account immediately blocks subsequent requests.
- [ ] **Task 5.3**: Verify collapsible sidebar maintains user preference across browser page reloads.
- [ ] **Task 5.4**: Run `npm run check` and `npm test` verifying 0 errors.
- [ ] **Task 5.5**: Commit Wave 5: `git commit -m "test(admin-users): verify session invalidation, RBAC gates and typecheck"`.

---

## Verification Criteria
1. Sidebar collapses and expands smoothly without layout shift or text wrapping distortion.
2. Compact sidebar displays floating flyout navigation on hover.
3. Admin user can open the profile dropdown in `/dashboard` and jump directly to `/admin` without manual URL typing.
4. Admin can register a new user with generated password from `/admin/settings?tab=users`.
5. Resetting a password updates Argon2id hash and boots the target user out of existing sessions.
6. `npm run check` and `npm test` exit cleanly.
