import { t as SearchService } from "../../../../../chunks/search.service.js";
import { t as rateLimits } from "../../../../../chunks/rate-limit.js";
import { json } from "@sveltejs/kit";
// src/routes/api/search/autocomplete/+server.ts
var GET = async ({ url, getClientAddress }) => {
	let ip = "127.0.0.1";
	try {
		ip = getClientAddress();
	} catch {}
	if (!(await rateLimits.search(ip)).success) return json({ error: "Too many search requests. Please slow down." }, { status: 429 });
	const q = url.searchParams.get("q") || "";
	const results = await SearchService.getSuggestions(q);
	return json(results, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
};
export { GET };

//# sourceMappingURL=_server.ts.js.map