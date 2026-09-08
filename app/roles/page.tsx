import type { Metadata } from "next";
import { RolePicker } from "@/components/roles/RolePicker";

export const metadata: Metadata = {
  title: "Who am I? — Garry Stevens",
  description: "Pick a role to see the portfolio tailored to how you read it.",
};

export default function RolesPage() {
  return <RolePicker />;
}
