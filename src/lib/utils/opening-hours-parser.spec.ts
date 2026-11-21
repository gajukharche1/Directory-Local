import { describe, it, expect } from "vitest";
import {
  parseOpeningHours,
  to24Hour,
  getDefaultSchedule,
  get24x7Schedule,
  formatScheduleSummary,
  isCurrentlyOpen,
} from "./opening-hours-parser";

describe("opening-hours-parser", () => {
  it("converts 12-hour AM/PM formats to 24-hour time", () => {
    expect(to24Hour("9am")).toBe("09:00");
    expect(to24Hour("9:30 AM")).toBe("09:30");
    expect(to24Hour("12pm")).toBe("12:00");
    expect(to24Hour("12am")).toBe("00:00");
    expect(to24Hour("8:45 PM")).toBe("20:45");
    expect(to24Hour("21:00")).toBe("21:00");
  });

  it("handles 24/7 shorthand inputs", () => {
    const s1 = parseOpeningHours("24/7");
    expect(s1.monday.isOpen).toBe(true);
    expect(s1.monday.openTime).toBe("00:00");
    expect(s1.monday.closeTime).toBe("23:59");
    expect(s1.sunday.isOpen).toBe(true);

    const s2 = parseOpeningHours("Open 24 hours");
    expect(s2.friday.openTime).toBe("00:00");
    expect(s2.friday.isOpen).toBe(true);
  });

  it("parses single general time range", () => {
    const schedule = parseOpeningHours("10:00 - 20:00");
    expect(schedule.monday.isOpen).toBe(true);
    expect(schedule.monday.openTime).toBe("10:00");
    expect(schedule.monday.closeTime).toBe("20:00");
  });

  it("parses complex day-qualified natural language strings", () => {
    const schedule = parseOpeningHours("Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed");
    expect(schedule.monday.isOpen).toBe(true);
    expect(schedule.monday.openTime).toBe("09:00");
    expect(schedule.monday.closeTime).toBe("18:00");

    expect(schedule.saturday.isOpen).toBe(true);
    expect(schedule.saturday.openTime).toBe("10:00");
    expect(schedule.saturday.closeTime).toBe("16:00");

    expect(schedule.sunday.isOpen).toBe(false);
  });

  it("parses pre-formatted JSON strings", () => {
    const defaultSched = getDefaultSchedule();
    const jsonStr = JSON.stringify(defaultSched);
    const parsed = parseOpeningHours(jsonStr);
    expect(parsed.monday.openTime).toBe(defaultSched.monday.openTime);
    expect(parsed.sunday.isOpen).toBe(false);
  });

  it("formats summaries cleanly", () => {
    const s24 = get24x7Schedule();
    expect(formatScheduleSummary(s24)).toBe("Open 24/7");

    const standard = getDefaultSchedule();
    expect(formatScheduleSummary(standard)).toContain("Mon - Sat: 09:00 - 21:00");
  });

  it("calculates real-time open status correctly", () => {
    const schedule = getDefaultSchedule(); // Mon-Sat 09:00 - 21:00, Sun closed
    // Wednesday 14:00 (2 PM)
    const testDateOpen = new Date("2026-11-25T14:00:00");
    const statusOpen = isCurrentlyOpen(schedule, testDateOpen);
    expect(statusOpen.isOpen).toBe(true);
    expect(statusOpen.statusText).toContain("Open now");

    // Wednesday 23:30 (11:30 PM)
    const testDateClosed = new Date("2026-11-25T23:30:00");
    const statusClosed = isCurrentlyOpen(schedule, testDateClosed);
    expect(statusClosed.isOpen).toBe(false);

    // Sunday (Closed)
    const testDateSunday = new Date("2026-11-29T12:00:00");
    const statusSunday = isCurrentlyOpen(schedule, testDateSunday);
    expect(statusSunday.isOpen).toBe(false);
    expect(statusSunday.statusText).toBe("Closed Today");
  });
});
