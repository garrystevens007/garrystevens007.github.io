"use client";

import { Award, BarChart3, Briefcase, Download, Layers, UserRound } from "lucide-react";
import { RoleShell } from "@/components/layout/RoleShell";
import type { RoleNavItem } from "@/components/layout/RoleSidebar";
import { ProfileCard } from "./ProfileCard";
import { SkillsBrowser } from "./SkillsBrowser";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { AchievementsMetrics } from "./AchievementsMetrics";
import { EducationCard } from "./EducationCard";
import { DownloadSection } from "./DownloadSection";

const nav: RoleNavItem[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "education", label: "Education", icon: Award },
  { id: "download", label: "Download CV", icon: Download },
];

export function HrDashboard() {
  return (
    <RoleShell role="hr" nav={nav} variant="warm">
      <div className="space-y-12">
        <ProfileCard />
        <SkillsBrowser />
        <ExperienceTimeline />
        <AchievementsMetrics />
        <EducationCard />
        <DownloadSection />
      </div>
    </RoleShell>
  );
}
