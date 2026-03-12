const MONTH_INDEX: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

export type PlainDate = {
  year: number;
  month: number;
  day: number;
};

function getPartsFormatter(timezone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function getZonedPlainDate(date: Date, timezone: string): PlainDate {
  const parts = getPartsFormatter(timezone).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return { year, month, day };
}

export function formatPlainDate(date: PlainDate): string {
  return `${date.year.toString().padStart(4, "0")}-${date.month.toString().padStart(2, "0")}-${date.day
    .toString()
    .padStart(2, "0")}`;
}

export function addDays(date: PlainDate, offset: number): PlainDate {
  const next = new Date(Date.UTC(date.year, date.month - 1, date.day + offset));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

export function diffInDays(left: PlainDate, right: PlainDate): number {
  const leftUtc = Date.UTC(left.year, left.month - 1, left.day);
  const rightUtc = Date.UTC(right.year, right.month - 1, right.day);
  return Math.round((leftUtc - rightUtc) / 86_400_000);
}

export function parseAgeToPlainDate(value: string, runDate: PlainDate): PlainDate | null {
  const match = value.trim().match(/^(\d+)d$/i);
  if (!match) {
    return null;
  }

  return addDays(runDate, -Number(match[1]));
}

export function parseMonthDayToPlainDate(value: string, runDate: PlainDate): PlainDate | null {
  const match = value.trim().match(/^([A-Z][a-z]{2})\s+(\d{1,2})$/);
  if (!match) {
    return null;
  }

  const month = MONTH_INDEX[match[1]];
  if (!month) {
    return null;
  }

  const candidate = {
    year: runDate.year,
    month,
    day: Number(match[2]),
  };

  if (diffInDays(candidate, runDate) > 7) {
    return { ...candidate, year: runDate.year - 1 };
  }

  return candidate;
}

export function formatZonedTimestamp(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const offset = (get("timeZoneName") || "GMT+0").replace("GMT", "").replace("−", "-");

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}
