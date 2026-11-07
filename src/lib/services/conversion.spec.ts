import { describe, it, expect } from "vitest";
import { hasRole, canManageListing } from "$lib/auth/rbac";
import { hashPassword, verifyPassword } from "$lib/auth/password";
import { getOpeningStatus } from "$lib/utils/opening-hours";
import { rateLimits } from "$lib/security/rate-limit";
import { UserRole } from "@prisma/client";

describe("SvelteKit Port - Core Architecture Verification", () => {
  it("enforces RBAC role hierarchy", () => {
    expect(hasRole(UserRole.admin, UserRole.moderator)).toBe(true);
    expect(hasRole(UserRole.moderator, UserRole.owner)).toBe(true);
    expect(hasRole(UserRole.owner, UserRole.visitor)).toBe(true);
    expect(hasRole(UserRole.visitor, UserRole.owner)).toBe(false);
  });

  it("checks listing management permissions correctly", () => {
    const adminUser = {
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      role: UserRole.admin,
      phone: null,
    };

    const ownerUser = {
      id: "owner-1",
      email: "owner@example.com",
      name: "Owner User",
      role: UserRole.owner,
      phone: null,
    };

    expect(canManageListing(adminUser, "any-owner")).toBe(true);
    expect(canManageListing(ownerUser, "owner-1")).toBe(true);
    expect(canManageListing(ownerUser, "other-owner")).toBe(false);
  });

  it("hashes and validates passwords with Argon2id", async () => {
    const password = "StrongPassword123!";
    const hash = await hashPassword(password);
    expect(hash).toContain("$argon2id$");

    const valid = await verifyPassword(hash, password);
    expect(valid).toBe(true);

    const invalid = await verifyPassword(hash, "WrongPassword");
    expect(invalid).toBe(false);
  });

  it("computes real-time opening hours accurately", () => {
    const sampleSchedule = {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: false },
      saturday: { open: "09:00", close: "21:00", closed: false },
      sunday: { closed: true },
    };

    const status = getOpeningStatus(sampleSchedule);
    expect(status).toHaveProperty("isOpen");
    expect(status).toHaveProperty("statusText");
  });

  it("applies token-bucket rate limits", async () => {
    const testIp = `test-ip-${Date.now()}`;
    const result1 = await rateLimits.search(testIp);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBeGreaterThan(0);
  });
});
