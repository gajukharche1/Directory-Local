import { r as destroySession } from "../../../../chunks/session.js";
import { redirect } from "@sveltejs/kit";
// src/routes/(auth)/logout/+server.ts
var POST = async ({ cookies }) => {
	await destroySession(cookies);
	throw redirect(303, "/login");
};
var GET = async ({ cookies }) => {
	await destroySession(cookies);
	throw redirect(303, "/login");
};
export { GET, POST };

//# sourceMappingURL=_server.ts.js.map