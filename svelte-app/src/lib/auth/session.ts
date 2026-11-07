import crypto from "node:crypto";
import db from "$lib/db/client";
import type { Cookies } from "@sveltejs/kit";
import { UserRole } from "@prisma/client";

export const SESSION_COOKIE_NAME = "ps_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
}

export async function createSession(
  userId: string,
  cookies?: Cookies,
  ipAddress?: string,
  userAgent?: string
): Promise<{ sessionToken: string; expires: Date }> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.session.create({
    data: {
      userId,
      sessionToken,
      expires,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  if (cookies) {
    cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
  }

  return { sessionToken, expires };
}

export async function validateSessionToken(token: string): Promise<AuthenticatedUser | null> {
  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expires.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function destroySession(cookies: Cookies): Promise<void> {
  const token = cookies.get(SESSION_COOKIE_NAME);
  if (token) {
    await db.session.deleteMany({ where: { sessionToken: token } }).catch(() => {});
    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
  }
}
