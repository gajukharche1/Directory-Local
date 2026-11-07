import type { RequestHandler } from "./$types";
import { env } from "$lib/config/env";

export const GET: RequestHandler = async () => {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://example.com";

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
