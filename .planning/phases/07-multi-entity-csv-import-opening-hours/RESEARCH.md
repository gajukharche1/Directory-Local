# Phase 07 Research: Multi-Entity CSV Import Hub & Business Opening Hours

> **Methodology Integration**: `/ui-ux-pro-max`, `/agency-ui-designer`, `/agency-ux-architect`, `/agency-ux-researcher`  
> **Source Specification**: `.planning/update/import-and-opening-hours-plan.md`

---

## 1. UX Research & Operational Human Factors (`/agency-ux-researcher`)

### Pain Points in Bulk Data Onboarding
1. **The "Silent CSV Failure" Trap**:
   - In most directory platforms, importing CSVs fails with generic "Internal Server Error" or "Row 42 invalid" without explaining *which column* failed or what format was expected.
   - Administrators waste hours debugging CSV files in Excel.
   - *UX Solution*: Pre-flight client-side inspection. Parse the file in browser memory first, validate mandatory headers (`title`, `category`, `address`, `phone`), and display a visual preview table with flagged invalid rows *before* submitting to the server.
2. **Opening Hours Ambiguity**:
   - Merchants and data vendors provide operating hours in diverse formats: "Mon-Sat 9am to 9pm", "10:00 - 22:00", "24x7", or closed Sundays.
   - Requiring raw JSON input guarantees 90%+ failure rates.
   - *UX Solution*: Smart shorthand regex parser converting natural language and military times into structured JSON, paired with an interactive 7-day visual timetable matrix with 1-click presets ("24/7", "Mon-Sat 9 AM - 9 PM", "Mon-Fri 9 AM - 6 PM").

---

## 2. Technical Architecture & Data Formats (`/agency-ux-architect`)

### Opening Hours Standard Structure
```typescript
export interface DaySchedule {
  isOpen: boolean;
  openTime: string;  // "09:00" (HH:mm 24-hour)
  closeTime: string; // "21:00"
}

export type WeekSchedule = Record<
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  DaySchedule
>;
```

- **Shorthand Parser Rules (`src/lib/utils/opening-hours-parser.ts`)**:
  - Handles "24/7" or "Open 24 Hours".
  - Handles ranges like "09:00-21:00", "9:00 AM - 9:00 PM", "9am - 9pm".
  - Handles day qualifications like "Mon-Fri: 09:00-18:00, Sat: 10:00-16:00, Sun: Closed".
  - Fallback safe parser defaulting to standard local commercial hours when unparseable.

---

## 3. Visual UI Design System (`/agency-ui-designer` & `/ui-ux-pro-max`)

### Import Hub Tabbed Interface (`/admin/imports`)
- **Segmented Tabs**: Tabs for `Listings`, `Categories`, and `Locations` with category counts and icon badges.
- **Dropzone Area**:
  - Drag-and-drop file upload target with SVG icon, sample CSV download button, and "Load Sample Demo CSV" button for instant testing.
- **Pre-Flight Inspection Table**:
  - Row summary counter: Valid rows (Emerald pill badge) vs Invalid lines (Rose pill badge).
  - Clean preview table with horizontal scroll and error tooltips on bad cells.
- **Opening Hours Matrix Component (`OpeningHoursScheduler.svelte`)**:
  - 7 day rows (Monday through Sunday) with toggle switch for `Open / Closed`.
  - Accessible time picker selects with 30-minute intervals.
  - Quick preset buttons: `Mon-Sat 9 AM - 9 PM`, `Mon-Fri 9 AM - 6 PM`, `24/7 Always Open`.

---

## 4. Pre-Delivery Quality Checklist (`/ui-ux-pro-max`)
- [ ] Sample CSV downloads generate valid UTF-8 CSVs with correct header rows.
- [ ] Time picker inputs accessible via keyboard arrow keys.
- [ ] Import progress bar displays animated percentage and record counter during database insertion.
- [ ] Validation errors displayed in human-readable plain language.
