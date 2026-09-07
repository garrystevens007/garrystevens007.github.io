import { Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <SectionHeading eyebrow="Career" title="Experience" description="Newest first." />
      <div className="space-y-4">
        {experience.map((role) => (
          <div
            key={`${role.company}-${role.start}`}
            className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">{role.role}</h3>
                  <p className="text-xs text-neutral-400">
                    {role.company} — {role.location}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
                {role.period}
              </span>
            </div>
            <ul className="mt-4 space-y-2 pl-1 text-sm text-neutral-500 dark:text-neutral-300">
              {role.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
