import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { ListingStatus } from "@prisma/client";

export const load: PageServerLoad = async () => {
  return {};
};

interface ImportRow {
  title: string;
  categorySlug?: string;
  locationSlug?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address: string;
  locality?: string;
  landmark?: string;
  description?: string;
  priceRange?: number;
}

export const actions: Actions = {
  batchImport: async ({ request }) => {
    const formData = await request.formData();
    const csvDataRaw = formData.get("csvData") as string;

    if (!csvDataRaw || !csvDataRaw.trim()) {
      return fail(400, { error: "Please provide CSV content to import." });
    }

    let items: ImportRow[] = [];
    try {
      // Check if it was sent as pre-parsed JSON or raw CSV
      if (csvDataRaw.trim().startsWith("[") && csvDataRaw.trim().endsWith("]")) {
        items = JSON.parse(csvDataRaw);
      } else {
        // Simple CSV parser
        const lines = csvDataRaw.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          return fail(400, { error: "CSV does not contain any data rows." });
        }

        const headers = lines[0]!.split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]!.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || "";
          });

          if (rowObj.title && rowObj.address) {
            items.push({
              title: rowObj.title,
              categorySlug: rowObj.category || rowObj.categoryslug || "",
              locationSlug: rowObj.location || rowObj.locationslug || "",
              phone: rowObj.phone || "",
              whatsapp: rowObj.whatsapp || "",
              email: rowObj.email || "",
              website: rowObj.website || "",
              address: rowObj.address,
              locality: rowObj.locality || "Pimple Saudagar",
              landmark: rowObj.landmark || "",
              description: rowObj.description || "",
              priceRange: rowObj.pricerange ? parseInt(rowObj.pricerange, 10) : 2,
            });
          }
        }
      }
    } catch (parseErr) {
      return fail(400, { error: "Failed to parse CSV format." });
    }

    if (items.length === 0) {
      return fail(400, { error: "No valid rows found. Each row requires at least a title and address." });
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      try {
        if (!item.title?.trim() || !item.address?.trim()) {
          errors.push(`Row ${i + 1}: Title and address are required.`);
          continue;
        }

        const baseSlug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        let slug = baseSlug || `business-${Date.now()}`;
        let suffix = 1;
        while (await db.listing.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${suffix++}`;
        }

        let category = item.categorySlug
          ? await db.category.findUnique({ where: { slug: item.categorySlug } })
          : null;
        if (!category) {
          category = await db.category.findFirst();
        }

        let location = item.locationSlug
          ? await db.location.findUnique({ where: { slug: item.locationSlug } })
          : null;
        if (!location) {
          location = await db.location.findFirst();
        }

        const listing = await db.listing.create({
          data: {
            slug,
            title: item.title.trim(),
            description:
              item.description?.trim() ||
              `<p>${item.title} is a verified business in Pimple Saudagar, PCMC.</p>`,
            status: ListingStatus.published,
            publishedAt: new Date(),
            address: item.address.trim(),
            locality: item.locality?.trim() || "Pimple Saudagar",
            landmark: item.landmark?.trim() || null,
            phone: item.phone?.trim() || null,
            whatsapp: item.whatsapp?.trim() || null,
            email: item.email?.trim() || null,
            website: item.website?.trim() || null,
            priceRange:
              item.priceRange && item.priceRange >= 1 && item.priceRange <= 4
                ? item.priceRange
                : 2,
          },
        });

        if (category) {
          await db.listingCategory.create({
            data: {
              listingId: listing.id,
              categoryId: category.id,
            },
          });
        }

        if (location) {
          await db.listingLocation.create({
            data: {
              listingId: listing.id,
              locationId: location.id,
              isPrimary: true,
            },
          });
        }

        importedCount++;
      } catch (err) {
        errors.push(
          `Row ${i + 1} (${item.title}): ${err instanceof Error ? err.message : "Database error"}`
        );
      }
    }

    return {
      success: true,
      importedCount,
      failedCount: errors.length,
      errors,
    };
  },
};
