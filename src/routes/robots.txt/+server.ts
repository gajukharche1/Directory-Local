import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const robots = `User-agent: *
Disallow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
