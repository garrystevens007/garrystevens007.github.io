import {
  Bug,
  Building2,
  CalendarDays,
  Eye,
  Gauge,
  Rocket,
  ShieldCheck,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import { companiesWorked, metrics, profile, yearsOfExperience } from "@/lib/data";

type Card = {
  icon: LucideIcon;
  label: string;
  value: string;
  context: string;
  /** Derived from real content rather than from content/metrics.json. */
  derived?: boolean;
};

const cards: Card[] = [
  {
    icon: CalendarDays,
    label: "Career Duration",
    // Computed from backendExperienceStartDate, not hardcoded — the spec's
    // "7+ years" predates the correction to 4+ and would contradict both the
    // resume and the rest of this site.
    value: `${yearsOfExperience}+`,
    context: "Years, backend engineering",
    derived: true,
  },
  {
    icon: Building2,
    label: "Organisations",
    value: String(companiesWorked),
    context: "Counted from the career timeline",
    derived: true,
  },
  {
    icon: Rocket,
    label: "Features Shipped",
    value: metrics.featuresShipped.toLocaleString(),
    context: "Production ready",
  },
  {
    icon: TestTube2,
    label: "Test Coverage",
    value: `${metrics.testCoverage}%`,
    context: `Target ${metrics.testCoverageTarget}%`,
  },
  {
    icon: Gauge,
    label: "Production Uptime",
    value: `${metrics.productionUptime}%`,
    context: "Reliability focus",
  },
  {
    icon: ShieldCheck,
    label: "Security Fixes",
    value: String(metrics.securityFixes),
    context: "Critical vulnerabilities",
  },
  {
    icon: Eye,
    label: "Code Reviews",
    value: metrics.codeReviews.toLocaleString(),
    context: "Quality assurance",
  },
  {
    icon: Bug,
    label: "Bugs Fixed",
    value: metrics.bugsFixed.toLocaleString(),
    context: "Problem resolution",
  },
];

export function ExecutiveSummary() {
  const asOf = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="summary" className="scroll-mt-24" aria-labelledby="summary-heading">
      {/* Masthead. A thin gold rule and letter-spaced small caps do most of
          the "executive document" work here — the serif name carries the rest. */}
      <header className="mb-10 border-b border-luxe-hairline pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-luxe-gold">
          Executive Summary
        </p>
        <h1
          id="summary-heading"
          className="mt-3 font-display text-4xl font-semibold tracking-tight text-luxe-ink md:text-5xl"
        >
          {profile.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-luxe-muted">
          <span className="text-luxe-ink-soft">{profile.title}</span>
          <span aria-hidden="true" className="h-3 w-px bg-luxe-hairline-strong" />
          <span>{profile.location}</span>
          <span aria-hidden="true" className="h-3 w-px bg-luxe-hairline-strong" />
          <span>As of {asOf}</span>
        </div>
        <span
          aria-hidden="true"
          className="mt-6 block h-px w-24 bg-gradient-to-r from-luxe-gold to-transparent"
        />
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-luxe-hairline bg-luxe-hairline sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            // A 1px gap over a hairline-coloured backdrop gives a hairline
            // grid between cells — cleaner on a dark surface than eight
            // separately-bordered boxes with visible gutters.
            <li
              key={card.label}
              className="group relative bg-luxe-card p-6 transition-colors duration-300 hover:bg-luxe-card-2 print-break-inside-avoid"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-luxe-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-luxe-gold/25 bg-luxe-gold-tint">
                  <Icon className="h-4 w-4 text-luxe-gold" aria-hidden="true" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-luxe-muted">
                  {card.label}
                </p>
              </div>
              <p className="font-display text-4xl font-semibold tabular-nums text-luxe-ink">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-luxe-muted">{card.context}</p>
              {card.derived && (
                <span className="mt-3 inline-block rounded-full border border-luxe-gold/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-luxe-gold/80">
                  Computed
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-luxe-muted">
        Cards marked <span className="text-luxe-gold/80">Computed</span> are derived from the career
        timeline. All other figures: {metrics.disclaimer.toLowerCase()}
      </p>
    </section>
  );
}
