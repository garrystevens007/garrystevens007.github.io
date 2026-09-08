"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { RoleSidebar, type RoleNavItem } from "./RoleSidebar";
import { useRole } from "@/context/RoleContext";
import { ROLE_CONFIG, type UserRole } from "@/lib/roles";

/**
 * One variant per role, because the three dashboards are deliberately not the
 * same surface:
 *  - `warm`  HR — warm sand canvas, deep teal accent
 *  - `dark`  Technical — gray-900, pink/neon accent
 *  - `luxe`  Executive — near-black, champagne gold, serif headings
 */
export type ShellVariant = "warm" | "dark" | "luxe";

type VariantTokens = {
  page: string;
  topbar: string;
  topbarButton: string;
  heading: string;
  headingFont: string;
  subtitle: string;
};

export const VARIANTS: Record<ShellVariant, VariantTokens> = {
  warm: {
    page: "bg-hr-canvas text-hr-ink",
    topbar: "border-hr-border bg-hr-card/90",
    topbarButton: "hover:bg-hr-canvas-2",
    heading: "text-hr-ink",
    headingFont: "",
    subtitle: "text-hr-muted",
  },
  dark: {
    page: "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100",
    topbar: "border-gray-700 bg-gray-900/90",
    topbarButton: "hover:bg-gray-800",
    heading: "text-white",
    headingFont: "",
    subtitle: "text-gray-400",
  },
  luxe: {
    page: "bg-luxe-canvas text-luxe-ink",
    topbar: "border-luxe-hairline bg-luxe-canvas/90",
    topbarButton: "hover:bg-luxe-card",
    heading: "text-luxe-ink",
    headingFont: "font-display tracking-tight",
    subtitle: "text-luxe-muted",
  },
};

type RoleShellProps = {
  role: UserRole;
  nav: RoleNavItem[];
  variant?: ShellVariant;
  children: React.ReactNode;
};

/**
 * Chrome shared by all three role dashboards: sidebar (drawer on mobile),
 * a mobile top bar, and scroll-spy over the page's section ids.
 *
 * It also owns one piece of routing: landing on /dashboard/hr with a
 * different role stored quietly re-points the stored role at the dashboard
 * you're actually looking at, so a shared deep link doesn't leave the sidebar
 * claiming you're in a role you aren't.
 */
export function RoleShell({ role, nav, variant = "warm", children }: RoleShellProps) {
  const { selectedRole, isLoading, setSelectedRole } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(nav[0]?.id ?? "");

  useEffect(() => {
    if (isLoading || selectedRole === role) return;
    setSelectedRole(role);
  }, [isLoading, selectedRole, role, setSelectedRole]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    nav.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [nav]);

  const handleNavigate = useCallback((id: string) => {
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const tokens = VARIANTS[variant];
  const config = ROLE_CONFIG[role];

  return (
    // `dark` is still applied for the two dark variants so any component that
    // reaches for a dark: utility (the shared api-playground pieces do) keeps
    // behaving. The palette itself comes from the tokens above, not from that
    // class.
    <div className={variant === "warm" ? undefined : "dark"}>
      <div className={`min-h-screen lg:flex ${tokens.page} print-light`}>
        <RoleSidebar
          role={role}
          nav={nav}
          variant={variant}
          activeSection={activeSection}
          open={sidebarOpen}
          onNavigate={handleNavigate}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <div
            className={`sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 backdrop-blur lg:hidden print-hide ${tokens.topbar}`}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className={`rounded-lg p-2 ${tokens.topbarButton}`}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className={`font-bold ${tokens.headingFont}`}>{config.name}</span>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 print-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

/** Section heading used consistently across all three dashboards. */
export function SectionHeader({
  id,
  title,
  subtitle,
  variant = "warm",
  action,
  eyebrow,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  variant?: ShellVariant;
  action?: React.ReactNode;
  /** Small label above the title — used on the executive dashboard. */
  eyebrow?: string;
}) {
  const tokens = VARIANTS[variant];
  return (
    <div id={id} className="mb-6 flex scroll-mt-24 flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-luxe-gold">
            {eyebrow}
          </p>
        )}
        <h2 className={`text-2xl font-bold ${tokens.heading} ${tokens.headingFont}`}>{title}</h2>
        {subtitle && <p className={`mt-1 text-sm ${tokens.subtitle}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
