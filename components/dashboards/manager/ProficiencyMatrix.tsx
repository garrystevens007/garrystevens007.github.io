import { SectionHeader } from "@/components/layout/RoleShell";
import { proficiencyLabels, skillCategoryNames, skillDetails, type Proficiency } from "@/lib/data";

// MANAGER_DASHBOARD_SPECS.md's ramp (amber → red, with rose-200 used twice so
// levels 2 and 3 were identical) was built for a white card. On near-black it
// would read as an alert palette. This is a single-hue gold intensity ramp
// instead: monotonic, unambiguous, and it keeps gold as the page's one accent.
const PROFICIENCY_COLORS: Record<Proficiency, string> = {
  1: "#4A3F1E",
  2: "#6B5A2A",
  3: "#8A7220",
  4: "#B29130",
  5: "#E8C87E",
};

const EMPTY_CELL = "#23232A";
const LEVELS: Proficiency[] = [1, 2, 3, 4, 5];

export function ProficiencyMatrix() {
  return (
    <section aria-labelledby="proficiency-heading">
      <SectionHeader
        id="proficiency"
        eyebrow="Capability"
        title="Technical Proficiency Matrix"
        subtitle="Expertise depth across technology domains"
        variant="luxe"
      />
      <h2 id="proficiency-heading" className="sr-only">
        Technical Proficiency Matrix
      </h2>

      <div className="rounded-2xl border border-luxe-hairline bg-luxe-card p-6 shadow-luxe">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-luxe-hairline pb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted">
            Proficiency
          </span>
          {LEVELS.map((level) => (
            <span key={level} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-6 rounded-sm"
                style={{ backgroundColor: PROFICIENCY_COLORS[level] }}
              />
              <span className="text-xs text-luxe-muted">{proficiencyLabels[level]}</span>
            </span>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse">
            <caption className="sr-only">
              Self-rated proficiency and years of experience per technology, grouped by category
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="pb-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted"
                >
                  Technology
                </th>
                <th
                  scope="col"
                  className="pb-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted"
                >
                  Proficiency
                </th>
                <th
                  scope="col"
                  className="pb-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted"
                >
                  Years
                </th>
              </tr>
            </thead>
            {skillCategoryNames.map((category) => (
              <tbody key={category}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={3}
                    className="border-t border-luxe-hairline pb-2 pt-5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-luxe-gold"
                  >
                    {category}
                  </th>
                </tr>
                {skillDetails
                  .filter((skill) => skill.category === category)
                  .sort((a, b) => b.level - a.level)
                  .map((skill) => (
                    <tr key={skill.name} className="transition-colors hover:bg-luxe-card-2">
                      <td className="py-2.5 text-sm text-luxe-ink">{skill.name}</td>
                      <td className="py-2.5">
                        <span
                          className="flex justify-center gap-1"
                          role="img"
                          aria-label={`${proficiencyLabels[skill.proficiency]} — ${skill.proficiency} of 5`}
                        >
                          {LEVELS.map((level) => (
                            <span
                              key={level}
                              // data-filled is what the print stylesheet hooks
                              // into — these colours are inline, so an unfilled
                              // near-black cell would otherwise print as a
                              // solid block and invert the chart's meaning.
                              data-filled={level <= skill.proficiency ? "true" : "false"}
                              className="h-5 w-7 rounded-sm"
                              style={{
                                backgroundColor:
                                  level <= skill.proficiency
                                    ? PROFICIENCY_COLORS[skill.proficiency]
                                    : EMPTY_CELL,
                              }}
                            />
                          ))}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-sm font-semibold tabular-nums text-luxe-ink-soft">
                        {skill.yearsOfExperience}y
                      </td>
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </div>

        <p className="mt-6 border-t border-luxe-hairline pt-4 text-xs text-luxe-muted">
          Proficiency is a self-rating derived from content/skills.json; years count from first
          day-to-day use of each technology.
        </p>
      </div>
    </section>
  );
}
