import { t as db } from "../../../chunks/client.js";
import { t as env } from "../../../chunks/env.js";
import { ListingStatus } from "@prisma/client";
// src/routes/sitemap.xml/+server.ts
var GET = async () => {
	const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://pimplesaudagar.org";
	const staticUrls = [
		{
			loc: `${baseUrl}/`,
			priority: "1.0",
			changefreq: "daily"
		},
		{
			loc: `${baseUrl}/search`,
			priority: "0.8",
			changefreq: "daily"
		},
		{
			loc: `${baseUrl}/pricing`,
			priority: "0.7",
			changefreq: "weekly"
		},
		{
			loc: `${baseUrl}/login`,
			priority: "0.3",
			changefreq: "monthly"
		},
		{
			loc: `${baseUrl}/register`,
			priority: "0.3",
			changefreq: "monthly"
		}
	];
	let dynamicListings = [];
	let dynamicCategories = [];
	let dynamicLocations = [];
	try {
		dynamicListings = (await db.listing.findMany({
			where: { status: ListingStatus.published },
			select: {
				slug: true,
				updatedAt: true
			},
			take: 5e3
		})).map((l) => ({
			loc: `${baseUrl}/listing/${l.slug}`,
			lastmod: l.updatedAt.toISOString().split("T")[0],
			priority: "0.9"
		}));
		dynamicCategories = (await db.category.findMany({ select: { slug: true } })).map((c) => ({
			loc: `${baseUrl}/category/${c.slug}`,
			priority: "0.8"
		}));
		dynamicLocations = (await db.location.findMany({ select: { slug: true } })).map((loc) => ({
			loc: `${baseUrl}/location/${loc.slug}`,
			priority: "0.8"
		}));
	} catch (error) {
		console.warn("Database unavailable during sitemap generation; serving static routes only.", error);
	}
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
		...staticUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`),
		...dynamicListings.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`),
		...dynamicCategories.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`),
		...dynamicLocations.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
	].join("\n")}
</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600, s-maxage=3600"
	} });
};
export { GET };

//# sourceMappingURL=_server.ts.js.map