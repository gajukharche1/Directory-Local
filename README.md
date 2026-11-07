# Local Business Directory — SvelteKit Port

A modern, production-grade local business directory, fully configurable for any city, neighborhood, or region, built with **SvelteKit 2 + Svelte 5 (Runes)** and **Tailwind CSS v4**.

---

## 🚀 Technology Stack

- **Framework**: SvelteKit 2 + Svelte 5 (with Runes: `$state`, `$derived`, `$props`, `{#snippet}`)
- **Styling**: Tailwind CSS v4 + PostCSS isolation
- **Database & ORM**: PostgreSQL 16 + Prisma Client 6.4.1 (Supports Prisma Postgres, Neon, Supabase, and self-hosted)
- **Authentication**: Argon2id password hashing + secure HttpOnly cookies (`ps_session`)
- **Maps**: Dynamic client-only Leaflet with OpenStreetMap tiles
- **Icons**: `lucide-svelte`
- **Testing**: Vitest with unit and integration coverage

---

## 📂 Architecture & Directory Structure

```
├── prisma/
│   └── schema.prisma             # PostgreSQL schema (Listings, Reviews, Claims, Users, Sessions)
├── scripts/
│   └── seed.ts                   # Initial database seeding script
├── src/
│   ├── app.d.ts                  # App typing (App.Locals: user & session)
│   ├── hooks.server.ts           # Server hooks (RBAC guard, session resolution, security headers)
│   ├── lib/
│   │   ├── auth/                 # Session management, Argon2id passwords, RBAC
│   │   ├── components/
│   │   │   ├── forms/            # EnquiryModal (honeypot + time-trap)
│   │   │   ├── listing/          # ListingCard, OpeningHoursCard, ListingGallery, ContactCard
│   │   │   ├── map/              # Dynamic client-only MapView with Leaflet
│   │   │   ├── reviews/          # Interactive ReviewForm with DPDP hashing
│   │   │   ├── search/           # SearchFilters with query bindings
│   │   │   ├── taxonomy/         # CategoryCard, LocationCard
│   │   │   └── ui/               # Header, SkipLink, LanguageSelector
│   │   ├── config/               # Environment variable validation (Zod)
│   │   ├── db/                   # Prisma Client singleton
│   │   ├── messages/             # i18n dictionaries (en, mr, hi)
│   │   ├── security/             # Rate-limiting, sanitization, CSRF
│   │   ├── services/             # Core business logic (Listing, Search, Review, Claim, Payment, Plan)
│   │   └── utils/                # Opening hours calculation, formatting
│   └── routes/
│       ├── +layout.svelte        # Global layout with Header and SkipLink
│       ├── +page.svelte          # Homepage (Hero search, categories, featured listings, locations)
│       ├── (auth)/               # Login, Register, Forgot Password, Logout
│       ├── (public)/             # Listing profile, Search, Category archive, Location archive, Pricing, Claim, Reviews
│       ├── (account)/dashboard/  # Business owner dashboard (Overview, Listings, Enquiries, Reviews, Billing)
│       ├── (admin)/admin/        # Moderator back-office (Overview, Moderation queue, Listings table, CSV Importer)
│       └── api/                  # Health check, Search autocomplete, Webhooks, and Cron jobs
```

---

## 🛠 Local Setup & Running

### 1. Prerequisites
- **Node.js** >= 18 (Node.js 22 LTS recommended)
- **PostgreSQL** database (Local PostgreSQL, Prisma Postgres, Neon, or Supabase)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:5173"
APP_SECRET="your_secret_key_must_be_at_least_32_characters_long"
CRON_SECRET="your_cron_secret_key"
```

### 3. Generate Prisma Client & Push Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. (Optional) Seed Sample Data
```bash
npx tsx scripts/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Run Unit Tests
```bash
npm test
```

### 7. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🛡 Security & Privacy
- **Password Hashing**: Argon2id via `@node-rs/argon2`.
- **Reviewer Privacy**: Raw email addresses are SHA-256 hashed with salt before storage.
- **Bot Mitigation**: Rate-limiting token buckets on search and review submission, alongside honeypots and time-traps on lead forms.
- **RBAC**: Protected `/admin` and `/dashboard` routes enforced server-side in SvelteKit hooks.
