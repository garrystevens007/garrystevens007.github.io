import type { Metadata } from "next";
import { TechnicalDashboard } from "@/components/dashboards/technical/TechnicalDashboard";

export const metadata: Metadata = {
  title: "Technical Dashboard — Garry Stevens",
  description:
    "Backend engineer showcase: achievement badges, leaderboard stats, and a gamified mock API playground.",
};

export default function TechnicalDashboardPage() {
  return <TechnicalDashboard />;
}
