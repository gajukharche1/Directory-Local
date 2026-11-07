import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { destroySession } from "$lib/auth/session";

export const POST: RequestHandler = async ({ cookies }) => {
  await destroySession(cookies);
  throw redirect(303, "/login");
};

export const GET: RequestHandler = async ({ cookies }) => {
  await destroySession(cookies);
  throw redirect(303, "/login");
};
