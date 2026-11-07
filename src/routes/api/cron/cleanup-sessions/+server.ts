import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/db/client";
import { env } from "$lib/config/env";

export const GET: RequestHandler = async ({ request, url }) => {
  const authHeader = request.headers.get("authorization");
  const urlSecret = url.searchParams.get("key");

  const providedSecret = authHeader?.replace("Bearer ", "") || urlSecret;
  if (!providedSecret || providedSecret !== env.CRON_SECRET) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  try {
    const expiredSessions = await db.session.deleteMany({
      where: { expires: { lt: now } },
    });

    const expiredTokens = await db.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return json({
      success: true,
      deletedSessions: expiredSessions.count,
      deletedResetTokens: expiredTokens.count,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron cleanup-sessions error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
};
