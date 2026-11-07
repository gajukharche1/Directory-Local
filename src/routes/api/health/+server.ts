import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/db/client";

export const GET: RequestHandler = async () => {
  try {
    await db.$queryRaw`SELECT 1`;

    return json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "pimplesaudagar-directory-svelte",
        version: "1.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    return json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 503 }
    );
  }
};
