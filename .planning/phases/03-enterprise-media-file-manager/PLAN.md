# Phase Plan: Enterprise Media File Manager

## Goal
Implement a centralized, multi-tenant Enterprise Media File Manager featuring direct presigned cloud uploads, virtual folder taxonomy, quota governance, and a reusable `MediaPickerModal.svelte` for listings, categories, and locations, adhering to high-contrast WCAG AA standards.

---

## Git Branch & Commit Strategy
- **Branch**: `feature/phase-03-media-file-manager`
- **Branch Creation**: `git checkout -b feature/phase-03-media-file-manager`
- **Commit Standards**: Conventional Commits with descriptive scopes:
  - Wave 1: `feat(media): add MediaFolder model, schema migration and storage driver`
  - Wave 2: `feat(media): implement presigned upload ticket and confirmation endpoints`
  - Wave 3: `feat(media): build reusable MediaPickerModal, dropzone and asset grid`
  - Wave 4: `feat(media): add merchant and admin media consoles with quota meter`
  - Wave 5: `test(media): add unit tests, verify WCAG AA compliance and typecheck`

---

## Detailed Task Breakdown

### Wave 0: Git Branch Setup
- [ ] **Task 0.1**: Create and switch to phase feature branch: `git checkout -b feature/phase-03-media-file-manager`.

### Wave 1: Database Schema & Storage Driver Foundations
- [ ] **Task 1.1**: Add `MediaFolder` model to `prisma/schema.prisma` and update `Media` model with `folderId`, `altText`, `tags`, `isQuarantined`, and `deletedAt` fields.
- [ ] **Task 1.2**: Execute `npx prisma db push` and `npx prisma generate`.
- [ ] **Task 1.3**: Implement `src/lib/services/storage.service.ts` supporting S3/Cloudflare R2 presigned ticket generation with a safe local disk fallback (`/static/uploads/`).
- [ ] **Task 1.4**: Extend `src/lib/services/media.service.ts` with multi-tenant asset isolation, virtual folder CRUD, and quota checks against `PricingPlan.maxPhotos`.
- [ ] **Task 1.5**: Commit Wave 1: `git commit -m "feat(media): add MediaFolder model, schema migration and storage driver"`.

### Wave 2: Storage Ingestion & Presigned Upload Routes
- [ ] **Task 2.1**: Implement ticket route `/api/media/upload-ticket` (validates MIME types, byte sizes, user quotas, and issues presigned URLs).
- [ ] **Task 2.2**: Implement upload confirmation route `/api/media/confirm` (persists asset metadata in PostgreSQL).
- [ ] **Task 2.3**: Build client-side chunked/direct uploader utility `src/lib/utils/media-uploader.ts` with progress callbacks.
- [ ] **Task 2.4**: Commit Wave 2: `git commit -m "feat(media): implement presigned upload ticket and confirmation endpoints"`.

### Wave 3: Universal Reusable `MediaPickerModal.svelte` (Svelte 5 Runes)
- [ ] **Task 3.1**: Create `src/lib/components/media/MediaDropzone.svelte` with drag & drop, file preview, and upload progress bars.
- [ ] **Task 3.2**: Create `src/lib/components/media/MediaAssetGrid.svelte` with multi-select support, thumbnail caching, and badge metadata.
- [ ] **Task 3.3**: Create `src/lib/components/media/MediaPickerModal.svelte` with tabbed "Upload New" vs "Media Library" views, search filtering, and single/multi-selection modes.
- [ ] **Task 3.4**: Integrate `MediaPickerModal.svelte` into listing forms and category/location editors.
- [ ] **Task 3.5**: Commit Wave 3: `git commit -m "feat(media): build reusable MediaPickerModal, dropzone and asset grid"`.

### Wave 4: Merchant & Admin Media Management Consoles
- [ ] **Task 4.1**: Build Merchant Media Hub `src/routes/(account)/dashboard/media/+page.server.ts` and `+page.svelte` (quota indicator bar, folder navigation, bulk move/delete).
- [ ] **Task 4.2**: Build Admin Global Media Console `src/routes/(admin)/admin/media/+page.server.ts` and `+page.svelte` (system-wide audit, quarantine toggle, storage metrics).
- [ ] **Task 4.3**: Add navigation links to Dashboard and Admin navigation sidebars.
- [ ] **Task 4.4**: Commit Wave 4: `git commit -m "feat(media): add merchant and admin media consoles with quota meter"`.

### Wave 5: Verification & Quality Assurance
- [ ] **Task 5.1**: Write unit tests in `src/lib/services/media.service.spec.ts` for quota enforcement and tenant isolation.
- [ ] **Task 5.2**: Verify WCAG AA compliance, keyboard navigation (Escape to close modal), and responsive layouts (375px to 1440px).
- [ ] **Task 5.3**: Run `npm run check` and `npm test` verifying 0 errors.
- [ ] **Task 5.4**: Commit Wave 5: `git commit -m "test(media): add unit tests, verify WCAG AA compliance and typecheck"`.

---

## Verification Criteria
1. Merchants can upload images up to their plan limit without hitting serverless size timeouts.
2. `MediaPickerModal.svelte` seamlessly attaches uploaded photos to listings.
3. Assets can be organized into virtual folders without modifying physical storage keys.
4. Admin can quarantine suspicious images, instantly hiding them from public listings.
5. `npm run check` and `npm test` exit with 0 errors.
