"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { RedirectSplash } from "@/components/layout/RedirectSplash";
import { ROLE_CONFIG } from "@/lib/roles";

// /dashboard with no role segment — resolve it to the stored role's dashboard,
// or send the visitor to the picker if they haven't chosen one.
export default function DashboardIndex() {
  const router = useRouter();
  const { selectedRole, isLoading } = useRole();

  useEffect(() => {
    if (isLoading) return;
    router.replace(selectedRole ? ROLE_CONFIG[selectedRole].href : "/roles");
  }, [isLoading, selectedRole, router]);

  return <RedirectSplash />;
}
