import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { SeoService } from "$lib/services/seo.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ params, url }) => {
  try {
    const listing = await ListingService.getBySlug(params.slug);

    if (!listing) {
      error(404, "Business Not Found in Local Business Directory");
    }

    // View counter increment (fire-and-forget)
    ListingService.trackView(listing.id).catch(() => {});

    const baseUrl = url.origin;
    const primaryCategory = listing.categories?.[0]?.category;

    const localBusinessSchema = SeoService.generateLocalBusinessSchema(listing, baseUrl);
    const breadcrumbSchema = SeoService.generateBreadcrumbSchema(
      [
        { name: "Home", url: "/" },
        ...(primaryCategory ? [{ name: primaryCategory.name, url: `/category/${primaryCategory.slug}` }] : []),
        { name: listing.title, url: `/listing/${listing.slug}` },
      ],
      baseUrl
    );

    return toPOJO({
      listing,
      localBusinessSchema,
      breadcrumbSchema,
    });
  } catch (err: any) {
    if (err?.status) throw err;
    console.error("Error loading listing slug:", params.slug, err);
    error(500, `Failed to load listing: ${err?.message || "Unknown error"}`);
  }
};
