import { t as db } from "./client.js";
import "@prisma/client";
import crypto from "node:crypto";
// src/lib/auth/session.ts
var SESSION_COOKIE_NAME = "ps_session";
var SESSION_MAX_AGE_SECONDS = 604800;
async function createSession(userId, cookies, ipAddress, userAgent) {
	const sessionToken = crypto.randomBytes(32).toString("hex");
	const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1e3);
	await db.session.create({ data: {
		userId,
		sessionToken,
		expires,
		ipAddress: ipAddress ?? null,
		userAgent: userAgent ?? null
	} });
	if (cookies) cookies.set(SESSION_COOKIE_NAME, sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires,
		maxAge: SESSION_MAX_AGE_SECONDS
	});
	return {
		sessionToken,
		expires
	};
}
async function validateSessionToken(token) {
	const session = await db.session.findUnique({
		where: { sessionToken: token },
		include: { user: { select: {
			id: true,
			email: true,
			name: true,
			role: true,
			phone: true
		} } }
	});
	if (!session) return null;
	if (session.expires.getTime() < Date.now()) {
		await db.session.delete({ where: { id: session.id } }).catch(() => {});
		return null;
	}
	return session.user;
}
async function destroySession(cookies) {
	const token = cookies.get(SESSION_COOKIE_NAME);
	if (token) {
		await db.session.deleteMany({ where: { sessionToken: token } }).catch(() => {});
		cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
	}
}
export { validateSessionToken as i, createSession as n, destroySession as r, SESSION_COOKIE_NAME as t };

//# sourceMappingURL=session.js.map