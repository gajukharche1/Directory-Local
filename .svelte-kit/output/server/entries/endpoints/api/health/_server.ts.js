import { t as db } from "../../../../chunks/client.js";
import { json } from "@sveltejs/kit";
// src/routes/api/health/+server.ts
var GET = async () => {
	try {
		await db.$queryRaw`SELECT 1`;
		return json({
			status: "healthy",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			service: "pimplesaudagar-directory-svelte",
			version: "1.0.0"
		}, { status: 200 });
	} catch (error) {
		return json({
			status: "unhealthy",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			error: error instanceof Error ? error.message : "Database connection failed"
		}, { status: 503 });
	}
};
export { GET };

//# sourceMappingURL=_server.ts.js.map