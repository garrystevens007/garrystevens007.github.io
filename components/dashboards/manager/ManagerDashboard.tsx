"use client";

import { BarChart3, Building2, CalendarDays, Download, Grid3x3, LayoutDashboard } from "lucide-react";
import { RoleShell } from "@/components/layout/RoleShell";
import type { RoleNavItem } from "@/components/layout/RoleSidebar";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { KPIDashboard } from "./KPIDashboard";
import { CareerTimeline } from "./CareerTimeline";
import { ProficiencyMatrix } from "./ProficiencyMatrix";
import { ExperienceOverview } from "./ExperienceOverview";
import { ExportSection } from "./ExportSection";

const nav: RoleNavItem[] = [
  { id: "summary", label: "Summary", icon: LayoutDashboard },
  { id: "kpis", label: "KPIs", icon: BarChart3 },
  { id: "timeline", label: "Career Timeline", icon: CalendarDays },
  { id: "proficiency", label: "Proficiency", icon: Grid3x3 },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "export", label: "Export", icon: Download },
];

export function ManagerDashboard() {
  return (
    <RoleShell role="manager" nav={nav} variant="luxe">
      <div className="space-y-16">
        <ExecutiveSummary />
        <KPIDashboard />
        <CareerTimeline />
        <ProficiencyMatrix />
        <ExperienceOverview />
        <ExportSection />
      </div>
    </RoleShell>
  );
}
