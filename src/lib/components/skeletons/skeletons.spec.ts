import { describe, it, expect } from "vitest";

describe("Shimmer Loading States & Skeletons", () => {
  it("defines shimmer keyframe and animation classes in layout CSS", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const cssPath = path.resolve(process.cwd(), "src/routes/layout.css");
    const content = fs.readFileSync(cssPath, "utf-8");

    expect(content).toContain("@keyframes shimmer-wave");
    expect(content).toContain(".animate-shimmer");
    expect(content).toContain("prefers-reduced-motion");
  });

  it("verifies skeleton component definitions exist", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const skeletonFiles = [
      "src/lib/components/ui/Skeleton.svelte",
      "src/lib/components/skeletons/ListingTableSkeleton.svelte",
      "src/lib/components/skeletons/FormCardSkeleton.svelte",
      "src/lib/components/skeletons/TaxonomyGridSkeleton.svelte",
    ];

    for (const file of skeletonFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it("verifies top indeterminate progress rail is bound to navigating in admin layout", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const layoutPath = path.resolve(process.cwd(), "src/routes/(admin)/admin/+layout.svelte");
    const content = fs.readFileSync(layoutPath, "utf-8");

    expect(content).toContain("navigating");
    expect(content).toContain("isNavigatingTo");
    expect(content).toContain("shimmer-wave");
  });

  it("verifies dual-tone status badges are used in admin listings", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const listingsPath = path.resolve(process.cwd(), "src/routes/(admin)/admin/listings/+page.svelte");
    const content = fs.readFileSync(listingsPath, "utf-8");

    expect(content).toContain("bg-emerald-50 text-emerald-700");
    expect(content).toContain("bg-amber-50 text-amber-800");
    expect(content).toContain("ListingTableSkeleton");
    expect(content).toContain("tabular-nums");
  });
});
