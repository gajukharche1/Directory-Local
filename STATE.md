# Project State

## Current Status
- **Date**: 2026-11-07
- **Current Phase**: Phase 4 — Vercel Deployment & Bug Fix Complete
- **Status**: ALL 500 ERRORS FULLY RESOLVED (Verified 200 OK across all live production routes)

## Root Cause Analysis & Solutions
1. **Root Cause 1: `DevalueError: Cannot stringify arbitrary non-POJOs`**
   - **Diagnosis**: SvelteKit's `devalue` serializer fails when passing non-POJOs (`Prisma.Decimal`, `BigInt`) from `+page.server.ts` to `+page.svelte`.
   - **Resolution**: Implemented recursive `toPOJO` utility and applied it across all server loaders.

2. **Root Cause 2: CommonJS / ESM runtime crash (`htmlparser2`)**
   - **Diagnosis**: `sanitize-html` was compiled as CommonJS using `require("htmlparser2")`. On Vercel's serverless Linux environment, `htmlparser2` is an ESM-only package, throwing:
     `Error [ERR_REQUIRE_ESM]: require() of ES Module /var/task/node_modules/htmlparser2/dist/index.js from /var/task/node_modules/sanitize-html/index.js not supported.`
   - **Resolution**: Replaced `sanitize-html` with a zero-dependency native regex HTML sanitizer in `src/lib/security/sanitize.ts` and removed `sanitize-html` from dependencies.

3. **Root Cause 3: Vercel Framework Preset & Output Detection**
   - **Diagnosis**: Vercel failed with `STATIC_BUILD_NO_OUT_DIR` because legacy Next.js project settings expected a `public` output directory.
   - **Resolution**: Added `vercel.json` with `{"framework": "sveltekit"}`, installed `@sveltejs/adapter-vercel`, and added a fallback `public/.gitkeep`.

4. **SSR Defensive Hardening**
   - Hardened `OpeningHoursCard.svelte` against null or undefined time strings.
   - Hardened `+page.svelte` against non-integer star ratings (`Array(rating)` invalid length crash).
   - Added SvelteKit `handleError` server hook in `src/hooks.server.ts` and custom `src/routes/+error.svelte`.

## Empirical Verification (Live Vercel Production)
- `https://directory-local.vercel.app/` -> **200 OK**
- `https://directory-local.vercel.app/listing/coolbreeze-ac-refrigerator-repair-local-area` -> **200 OK** (30,717 bytes)
- `https://directory-local.vercel.app/listing/govind-garden-multi-cuisine-restaurant` -> **200 OK**
- `https://directory-local.vercel.app/listing/dr-smile-advanced-dental-clinic-local-area` -> **200 OK**
- `https://directory-local.vercel.app/category/food-and-dining` -> **200 OK**
- `https://directory-local.vercel.app/category/home-services` -> **200 OK**
- `https://directory-local.vercel.app/category/dental-clinics` -> **200 OK**
- `https://directory-local.vercel.app/category/ac-repair-services` -> **200 OK**
- `https://directory-local.vercel.app/claim/coolbreeze-ac-refrigerator-repair-local-area` -> **200 OK**
- `https://directory-local.vercel.app/pricing` -> **200 OK**
- `https://directory-local.vercel.app/search` -> **200 OK**
- `https://directory-local.vercel.app/login` -> **200 OK**
- `https://directory-local.vercel.app/register` -> **200 OK**
- `https://directory-local.vercel.app/robots.txt` -> **200 OK**
- `https://directory-local.vercel.app/sitemap.xml` -> **200 OK**
