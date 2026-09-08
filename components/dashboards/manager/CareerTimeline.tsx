import { Building2 } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import { experience } from "@/lib/data";
import { formatMonthYear, monthsBetween } from "@/lib/role-utils";

export function CareerTimeline() {
  return (
    <section aria-labelledby="timeline-heading">
      <SectionHeader
        id="timeline"
        eyebrow="Progression"
        title="Career Timeline"
        subtitle="Career progression and impact, most recent first"
        variant="luxe"
      />
      <h2 id="timeline-heading" className="sr-only">
        Career Timeline
      </h2>

      <div className="relative space-y-6">
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-7 top-6 hidden w-px bg-gradient-to-b from-luxe-gold via-luxe-gold/30 to-transparent sm:block"
        />

        {experience.map((role) => {
          const months = monthsBetween(role.start, role.end);
          const isCurrent = role.end === null;

          return (
            <article key={`${role.company}-${role.start}`} className="relative sm:pl-24">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-6 hidden h-14 w-14 items-center justify-center rounded-full border bg-luxe-canvas sm:flex ${
                  isCurrent ? "border-luxe-gold shadow-gold" : "border-luxe-hairline-strong"
                }`}
              >
                <Building2
                  className={`h-5 w-5 ${isCurrent ? "text-luxe-gold" : "text-luxe-muted"}`}
                />
              </span>

              <div className="rounded-2xl border border-luxe-hairline bg-luxe-card p-6 shadow-luxe transition-colors duration-300 hover:border-luxe-gold/30 print-break-inside-avoid">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-luxe-ink">
                      {role.role}
                    </h3>
                    <p className="mt-0.5 font-semibold text-luxe-gold">{role.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full border border-luxe-hairline-strong px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-luxe-ink-soft">
                      {months} months
                    </span>
                    {isCurrent && (
                      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-luxe-gold">
                        Current
                      </p>
                    )}
                  </div>
                </div>

                <p className="mb-5 text-sm text-luxe-muted">
                  {formatMonthYear(role.start)} — {role.end ? formatMonthYear(role.end) : "Present"}{" "}
                  · {role.location}
                </p>

                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted">
                    Key Achievements
                  </p>
                  <ul className="space-y-1.5">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-sm text-luxe-ink-soft">
                        <span className="text-luxe-gold" aria-hidden="true">
                          ·
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-luxe-hairline pt-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted">
                    Skills
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-luxe-hairline-strong px-2.5 py-1 text-xs text-luxe-ink-soft"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
