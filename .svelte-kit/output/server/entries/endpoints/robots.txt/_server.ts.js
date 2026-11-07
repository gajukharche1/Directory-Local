import { t as env } from "../../../chunks/env.js";
// src/routes/robots.txt/+server.ts
var GET = async () => {
	const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${env.NEXT_PUBLIC_APP_URL || "https://pimplesaudagar.org"}/sitemap.xml
`;
	return new Response(robots, { headers: {
		"Content-Type": "text/plain",
		"Cache-Control": "public, max-age=86400"
	} });
};
export { GET };

//# sourceMappingURL=_server.ts.js.map