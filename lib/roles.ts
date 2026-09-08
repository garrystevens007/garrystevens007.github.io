// Role definitions shared by the picker, the context, the sidebar and every
// dashboard. Kept out of context/RoleContext.tsx (which is "use client") so
// server components and plain modules can import the types and config without
// dragging a client boundary along.

export type UserRole = "hr" | "technical" | "manager";

export const USER_ROLES: readonly UserRole[] = ["hr", "technical", "manager"];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

export type RoleConfig = {
  id: UserRole;
  /** Short label — used on cards and chips. */
  title: string;
  /** Long label — used in the sidebar header and page heading. */
  name: string;
  /** One line, shown on the picker card and as the dashboard subtitle. */
  description: string;
  /** Lucide icon name, resolved at the call site (icons can't cross a JSON-ish config cleanly). */
  icon: "Users" | "Code" | "BarChart3";
  /** Tailwind text colour for the picker icon, per ROLE_PICKER_PAGE.md. */
  iconClass: string;
  /** Tint used for the picker card's hover glow. */
  glowClass: string;
  /** Background behind the picker icon. */
  iconBgClass: string;
  /**
   * Three hex values previewing that dashboard's actual palette, shown as a
   * swatch row on the picker card — so the choice reads as "which of these
   * three surfaces do I want" rather than three identical glass boxes.
   */
  swatches: [string, string, string];
  href: string;
};

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  hr: {
    id: "hr",
    title: "HR",
    name: "HR Dashboard",
    description: "Experience, skills, and contact info optimized for recruiting",
    icon: "Users",
    iconClass: "text-hr-accent",
    iconBgClass: "bg-hr-accent-tint",
    glowClass: "group-hover:shadow-[0_0_60px_-12px_rgba(15,118,110,0.55)]",
    swatches: ["#F7F3EE", "#0F766E", "#E8DFD3"],
    href: "/dashboard/hr",
  },
  technical: {
    id: "technical",
    title: "Technical User",
    name: "Technical Dashboard",
    description: "API playground with gamification and backend achievements",
    icon: "Code",
    iconClass: "text-cyan-500",
    iconBgClass: "bg-cyan-50",
    glowClass: "group-hover:shadow-[0_0_60px_-12px_rgba(6,182,212,0.55)]",
    swatches: ["#111827", "#e91e63", "#22D3EE"],
    href: "/dashboard/technical",
  },
  manager: {
    id: "manager",
    title: "Manager / Director",
    name: "Executive Dashboard",
    description: "Data-driven KPIs, metrics, and career timeline",
    icon: "BarChart3",
    // The champagne gold used on the dashboard itself is too light to sit on
    // the picker's pale gradient — this is the deep end of the same ramp.
    iconClass: "text-luxe-gold-deep",
    iconBgClass: "bg-[#F5EFDC]",
    glowClass: "group-hover:shadow-[0_0_60px_-12px_rgba(212,175,55,0.6)]",
    swatches: ["#0A0A0C", "#D4AF37", "#2A2A30"],
    href: "/dashboard/manager",
  },
};

export const roleList: RoleConfig[] = USER_ROLES.map((id) => ROLE_CONFIG[id]);

export function getRoleName(role: UserRole): string {
  return ROLE_CONFIG[role].name;
}

export function getRoleDescription(role: UserRole): string {
  return ROLE_CONFIG[role].description;
}
