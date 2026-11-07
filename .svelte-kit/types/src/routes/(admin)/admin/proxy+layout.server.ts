// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { hasRole } from "$lib/auth/rbac";
import { UserRole } from "@prisma/client";

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  if (!locals.user || !hasRole(locals.user.role, UserRole.moderator)) {
    throw redirect(303, "/login?redirectTo=/admin");
  }

  return {
    user: locals.user,
  };
};
