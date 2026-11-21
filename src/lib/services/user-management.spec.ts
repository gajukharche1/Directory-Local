import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "$lib/auth/password";
import { hasRole } from "$lib/auth/rbac";
import { UserRole, UserStatus } from "@prisma/client";
import { generateSecurePassword } from "$lib/utils/password-generator";

describe("Phase 08: User Management & Security Gates", () => {
  it("enforces RBAC role hierarchy", () => {
    // Admin has access to admin, moderator, owner, visitor
    expect(hasRole(UserRole.admin, UserRole.admin)).toBe(true);
    expect(hasRole(UserRole.admin, UserRole.moderator)).toBe(true);
    expect(hasRole(UserRole.admin, UserRole.owner)).toBe(true);
    expect(hasRole(UserRole.admin, UserRole.visitor)).toBe(true);

    // Moderator has access to moderator, owner, visitor, but not admin
    expect(hasRole(UserRole.moderator, UserRole.admin)).toBe(false);
    expect(hasRole(UserRole.moderator, UserRole.moderator)).toBe(true);

    // Owner has access to owner and visitor only
    expect(hasRole(UserRole.owner, UserRole.admin)).toBe(false);
    expect(hasRole(UserRole.owner, UserRole.moderator)).toBe(false);
    expect(hasRole(UserRole.owner, UserRole.owner)).toBe(true);

    // Visitor has access to visitor only
    expect(hasRole(UserRole.visitor, UserRole.owner)).toBe(false);
    expect(hasRole(UserRole.visitor, UserRole.visitor)).toBe(true);
  });

  it("hashes and validates passwords with Argon2id for administrative reset", async () => {
    const generated = generateSecurePassword(18);
    expect(generated.length).toBe(18);

    const hash = await hashPassword(generated);
    expect(hash).toContain("$argon2id$");

    const isValid = await verifyPassword(hash, generated);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword(hash, "wrong-password-123");
    expect(isInvalid).toBe(false);
  });

  it("validates UserStatus lifecycle states", () => {
    expect(Object.values(UserStatus)).toEqual(["active", "suspended", "locked"]);
  });
});
