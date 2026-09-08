import { proficiencyLabels, skillDetails } from "@/lib/data";

export function SkillsShowcase() {
  const ranked = [...skillDetails].sort((a, b) => b.level - a.level);

  return (
    <section id="skills" className="scroll-mt-24" aria-labelledby="tech-skills-heading">
      <div className="mb-6">
        <h2 id="tech-skills-heading" className="text-2xl font-bold text-white">
          Skills Showcase
        </h2>
        <p className="mt-1 text-sm text-gray-400">Mastery across the stack</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ranked.map((skill) => (
          <li
            key={`${skill.category}-${skill.name}`}
            className="group rounded-lg border border-gray-700 bg-gray-800 p-3 transition hover:border-pink-500"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white transition group-hover:text-pink-400">
                {skill.name}
              </h3>
              <span
                className="text-yellow-400"
                role="img"
                aria-label={`${proficiencyLabels[skill.proficiency]} — ${skill.proficiency} of 5`}
              >
                {"★".repeat(skill.proficiency)}
                <span className="text-gray-600">{"★".repeat(5 - skill.proficiency)}</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
              <span className="truncate rounded bg-gray-700 px-2 py-1">{skill.category}</span>
              <span className="flex-shrink-0">{skill.yearsOfExperience}y exp</span>
            </div>

            {skill.roles > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Used in {skill.roles} {skill.roles === 1 ? "role" : "roles"}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
