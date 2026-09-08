import { MapPin } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import { experience } from "@/lib/data";
import { employmentTypeLabels, formatDuration, monthsBetween } from "@/lib/role-utils";

// With the per-company delivery metrics gone, this section would just be a
// thinner restatement of the career timeline above it. So it leans on the
// other half of MANAGER_DASHBOARD_SPECS.md §5 instead — tenure visualisation,
// role progression and location distribution — all of which are computed from
// content/experience.json rather than estimated.
const totalMonths = experience.reduce(
  (sum, role) => sum + monthsBetween(role.start, role.end),
  0
);

export function ExperienceOverview() {
  const locations = Array.from(new Set(experience.map((role) => role.location)));

  return (
    <section aria-labelledby="companies-heading">
      <SectionHeader
        id="companies"
        eyebrow="Breakdown"
        title="Experience Overview"
        subtitle="Tenure distribution and role progression across employers"
        variant="luxe"
      />
      <h2 id="companies-heading" className="sr-only">
        Experience Overview
      </h2>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {experience.map((role) => {
          const months = monthsBetween(role.start, role.end);
          const share = Math.round((months / totalMonths) * 100);

          return (
            <li
              key={`${role.company}-${role.start}`}
              className="rounded-2xl border border-luxe-hairline bg-luxe-card p-6 shadow-luxe transition-colors duration-300 hover:border-luxe-gold/30 print-break-inside-avoid"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-luxe-ink">
                    {role.company}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-luxe-gold">{role.role}</p>
                </div>
                <span className="rounded-full border border-luxe-hairline-strong px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-luxe-ink-soft">
                  {formatDuration(role.start, role.end)}
                </span>
              </div>

              <p className="mb-5 flex items-center gap-1.5 text-sm text-luxe-muted">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {role.location} · {employmentTypeLabels[role.type]}
              </p>

              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-luxe-muted">
                  Share of career
                </span>
                <span className="font-display text-lg font-semibold tabular-nums text-luxe-gold">
                  {share}%
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-luxe-hairline"
                role="img"
                aria-label={`${share}% of total career tenure`}
              >
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-luxe-gold-from to-luxe-gold-to"
                  style={{ width: `${share}%` }}
                />
              </div>

              <p className="mt-4 border-t border-luxe-hairline pt-4 text-xs text-luxe-muted">
                {role.skills.length} technologies applied · {months} months
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-luxe-muted">
        <div className="flex gap-2">
          <dt>Total tenure</dt>
          <dd className="font-semibold text-luxe-ink-soft">
            {Math.floor(totalMonths / 12)} yrs {totalMonths % 12} mos
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>Locations</dt>
          <dd className="font-semibold text-luxe-ink-soft">{locations.join(" · ")}</dd>
        </div>
      </dl>
    </section>
  );
}
