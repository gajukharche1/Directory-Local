import { t as db } from "../../../../../chunks/client.js";
import { t as env } from "../../../../../chunks/env.js";
import { json } from "@sveltejs/kit";
// src/routes/api/cron/cleanup-sessions/+server.ts
var GET = async ({ request, url }) => {
	const authHeader = request.headers.get("authorization");
	const urlSecret = url.searchParams.get("key");
	const providedSecret = authHeader?.replace("Bearer ", "") || urlSecret;
	if (!providedSecret || providedSecret !== env.CRON_SECRET) return json({ error: "Unauthorized" }, { status: 401 });
	const now = /* @__PURE__ */ new Date();
	try {
		const expiredSessions = await db.session.deleteMany({ where: { expires: { lt: now } } });
		const expiredTokens = await db.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } });
		return json({
			success: true,
			deletedSessions: expiredSessions.count,
			deletedResetTokens: expiredTokens.count,
			timestamp: now.toISOString()
		});
	} catch (error) {
		console.error("Cron cleanup-sessions error:", error);
		return json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 });
	}
};
export { GET };

//# sourceMappingURL=_server.ts.js.map