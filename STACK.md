# Technical Stack & Dependency Matrix: Local Business Directory

**Project Name**: Local Business Directory  
**Package/Slug**: `local-directory-slug`  
**Internal Prefix**: `PS`  
**Architecture**: SvelteKit 2 + Svelte 5 (Runes) + PostgreSQL via Prisma + Tailwind CSS v4

---

## 1. Runtime & Core Framework

| Layer | Technology | Selection Rationale & Version Pinning |
| :--- | :--- | :--- |
| **Framework** | SvelteKit 2 + Svelte 5 | Fine-grained reactivity without Virtual DOM overhead, server-rendered SEO, unified type-safe `PageServerLoad` & Form Actions. |
| **Runtime UI** | Svelte 5 (Runes) | `$state`, `$derived`, `$props`, `{#snippet}` for lean, responsive, zero-bloat UI. |
| **Language** | TypeScript 5.x / 6.x | Strict mode (`strict: true`, `noUncheckedIndexedAccess: true`). |
| **Styling** | Tailwind CSS v4 | CSS-first configuration via `@tailwindcss/vite` with modern utility tokens. |
| **Icons** | Lucide Svelte | Clean, tree-shakeable SVG icon collection for Svelte. |

---

## 2. Data Layer & State

| Layer | Technology | Specification |
| :--- | :--- | :--- |
| **Primary Database** | PostgreSQL 16 (Prisma Postgres / Neon / Supabase / Local Docker) | Relational data integrity, ACID transactions, native full-text search (`tsvector`), connection pooling via PgBouncer / Neon pooler. |
| **ORM / Client** | Prisma ORM 6.4.1 | Type-safe schema definition, declarative migrations, connection pooling. |
| **Geospatial Queries** | PostGIS or Haversine SQL | Bounding box spatial index (`GiST`) with Haversine formula fallback for radius calculations. |
| **Caching & Rate Limit** | In-Memory Token Bucket / Redis | Sliding-window rate limiting, search autocomplete caching, session revocation cache, in-memory fallback for local dev. |
| **File Storage** | Cloudflare R2 / AWS S3 | Object storage for business photos, claim proofs, and category icons via pre-signed URLs. |

---

## 3. Security, Authentication & Validation

| Domain | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Authentication** | Custom Session via Cookies | Argon2id password hashing, HTTP-only Secure SameSite cookies, session rotation, account lockout on failed attempts. |
| **Schema Validation** | Zod 3.x / 4.x | End-to-end type validation shared across forms and endpoints. Strict objects (`.strict()`). |
| **Sanitization** | sanitize-html | Strict server-side allowlist for rich text (`p`, `br`, `strong`, `em`, `ul`, `ol`, `li`, `a[rel="nofollow noopener noreferrer"][href^="https://"]`). |
| **Security Headers** | SvelteKit Server Hooks (`hooks.server.ts`) | HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin. |
| **Bot Protection** | Honeypot & Time-Trap | Anti-bot defenses on public review, claim, and enquiry forms. |

---

## 4. Maps, Media & Communications

| Component | Provider / Tool | Integration Details |
| :--- | :--- | :--- |
| **Maps** | Leaflet + OpenStreetMap | Client-side map with `leaflet.markercluster`. Pluggable adapter to swap to Google Maps via environment switch. |
| **Image Processing** | Sharp | Server-side EXIF GPS metadata stripping, re-encoding to WebP/AVIF, dimension throttling. |
| **Transactional Email**| EmailService | Transactional email delivery behind adapter interface, HTML templates. |
| **Payments** | Razorpay (Primary INR) + Stripe | Hosted checkout / tokenized payments, webhook signature verification with event replay protection. |

---

## 5. Background Jobs & Observability

| Service | Mechanism | Details |
| :--- | :--- | :--- |
| **Scheduled Jobs** | SvelteKit Server Endpoints (`src/routes/api/cron/*`) | Protected by `CRON_SECRET` header/query verification for plan expiration, rating recalculation, and session cleanup. |
| **Health Check** | `src/routes/api/health/+server.ts` | Database ping, memory usage, uptime reporter. |
| **Test Suite** | Vitest 4.x | Unit and integration testing across auth, rate limiting, and business services. |
