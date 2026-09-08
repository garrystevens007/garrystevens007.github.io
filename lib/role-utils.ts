// Shared helpers for the three role dashboards: date/duration formatting,
// filtering predicates, and the client-side export helpers.
//
// Everything here runs in the browser. The site is a static export
// (next.config.mjs `output: "export"`) — there is no server to call, so the
// specs' "backend calls scripts/build_resume.py with filter params" is not
// available. The full CV stays a real pre-built PDF served from /resume/, and
// the *filtered* exports are generated in the browser as Markdown/CSV instead
// of silently handing back an unfiltered file.

import type { EmploymentType } from "@/lib/data";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2023-05-01" -> "May 2023". Parsed manually to dodge timezone drift. */
export function formatMonthYear(dateString: string): string {
  const [year, month] = dateString.split("-");
  const index = Number(month) - 1;
  return `${MONTHS[index] ?? month} ${year}`;
}

export function monthsBetween(startDate: string, endDate: string | null): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months);
}

/** "2 yrs 3 mos" / "8 mos" / "1 yr". */
export function formatDuration(startDate: string, endDate: string | null): string {
  const total = monthsBetween(startDate, endDate);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} mo${months === 1 ? "" : "s"}`);
  return parts.join(" ") || "1 mo";
}

export type DurationBucket = "all" | "under-1" | "1-2" | "2-5" | "over-5";

export const durationBucketLabels: Record<DurationBucket, string> = {
  all: "All Years",
  "under-1": "< 1 Year",
  "1-2": "1–2 Years",
  "2-5": "2–5 Years",
  "over-5": "> 5 Years",
};

export function matchesDurationBucket(months: number, bucket: DurationBucket): boolean {
  const years = months / 12;
  switch (bucket) {
    case "under-1":
      return years < 1;
    case "1-2":
      return years >= 1 && years < 2;
    case "2-5":
      return years >= 2 && years < 5;
    case "over-5":
      return years >= 5;
    default:
      return true;
  }
}

export const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "Full-Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

// ---------------------------------------------------------------------------
// Client-side downloads
// ---------------------------------------------------------------------------

/**
 * Triggers a browser download for generated text. Revokes the object URL on
 * the next tick — revoking synchronously can cancel the download in Safari.
 */
export function downloadTextFile(filename: string, contents: string, mimeType = "text/plain") {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** RFC 4180 escaping: quote the field and double any inner quotes. */
function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: Array<Array<string | number>>): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
