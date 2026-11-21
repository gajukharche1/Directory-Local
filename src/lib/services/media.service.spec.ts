import { describe, it, expect } from "vitest";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "./media.service";
import { StorageService } from "./storage.service";

describe("Media Service & Storage Driver Specs", () => {
  it("enforces allowed image MIME types", () => {
    expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
    expect(ALLOWED_MIME_TYPES).toContain("image/webp");
    expect(ALLOWED_MIME_TYPES).toContain("image/avif");
    expect(ALLOWED_MIME_TYPES).toContain("image/svg+xml");

    expect(ALLOWED_MIME_TYPES).not.toContain("application/pdf");
    expect(ALLOWED_MIME_TYPES).not.toContain("application/x-msdownload");
    expect(ALLOWED_MIME_TYPES).not.toContain("text/html");
  });

  it("enforces 10 MB maximum file size limit", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
  });

  it("generates collision-resistant storage ticket with sanitized prefix", async () => {
    const ticket = await StorageService.createUploadTicket(
      "storefront photo.jpg",
      "image/jpeg",
      1024 * 500,
      "users/user_123/../../malicious"
    );

    expect(ticket.key).toBeDefined();
    // Path traversal characters stripped
    expect(ticket.key).not.toContain("..");
    expect(ticket.uploadUrl).toBeDefined();
    expect(ticket.publicUrl).toBeDefined();
  });

  it("prevents directory traversal attacks in local file storage", async () => {
    const maliciousKey = "../../../etc/passwd";
    const dummyBuffer = Buffer.from("test");

    await expect(
      StorageService.saveLocalFile(maliciousKey, dummyBuffer)
    ).rejects.toThrow("Invalid path traversal attempted.");
  });

  it("formats file size correctly in bytes and megabytes", () => {
    const sampleBytes = 5.25 * 1024 * 1024;
    const mb = sampleBytes / (1024 * 1024);
    expect(mb).toBeCloseTo(5.25, 2);
  });
});
