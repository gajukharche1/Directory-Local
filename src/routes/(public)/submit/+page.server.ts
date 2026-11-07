import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const plan = url.searchParams.get("plan");
  if (plan) {
    throw redirect(303, `/register?role=owner&plan=${plan}`);
  }
  throw redirect(303, "/pricing");
};
