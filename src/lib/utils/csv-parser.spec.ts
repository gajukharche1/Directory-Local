import { describe, it, expect } from "vitest";
import {
  parseCsvText,
  detectDelimiter,
  validateCsvInput,
  SAMPLE_TEMPLATES,
} from "./csv-parser";

describe("csv-parser", () => {
  it("detects comma and semicolon delimiters", () => {
    expect(detectDelimiter("title,address,locality\nFoo,Bar,Baz")).toBe(",");
    expect(detectDelimiter("title;address;locality\nFoo;Bar;Baz")).toBe(";");
  });

  it("handles quoted fields and escaped quotes properly", () => {
    const csv = `title,address,openingHours\n"Apex Dental, Clinic","Shop 104, Icon Rd","Mon-Sat: 10am-8pm"`;
    const rows = parseCsvText(csv);
    expect(rows.length).toBe(2);
    expect(rows[1]![0]).toBe("Apex Dental, Clinic");
    expect(rows[1]![1]).toBe("Shop 104, Icon Rd");
    expect(rows[1]![2]).toBe("Mon-Sat: 10am-8pm");
  });

  it("validates listings with required fields", () => {
    const validCsv = `title,address,phone\nAcme Cafe,Main Road,+919999999999`;
    const res = validateCsvInput(validCsv, "listings");
    expect(res.validCount).toBe(1);
    expect(res.invalidCount).toBe(0);
    expect(res.rows[0]!.isValid).toBe(true);
  });

  it("flags missing title and address in listings", () => {
    const invalidCsv = `title,address\n,123 Main St\nBad Business,`;
    const res = validateCsvInput(invalidCsv, "listings");
    expect(res.validCount).toBe(0);
    expect(res.invalidCount).toBe(2);
    expect(res.rows[0]!.errors[0]!.field).toBe("title");
    expect(res.rows[1]!.errors[0]!.field).toBe("address");
  });

  it("validates sample templates without errors", () => {
    const listingRes = validateCsvInput(SAMPLE_TEMPLATES.listings, "listings");
    expect(listingRes.invalidCount).toBe(0);
    expect(listingRes.validCount).toBeGreaterThanOrEqual(3);

    const categoryRes = validateCsvInput(SAMPLE_TEMPLATES.categories, "categories");
    expect(categoryRes.invalidCount).toBe(0);
    expect(categoryRes.validCount).toBeGreaterThanOrEqual(4);

    const locationRes = validateCsvInput(SAMPLE_TEMPLATES.locations, "locations");
    expect(locationRes.invalidCount).toBe(0);
    expect(locationRes.validCount).toBeGreaterThanOrEqual(3);
  });
});
