import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import db from "$lib/db/client";
import { UserRole, UserStatus } from "@prisma/client";
import { hashPassword } from "$lib/auth/password";
import { hasRole } from "$lib/auth/rbac";
import { getSettings, updateSettings } from "$lib/services/settings.service";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || !hasRole(locals.user.role, UserRole.moderator)) {
    throw redirect(303, "/login?redirectTo=/admin/settings");
  }

  const [users, stats, siteSettings] = await Promise.all([
    db.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            listings: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      db.user.count({ where: { deletedAt: null } }),
      db.user.count({ where: { deletedAt: null, status: UserStatus.active } }),
      db.user.count({ where: { deletedAt: null, status: { in: [UserStatus.suspended, UserStatus.locked] } } }),
      db.user.count({ where: { deletedAt: null, role: { in: [UserRole.admin, UserRole.moderator] } } }),
      db.user.count({ where: { deletedAt: null, role: UserRole.owner } }),
    ]),
    getSettings(),
  ]);

  return {
    users,
    stats: {
      total: stats[0],
      active: stats[1],
      suspended: stats[2],
      admins: stats[3],
      owners: stats[4],
    },
    siteSettings,
    currentUser: locals.user,
  };
};

export const actions: Actions = {
  createUser: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to register new users." });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim() || null;
    const roleInput = formData.get("role")?.toString() || "visitor";
    const statusInput = formData.get("status")?.toString() || "active";
    const password = formData.get("password")?.toString();

    if (!name || name.length < 2) {
      return fail(400, { error: "Full name must be at least 2 characters." });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { error: "A valid email address is required." });
    }

    if (!password || password.length < 8) {
      return fail(400, { error: "Password must be at least 8 characters long." });
    }

    const role = Object.values(UserRole).includes(roleInput as UserRole)
      ? (roleInput as UserRole)
      : UserRole.visitor;

    const status = Object.values(UserStatus).includes(statusInput as UserStatus)
      ? (statusInput as UserStatus)
      : UserStatus.active;

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return fail(409, { error: "A user with this email address already exists." });
    }

    const passwordHash = await hashPassword(password);

    try {
      await db.user.create({
        data: {
          name,
          email,
          phone,
          role,
          status,
          passwordHash,
          emailVerifiedAt: new Date(),
        },
      });

      return {
        success: true,
        action: "create",
        message: `User account "${name}" created successfully.`,
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to create user account." });
    }
  },

  updateUserStatus: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to change account status." });
    }

    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();
    const statusInput = formData.get("status")?.toString();

    if (!userId || !statusInput) {
      return fail(400, { error: "User ID and status are required." });
    }

    if (userId === locals.user.id) {
      return fail(400, { error: "You cannot suspend or modify your own account status." });
    }

    const status = Object.values(UserStatus).includes(statusInput as UserStatus)
      ? (statusInput as UserStatus)
      : null;

    if (!status) {
      return fail(400, { error: "Invalid status value." });
    }

    try {
      // If status is suspended or locked, terminate all active sessions immediately!
      if (status === UserStatus.suspended || status === UserStatus.locked) {
        await db.$transaction([
          db.user.update({
            where: { id: userId },
            data: { status, lockedUntil: status === UserStatus.locked ? new Date(Date.now() + 86400000) : null },
          }),
          db.session.deleteMany({ where: { userId } }),
        ]);
      } else {
        await db.user.update({
          where: { id: userId },
          data: { status, failedLoginCount: 0, lockedUntil: null },
        });
      }

      return {
        success: true,
        action: "status",
        message: `User status updated to "${status}". ${status !== UserStatus.active ? "Active sessions revoked." : ""}`,
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to update user status." });
    }
  },

  updateUserRole: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to change privileges." });
    }

    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();
    const roleInput = formData.get("role")?.toString();

    if (!userId || !roleInput) {
      return fail(400, { error: "User ID and role are required." });
    }

    if (userId === locals.user.id) {
      return fail(400, { error: "You cannot change your own administrative role." });
    }

    const role = Object.values(UserRole).includes(roleInput as UserRole)
      ? (roleInput as UserRole)
      : null;

    if (!role) {
      return fail(400, { error: "Invalid role value." });
    }

    try {
      await db.user.update({
        where: { id: userId },
        data: { role },
      });

      return {
        success: true,
        action: "role",
        message: `User role successfully updated to "${role}".`,
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to update user role." });
    }
  },

  resetPassword: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to reset credentials." });
    }

    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();
    const newPassword = formData.get("newPassword")?.toString();

    if (!userId) {
      return fail(400, { error: "Target user ID is required." });
    }

    if (!newPassword || newPassword.length < 8) {
      return fail(400, { error: "New password must be at least 8 characters long." });
    }

    const passwordHash = await hashPassword(newPassword);

    try {
      // Update password hash and revoke ALL active sessions immediately!
      await db.$transaction([
        db.user.update({
          where: { id: userId },
          data: {
            passwordHash,
            failedLoginCount: 0,
            lockedUntil: null,
          },
        }),
        db.session.deleteMany({ where: { userId } }),
      ]);

      return {
        success: true,
        action: "resetPassword",
        message: "Password reset successfully. All active sessions have been revoked.",
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to reset user password." });
    }
  },

  deleteUser: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to delete accounts." });
    }

    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();

    if (!userId) {
      return fail(400, { error: "User ID is required." });
    }

    if (userId === locals.user.id) {
      return fail(400, { error: "You cannot delete your own account." });
    }

    try {
      // Soft-delete user and revoke sessions
      await db.$transaction([
        db.user.update({
          where: { id: userId },
          data: { deletedAt: new Date(), status: UserStatus.suspended },
        }),
        db.session.deleteMany({ where: { userId } }),
      ]);

      return {
        success: true,
        action: "delete",
        message: "User account deactivated and purged from active directory.",
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to delete user." });
    }
  },

  updateSiteSettings: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== UserRole.admin) {
      return fail(403, { error: "Admin role required to configure site settings." });
    }

    const formData = await request.formData();
    const siteName = formData.get("siteName")?.toString().trim();
    const siteTagline = formData.get("siteTagline")?.toString().trim() || "";
    const supportEmail = formData.get("supportEmail")?.toString().trim() || "";
    const currencyCode = formData.get("currencyCode")?.toString().trim() || "INR";
    const currencySymbol = formData.get("currencySymbol")?.toString().trim() || "₹";
    const radiusStr = formData.get("defaultRadiusKm")?.toString();
    const defaultRadiusKm = radiusStr && !isNaN(parseInt(radiusStr, 10)) ? parseInt(radiusStr, 10) : 25;
    const logoUrl = formData.get("logoUrl")?.toString().trim() || null;
    const faviconUrl = formData.get("faviconUrl")?.toString().trim() || null;
    const maintenanceMode = formData.get("maintenanceMode") === "true";
    const allowRegistration = formData.get("allowRegistration") === "true";
    const autoApproveClaims = formData.get("autoApproveClaims") === "true";
    const requireReviewOtp = formData.get("requireReviewOtp") === "true";

    if (!siteName) {
      return fail(400, { error: "Directory brand name is required." });
    }

    try {
      await updateSettings({
        siteName,
        siteTagline,
        supportEmail,
        currencyCode,
        currencySymbol,
        defaultRadiusKm,
        logoUrl,
        faviconUrl,
        maintenanceMode,
        allowRegistration,
        autoApproveClaims,
        requireReviewOtp,
      });

      return {
        success: true,
        action: "settings",
        message: "Portal settings updated and synchronized across all views.",
      };
    } catch (err: any) {
      return fail(500, { error: err?.message || "Failed to save directory settings." });
    }
  },
};
