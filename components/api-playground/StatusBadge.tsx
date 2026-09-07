type StatusBadgeProps = {
  statusCode: number;
  emoji: string;
  statusLabel: string;
};

const statusColors: Record<number, string> = {
  200: "bg-emerald-100 border-emerald-300 text-emerald-800",
  201: "bg-emerald-100 border-emerald-300 text-emerald-800",
  400: "bg-amber-100 border-amber-300 text-amber-800",
  404: "bg-orange-100 border-orange-300 text-orange-800",
  429: "bg-orange-100 border-orange-300 text-orange-800",
  500: "bg-red-100 border-red-300 text-red-800",
};

export function StatusBadge({ statusCode, emoji, statusLabel }: StatusBadgeProps) {
  const colorClass = statusColors[statusCode] ?? "bg-gray-100 border-gray-300 text-gray-800";
  return (
    <div className={`inline-block rounded border-2 px-3 py-2 font-semibold ${colorClass}`}>
      <span className="mr-2">{emoji}</span>
      {statusCode} {statusLabel}
    </div>
  );
}
