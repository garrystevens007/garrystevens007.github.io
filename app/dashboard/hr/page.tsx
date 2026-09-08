import type { Metadata } from "next";
import { HrDashboard } from "@/components/dashboards/hr/HrDashboard";

export const metadata: Metadata = {
  title: "HR Dashboard — Garry Stevens",
  description:
    "Recruitment-focused view: searchable skills, filterable experience timeline, education, and CV downloads.",
};

export default function HrDashboardPage() {
  return <HrDashboard />;
}
