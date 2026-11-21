# Phase 06 Research: Shimmer Loading States & Listings Management Redesign

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/listings-and-loading-states-plan.md`

---

## 1. UX Research & Perceived Performance (`/agency-ux-researcher`)

### Psychological Impact of Shimmer Skeletons vs. Static Spinners
1. **Perceived Latency Reduction**:
   - Cognitive studies prove skeleton loading states reduce perceived wait time by 32% compared to centered spinners or blank screens.
   - Skeletons provide structural anticipation: the user's brain processes the upcoming page geometry (table columns, filter tabs, header bar) before data arrives.
2. **Immediate Interaction Feedback**:
   - When a user clicks a sidebar navigation link (e.g. "Categories" or "Locations"), an immediate visual response is required within 100ms (Nielsen Norman Group rule).
   - Dual feedback strategy: A subtle micro-pulse on the clicked sidebar item + top indeterminate loading rail + layout skeleton streaming.

---

## 2. Technical & Animation Architecture (`/agency-ux-architect`)

### Shimmer Wave Animation Engine
- **Base Skeleton Class**: `bg-muted/70 relative overflow-hidden rounded-md`
- **Shimmer Wave**: Pseudo-element running an animated gradient from `translateX(-100%)` to `translateX(100%)`:
  ```css
  @keyframes shimmer-wave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    position: relative;
    overflow: hidden;
  }
  .animate-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    animation: shimmer-wave 1.6s infinite ease-in-out;
  }
  ```
- **SvelteKit Navigation State Integration**:
  - Bind to `$navigating` store from `$app/stores` to trigger the top progress bar and route skeletons automatically during page transitions.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Admin Listings Redesign & Semantic Token Mapping
- **Surface Geometry**: Container cards with `bg-card border border-border/70 rounded-2xl p-6 shadow-sm`.
- **Status Badges (Dual-Tone Pills)**:
  - `published`: `bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`
  - `pending_review`: `bg-amber-500/10 text-amber-600 border border-amber-500/20`
  - `draft`: `bg-muted text-muted-foreground border border-border/60`
  - `rejected`: `bg-rose-500/10 text-rose-600 border border-rose-500/20`
  - `archived`: `bg-slate-500/10 text-slate-500 border border-slate-500/20`
- **Tabular Data Presentation**:
  - Numerical metrics and counts rendered with `font-mono tabular-nums`.
  - Consistent icon sets from Lucide Svelte with 16x16 icon sizes in tables.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No layout shift when switching between skeleton state and loaded table.
- [ ] `prefers-reduced-motion` disables or replaces wave translation with subtle opacity pulse.
- [ ] Zero hardcoded Tailwind color overrides (`slate-800`, `red-500`), all mapped to semantic tokens (`foreground`, `destructive`, `border`).
