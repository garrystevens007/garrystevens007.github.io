import type { HttpMethod } from "@/lib/data";

type MethodBadgeProps = {
  method: HttpMethod;
};

// GET/POST/PUT grouping follows the majority across the spec docs (DESIGN_SPECS,
// API_PLAYGROUND_OVERVIEW, IMPLEMENTATION_GUIDE all group POST+PUT as blue;
// only UI_COMPONENTS' inline sample splits PUT into yellow) — none of the
// actual mocked endpoints use PUT/DELETE today, but the badge supports all four.
const methodColors: Record<HttpMethod, string> = {
  GET: "bg-emerald-100 text-emerald-800 border-emerald-300",
  POST: "bg-blue-100 text-blue-800 border-blue-300",
  PUT: "bg-blue-100 text-blue-800 border-blue-300",
  DELETE: "bg-red-100 text-red-800 border-red-300",
};

export function MethodBadge({ method }: MethodBadgeProps) {
  return <span className={`rounded border px-2 py-1 text-xs font-bold ${methodColors[method]}`}>{method}</span>;
}
