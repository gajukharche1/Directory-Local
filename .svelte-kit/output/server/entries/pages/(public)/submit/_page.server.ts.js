import { redirect } from "@sveltejs/kit";
// src/routes/(public)/submit/+page.server.ts
var load = async ({ url }) => {
	const plan = url.searchParams.get("plan");
	if (plan) throw redirect(303, `/register?role=owner&plan=${plan}`);
	throw redirect(303, "/pricing");
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map