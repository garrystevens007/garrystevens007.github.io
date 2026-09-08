"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import { proficiencyLabels, skillCategoryNames, skillDetails } from "@/lib/data";

type SortKey = "proficiency" | "years" | "alphabetical";

const SORT_LABELS: Record<SortKey, string> = {
  proficiency: "Proficiency (high → low)",
  years: "Years of experience",
  alphabetical: "Alphabetical",
};

const inputClass =
  "w-full rounded-xl border border-hr-border bg-hr-card px-4 py-2.5 text-sm text-hr-ink placeholder:text-hr-muted/70 transition focus:border-hr-accent focus:outline-none focus:ring-2 focus:ring-hr-accent/30";

export function SkillsBrowser() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("proficiency");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    // Filters are AND-ed, per the spec's "Multiple filters: AND logic".
    const filtered = skillDetails.filter((skill) => {
      const matchesCategory = category === "all" || skill.category === category;
      const matchesQuery =
        needle.length === 0 ||
        skill.name.toLowerCase().includes(needle) ||
        skill.category.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "alphabetical") return a.name.localeCompare(b.name);
      if (sort === "years") return b.yearsOfExperience - a.yearsOfExperience || b.level - a.level;
      return b.level - a.level || a.name.localeCompare(b.name);
    });
  }, [category, query, sort]);

  return (
    <section aria-labelledby="skills-heading">
      <SectionHeader
        id="skills"
        title="Skills Browser"
        subtitle={`${skillDetails.length} technical skills, filterable by category and searchable by name.`}
      />
      <h2 id="skills-heading" className="sr-only">
        Skills Browser
      </h2>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <FilterChip
          label="All Skills"
          isActive={category === "all"}
          onClick={() => setCategory("all")}
        />
        {skillCategoryNames.map((name) => (
          <FilterChip
            key={name}
            label={name}
            isActive={category === name}
            onClick={() => setCategory(name)}
          />
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hr-muted"
            aria-hidden="true"
          />
          <label htmlFor="skill-search" className="sr-only">
            Search skills
          </label>
          <input
            id="skill-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills…"
            className={`${inputClass} pl-10`}
          />
        </div>
        <div className="sm:w-64">
          <label htmlFor="skill-sort" className="sr-only">
            Sort skills
          </label>
          <select
            id="skill-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className={inputClass}
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                Sort: {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hr-border-strong bg-hr-canvas-2 p-10 text-center">
          <p className="text-hr-muted">No skills found in this category</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((skill) => (
            <li
              key={`${skill.category}-${skill.name}`}
              className="group relative overflow-hidden rounded-2xl border border-hr-border bg-hr-card p-5 shadow-warm transition hover:-translate-y-0.5 hover:border-hr-accent/40 hover:shadow-warm-lg"
            >
              {/* Left rail fills in on hover — a quiet way to make the whole
                  card feel interactive without adding a visible button. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-hr-accent-from to-hr-accent-to transition-transform duration-300 group-hover:scale-y-100"
              />

              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-hr-ink">{skill.name}</h3>
                  <p className="mt-0.5 text-xs text-hr-muted">{skill.category}</p>
                </div>
                <span
                  className="flex-shrink-0 rounded-full bg-hr-accent-soft/70 px-2.5 py-1 text-xs font-bold text-hr-accent-ink"
                  title={`${skill.yearsOfExperience} years of hands-on experience`}
                >
                  {skill.yearsOfExperience}y
                </span>
              </div>

              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-hr-muted">Proficiency</span>
                <span className="text-xs font-semibold text-hr-ink">
                  {proficiencyLabels[skill.proficiency]}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-hr-canvas-2"
                role="img"
                aria-label={`${skill.name}: ${proficiencyLabels[skill.proficiency]}, self-rated ${skill.level} out of 100`}
              >
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-hr-accent-from to-hr-accent-to transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {skill.roles > 0 && (
                <p className="mt-3 text-xs text-hr-muted">
                  Used in {skill.roles} {skill.roles === 1 ? "role" : "roles"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-hr-muted">
        Proficiency is a self-rating; years are counted from when each technology first entered
        day-to-day use.
      </p>
    </section>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-hr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-hr-canvas ${
        isActive
          ? "bg-gradient-to-r from-hr-accent-from to-hr-accent-to text-white shadow-teal"
          : "border border-hr-border bg-hr-card text-hr-ink-soft hover:border-hr-accent/40 hover:text-hr-accent"
      }`}
    >
      {label}
    </button>
  );
}
