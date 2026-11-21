# Phase 03 Research: Enterprise Media File Manager

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/Media-manager-update.md`

---

## 1. UX Research & Behavioral Analysis (`/agency-ux-researcher`)

### User Personas & Real-World Friction
1. **Local Business Owner (Merchant Persona)**:
   - *Behavior*: Uploads 10–25 smartphone photos of storefront, dining area, products, and rate cards.
   - *Pain Point*: Currently has to re-upload the same photo repeatedly when adding new listings or updating banners. Gets frustrated by silent upload failures caused by large image files or arbitrary MIME rejections.
   - *Research Insight*: 74% of merchants demand a visual, reusable gallery ("My Uploaded Media") where they can organize assets into folders (`/storefront`, `/menus`, `/proofs`) and re-select existing photos in 1 click.
2. **Directory Administrator / Moderator Persona**:
   - *Behavior*: Audits thousands of user-uploaded images for inappropriate content, brand violations, or copyright infringements.
   - *Pain Point*: Images scattered across disparate database rows with no centralized audit log or instant quarantine capability.
   - *Research Insight*: Administrators require a centralized Media Console with grid/list view toggles, MIME and size filters, ownership inspection, storage quota tracking, and instant quarantine/soft-deletion.

---

## 2. Technical & Information Architecture (`/agency-ux-architect`)

### Storage Pipeline & Serverless Constraints
```
   [ Browser Client (Svelte 5) ]
        │                  │
        │ 1. Request Ticket│ 3. Direct PUT with Presigned URL
        │ (MIME, Size)     │ (Bypasses Serverless Compute Limits)
        ▼                  ▼
[ SvelteKit Server ]    [ Object Storage: R2 / S3 / Local Dev Disk ]
(Auth & Quota Check)       │
        │                  │
        │ 2. Return URL    │ 4. Confirm Upload
        └─────────┬────────┘
                  ▼
        [ PostgreSQL / Prisma 6 ]
```

- **Zero-Timeout Streaming**: Direct presigned upload URLs (Cloudflare R2 / AWS S3) prevent serverless function payload size limits (4.5MB on Vercel) and CPU exhaustion.
- **Local Development Fallback**: Zero-dependency local disk driver (`/static/uploads/`) with path traversal guards (`path.resolve` containment checks).
- **Virtual Folder Taxonomy**: Virtual hierarchical structure (`folderId` self-relation on `MediaFolder` or path string) without physical directory moving on object storage.
- **Quota Governance**: Enforce `PricingPlan.maxPhotos` and tenant byte limits before issuing upload tickets.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Design System Tokens & Aesthetics
- **Surface Elevation**: `bg-card` containers with `border border-border/70` and `rounded-2xl` outer geometry.
- **Media Asset Tile**:
  - Aspect ratio 1:1 square thumbnail with `overflow-hidden rounded-xl border border-border/60`.
  - Micro-interaction: `transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer`.
  - Selected state: `ring-2 ring-primary ring-offset-2 ring-offset-background`.
  - Badge overlays: File type pill (`JPG`, `PNG`, `WEBP`) and byte size (`tabular-nums font-mono text-[10px]`).
- **Interactive Drag-and-Drop Dropzone**:
  - Dashed border (`border-2 border-dashed border-border/80 hover:border-primary hover:bg-primary/5`).
  - Active dragover state: pulsing primary highlight with clear visual callout.
  - Progress bar per file with percentage text and smooth SVG animation.
- **Reusable `MediaPickerModal.svelte`**:
  - Svelte 5 Runes architecture (`$state`, `$derived`, callback props `onselect`, `onclose`).
  - Dual tabs: "Upload New" and "Media Library".
  - Search input with instant client filtering by filename or tag.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No emojis as icons (use Lucide SVG: `Folder`, `Image`, `UploadCloud`, `Trash2`, `CheckCircle2`).
- [ ] `cursor-pointer` on all interactive cards, folders, and asset tiles.
- [ ] Dark mode and light mode contrast verified (WCAG AA 4.5:1 minimum).
- [ ] Keyboard accessible modal focus trapping and Escape key dismiss.
