import type { Metadata } from "next";
import { ManagerDashboard } from "@/components/dashboards/manager/ManagerDashboard";

export const metadata: Metadata = {
  title: "Manager Dashboard — Garry Stevens",
  description:
    "Executive view: KPIs, delivery and quality charts, career timeline, proficiency matrix, and data exports.",
};

export default function ManagerDashboardPage() {
  return <ManagerDashboard />;
}
