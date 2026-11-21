/**
 * Opening Hours Engine & Smart Parser
 * Translates natural language, shorthand formats, and JSON into structured WeekSchedule.
 */

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday"
  , "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;  // "09:00" (HH:mm in 24-hr)
  closeTime: string; // "21:00" (HH:mm in 24-hr)
}

export type WeekSchedule = Record<DayOfWeek, DaySchedule>;

/**
 * Returns a standard retail default schedule (Mon-Sat 9 AM - 9 PM, Sunday closed)
 */
export function getDefaultSchedule(): WeekSchedule {
  return {
    monday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    saturday: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
    sunday: { isOpen: false, openTime: "10:00", closeTime: "18:00" },
  };
}

/**
 * Returns a 24/7 all-days open schedule
 */
export function get24x7Schedule(): WeekSchedule {
  const schedule = {} as WeekSchedule;
  for (const day of DAYS_OF_WEEK) {
    schedule[day] = { isOpen: true, openTime: "00:00", closeTime: "23:59" };
  }
  return schedule;
}

/**
 * Returns standard corporate hours (Mon-Fri 9 AM - 6 PM, Sat-Sun closed)
 */
export function getStandardOfficeSchedule(): WeekSchedule {
  return {
    monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    saturday: { isOpen: false, openTime: "10:00", closeTime: "16:00" },
    sunday: { isOpen: false, openTime: "10:00", closeTime: "16:00" },
  };
}

/**
 * Helper to convert 12-hour AM/PM string (e.g. "9am", "9:30 PM", "12pm") to 24-hr "HH:mm"
 */
export function to24Hour(timeStr: string): string {
  const cleaned = timeStr.trim().toLowerCase();
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return "09:00";

  let hour = parseInt(match[1]!, 10);
  const minute = match[2] ? match[2].padStart(2, "0") : "00";
  const meridian = match[3];

  if (meridian === "pm" && hour < 12) {
    hour += 12;
  } else if (meridian === "am" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

const DAY_MAP: Record<string, DayOfWeek> = {
  mon: "monday",
  monday: "monday",
  tue: "tuesday",
  tues: "tuesday",
  tuesday: "tuesday",
  wed: "wednesday",
  wednesday: "wednesday",
  thu: "thursday",
  thur: "thursday",
  thurs: "thursday",
  thursday: "thursday",
  fri: "friday",
  friday: "friday",
  sat: "saturday",
  saturday: "saturday",
  sun: "sunday",
  sunday: "sunday",
};

/**
 * Parse days range (e.g. "Mon-Sat", "Mon-Fri", "Sunday", "Mon,Wed,Fri")
 */
function resolveDays(dayRangeStr: string): DayOfWeek[] {
  const normalized = dayRangeStr.trim().toLowerCase();
  if (normalized.includes("-") || normalized.includes("to")) {
    const parts = normalized.split(/[-–—]|(?:\s+to\s+)/).map((p) => p.trim());
    const startDay = DAY_MAP[parts[0]!];
    const endDay = DAY_MAP[parts[1]!];
    if (startDay && endDay) {
      const startIndex = DAYS_OF_WEEK.indexOf(startDay);
      const endIndex = DAYS_OF_WEEK.indexOf(endDay);
      if (startIndex <= endIndex) {
        return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
      } else {
        // Wraparound e.g. Fri-Mon
        return [...DAYS_OF_WEEK.slice(startIndex), ...DAYS_OF_WEEK.slice(0, endIndex + 1)];
      }
    }
  }

  if (normalized.includes(",") || normalized.includes("&")) {
    const list: DayOfWeek[] = [];
    const parts = normalized.split(/[,&]/).map((p) => p.trim());
    for (const p of parts) {
      if (DAY_MAP[p]) list.push(DAY_MAP[p]!);
    }
    return list;
  }

  if (DAY_MAP[normalized]) {
    return [DAY_MAP[normalized]!];
  }

  if (normalized === "daily" || normalized === "all" || normalized === "everyday") {
    return [...DAYS_OF_WEEK];
  }

  return [];
}

/**
 * Parses any input (JSON, shorthand, natural language) into a valid WeekSchedule
 */
export function parseOpeningHours(input: unknown): WeekSchedule {
  if (!input) return getDefaultSchedule();

  // If already structured WeekSchedule object
  if (typeof input === "object" && !Array.isArray(input)) {
    const obj = input as any;
    let isValidStructure = true;
    for (const d of DAYS_OF_WEEK) {
      if (!obj[d] || typeof obj[d].isOpen !== "boolean") {
        isValidStructure = false;
        break;
      }
    }
    if (isValidStructure) {
      return obj as WeekSchedule;
    }
  }

  // If string input
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return getDefaultSchedule();

    // Check JSON string
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          return parseOpeningHours(parsed);
        }
      } catch {
        // Fallback to text parsing
      }
    }

    const lower = trimmed.toLowerCase();

    // 24/7 or always open
    if (
      lower === "24/7" ||
      lower === "24x7" ||
      lower.includes("24 hours") ||
      lower.includes("always open")
    ) {
      return get24x7Schedule();
    }

    // Default template to modify
    const schedule = getDefaultSchedule();

    // Check for comma or semicolon delimited segments (e.g. "Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed")
    const segments = trimmed.split(/[,;]\s*(?=[A-Za-z])/);

    if (segments.length > 1 || trimmed.includes(":")) {
      let matchedAny = false;
      for (const seg of segments) {
        const colonIdx = seg.indexOf(":");
        if (colonIdx !== -1) {
          const daysPart = seg.substring(0, colonIdx);
          const timePart = seg.substring(colonIdx + 1).trim();
          const targetDays = resolveDays(daysPart);

          if (targetDays.length > 0) {
            matchedAny = true;
            if (timePart.toLowerCase().includes("closed")) {
              for (const day of targetDays) {
                schedule[day].isOpen = false;
              }
            } else {
              // Parse time range like "09:00-21:00" or "9am - 9pm"
              const timeRange = timePart.split(/[-–—]|(?:\s+to\s+)/).map((t) => t.trim());
              if (timeRange.length >= 2) {
                const open = to24Hour(timeRange[0]!);
                const close = to24Hour(timeRange[1]!);
                for (const day of targetDays) {
                  schedule[day] = { isOpen: true, openTime: open, closeTime: close };
                }
              }
            }
          }
        }
      }

      if (matchedAny) return schedule;
    }

    // Single simple time range like "09:00-21:00" or "9am to 9pm" applied to all active days
    const simpleRange = trimmed.split(/[-–—]|(?:\s+to\s+)/).map((t) => t.trim());
    if (simpleRange.length === 2 && /\d/.test(simpleRange[0]!) && /\d/.test(simpleRange[1]!)) {
      const open = to24Hour(simpleRange[0]!);
      const close = to24Hour(simpleRange[1]!);
      for (const day of DAYS_OF_WEEK) {
        if (day !== "sunday") {
          schedule[day] = { isOpen: true, openTime: open, closeTime: close };
        }
      }
      return schedule;
    }
  }

  return getDefaultSchedule();
}

