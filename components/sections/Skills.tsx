import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { skillCategoryColors, skills, type Accent } from "@/lib/data";

// One accent per category (from skillCategoryColors) instead of every bar
// being the same primary pink — the dot + fill color are the same swatch.
const dotClasses: Record<Accent, string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <SectionHeading eyebrow="Toolbox" title="Skills" description="Grouped by category, with a self-rated proficiency bar." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(skills).map(([category, items]) => {
          const accent = skillCategoryColors[category] ?? "primary";
          return (
            <div
              key={category}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white">
                <span className={`h-2 w-2 rounded-full ${dotClasses[accent]}`} />
                {category}
              </h3>
              <div className="mt-4 space-y-3">
                {items.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">{skill.name}</span>
                      <span className="text-neutral-400">{skill.level}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div className={`h-full rounded-full ${dotClasses[accent]}`} style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
