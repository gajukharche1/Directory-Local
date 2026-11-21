# Phase Plan: Admin Dashboard & Site Settings Modernization

## Goal
Implement a dynamic, database-backed Site Settings engine at `/admin/settings` controlling site branding, localization, and operational switches, and modernize the Admin Dashboard home (`/admin`) with high-contrast KPI priority cards, triage counters, and recent activity streams.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-09-admin-dashboard-settings`
- **Branch Creation**: `git checkout -b feature/phase-09-admin-dashboard-settings`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(settings): add SiteSetting model and DAL service with maintenance guard`
  - Wave 2: `feat(admin-settings): build centralized settings console with ToggleSwitch`
  - Wave 3: `feat(admin-home): modernize admin overview with 4-column KPI cards and triage queue`
  - Wave 4: `feat(layout): inject dynamic site settings into public layout and header`
  - Wave 5: `test(admin): verify maintenance mode guard, dark mode contrast and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-09-admin-dashboard-settings`.

### Wave 1: Database Model & Settings Domain Service
- [ ] **Task 1.1**: Add `SiteSetting` model to `prisma/schema.prisma` with defaults for branding, currency (`₹`), search radius, and operational flags.
- [ ] **Task 1.2**: Synchronize database via `npx prisma db push` and `npx prisma generate`.
- [ ] **Task 1.3**: Implement `src/lib/services/settings.service.ts` with cached retrieval and admin update methods.
- [ ] **Task 1.4**: Update `src/hooks.server.ts` to inspect `maintenanceMode` and enforce maintenance routing for non-admins.
- [ ] **Task 1.5**: Commit Wave 1: `git commit -m "feat(settings): add SiteSetting model and DAL service with maintenance guard"`.

### Wave 2: Centralized Settings Console (`/admin/settings`)
- [ ] **Task 2.1**: Build `src/routes/(admin)/admin/settings/+page.server.ts` with loader and `updateSettingsAction`.
- [ ] **Task 2.2**: Build tabbed interface `src/routes/(admin)/admin/settings/+page.svelte` (General Branding, Localization & Currency, Moderation Rules, Maintenance).
- [ ] **Task 2.3**: Build reusable `ToggleSwitch.svelte` component with `role="switch"` and `aria-checked` accessibility.
- [ ] **Task 2.4**: Wire Logo and Favicon upload triggers into `MediaPickerModal.svelte`.
- [ ] **Task 2.5**: Commit Wave 2: `git commit -m "feat(admin-settings): build centralized settings console with ToggleSwitch"`.

### Wave 3: Admin Dashboard Home Overhaul (`/admin`)
- [ ] **Task 3.1**: Refactor `src/routes/(admin)/admin/+page.server.ts` to load comprehensive directory metrics (active listings, pending review count, claims queue, registered users, and recent activity log).
- [ ] **Task 3.2**: Redesign `src/routes/(admin)/admin/+page.svelte` with a 4-column modern KPI card grid (Active Listings, Pending Approvals, Claims, Users) with priority alert pills.
- [ ] **Task 3.3**: Add "Quick Triage" queue section: 1-click links to resolve pending reviews or claims.
- [ ] **Task 3.4**: Add Recent Activity Feed displaying audit logs with timestamps and user avatars.
- [ ] **Task 3.5**: Commit Wave 3: `git commit -m "feat(admin-home): modernize admin overview with 4-column KPI cards and triage queue"`.

### Wave 4: Public Site Header & Layout Integration
- [ ] **Task 4.1**: Update public layout (`src/routes/+layout.server.ts`) to inject site title, tagline, logo, and currency symbol from `settings.service.ts`.
- [ ] **Task 4.2**: Update `src/lib/components/ui/Header.svelte` to dynamically render branding from site settings.
- [ ] **Task 4.3**: Commit Wave 4: `git commit -m "feat(layout): inject dynamic site settings into public layout and header"`.

### Wave 5: Verification & Accessibility
- [ ] **Task 5.1**: Test toggling maintenance mode and verify non-admin users are blocked.
- [ ] **Task 5.2**: Test updating currency symbol to verify changes propagate across pricing and deals pages.
- [ ] **Task 5.3**: Run `npm run check` and `npm test` verifying 0 errors.
- [ ] **Task 5.4**: Commit Wave 5: `git commit -m "test(admin): verify maintenance mode guard, dark mode contrast and typecheck"`.

---

## Verification Criteria
1. Changing the site name and logo in `/admin/settings` updates public headers without code changes or rebuilds.
2. Toggling maintenance mode redirects visitors to a maintenance screen while allowing logged-in admins full access.
3. `/admin` renders the 4-column executive KPI grid with accurate triage counts.
4. Toggle switches are fully keyboard accessible.
5. `npm run check` and `npm test` exit cleanly.
