import { describe, it, expect } from "vitest";
import { generateSecurePassword } from "./password-generator";

describe("generateSecurePassword", () => {
  it("generates a password of the requested length", () => {
    const pwd16 = generateSecurePassword(16);
    expect(pwd16).toHaveLength(16);

    const pwd24 = generateSecurePassword(24);
    expect(pwd24).toHaveLength(24);
  });

  it("includes uppercase, lowercase, numbers, and symbols", () => {
    for (let i = 0; i < 10; i++) {
      const pwd = generateSecurePassword(16);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[!@#$%^&*()_+~=]/.test(pwd)).toBe(true);
    }
  });

  it("generates unique values on consecutive calls", () => {
    const p1 = generateSecurePassword(16);
    const p2 = generateSecurePassword(16);
    expect(p1).not.toBe(p2);
  });
});
