import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";
import { parseOpeningHours } from "$lib/utils/opening-hours-parser";
import { parseCsvText, detectDelimiter } from "$lib/utils/csv-parser";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
    throw redirect(303, "/login?redirectTo=/admin/imports");
  }

  const [totalListings, totalCategories, totalLocations] = await Promise.all([
    db.listing.count().catch(() => 0),
    db.category.count().catch(() => 0),
    db.location.count().catch(() => 0),
  ]);

  return {
    totalListings,
    totalCategories,
    totalLocations,
  };
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const actions: Actions = {
  importListings: async ({ request, locals }) => {
    if (!locals.user || (locals.user.role !== "admin" && locals.user.role !== "moderator")) {
      return fail(403, { error: "Unauthorized access" });
    }

    const formData = await request.formData();
    const rawData = formData.get("csvData")?.toString().trim();
    const statusOption = (formData.get("status")?.toString() || "draft") as ListingStatus;

    if (!rawData) {
      return fail(400, { error: "Please provide CSV data to import." });
    }

    let rows: any[] = [];
    if (rawData.startsWith("[") && rawData.endsWith("]")) {
      try {
        rows = JSON.parse(rawData);
      } catch {
        return fail(400, { error: "Malformed JSON payload." });
      }
    } else {
      const delimiter = detectDelimiter(rawData);
      const lines = parseCsvText(rawData, delimiter);
      if (lines.length <= 1) {
        return fail(400, { error: "CSV does not contain any data rows." });
      }
      const headers = lines[0]!.map((h) => h.toLowerCase().trim().replace(/['"_\s-]+/g, ""));
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i]!;
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] || "";
        });
        rows.push(obj);
      }
    }

    if (rows.length === 0) {
      return fail(400, { error: "No valid rows found to import." });
    }

    // Cache categories & locations by slug/name
    const [allCategories, allLocations, defaultPlan] = await Promise.all([
      db.category.findMany({ select: { id: true, slug: true, name: true } }),
      db.location.findMany({ select: { id: true, slug: true, name: true } }),
      db.pricingPlan.findFirst({ where: { isActive: true }, orderBy: { displayOrder: "asc" }, select: { id: true } }),
    ]);

    const catMap = new Map<string, string>();
    for (const c of allCategories) {
      catMap.set(c.slug.toLowerCase(), c.id);
      catMap.set(c.name.toLowerCase(), c.id);
    }

    const locMap = new Map<string, string>();
    for (const l of allLocations) {
      locMap.set(l.slug.toLowerCase(), l.id);
      locMap.set(l.name.toLowerCase(), l.id);
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const title = (row.title || row.businessname || row.name || "").trim();
      const address = (row.address || row.streetaddress || "").trim();

      if (!title || !address) {
        errors.push(`Row ${i + 1}: Missing title or address.`);
        continue;
      }

      const locality = (row.locality || "Local Business").trim();
      const phone = (row.phone || row.phonenumber || "").trim() || null;
      const whatsapp = (row.whatsapp || row.whatsappnumber || "").trim() || null;
      const email = (row.email || "").trim() || null;
      const website = (row.website || "").trim() || null;
      const description = (row.description || `Verified local business: ${title}`).trim();
      const priceRange = row.pricerange ? Math.min(4, Math.max(1, parseInt(row.pricerange, 10))) : 2;

      // Smart Opening Hours
      const openingHours = parseOpeningHours(row.openinghours || row.hours || row.timings);

      // Category and Location lookup
      const catKey = (row.category || row.categoryslug || "").toLowerCase().trim();
      const categoryId = catMap.get(catKey);

      const locKey = (row.location || row.locationslug || row.locality || "").toLowerCase().trim();
      const locationId = locMap.get(locKey);

      const baseSlug = generateSlug(title) || `listing-${Date.now()}`;
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const slug = `${baseSlug}-${uniqueSuffix}`;

      try {
        await db.listing.create({
          data: {
            title,
            slug,
            description,
            address,
            locality,
            phone,
            whatsapp,
            email,
            website,
            priceRange,
            status: Object.values(ListingStatus).includes(statusOption) ? statusOption : ListingStatus.draft,
            ownerId: locals.user.id,
            planId: defaultPlan?.id || null,
            openingHours: openingHours as any,
            ...(categoryId
              ? {
                  categories: {
                    create: [{ categoryId, isPrimary: true }],
                  },
                }
              : {}),
            ...(locationId
              ? {
                  locations: {
                    create: [{ locationId, isPrimary: true }],
                  },
                }
              : {}),
          },
        });
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1} (${title}): ${err?.message || "Failed to save listing"}`);
      }
    }

    return {
      success: true,
      importedCount,
      failedCount: errors.length,
      errors: errors.slice(0, 15),
      entityType: "listings",
    };
  },

  importCategories: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to import categories." });
    }

    const formData = await request.formData();
    const rawData = formData.get("csvData")?.toString().trim();

    if (!rawData) {
      return fail(400, { error: "Please provide CSV data for categories." });
    }

    let rows: any[] = [];
    if (rawData.startsWith("[") && rawData.endsWith("]")) {
      try {
        rows = JSON.parse(rawData);
      } catch {
        return fail(400, { error: "Malformed JSON payload." });
      }
    } else {
      const delimiter = detectDelimiter(rawData);
      const lines = parseCsvText(rawData, delimiter);
      if (lines.length <= 1) {
        return fail(400, { error: "CSV does not contain data rows." });
      }
      const headers = lines[0]!.map((h) => h.toLowerCase().trim().replace(/['"_\s-]+/g, ""));
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i]!;
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] || "";
        });
        rows.push(obj);
      }
    }

    const allCategories = await db.category.findMany({ select: { id: true, slug: true, name: true } });
    const catMap = new Map<string, string>();
    for (const c of allCategories) {
      catMap.set(c.slug.toLowerCase(), c.id);
      catMap.set(c.name.toLowerCase(), c.id);
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const name = (row.name || row.title || "").trim();
      if (!name) {
        errors.push(`Row ${i + 1}: Category name is required.`);
        continue;
      }

      let slug = (row.slug || generateSlug(name)).trim();
      if (!slug) slug = `cat-${Date.now()}`;

      // Check if slug already exists
      const existing = await db.category.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
      }

      const parentKey = (row.parent || row.parentslug || "").toLowerCase().trim();
      const parentId = parentKey ? catMap.get(parentKey) || null : null;
      const description = (row.description || "").trim() || null;
      const featuredOnHome = row.featured === "true" || row.featuredonhome === "true" || row.featured === "1";
      const sortOrder = row.sortorder ? parseInt(row.sortorder, 10) : 0;

      try {
        const created = await db.category.create({
          data: {
            name,
            slug,
            description,
            parentId,
            featuredOnHome,
            sortOrder,
          },
        });
        catMap.set(created.slug.toLowerCase(), created.id);
        catMap.set(created.name.toLowerCase(), created.id);
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1} (${name}): ${err?.message || "Failed to create category"}`);
      }
    }

    return {
      success: true,
      importedCount,
      failedCount: errors.length,
      errors: errors.slice(0, 15),
      entityType: "categories",
    };
  },

  importLocations: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "admin") {
      return fail(403, { error: "Admin role required to import locations." });
    }

    const formData = await request.formData();
    const rawData = formData.get("csvData")?.toString().trim();

    if (!rawData) {
      return fail(400, { error: "Please provide CSV data for locations." });
    }

    let rows: any[] = [];
    if (rawData.startsWith("[") && rawData.endsWith("]")) {
      try {
        rows = JSON.parse(rawData);
      } catch {
        return fail(400, { error: "Malformed JSON payload." });
      }
    } else {
      const delimiter = detectDelimiter(rawData);
      const lines = parseCsvText(rawData, delimiter);
      if (lines.length <= 1) {
        return fail(400, { error: "CSV does not contain data rows." });
      }
      const headers = lines[0]!.map((h) => h.toLowerCase().trim().replace(/['"_\s-]+/g, ""));
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i]!;
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] || "";
        });
        rows.push(obj);
      }
    }

    const allLocations = await db.location.findMany({ select: { id: true, slug: true, name: true } });
    const locMap = new Map<string, string>();
    for (const l of allLocations) {
      locMap.set(l.slug.toLowerCase(), l.id);
      locMap.set(l.name.toLowerCase(), l.id);
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      const name = (row.name || row.title || "").trim();
      if (!name) {
        errors.push(`Row ${i + 1}: Location name is required.`);
        continue;
      }

      let slug = (row.slug || generateSlug(name)).trim();
      if (!slug) slug = `loc-${Date.now()}`;

      const existing = await db.location.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
      }

      const parentKey = (row.parent || row.parentslug || "").toLowerCase().trim();
      const parentId = parentKey ? locMap.get(parentKey) || null : null;
      const description = (row.description || "").trim() || null;
      const featured = row.featured === "true" || row.featured === "1";
      const sortOrder = row.sortorder ? parseInt(row.sortorder, 10) : 0;
      const latitude = row.latitude && !isNaN(Number(row.latitude)) ? Number(row.latitude) : null;
      const longitude = row.longitude && !isNaN(Number(row.longitude)) ? Number(row.longitude) : null;

      try {
        const created = await db.location.create({
          data: {
            name,
            slug,
            description,
            parentId,
            featured,
            sortOrder,
            latitude,
            longitude,
          },
        });
        locMap.set(created.slug.toLowerCase(), created.id);
        locMap.set(created.name.toLowerCase(), created.id);
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1} (${name}): ${err?.message || "Failed to create location"}`);
      }
    }

    return {
      success: true,
      importedCount,
      failedCount: errors.length,
      errors: errors.slice(0, 15),
      entityType: "locations",
    };
  },

  // Backward compatibility alias
  batchImport: async (event) => {
    return actions.importListings(event);
  },
};
