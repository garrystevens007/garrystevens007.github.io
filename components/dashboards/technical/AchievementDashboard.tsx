"use client";

import { useGame } from "@/context/GameContext";
import { metrics, secretEndpoints } from "@/lib/data";

type Badge = {
  id: string;
  icon: string;
  name: string;
  description: string;
  requirement: string;
  /** 0-100. 100 means unlocked. */
  progress: number;
};

function pct(current: number, target: number) {
  return Math.min(100, Math.round((current / target) * 100));
}

export function AchievementDashboard() {
  const { triedEndpointIds, unlockedSecrets } = useGame();

  // Career badges unlock from content/metrics.json thresholds. Session badges
  // unlock live from what you do in the playground below — that's what the
  // spec's "Unlock more by exploring the API!" is actually pointing at.
  const careerBadges: Badge[] = [
    {
      id: "security-hero",
      icon: "🔐",
      name: "Security Hero",
      description: "Resolved 8+ vulnerabilities",
      requirement: "8+ security fixes",
      progress: pct(metrics.securityFixes, 8),
    },
    {
      id: "feature-shipper",
      icon: "🚀",
      name: "Feature Shipped",
      description: "50+ features deployed",
      requirement: "50+ features shipped",
      progress: pct(metrics.featuresShipped, 50),
    },
    {
      id: "bug-squasher",
      icon: "🐛",
      name: "Bug Squasher",
      description: "150+ bugs fixed",
      requirement: "150+ bugs fixed",
      progress: pct(metrics.bugsFixed, 150),
    },
    {
      id: "code-reviewer",
      icon: "📝",
      name: "Code Reviewer",
      description: "200+ code reviews",
      requirement: "200+ code reviews",
      progress: pct(metrics.codeReviews, 200),
    },
    {
      id: "reliability",
      icon: "🏆",
      name: "System Reliability",
      description: "99.8%+ uptime",
      requirement: "99.8%+ uptime achieved",
      progress: pct(metrics.productionUptime, 99.8),
    },
  ];

  const sessionBadges: Badge[] = [
    {
      id: "explorer",
      icon: "🧭",
      name: "The Explorer",
      description: "Tried 5 different endpoints",
      requirement: secretEndpoints[0].unlockLabel,
      progress: pct(triedEndpointIds.length, 5),
    },
    {
      id: "hacker",
      icon: "⚡",
      name: "Method Mixer",
      description: "Used both POST and GET",
      requirement: secretEndpoints[1].unlockLabel,
      progress: unlockedSecrets.includes("hacker-stats") ? 100 : 0,
    },
    {
      id: "speedrunner",
      icon: "🏃",
      name: "Speedrunner",
      description: "3 requests in under 10 seconds",
      requirement: secretEndpoints[2].unlockLabel,
      progress: unlockedSecrets.includes("speedrun") ? 100 : 0,
    },
  ];

  const unlockedCount = [...careerBadges, ...sessionBadges].filter((b) => b.progress >= 100).length;

  return (
    <section id="achievements" className="scroll-mt-24" aria-labelledby="achievements-heading">
      <div className="mb-6">
        <h1 id="achievements-heading" className="text-3xl font-bold text-white">
          Achievements
        </h1>
        <p className="mt-1 text-sm italic text-gray-400">
          {unlockedCount} of {careerBadges.length + sessionBadges.length} unlocked — unlock more by
          exploring the API below!
        </p>
      </div>

      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Career</h3>
      <ul className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {careerBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </ul>

      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">This session</h3>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {sessionBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </ul>

      <p className="mt-4 text-xs text-gray-500">
        Career badges are thresholds over {metrics.disclaimer.toLowerCase()}
      </p>
    </section>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const unlocked = badge.progress >= 100;

  if (unlocked) {
    return (
      <li className="group relative animate-pop-in rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 p-5 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50">
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-600 to-pink-400 opacity-0 blur transition group-hover:opacity-30"
        />
        <div className="relative">
          <div className="mb-2 text-4xl" aria-hidden="true">
            {badge.icon}
          </div>
          <h4 className="mb-1 font-bold text-white">{badge.name}</h4>
          <p className="text-xs text-pink-100">{badge.description}</p>
          <p className="mt-2 text-xl text-white" aria-label="Unlocked">
            ✓
          </p>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 p-5 text-center opacity-70 transition hover:opacity-90">
      <div className="mb-2 text-4xl grayscale" aria-hidden="true">
        {badge.icon}
      </div>
      <h4 className="mb-1 font-bold text-gray-300">{badge.name}</h4>
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-600">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-500"
          style={{ width: `${badge.progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">{badge.requirement}</p>
      <p className="mt-1 text-xs text-gray-500">{badge.progress}% complete</p>
    </li>
  );
}
