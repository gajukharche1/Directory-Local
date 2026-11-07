import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { SearchService } from "$lib/services/search.service";
import { rateLimits } from "$lib/security/rate-limit";

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
  let ip = "127.0.0.1";
  try {
    ip = getClientAddress();
  } catch {}

  const rateLimitResult = await rateLimits.search(ip);
  if (!rateLimitResult.success) {
    return json(
      { error: "Too many search requests. Please slow down." },
      { status: 429 }
    );
  }

  const q = url.searchParams.get("q") || "";
  const results = await SearchService.getSuggestions(q);

  return json(results, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
};
