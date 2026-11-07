// @ts-nocheck
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { z } from "zod";
import db from "$lib/db/client";
import { hashPassword } from "$lib/auth/password";
import { createSession } from "$lib/auth/session";
import { EmailService } from "$lib/services/email.service";
import { UserRole } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (e.g. +919876543210)")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  role: z.enum(["visitor", "owner"]).default("visitor"),
});

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (locals.user) {
    if (locals.user.role === UserRole.owner) {
      throw redirect(303, "/dashboard");
    } else {
      throw redirect(303, "/");
    }
  }
  return {};
};

export const actions = {
  default: async ({ request, cookies, getClientAddress }: import('./$types').RequestEvent) => {
    const formData = await request.formData();
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      password: formData.get("password"),
      role: formData.get("role") || "visitor",
    };

    const validation = registerSchema.safeParse(rawData);
    if (!validation.success) {
      return fail(400, {
        error: "Please correct the form errors.",
        fieldErrors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, email, phone, password, role } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return fail(400, {
        error: "An account with this email address already exists. Please sign in instead.",
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        passwordHash,
        role: role === "owner" ? UserRole.owner : UserRole.visitor,
      },
    });

    let clientIp = "127.0.0.1";
    try {
      clientIp = getClientAddress();
    } catch {}

    await createSession(newUser.id, cookies, clientIp);

    // Send asynchronous welcome email (non-blocking)
    EmailService.sendWelcomeEmail(newUser.email, newUser.name).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    throw redirect(303, role === "owner" ? "/dashboard" : "/");
  },
};
;null as any as Actions;