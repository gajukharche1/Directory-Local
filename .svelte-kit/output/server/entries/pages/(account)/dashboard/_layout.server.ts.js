import { redirect } from "@sveltejs/kit";
// src/routes/(account)/dashboard/+layout.server.ts
var load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, "/login?redirectTo=/dashboard");
	return { user: locals.user };
};
export { load };

//# sourceMappingURL=_layout.server.ts.js.map