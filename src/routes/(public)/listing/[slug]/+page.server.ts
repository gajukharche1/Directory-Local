import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { SeoService } from "$lib/services/seo.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async ({ params, url }) => {
  const listing = await ListingService.getBySlug(params.slug);

  if (!listing) {
    throw error(404, "Business Not Found in Local Business Directory");
  }

  // View counter increment (fire-and-forget)
  ListingService.trackView(listing.id).catch(() => {});

  const baseUrl = url.origin;
  const primaryCategory = listing.categories[0]?.category;

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
};
