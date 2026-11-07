import { l as building, t as app_environment_deprecated } from "../chunks/shared-warnings.js";
import { i as validateSessionToken, t as SESSION_COOKIE_NAME } from "../chunks/session.js";
app_environment_deprecated();
// src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
	if (sessionToken && !building) try {
		const user = await validateSessionToken(sessionToken);
		if (user) event.locals.user = user;
		else {
			event.locals.user = null;
			event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
		}
	} catch (err) {
		console.warn("Session validation error in hooks:", err);
		event.locals.user = null;
	}
	else event.locals.user = null;
	const pathname = event.url.pathname;
	if (pathname.startsWith("/admin")) {
		if (!event.locals.user || !["admin", "moderator"].includes(event.locals.user.role)) return new Response(null, {
			status: 303,
			headers: { Location: `/login?redirectTo=${encodeURIComponent(pathname)}` }
		});
	}
	if (pathname.startsWith("/dashboard")) {
		if (!event.locals.user || event.locals.user.role === "visitor") return new Response(null, {
			status: 303,
			headers: { Location: `/login?redirectTo=${encodeURIComponent(pathname)}` }
		});
	}
	const response = await resolve(event);
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
	return response;
};
export { handle };

//# sourceMappingURL=hooks.server.js.map