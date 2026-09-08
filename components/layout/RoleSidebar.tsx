"use client";

import Link from "next/link";
import { LayoutGrid, Repeat, X, type LucideIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useRole } from "@/context/RoleContext";
import { profile, socials } from "@/lib/data";
import { ROLE_CONFIG, type UserRole } from "@/lib/roles";
import type { ShellVariant } from "./RoleShell";

export type RoleNavItem = {
  /** Matches the id of the section element on the page. */
  id: string;
  label: string;
  icon: LucideIcon;
};

type SidebarTokens = {
  aside: string;
  name: string;
  role: string;
  navIdle: string;
  navActive: string;
  divider: string;
  monogram: string;
  cta: string;
  social: string;
  closeButton: string;
  secondary: string;
};

const TOKENS: Record<ShellVariant, SidebarTokens> = {
  warm: {
    aside: "border-hr-border bg-hr-card",
    name: "text-hr-ink",
    role: "text-hr-muted",
    navIdle: "text-hr-ink-soft hover:bg-hr-canvas-2",
    navActive: "bg-gradient-to-br from-hr-accent-from to-hr-accent-to text-white shadow-teal",
    divider: "border-hr-border",
    monogram: "bg-gradient-to-br from-hr-accent-from to-hr-accent-to text-white",
    cta:
      "bg-gradient-to-r from-hr-accent-from to-hr-accent-to text-white shadow-teal hover:from-hr-accent-to hover:to-hr-accent-from focus-visible:ring-hr-accent",
    social: "bg-hr-canvas-2 text-hr-muted hover:text-hr-accent",
    closeButton: "text-hr-muted hover:bg-hr-canvas-2",
    secondary: "text-hr-muted hover:bg-hr-canvas-2",
  },
  dark: {
    aside: "border-gray-700 bg-gray-900",
    name: "text-white",
    role: "text-gray-500",
    navIdle: "text-gray-300 hover:bg-gray-800",
    navActive: "bg-gradient-to-br from-primary-from to-primary-to text-white shadow-primary",
    divider: "border-gray-700",
    monogram: "bg-gradient-to-br from-primary-from to-primary-to text-white",
    cta:
      "bg-gradient-to-r from-primary-from to-primary-to text-white shadow-primary hover:from-primary-to hover:to-primary-from focus-visible:ring-primary",
    social: "bg-gray-800 text-gray-300 hover:text-white",
    closeButton: "text-gray-400 hover:bg-gray-800",
    secondary: "text-gray-400 hover:bg-gray-800",
  },
  luxe: {
    aside: "border-luxe-hairline bg-luxe-canvas-2",
    name: "text-luxe-ink",
    role: "text-luxe-gold",
    navIdle: "text-luxe-ink-soft hover:bg-luxe-card",
    // Gold fill with near-black text: a gold-on-gold or white-on-gold active
    // state washes out, and this is the one element that should read as
    // unambiguously "selected".
    navActive:
      "bg-gradient-to-r from-luxe-gold-from to-luxe-gold-to text-luxe-canvas shadow-gold",
    divider: "border-luxe-hairline",
    monogram:
      "bg-gradient-to-br from-luxe-gold-from to-luxe-gold-to text-luxe-canvas",
    cta:
      "border border-luxe-gold/40 bg-luxe-gold-tint text-luxe-gold hover:bg-luxe-gold hover:text-luxe-canvas focus-visible:ring-luxe-gold",
    social: "bg-luxe-card text-luxe-muted hover:text-luxe-gold",
    closeButton: "text-luxe-muted hover:bg-luxe-card",
    secondary: "text-luxe-muted hover:bg-luxe-card",
  },
};

type RoleSidebarProps = {
  role: UserRole;
  nav: RoleNavItem[];
  variant: ShellVariant;
  activeSection: string;
  open: boolean;
  onNavigate: (id: string) => void;
  onClose: () => void;
};

export function RoleSidebar({
  role,
  nav,
  variant,
  activeSection,
  open,
  onNavigate,
  onClose,
}: RoleSidebarProps) {
  const { changeRole } = useRole();
  const config = ROLE_CONFIG[role];
  const t = TOKENS[variant];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform print-hide lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${t.aside} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-2 px-5 py-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${t.monogram}`}
            >
              GS
            </span>
            <div className="min-w-0">
              <p className={`truncate text-sm font-bold ${t.name}`}>{profile.name}</p>
              <p
                className={`truncate text-[11px] font-medium uppercase tracking-[0.12em] ${t.role}`}
              >
                {config.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full p-1 lg:hidden ${t.closeButton}`}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className={`mx-5 border-t ${t.divider}`} />

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Dashboard sections">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? t.navActive : t.navIdle
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}

          <Link
            href="/portfolio"
            className={`mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${t.secondary}`}
          >
            <LayoutGrid size={18} aria-hidden="true" />
            Full Portfolio
          </Link>
        </nav>

        <div className={`space-y-3 border-t p-4 ${t.divider}`}>
          <button
            type="button"
            onClick={changeRole}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.cta}`}
          >
            <Repeat size={16} aria-hidden="true" />
            Change Role
          </button>

          <div className="flex justify-center gap-2">
            <SocialLink href={socials.github} label="GitHub" className={t.social}>
              <GithubIcon size={16} />
            </SocialLink>
            <SocialLink href={socials.linkedin} label="LinkedIn" className={t.social}>
              <LinkedinIcon size={16} />
            </SocialLink>
          </div>

          <p className={`text-center text-xs font-medium ${t.role}`}>{profile.availability}</p>
        </div>
      </aside>
    </>
  );
}

function SocialLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${className}`}
    >
      {children}
    </a>
  );
}
