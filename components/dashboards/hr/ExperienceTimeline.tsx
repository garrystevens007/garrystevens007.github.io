"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import { experience, type EmploymentType } from "@/lib/data";
import {
  durationBucketLabels,
  employmentTypeLabels,
  formatDuration,
  formatMonthYear,
  matchesDurationBucket,
  monthsBetween,
  type DurationBucket,
} from "@/lib/role-utils";

const companies = Array.from(new Set(experience.map((role) => role.company)));
const types = Array.from(new Set(experience.map((role) => role.type)));

const selectClass =
  "w-full rounded-xl border border-hr-border bg-hr-card px-3.5 py-2.5 text-sm text-hr-ink transition focus:border-hr-accent focus:outline-none focus:ring-2 focus:ring-hr-accent/30";

export function ExperienceTimeline() {
  const [company, setCompany] = useState("all");
  const [duration, setDuration] = useState<DurationBucket>("all");
  const [type, setType] = useState<EmploymentType | "all">("all");

  const visible = useMemo(
    () =>
      experience.filter((role) => {
        const months = monthsBetween(role.start, role.end);
        return (
          (company === "all" || role.company === company) &&
          matchesDurationBucket(months, duration) &&
          (type === "all" || role.type === type)
        );
      }),
    [company, duration, type]
  );

  return (
    <section aria-labelledby="experience-heading">
      <SectionHeader
        id="experience"
        title="Experience Timeline"
        subtitle="Filter by company, tenure length, or employment type. Expand any role for its full achievement list."
      />
      <h2 id="experience-heading" className="sr-only">
        Experience Timeline
      </h2>

      <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-hr-border bg-hr-card p-4 shadow-warm">
        <Field label="Company" id="filter-company">
          <select
            id="filter-company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={selectClass}
          >
            <option value="all">All Companies</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Duration" id="filter-duration">
          <select
            id="filter-duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value as DurationBucket)}
            className={selectClass}
          >
            {(Object.keys(durationBucketLabels) as DurationBucket[]).map((key) => (
              <option key={key} value={key}>
                {durationBucketLabels[key]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Type" id="filter-type">
          <select
            id="filter-type"
            value={type}
            onChange={(event) => setType(event.target.value as EmploymentType | "all")}
            className={selectClass}
          >
            <option value="all">All Types</option>
            {types.map((value) => (
              <option key={value} value={value}>
                {employmentTypeLabels[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hr-border-strong bg-hr-canvas-2 p-10 text-center">
          <p className="text-hr-muted">No experience matches these filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((role) => (
            <article
              key={`${role.company}-${role.start}`}
              className="relative overflow-hidden rounded-2xl border border-hr-border bg-hr-card shadow-warm transition hover:border-hr-accent/30 hover:shadow-warm-lg"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-hr-accent-from to-hr-accent-to"
              />

              <div className="p-5 pl-7">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-hr-ink">{role.role}</h3>
                    <p className="text-sm font-semibold text-hr-accent">{role.company}</p>
                  </div>
                  <span className="rounded-full border border-hr-accent/25 bg-hr-accent-tint px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-hr-accent-ink">
                    {employmentTypeLabels[role.type]}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hr-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {role.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatMonthYear(role.start)} —{" "}
                    {role.end ? formatMonthYear(role.end) : "Present"}
                  </span>
                  <span className="font-semibold text-hr-ink-soft">
                    ({formatDuration(role.start, role.end)})
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-hr-ink-soft">{role.summary}</p>

                <details className="group">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-hr-accent transition hover:text-hr-accent-ink">
                    <span className="inline-block transition-transform group-open:rotate-90">▶</span>{" "}
                    Key Achievements ({role.bullets.length})
                  </summary>
                  <ul className="ml-3 mt-3 space-y-2 border-l-2 border-hr-accent-soft pl-4">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-hr-ink-soft">
                        <span className="font-bold text-hr-accent" aria-hidden="true">
                          •
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </details>

                {role.skills.length > 0 && (
                  <div className="mt-4 border-t border-hr-border pt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-hr-muted">
                      Skills Used
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-full border border-hr-border bg-hr-canvas px-2.5 py-1 text-xs text-hr-ink-soft"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[180px] flex-1">
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-hr-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
