import type { LucideIcon } from "lucide-react";

type StatColor = "primary" | "info" | "success" | "warning";

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  color: StatColor;
};

// Card anatomy (header / divider / footer) is copied from Material
// Dashboard's actual stat-card markup, not just its colors. Icon chips use
// the exact gradient + shadow formula sourced from the theme CSS, one accent
// per card instead of a single uniform tile.
const chipClasses: Record<StatColor, string> = {
  primary: "from-primary-from to-primary-to shadow-primary",
  info: "from-info-from to-info-to shadow-info",
  success: "from-success-from to-success-to shadow-success",
  warning: "from-warning-from to-warning-to shadow-warning",
};

export function StatCard({ label, value, caption, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-card dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-800 dark:text-white">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white ${chipClasses[color]}`}
        >
          <Icon size={22} />
        </div>
      </div>
      <hr className="m-0 border-neutral-200 dark:border-neutral-700" />
      <p className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{caption}</p>
    </div>
  );
}
