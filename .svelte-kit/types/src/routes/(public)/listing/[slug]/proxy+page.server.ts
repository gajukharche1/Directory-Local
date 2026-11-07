// @ts-nocheck
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ListingService } from "$lib/services/listing.service";
import { SeoService } from "$lib/services/seo.service";

export const load = async ({ params, url }: Parameters<PageServerLoad>[0]) => {
  const listing = await ListingService.getBySlug(params.slug);

  if (!listing) {
    throw error(404, "Business Not Found in Pimple Saudagar Directory");
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

  return {
    listing,
    localBusinessSchema,
    breadcrumbSchema,
  };
};