/**
 * Formats a WeekSchedule into a compact human-readable summary
 */
export function formatScheduleSummary(schedule: WeekSchedule): string {
  if (!schedule) return "Hours not specified";

  // Check 24/7
  const all247 = DAYS_OF_WEEK.every(
    (d) => schedule[d]?.isOpen && schedule[d]?.openTime === "00:00" && schedule[d]?.closeTime === "23:59"
  );
  if (all247) return "Open 24/7";

  const mon = schedule.monday;
  const sat = schedule.saturday;
  const sun = schedule.sunday;

  const monFriSame = ["tuesday", "wednesday", "thursday", "friday"].every(
    (d) =>
      schedule[d as DayOfWeek]?.isOpen === mon?.isOpen &&
      schedule[d as DayOfWeek]?.openTime === mon?.openTime &&
      schedule[d as DayOfWeek]?.closeTime === mon?.closeTime
  );

  if (monFriSame) {
    if (
      sat?.isOpen === mon?.isOpen &&
      sat?.openTime === mon?.openTime &&
      sat?.closeTime === mon?.closeTime
    ) {
      if (!sun?.isOpen) {
        return `Mon - Sat: ${mon.openTime} - ${mon.closeTime} (Sun: Closed)`;
      } else {
        return `Mon - Sat: ${mon.openTime} - ${mon.closeTime}, Sun: ${sun.openTime} - ${sun.closeTime}`;
      }
    } else {
      let str = `Mon - Fri: ${mon.openTime} - ${mon.closeTime}`;
      if (sat?.isOpen) str += `, Sat: ${sat.openTime} - ${sat.closeTime}`;
      else str += `, Sat: Closed`;
      if (sun?.isOpen) str += `, Sun: ${sun.openTime} - ${sun.closeTime}`;
      else str += `, Sun: Closed`;
      return str;
    }
  }

  return `Mon - Sat: ${mon?.openTime || "09:00"} - ${mon?.closeTime || "21:00"}`;
}

/**
 * Determines real-time opening status based on current local time
 */
export function isCurrentlyOpen(
  schedule: WeekSchedule | null | undefined,
  currentDate = new Date()
): {
  isOpen: boolean;
  statusText: string;
  badgeClass: string;
} {
  if (!schedule) {
    return { isOpen: false, statusText: "Hours Unspecified", badgeClass: "bg-slate-100 text-slate-600" };
  }

  const dayIndex = currentDate.getDay(); // 0 is Sunday, 1 is Monday...
  const dayKey: DayOfWeek =
    dayIndex === 0
      ? "sunday"
      : dayIndex === 1
      ? "monday"
      : dayIndex === 2
      ? "tuesday"
      : dayIndex === 3
      ? "wednesday"
      : dayIndex === 4
      ? "thursday"
      : dayIndex === 5
      ? "friday"
      : "saturday";

  const todaySchedule = schedule[dayKey];
  if (!todaySchedule || !todaySchedule.isOpen) {
    return { isOpen: false, statusText: "Closed Today", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" };
  }

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const [openHour, openMin] = todaySchedule.openTime.split(":").map(Number);
  const [closeHour, closeMin] = todaySchedule.closeTime.split(":").map(Number);

  const openMinutes = (openHour || 0) * 60 + (openMin || 0);
  const closeMinutes = (closeHour || 0) * 60 + (closeMin || 0);

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return {
      isOpen: true,
      statusText: `Open now until ${todaySchedule.closeTime}`,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: `Closed · Opens at ${todaySchedule.openTime}`,
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    };
  } else {
    return {
      isOpen: false,
      statusText: `Closed · Closed at ${todaySchedule.closeTime}`,
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }
}
