"use client";

import { BarChart3, FolderGit2, Layers, Trophy, Webhook } from "lucide-react";
import { RoleShell } from "@/components/layout/RoleShell";
import type { RoleNavItem } from "@/components/layout/RoleSidebar";
import { GameProvider } from "@/context/GameContext";
import { AchievementDashboard } from "./AchievementDashboard";
import { LeaderboardStats } from "./LeaderboardStats";
import { GamifiedApiPlayground } from "./GamifiedApiPlayground";
import { GameNotifications } from "./GameHud";
import { SkillsShowcase } from "./SkillsShowcase";
import { ProjectsHighlight } from "./ProjectsHighlight";

const nav: RoleNavItem[] = [
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "stats", label: "Leaderboard", icon: BarChart3 },
  { id: "playground", label: "API Playground", icon: Webhook },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "projects", label: "Projects", icon: FolderGit2 },
];

export function TechnicalDashboard() {
  return (
    // GameProvider wraps only this dashboard — the score is meaningless
    // anywhere else, and scoping it here means switching roles genuinely
    // resets the session the way the spec describes.
    <GameProvider>
      <RoleShell role="technical" nav={nav} variant="dark">
        <div className="space-y-12">
          <AchievementDashboard />
          <LeaderboardStats />
          <GamifiedApiPlayground />
          <SkillsShowcase />
          <ProjectsHighlight />
        </div>
      </RoleShell>
      <GameNotifications />
    </GameProvider>
  );
}
