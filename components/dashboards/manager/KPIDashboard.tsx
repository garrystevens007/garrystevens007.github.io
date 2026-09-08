"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionHeader } from "@/components/layout/RoleShell";
import { metrics } from "@/lib/data";

// Chart chrome tuned for the near-black canvas: a light grid would glare, so
// the gridlines sit just above the card colour and the axes use muted text.
const ICE = "#8FB8C9";
const ROSE = "#C08497";

const grid = { strokeDasharray: "2 6", stroke: "#2A2A30" } as const;
const axis = { stroke: "#6E6E78", fontSize: 11, tickLine: false, axisLine: false } as const;
const tooltipStyle = {
  backgroundColor: "#1C1C22",
  border: "1px solid #3A3A44",
  borderRadius: 10,
  fontSize: 12,
  color: "#F5F3EF",
} as const;
const tooltipItemStyle = { color: "#F5F3EF" } as const;
const tooltipLabelStyle = { color: "#8A8A94", marginBottom: 4 } as const;

export function KPIDashboard() {
  const totalFeatures = metrics.featuresPerYear.reduce((sum, row) => sum + row.features, 0);
  const avgPerYear = Math.round(totalFeatures / Math.max(1, metrics.featuresPerYear.length));
  const coverageStart = metrics.testCoverageTrend[0]?.coverage ?? 0;
  const coverageNow = metrics.testCoverageTrend.at(-1)?.coverage ?? metrics.testCoverage;

  return (
    <section aria-labelledby="kpi-heading">
      <SectionHeader
        id="kpis"
        eyebrow="Performance"
        title="Key Performance Indicators"
        subtitle="Delivery, quality, reliability and security over time"
        variant="luxe"
      />
      <h2 id="kpi-heading" className="sr-only">
        Key Performance Indicators
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Delivery Velocity"
          subtitle="Features shipped per year"
          headline={String(totalFeatures)}
          footer={[
            ["Avg per year", `${avgPerYear} features`],
            ["Total tracked", `${totalFeatures} features`],
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.featuresPerYear} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8C87E" />
                  <stop offset="100%" stopColor="#C9A227" />
                </linearGradient>
              </defs>
              <CartesianGrid {...grid} vertical={false} />
              <XAxis dataKey="year" {...axis} />
              <YAxis {...axis} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipLabelStyle}
                cursor={{ fill: "rgba(212,175,55,0.08)" }}
              />
              <Bar
                dataKey="features"
                name="Features shipped"
                fill="url(#goldBar)"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Code Quality"
          subtitle="Test coverage over time"
          headline={`${coverageNow}%`}
          footer={[
            ["Target", `${metrics.testCoverageTarget}%`],
            [
              "Change",
              `${coverageNow >= coverageStart ? "+" : ""}${coverageNow - coverageStart} pts across the tracked window`,
            ],
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.testCoverageTrend} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid {...grid} vertical={false} />
              <XAxis dataKey="period" {...axis} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} {...axis} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipLabelStyle}
                cursor={{ stroke: "#3A3A44" }}
                formatter={(value) => [`${Number(value)}%`, "Test coverage"]}
              />
              <Line
                type="monotone"
                dataKey="coverage"
                name="Test coverage"
                stroke={ICE}
                strokeWidth={2.5}
                dot={{ fill: "#16161A", stroke: ICE, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: ICE }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="System Reliability"
          subtitle="Production uptime"
          headline={`${metrics.productionUptime}%`}
          footer={[
            ["Industry standard", `${metrics.uptimeIndustryStandard}%`],
            [
              "Gap",
              `${(metrics.productionUptime - metrics.uptimeIndustryStandard).toFixed(1)} pts vs standard`,
            ],
          ]}
        >
          <UptimeGauge value={metrics.productionUptime} />
        </ChartCard>

        <ChartCard
          title="Security Posture"
          subtitle="Vulnerabilities resolved by severity"
          headline={String(metrics.securityFixes)}
          footer={[
            ["Highest severity addressed", metrics.vulnerabilitiesBySeverity[0]?.severity ?? "—"],
          ]}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.vulnerabilitiesBySeverity}
              margin={{ top: 5, right: 8, left: -22, bottom: 0 }}
            >
              <CartesianGrid {...grid} vertical={false} />
              <XAxis dataKey="severity" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipLabelStyle}
                cursor={{ fill: "rgba(192,132,151,0.08)" }}
              />
              <Bar
                dataKey="count"
                name="Vulnerabilities"
                fill={ROSE}
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <p className="mt-4 text-xs text-luxe-muted">{metrics.disclaimer}</p>
    </section>
  );
}

function ChartCard({
  title,
  subtitle,
  headline,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  headline: string;
  footer: Array<[string, string]>;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-luxe-hairline bg-luxe-card p-6 shadow-luxe transition-colors duration-300 hover:border-luxe-gold/30 print-break-inside-avoid">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-luxe-ink">{title}</h3>
          <p className="mt-0.5 text-sm text-luxe-muted">{subtitle}</p>
        </div>
        <span className="font-display text-3xl font-semibold tabular-nums text-luxe-gold">
          {headline}
        </span>
      </div>

      {/* Fixed height, because ResponsiveContainer resolves its own height as
          a percentage of the parent — a parent with auto height collapses it
          to zero and the chart renders nothing. The gauge card passes plain
          SVG rather than a Recharts chart, which is why the container is at
          the call site rather than wrapped around `children` here.  */}
      <div className="h-60 w-full">{children}</div>

      <dl className="mt-5 space-y-2 border-t border-luxe-hairline pt-4">
        {footer.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-sm text-luxe-muted">{label}</dt>
            <dd className="text-right text-sm font-semibold text-luxe-ink-soft">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function UptimeGauge({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  // strokeDasharray must be measured against the FULL circumference (2πr).
  // The spec's `Math.PI * 100` is only half of it, which would draw a 99.8%
  // arc as a bit over half the ring.
  const dash = (value / 100) * circumference;

  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 130 130" className="h-48 w-48" role="img" aria-label={`Uptime ${value}%`}>
        <defs>
          <linearGradient id="goldArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C87E" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>
        </defs>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#2A2A30" strokeWidth="6" />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="url(#goldArc)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 65 65)"
        />
        {/* SVG text takes its colour from `fill`, not `color`, so the print
            stylesheet's colour overrides can't reach it — these use Tailwind
            fill utilities with a print: variant so they flip on paper too. */}
        <text
          x="65"
          y="63"
          textAnchor="middle"
          fontSize="24"
          fontWeight="600"
          className="fill-luxe-ink print:fill-black"
          fontFamily="var(--font-playfair), Georgia, serif"
        >
          {value}%
        </text>
        <text
          x="65"
          y="80"
          textAnchor="middle"
          fontSize="8"
          className="fill-luxe-muted print:fill-neutral-600"
          letterSpacing="2"
        >
          UPTIME
        </text>
      </svg>
    </div>
  );
}
