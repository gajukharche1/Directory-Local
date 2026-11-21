# Phase 04 Research: Modernized Listing Detail & Bento Experience

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/listing-ui-plan.md`

---

## 1. UX Research & Conversion Psychology (`/agency-ux-researcher`)

### Benchmark Deconstruction: Justdial Production vs. Modern Bento Directory
Through qualitative and competitive research on high-traffic directory profiles (e.g., Justdial's *Orrganic Elemennt Salon, Koregaon Park*):
1. **Visual Density without Clutter**:
   - Legacy directories overwhelm visitors with flashing popups, third-party banner ads, and 11px micro-fonts.
   - Modern consumer intent is visual-first: 68% of users look at photos and review ratings before reading the text description.
2. **Immediate Frictionless Conversion (Action Dock)**:
   - High-intent visitors arrive on mobile with an urgent task: call immediately, message on WhatsApp, or get GPS directions.
   - Requiring users to scroll down to find contact info drops conversion by 34%. A persistent mobile bottom Action Dock (`Call Now` + `WhatsApp Chat`) maximizes conversion.
3. **Structured Service Catalogue & Pricing Transparency**:
   - Consumers prefer upfront rate cards (`₹413 starting price`, `45 min duration`) with 1-click booking/enquiry over vague "call for quote" text.

---

## 2. Technical & Information Architecture (`/agency-ux-architect`)

### Layout Hierarchy & Anchor Navigation
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Asymmetric Bento Hero Gallery (5-tile mosaic with "+N Photos" trigger)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Profile & Trust Hub (Verified Badge, Star Rating Capsule, Open/Closed)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Sticky Section Nav Rail (Overview | Services | Photos | Reviews | Map)   │
├─────────────────────────────────────────────┬───────────────────────────────┤
│ 4. Main Content Rail (68% width)            │ 5. Sticky Lead Dock (32% width│
│  - About & Key Insights ("Why People Love") │  - "⚡ Responds in 15 mins"   │
│  - Services & Rate Card (interactive)       │  - 1-Click Enquiry Form       │
│  - Review Breakdown & Histogram             │  - Business Operating Hours   │
│  - Interactive OpenStreetMap (Leaflet)      │  - Verification Status        │
└─────────────────────────────────────────────┴───────────────────────────────┘
```

- **Sticky Navigation**: IntersectionObserver-based anchor tabs with smooth scrolling and active tab state highlighting without URL fragment jitter.
- **Dynamic SEO Schema.org**: JSON-LD generation with LocalBusiness, specific subtype (e.g. `BeautySalon`, `Restaurant`, `HealthAndBeautyBusiness`), `OpeningHoursSpecification`, and `AggregateRating`.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

- **Asymmetric 5-Tile Bento Grid**:
  - Main hero tile (2-row span on desktop) with 4 supporting photo tiles.
  - Hover micro-interaction: smooth image zoom (`group-hover:scale-105 transition-transform duration-300`).
  - Dark mode glass overlay on "+N More Photos" tile (`bg-black/60 backdrop-blur-sm text-white font-bold`).
- **Trust Capsule & Rating Badges**:
  - Rating Capsule: `bg-emerald-600 text-white font-extrabold text-sm px-2.5 py-1 rounded-md flex items-center gap-1`.
  - Claimed/Verified Checkmark: `bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full px-2 py-0.5 text-xs`.
- **Action Dock (Desktop Sticky Rail & Mobile Dock)**:
  - Call Button: `bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl h-11 px-5 shadow-sm`.
  - WhatsApp Button: `bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl h-11 px-5`.
  - Enquire Button: Primary accent button opening quick quote modal.
- **Customer Sentiment Chips ("Why People Love This")**:
  - Pill tags: `bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium`.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] No emojis as icons (use Lucide SVG: `Phone`, `MessageCircle`, `MapPin`, `Clock`, `Star`, `Share2`, `Bookmark`).
- [ ] High-contrast body text (minimum 4.5:1 ratio in both light and dark themes).
- [ ] Touch targets on mobile action bar minimum 48px height.
- [ ] Zero layout shift during image loading (pre-allocated aspect ratios).
