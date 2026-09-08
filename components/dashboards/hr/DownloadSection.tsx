"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileDown } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import {
  education,
  experience,
  profile,
  resumeUrl,
  skillDetails,
  socials,
  yearsOfExperience,
  type EmploymentType,
} from "@/lib/data";
import {
  downloadTextFile,
  employmentTypeLabels,
  formatDuration,
  formatMonthYear,
  todayIso,
} from "@/lib/role-utils";

const companies = Array.from(new Set(experience.map((role) => role.company)));
const skillNames = Array.from(new Set(skillDetails.map((skill) => skill.name))).sort();
const types = Array.from(new Set(experience.map((role) => role.type)));

type Filter =
  | { kind: "skill"; value: string }
  | { kind: "company"; value: string }
  | { kind: "type"; value: EmploymentType };

/**
 * The spec has these buttons POST filter params to `scripts/build_resume.py`.
 * This site is a static export with no server, so rather than pretend to
 * filter and hand back the same unfiltered PDF, the filtered exports are
 * genuinely built here in the browser as Markdown. The full CV button below
 * still serves the real pre-generated PDF.
 */
function buildFilteredResume(filter: Filter): { filename: string; body: string } {
  const roles = experience.filter((role) => {
    if (filter.kind === "company") return role.company === filter.value;
    if (filter.kind === "type") return role.type === filter.value;
    return role.skills.includes(filter.value);
  });

  const label =
    filter.kind === "type" ? employmentTypeLabels[filter.value as EmploymentType] : filter.value;

  const lines: string[] = [
    `# ${profile.name}`,
    "",
    `**${profile.title}** · ${profile.location}`,
    `${profile.email} · ${socials.linkedin} · ${socials.github}`,
    "",
    `> Filtered view — ${filter.kind}: **${label}**. Generated ${todayIso()} from ${profile.name}'s portfolio.`,
    "",
    "## Summary",
    "",
    profile.summary,
    "",
    `${yearsOfExperience}+ years of backend engineering experience.`,
    "",
    "## Experience",
    "",
  ];

  if (roles.length === 0) {
    lines.push(`_No roles match this filter._`, "");
  } else {
    roles.forEach((role) => {
      lines.push(
        `### ${role.role} — ${role.company}`,
        "",
        `${formatMonthYear(role.start)} – ${role.end ? formatMonthYear(role.end) : "Present"} · ${formatDuration(role.start, role.end)} · ${role.location} · ${employmentTypeLabels[role.type]}`,
        "",
        role.summary,
        ""
      );
      role.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
      lines.push("", `**Skills:** ${role.skills.join(", ")}`, "");
    });
  }

  if (filter.kind === "skill") {
    const detail = skillDetails.find((skill) => skill.name === filter.value);
    if (detail) {
      lines.push(
        "## Skill detail",
        "",
        `**${detail.name}** (${detail.category}) — ${detail.yearsOfExperience} years, self-rated ${detail.level}/100.`,
        ""
      );
    }
  }

  lines.push(
    "## Education",
    "",
    `${education.degree}, ${education.school} — ${education.location} (${education.period})`,
    ""
  );

  const slug = String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    filename: `Garry-Stevens-${filter.kind}-${slug}.md`,
    body: lines.join("\n"),
  };
}

export function DownloadSection() {
  const [skill, setSkill] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleFiltered = useCallback(
    (filter: Filter | null, what: string) => {
      if (!filter) {
        showToast(`Pick a ${what} first`);
        return;
      }
      const { filename, body } = buildFilteredResume(filter);
      downloadTextFile(filename, body, "text/markdown");
      showToast("Filtered summary downloaded");
    },
    [showToast]
  );

  return (
    <section aria-labelledby="download-heading">
      <SectionHeader
        id="download"
        title="Download & Export"
        subtitle="Take the full CV, or generate a summary narrowed to what you're hiring for."
      />
      <h2 id="download-heading" className="sr-only">
        Download and Export
      </h2>

      <a
        href={resumeUrl}
        download
        onClick={() => showToast("CV downloaded")}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-hr-accent-from to-hr-accent-to px-6 py-4 font-bold text-white shadow-teal transition hover:from-hr-accent-to hover:to-hr-accent-from focus:outline-none focus-visible:ring-2 focus-visible:ring-hr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-hr-canvas"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        Download Full CV (PDF)
      </a>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ExportCard
          title="Filter by Skill"
          selectId="export-skill"
          value={skill}
          onChange={setSkill}
          placeholder="Select a skill…"
          options={skillNames.map((name) => ({ value: name, label: name }))}
          onDownload={() => handleFiltered(skill ? { kind: "skill", value: skill } : null, "skill")}
        />
        <ExportCard
          title="Filter by Company"
          selectId="export-company"
          value={company}
          onChange={setCompany}
          placeholder="Select a company…"
          options={companies.map((name) => ({ value: name, label: name }))}
          onDownload={() =>
            handleFiltered(company ? { kind: "company", value: company } : null, "company")
          }
        />
        <ExportCard
          title="Filter by Role Type"
          selectId="export-type"
          value={type}
          onChange={setType}
          placeholder="Select a type…"
          options={types.map((value) => ({ value, label: employmentTypeLabels[value] }))}
          onDownload={() =>
            handleFiltered(type ? { kind: "type", value: type as EmploymentType } : null, "type")
          }
        />
      </div>

      <p className="mt-4 text-xs text-hr-muted">
        Filtered exports are generated in your browser as Markdown — the site is fully static, so
        nothing you select here is sent anywhere.
      </p>

      {/* Polite, not assertive: these are confirmations, not warnings. */}
      <div aria-live="polite" className="sr-only">
        {toast}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up rounded-xl bg-hr-ink px-4 py-3 text-sm font-semibold text-hr-card shadow-warm-lg">
          {toast}
        </div>
      )}
    </section>
  );
}

function ExportCard({
  title,
  selectId,
  value,
  onChange,
  placeholder,
  options,
  onDownload,
}: {
  title: string;
  selectId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onDownload: () => void;
}) {
  return (
    <div className="rounded-2xl border border-hr-border bg-hr-card p-5 shadow-warm transition hover:border-hr-accent/30">
      <label htmlFor={selectId} className="mb-3 block font-semibold text-hr-ink">
        {title}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mb-3 w-full rounded-xl border border-hr-border bg-hr-canvas px-3.5 py-2.5 text-sm text-hr-ink transition focus:border-hr-accent focus:outline-none focus:ring-2 focus:ring-hr-accent/30"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onDownload}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-hr-accent/30 bg-hr-accent-tint px-4 py-2.5 text-sm font-semibold text-hr-accent-ink transition hover:bg-hr-accent hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-hr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-hr-canvas"
      >
        <FileDown className="h-4 w-4" aria-hidden="true" />
        Download
      </button>
    </div>
  );
}
