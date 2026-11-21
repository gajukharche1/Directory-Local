import { describe, it, expect } from "vitest";

// Nav helper matching admin sidebar accordion logic
export interface NavItem {
  id?: string;
  label: string;
  href?: string;
  isGroup?: boolean;
  children?: { label: string; href: string }[];
}

export const ADMIN_NAV_CONFIG: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Moderation Queue", href: "/admin/moderation" },
  {
    id: "listing",
    label: "Listing",
    isGroup: true,
    children: [
      { label: "All Listing", href: "/admin/listings" },
      { label: "Add New Listing", href: "/admin/listings/new" },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    isGroup: true,
    children: [
      { label: "All Categories", href: "/admin/categories" },
      { label: "Add New Category", href: "/admin/categories/new" },
    ],
  },
  {
    id: "locations",
    label: "Locations",
    isGroup: true,
    children: [
      { label: "All Locations", href: "/admin/locations" },
      { label: "Add New Location", href: "/admin/locations/new" },
    ],
  },
  { label: "CSV Import / Export", href: "/admin/imports" },
  { label: "Media Library", href: "/admin/media" },
  { label: "Directory Analytics", href: "/admin/analytics" },
  { label: "Site Setting", href: "/admin/settings" },
];

export function resolveOpenSections(pathname: string): Record<string, boolean> {
  const open: Record<string, boolean> = {
    listing: false,
    categories: false,
    locations: false,
  };

  if (pathname.startsWith("/admin/listings")) {
    open.listing = true;
  }
  if (pathname.startsWith("/admin/categories")) {
    open.categories = true;
  }
  if (pathname.startsWith("/admin/locations")) {
    open.locations = true;
  }

  return open;
}

describe("Admin Sidebar Accordion Navigation", () => {
  it("defines all required 9 navigation items and groups", () => {
    expect(ADMIN_NAV_CONFIG).toHaveLength(9);
    const groupIds = ADMIN_NAV_CONFIG.filter((n) => n.isGroup).map((n) => n.id);
    expect(groupIds).toEqual(["listing", "categories", "locations"]);
  });

  it("verifies listing sub-items contain All Listing and Add New Listing", () => {
    const listingGroup = ADMIN_NAV_CONFIG.find((n) => n.id === "listing");
    expect(listingGroup?.children).toEqual([
      { label: "All Listing", href: "/admin/listings" },
      { label: "Add New Listing", href: "/admin/listings/new" },
    ]);
  });

  it("verifies categories sub-items contain All Categories and Add New Category", () => {
    const catGroup = ADMIN_NAV_CONFIG.find((n) => n.id === "categories");
    expect(catGroup?.children).toEqual([
      { label: "All Categories", href: "/admin/categories" },
      { label: "Add New Category", href: "/admin/categories/new" },
    ]);
  });

  it("verifies locations sub-items contain All Locations and Add New Location", () => {
    const locGroup = ADMIN_NAV_CONFIG.find((n) => n.id === "locations");
    expect(locGroup?.children).toEqual([
      { label: "All Locations", href: "/admin/locations" },
      { label: "Add New Location", href: "/admin/locations/new" },
    ]);
  });

  it("auto-expands 'listing' accordion when navigating to /admin/listings or /admin/listings/new", () => {
    expect(resolveOpenSections("/admin/listings").listing).toBe(true);
    expect(resolveOpenSections("/admin/listings/new").listing).toBe(true);
    expect(resolveOpenSections("/admin/listings/cmw123abc").listing).toBe(true);
    expect(resolveOpenSections("/admin/listings").categories).toBe(false);
  });

  it("auto-expands 'categories' accordion when navigating to /admin/categories", () => {
    const open = resolveOpenSections("/admin/categories");
    expect(open.categories).toBe(true);
    expect(open.listing).toBe(false);
    expect(open.locations).toBe(false);
  });

  it("auto-expands 'locations' accordion when navigating to /admin/locations", () => {
    const open = resolveOpenSections("/admin/locations");
    expect(open.locations).toBe(true);
    expect(open.listing).toBe(false);
    expect(open.categories).toBe(false);
  });

  it("keeps all accordions closed on top-level routes like /admin and /admin/moderation", () => {
    const dashboardOpen = resolveOpenSections("/admin");
    expect(dashboardOpen.listing).toBe(false);
    expect(dashboardOpen.categories).toBe(false);
    expect(dashboardOpen.locations).toBe(false);

    const modOpen = resolveOpenSections("/admin/moderation");
    expect(modOpen.listing).toBe(false);
    expect(modOpen.categories).toBe(false);
    expect(modOpen.locations).toBe(false);
  });
});
