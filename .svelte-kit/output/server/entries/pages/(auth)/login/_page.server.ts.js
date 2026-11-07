import { t as db } from "../../../../chunks/client.js";
import { n as verifyPassword } from "../../../../chunks/password.js";
import { n as createSession } from "../../../../chunks/session.js";
import { fail, redirect } from "@sveltejs/kit";
import { UserRole } from "@prisma/client";
import { z } from "zod";
// src/routes/(auth)/login/+page.server.ts
var loginSchema = z.object({
	email: z.string().email("Please provide a valid email address."),
	password: z.string().min(1, "Password is required."),
	redirectTo: z.string().optional()
});
var load = async ({ locals, url }) => {
	const redirectTo = url.searchParams.get("redirectTo") || "";
	if (locals.user) {
		if (locals.user.role === UserRole.admin || locals.user.role === UserRole.moderator) throw redirect(303, redirectTo || "/admin");
		else if (locals.user.role === UserRole.owner) throw redirect(303, redirectTo || "/dashboard");
		else throw redirect(303, redirectTo || "/");
	}
	return { redirectTo };
};
var actions = { default: async ({ request, cookies, getClientAddress }) => {
	const formData = await request.formData();
	const rawData = {
		email: formData.get("email"),
		password: formData.get("password"),
		redirectTo: formData.get("redirectTo") || void 0
	};
	const validation = loginSchema.safeParse(rawData);
	if (!validation.success) return fail(400, {
		error: "Validation failed",
		fieldErrors: validation.error.flatten().fieldErrors
	});
	const { email, password, redirectTo } = validation.data;
	const normalizedEmail = email.toLowerCase().trim();
	const user = await db.user.findUnique({ where: { email: normalizedEmail } });
	const dummyHash = "$argon2id$v=19$m=65536,t=3,p=1$5YlY3wBw4yR9z$U9xYxL9j+wM8X8zW1sO8A==";
	if (!user) {
		await verifyPassword(dummyHash, password);
		return fail(400, { error: "Invalid email or password." });
	}
	if (user.lockedUntil && user.lockedUntil > /* @__PURE__ */ new Date()) {
		const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 6e4);
		return fail(429, { error: `Account is temporarily locked due to repeated failed login attempts. Try again in ${minutesLeft} minutes.` });
	}
	if (!await verifyPassword(user.passwordHash, password)) {
		const updatedCount = user.failedLoginCount + 1;
		let lockUntil = null;
		if (updatedCount >= 5) lockUntil = new Date(Date.now() + 9e5);
		await db.user.update({
			where: { id: user.id },
			data: {
				failedLoginCount: updatedCount,
				lockedUntil: lockUntil
			}
		});
		return fail(400, { error: "Invalid email or password." });
	}
	await db.user.update({
		where: { id: user.id },
		data: {
			failedLoginCount: 0,
			lockedUntil: null,
			lastLoginAt: /* @__PURE__ */ new Date()
		}
	});
	let clientIp = "127.0.0.1";
	try {
		clientIp = getClientAddress();
	} catch {}
	await createSession(user.id, cookies, clientIp);
	let destination = redirectTo || "/";
	if (!redirectTo) {
		if (user.role === UserRole.admin || user.role === UserRole.moderator) destination = "/admin";
		else if (user.role === UserRole.owner) destination = "/dashboard";
	}
	throw redirect(303, destination);
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map