import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { SESSION_COOKIE_NAME, validateSessionToken } from "$lib/auth/session";

export const handle: Handle = async ({ event, resolve }) => {
  // 1. Session resolution
  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
  if (sessionToken && !building) {
    try {
      const user = await validateSessionToken(sessionToken);
      if (user) {
        event.locals.user = user;
      } else {
        event.locals.user = null;
        event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
      }
    } catch (err) {
      console.warn("Session validation error in hooks:", err);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  const pathname = event.url.pathname;

  // 2. Role-based Route Protection
  // Protected Admin Area: Requires admin or moderator role
  if (pathname.startsWith("/admin")) {
    if (!event.locals.user || !["admin", "moderator"].includes(event.locals.user.role)) {
      return new Response(null, {
        status: 303,
        headers: { Location: `/login?redirectTo=${encodeURIComponent(pathname)}` },
      });
    }
  }

  // Protected Business Owner Dashboard Area: Requires owner, moderator, or admin
  if (pathname.startsWith("/dashboard")) {
    if (!event.locals.user || event.locals.user.role === "visitor") {
      return new Response(null, {
        status: 303,
        headers: { Location: `/login?redirectTo=${encodeURIComponent(pathname)}` },
      });
    }
  }

  // 3. Resolve request and apply security headers
  const response = await resolve(event);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  return response;
};
