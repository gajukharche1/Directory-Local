# System Architecture: Local Business Directory

```
+---------------------------------------------------------------------------------------+
|                                    Edge & Clients                                     |
|  [Desktop / Mobile Browsers] <---> [SvelteKit Server Hooks] (RBAC, Session, Headers)  |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                               SvelteKit 2 + Svelte 5                                  |
|                                                                                       |
|  +---------------------------+   +----------------------------+                       |
|  | Server Load Functions     |   | Svelte 5 Client Runes      |                       |
|  | (+page.server.ts)         |   | ($state, $props, $derived) |                       |
|  | - Listing Profiles        |   | - Leaflet MapView          |                       |
|  | - Category/Location Hubs  |   | - Search Filter Bar        |                       |
|  +---------------------------+   +----------------------------+                       |
|                |                               |                                      |
|                v                               v                                      |
|  +------------------------------------------------------------+                       |
|  | Form Actions & Server Endpoints (+page.server.ts, +server) |                       |
|  | - Zod Input Schema Validation (.strict())                  |                       |
|  | - Origin Header Verification & SvelteKit CSRF Guard        |                       |
|  | - Sliding Window / Token Bucket Rate Limiter               |                       |
|  +------------------------------------------------------------+                       |
|                                |                                                      |
|                                v                                                      |
|  +------------------------------------------------------------+                       |
|  | Domain Service Layer (src/lib/services/*)                  |                       |
|  | - ListingService, ReviewService, PlanService, MediaService |                       |
|  | - Data Access Layer (DAL) Enforcing Owner/Role Boundaries  |                       |
|  +------------------------------------------------------------+                       |
+---------------------------------------------------------------------------------------+
                 |                       |                       |
                 v                       v                       v
+--------------------------------+ +----------------+ +--------------------------------+
|      PostgreSQL 16 Engine      | |  Redis (Upstash| | Cloudflare R2 / AWS S3         |
| - Full-Text Search (tsvector)  | |  / Docker)     | | - Pre-signed uploads           |
| - Spatial GiST Bounding Boxes  | | - Rate limits  | | - Sharp processed images       |
| - ACID Recalculation Txns      | | - Cache tags   | | - Public WebP/AVIF CDN         |
+--------------------------------+ +----------------+ +--------------------------------+
                 |
                 v
+---------------------------------------------------------------------------------------+
|                            External Service Adapters                                  |
|  [Resend / Email Service]     [Razorpay / Stripe Payments]     [Turnstile Bot Guard]  |
+---------------------------------------------------------------------------------------+
```

---

## 1. Architectural Decision Records (ADRs)

### ADR-01: SvelteKit 2 + Svelte 5 (Runes) SSR & Form Actions
- **Decision**: Adopt SvelteKit 2 with Svelte 5 Runes (`$state`, `$props`, `$derived`, `{#snippet}`) and Server Form Actions.
- **Rationale**: A local business directory requires top-tier SEO, fast Time-to-First-Byte (TTFB), and low client runtime overhead. Svelte 5 compiles away virtual DOM overhead, delivering faster page loads, instantaneous client navigation, and unified server form actions with automatic progressive enhancement.

### ADR-02: PostgreSQL Native Full-Text Search vs External Search Engines
- **Decision**: Leverage PostgreSQL built-in `tsvector`, `tsquery`, GIN indexes, and `pg_trgm` similarity queries instead of Algolia or Elasticsearch.
- **Rationale**: For directories scaling up to 10,000+ listings, PostgreSQL FTS provides sub-10ms response times without cross-service network latency, data synchronization lag, or additional SaaS operational costs.

### ADR-03: Data Access Layer (DAL) Ownership Isolation
- **Decision**: Enforce tenant and ownership isolation directly in `src/lib/services/` and database repository functions rather than relying only on UI checks.
- **Rationale**: Mitigates Insecure Direct Object References (IDOR, OWASP Top 10 A01:2021). Every listing update, image deletion, or reply submission explicitly verifies `where: { id, ownerId: session.userId }` at the SQL query level.

### ADR-04: Atomic Recalculation for Ratings & Review Aggregates
- **Decision**: When reviews transition state (e.g. `pending` -> `approved` or `approved` -> `trashed`), ratings are recalculated inside an atomic PostgreSQL interactive transaction (`prisma.$transaction`).
- **Rationale**: Eliminates rating drift, stale averages, and concurrency race conditions. Background cron repairs exist as a secondary failsafe.

### ADR-05: SvelteKit Server Hooks for Security & Access Control
- **Decision**: Enforce authentication resolution, role-based access control (RBAC), and security headers centrally via `src/hooks.server.ts`.
- **Rationale**: Guarantees that protected areas (`/admin/*` and `/dashboard/*`) cannot be accessed without valid session tokens and proper roles, regardless of how routes are loaded.

---

## 2. Security Architecture & Threat Model (STRIDE)

| Threat | Target Subsystem | Mitigation Architecture |
| :--- | :--- | :--- |
| **Spoofing** | User & Owner Auth | Argon2id password hashing, hashed single-use tokens, session rotation upon privilege elevation. |
| **Tampering** | Listings & Reviews | Server-side HTML sanitization with strict element allowlist, strict Zod schema validation, parameterised queries. |
| **Repudiation** | Moderation & Admin | Append-only `audit_log` recording `actorId`, `action`, `entity`, `ipAddress`, and diff snapshots. |
| **Information Disclosure** | PII & Reviewers | Reviewer emails hashed with server-side pepper; raw business emails hidden behind server action contact proxies. |
| **Denial of Service** | Search & Form Spam | Sliding-window rate limits (e.g. 5 reviews/hr/IP, 60 search queries/min/IP), honeypot traps, time-traps. |
| **Elevation of Privilege** | Admin & Owner Areas | Role-based route guards in `src/hooks.server.ts` checking `UserRole` (`admin`, `moderator`, `owner`, `visitor`). |

---

## 3. Data Flow Pipelines

### 3.1 Public Search & Directory Browsing
1. User requests search `/search?q=bakery&location=central`
2. `src/routes/(public)/search/+page.server.ts` executes `SearchService.searchListings()`
3. PostgreSQL performs indexed FTS query with locality filter
4. Server streams pre-rendered HTML to browser; client-side Svelte 5 runes handle interactive filtering without full page reloads

### 3.2 Lead Capture & Enquiry Flow
1. User clicks "Send Enquiry" on listing profile
2. `EnquiryModal.svelte` captures contact form data, honeypot field, and timestamp
3. Submitted to `/api/enquiry` or page action; validated via Zod
4. Lead stored in PostgreSQL; non-blocking notification dispatched via `EmailService`
