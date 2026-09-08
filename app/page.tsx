"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { RedirectSplash } from "@/components/layout/RedirectSplash";
import { ROLE_CONFIG } from "@/lib/roles";

// Entry point. Sends a returning visitor straight back to the dashboard they
// last picked, and a first-time visitor to the role picker.
//
// The redirect is client-side because the site is a static export — there is
// no server to issue a 302, and next/navigation's redirect() would be
// evaluated at build time, baking in whichever branch was true then. The
// splash below covers the one frame this costs; the original single-page
// portfolio is still available at /portfolio.
export default function Home() {
  const router = useRouter();
  const { selectedRole, isLoading } = useRole();

  useEffect(() => {
    // Wait for localStorage to be read, or a returning visitor gets bounced
    // to /roles before their saved role is even known.
    if (isLoading) return;
    router.replace(selectedRole ? ROLE_CONFIG[selectedRole].href : "/roles");
  }, [isLoading, selectedRole, router]);

  return <RedirectSplash />;
}
