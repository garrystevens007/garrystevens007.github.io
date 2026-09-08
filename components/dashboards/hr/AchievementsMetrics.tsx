import { Bug, Code2, Eye, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import { metrics } from "@/lib/data";

const cards: Array<{ icon: LucideIcon; label: string; value: number; caption: string }> = [
  {
    icon: Code2,
    label: "Lines of Code",
    value: metrics.linesOfCode,
    caption: "Production code written",
  },
  {
    icon: Bug,
    label: "Bugs Fixed",
    value: metrics.bugsFixed,
    caption: "Critical and minor issues resolved",
  },
  {
    icon: ShieldCheck,
    label: "Vulnerabilities Resolved",
    value: metrics.securityFixes,
    caption: "Security fixes and hardening",
  },
  {
    icon: Rocket,
    label: "Features Shipped",
    value: metrics.featuresShipped,
    caption: "Completed and deployed",
  },
  {
    icon: Eye,
    label: "Code Reviews",
    value: metrics.codeReviews,
    caption: "Code quality assurance",
  },
];

export function AchievementsMetrics() {
  return (
    <section aria-labelledby="metrics-heading">
      <SectionHeader
        id="metrics"
        title="Achievements & Metrics"
        subtitle="Quantified impact and contributions"
      />
      <h2 id="metrics-heading" className="sr-only">
        Achievements and Metrics
      </h2>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <li
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-hr-border bg-hr-card p-5 text-center shadow-warm transition hover:-translate-y-1 hover:border-hr-accent/40 hover:shadow-warm-lg"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-hr-accent/5 blur-2xl transition group-hover:bg-hr-accent/15"
              />
              <span className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-hr-accent-from to-hr-accent-to shadow-teal">
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <p className="relative mb-1 text-2xl font-bold tabular-nums text-hr-ink md:text-3xl">
                {card.value.toLocaleString()}
                {card.label === "Lines of Code" && "+"}
              </p>
              <p className="relative text-sm font-semibold text-hr-ink-soft">{card.label}</p>
              <p className="relative mt-1 text-xs text-hr-muted">{card.caption}</p>
            </li>
          );
        })}
      </ul>

      {/* Rendered from content/metrics.json so these figures are never
          presented as audited facts. See that file's `_provenance` note. */}
      <p className="mt-4 text-xs text-hr-muted">{metrics.disclaimer}</p>
    </section>
  );
}
