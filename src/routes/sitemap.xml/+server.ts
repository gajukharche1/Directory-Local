import type { RequestHandler } from "./$types";
import db from "$lib/db/client";
import { env } from "$lib/config/env";
import { ListingStatus } from "@prisma/client";

export const GET: RequestHandler = async () => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://pimplesaudagar.org";

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/search`, priority: "0.8", changefreq: "daily" },
    { loc: `${baseUrl}/pricing`, priority: "0.7", changefreq: "weekly" },
    { loc: `${baseUrl}/login`, priority: "0.3", changefreq: "monthly" },
    { loc: `${baseUrl}/register`, priority: "0.3", changefreq: "monthly" },
  ];

  let dynamicListings: { loc: string; lastmod: string; priority: string }[] = [];
  let dynamicCategories: { loc: string; priority: string }[] = [];
  let dynamicLocations: { loc: string; priority: string }[] = [];

  try {
    const listings = await db.listing.findMany({
      where: { status: ListingStatus.published },
      select: { slug: true, updatedAt: true },
      take: 5000,
    });
    dynamicListings = listings.map((l) => ({
      loc: `${baseUrl}/listing/${l.slug}`,
      lastmod: l.updatedAt.toISOString().split("T")[0]!,
      priority: "0.9",
    }));

    const categories = await db.category.findMany({
      select: { slug: true },
    });
    dynamicCategories = categories.map((c) => ({
      loc: `${baseUrl}/category/${c.slug}`,
      priority: "0.8",
    }));

    const locations = await db.location.findMany({
      select: { slug: true },
    });
    dynamicLocations = locations.map((loc) => ({
      loc: `${baseUrl}/location/${loc.slug}`,
      priority: "0.8",
    }));
  } catch (error) {
    console.warn("Database unavailable during sitemap generation; serving static routes only.", error);
  }

  const allUrls = [
    ...staticUrls.map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    ),
    ...dynamicListings.map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    ),
    ...dynamicCategories.map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    ),
    ...dynamicLocations.map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    ),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
