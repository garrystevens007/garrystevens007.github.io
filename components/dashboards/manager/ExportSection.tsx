"use client";

import { useCallback } from "react";
import { Award, FileText, Sheet } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import {
  companiesWorked,
  education,
  experience,
  metrics,
  profile,
  proficiencyLabels,
  skillDetails,
  socials,
  yearsOfExperience,
} from "@/lib/data";
import {
  downloadTextFile,
  employmentTypeLabels,
  formatDuration,
  formatMonthYear,
  todayIso,
  toCsv,
} from "@/lib/role-utils";

export function ExportSection() {
  // No server to render a PDF on (static export), so "Export to PDF" is the
  // browser's own print dialog with a print stylesheet behind it — the
  // sidebar and buttons are hidden and cards avoid page breaks. Labelled
  // honestly rather than implying a server-generated document.
  const handlePrint = useCallback(() => window.print(), []);

  const handleCsv = useCallback(() => {
    const rows: Array<Array<string | number>> = [["Section", "Field", "Value"]];

    rows.push(["Profile", "Name", profile.name]);
    rows.push(["Profile", "Title", profile.title]);
    rows.push(["Profile", "Location", profile.location]);
    rows.push(["Profile", "Email", profile.email]);
    rows.push(["Profile", "LinkedIn", socials.linkedin]);
    rows.push(["Profile", "GitHub", socials.github]);
    rows.push(["Profile", "Years of backend experience", yearsOfExperience]);
    rows.push(["Profile", "Organisations", companiesWorked]);

    rows.push(["Education", education.degree, `${education.school} (${education.period})`]);

    experience.forEach((role) => {
      const prefix = `${role.company} — ${role.role}`;
      rows.push(["Experience", prefix, `${formatMonthYear(role.start)} to ${role.end ? formatMonthYear(role.end) : "Present"}`]);
      rows.push(["Experience", `${prefix} · tenure`, formatDuration(role.start, role.end)]);
      rows.push(["Experience", `${prefix} · location`, role.location]);
      rows.push(["Experience", `${prefix} · type`, employmentTypeLabels[role.type]]);
      rows.push(["Experience", `${prefix} · skills`, role.skills.join("; ")]);
    });

    skillDetails.forEach((skill) => {
      rows.push([
        "Skills",
        `${skill.category} · ${skill.name}`,
        `${proficiencyLabels[skill.proficiency]} (${skill.level}/100), ${skill.yearsOfExperience}y`,
      ]);
    });

    rows.push(["Metrics", "Lines of code", metrics.linesOfCode]);
    rows.push(["Metrics", "Bugs fixed (total)", metrics.bugsFixed]);
    rows.push(["Metrics", "Security fixes (total)", metrics.securityFixes]);
    rows.push(["Metrics", "Features shipped (total)", metrics.featuresShipped]);
    rows.push(["Metrics", "Code reviews (total)", metrics.codeReviews]);
    rows.push(["Metrics", "Test coverage %", metrics.testCoverage]);
    rows.push(["Metrics", "Production uptime %", metrics.productionUptime]);
    rows.push(["Metrics", "Disclaimer", metrics.disclaimer]);

    downloadTextFile(`Garry-Stevens-metrics-${todayIso()}.csv`, toCsv(rows), "text/csv");
  }, []);

  const handleSummary = useCallback(() => {
    const current = experience[0];
    const lines = [
      `# Executive Summary — ${profile.name}`,
      "",
      `**${profile.title}** · ${profile.location} · ${profile.email}`,
      `Generated ${todayIso()} from ${socials.github.replace(/^https?:\/\//, "")}`,
      "",
      "## Profile",
      "",
      profile.summary,
      "",
      `- ${yearsOfExperience}+ years of backend engineering experience`,
      `- ${companiesWorked} organisations; currently ${current.role} at ${current.company}`,
      `- ${education.degree}, ${education.school} (${education.period})`,
      "",
      "## Headline metrics",
      "",
      `| Metric | Value |`,
      `| --- | --- |`,
      `| Features shipped | ${metrics.featuresShipped} |`,
      `| Bugs fixed | ${metrics.bugsFixed} |`,
      `| Code reviews | ${metrics.codeReviews} |`,
      `| Security fixes | ${metrics.securityFixes} |`,
      `| Test coverage | ${metrics.testCoverage}% (target ${metrics.testCoverageTarget}%) |`,
      `| Production uptime | ${metrics.productionUptime}% |`,
      "",
      `_${metrics.disclaimer}_`,
      "",
      "## Career",
      "",
    ];

    experience.forEach((role) => {
      lines.push(
        `**${role.role} — ${role.company}** (${formatMonthYear(role.start)}–${role.end ? formatMonthYear(role.end) : "Present"}, ${formatDuration(role.start, role.end)})`,
        "",
        role.summary,
        ""
      );
    });

    const strongest = [...skillDetails].sort((a, b) => b.level - a.level).slice(0, 6);
    lines.push(
      "## Strongest technologies",
      "",
      ...strongest.map(
        (skill) =>
          `- **${skill.name}** — ${proficiencyLabels[skill.proficiency]}, ${skill.yearsOfExperience}y`
      ),
      ""
    );

    downloadTextFile(`Garry-Stevens-executive-summary-${todayIso()}.md`, lines.join("\n"), "text/markdown");
  }, []);

  return (
    <section aria-labelledby="export-heading" className="print-hide">
      <SectionHeader
        id="export"
        eyebrow="Distribution"
        title="Export & Download"
        subtitle="Export dashboard insights and data"
        variant="luxe"
      />
      <h2 id="export-heading" className="sr-only">
        Export and Download
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ExportCard
          icon={FileText}
          title="Dashboard PDF"
          description="Full dashboard with charts"
          buttonLabel="Print / Save as PDF"
          primary
          note="Opens your browser's print dialog with a light print layout applied — choose “Save as PDF”."
          onClick={handlePrint}
        />
        <ExportCard
          icon={Sheet}
          title="Data Export (CSV)"
          description="Raw metrics and experience"
          buttonLabel="Export to CSV"
          note="Includes profile, education, experience, per-company metrics and every skill rating."
          onClick={handleCsv}
        />
        <ExportCard
          icon={Award}
          title="Executive Summary"
          description="One-page professional brief"
          buttonLabel="Generate Summary"
          note="Markdown brief: profile, headline metrics, career history and strongest technologies."
          onClick={handleSummary}
        />
      </div>
    </section>
  );
}

function ExportCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  note,
  onClick,
  primary = false,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  buttonLabel: string;
  note: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-luxe-hairline bg-luxe-card p-6 shadow-luxe transition-colors duration-300 hover:border-luxe-gold/30">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-luxe-gold/25 bg-luxe-gold-tint">
          <Icon className="h-4 w-4 text-luxe-gold" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-luxe-ink">{title}</h3>
          <p className="text-sm text-luxe-muted">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-luxe-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxe-canvas ${
          primary
            ? "bg-gradient-to-r from-luxe-gold-from to-luxe-gold-to text-luxe-canvas shadow-gold hover:brightness-110"
            : "border border-luxe-gold/30 bg-luxe-gold-tint text-luxe-gold hover:bg-luxe-gold hover:text-luxe-canvas"
        }`}
      >
        {buttonLabel}
      </button>
      <p className="mt-3 flex-1 text-xs text-luxe-muted">{note}</p>
    </div>
  );
}
