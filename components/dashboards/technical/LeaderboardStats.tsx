"use client";

import { useGame } from "@/context/GameContext";
import { metrics, nextTierForPoints, tierForPoints } from "@/lib/data";

export function LeaderboardStats() {
  const { totalPoints } = useGame();
  const tier = tierForPoints(totalPoints);
  const nextTier = nextTierForPoints(totalPoints);

  const tierSpan = tier.maxPoints === Infinity ? 1 : tier.maxPoints - tier.minPoints + 1;
  const tierProgress =
    tier.maxPoints === Infinity
      ? 100
      : Math.min(100, Math.round(((totalPoints - tier.minPoints) / tierSpan) * 100));

  return (
    <section id="stats" className="scroll-mt-24" aria-labelledby="stats-heading">
      <div className="mb-6">
        <h2 id="stats-heading" className="text-2xl font-bold text-white">
          Leaderboard Stats
        </h2>
        <p className="mt-1 text-sm text-gray-400">Career numbers, plus your live playground score</p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <BarStat
          icon="💻"
          label="Lines of Code"
          value={metrics.linesOfCode}
          max={50000}
          suffix="+"
        />
        <BarStat icon="🐛" label="Bugs Fixed" value={metrics.bugsFixed} max={200} />
        <BarStat icon="🔐" label="Security Fixes" value={metrics.securityFixes} max={10} />
        <BarStat icon="🚀" label="Features Shipped" value={metrics.featuresShipped} max={100} />
        <GaugeStat icon="📈" label="Test Coverage" value={metrics.testCoverage} unit="% covered" />
        <GaugeStat icon="🏆" label="Production Uptime" value={metrics.productionUptime} unit="% uptime" />

        <li className="rounded-lg border border-pink-500 bg-gradient-to-br from-pink-600 to-pink-700 p-4 transition hover:shadow-lg hover:shadow-pink-600/50 sm:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              ⚡
            </span>
            <span className="text-sm font-semibold text-white">Real-time Score</span>
          </div>
          <p className="mb-1 text-4xl font-bold text-white">{totalPoints.toLocaleString()}</p>
          <p className="text-xs text-pink-100">
            pts this session · {tier.emoji} {tier.name}
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-pink-500/40">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-500"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-pink-100">
            {nextTier
              ? `${(nextTier.minPoints - totalPoints).toLocaleString()} pts to ${nextTier.emoji} ${nextTier.name}`
              : "Top tier reached — nothing left to unlock."}
          </p>
        </li>
      </ul>

      <p className="mt-4 text-xs text-gray-500">
        Career figures: {metrics.disclaimer.toLowerCase()} The score is session-only and resets on
        reload.
      </p>
    </section>
  );
}

function BarStat({
  icon,
  label,
  value,
  max,
  suffix = "",
}: {
  icon: string;
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <li className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition hover:border-pink-500">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <span className="text-sm font-semibold text-gray-300">{label}</span>
      </div>
      <p className="mb-3 text-3xl font-bold text-white">
        {value.toLocaleString()}
        {suffix}
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-700"
        role="img"
        aria-label={`${percent}% of ${max.toLocaleString()}`}
      >
        <div
          className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </li>
  );
}

function GaugeStat({ icon, label, value, unit }: { icon: string; label: string; value: number; unit: string }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Measured against the full circumference — the spec's `Math.PI * 100` is
  // only half a circle, which would draw 85% as roughly a 42% arc.
  const dash = (value / 100) * circumference;

  return (
    <li className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition hover:border-pink-500">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <span className="text-sm font-semibold text-gray-300">{label}</span>
      </div>
      <svg viewBox="0 0 120 120" className="mx-auto h-28 w-28" role="img" aria-label={`${label}: ${value}%`}>
        <defs>
          <linearGradient id={`grad-${label.replace(/\s+/g, "-")}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec407a" />
            <stop offset="100%" stopColor="#d81b60" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#374151" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#grad-${label.replace(/\s+/g, "-")})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">
          {value}%
        </text>
      </svg>
      <p className="mt-1 text-center text-xs text-gray-400">{unit}</p>
    </li>
  );
}
