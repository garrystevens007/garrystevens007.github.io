"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Code, Users, type LucideIcon } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { roleList, ROLE_CONFIG, type RoleConfig, type UserRole } from "@/lib/roles";
import { profile } from "@/lib/data";
import { FlowFieldBackground } from "./FlowFieldBackground";

const ICONS: Record<RoleConfig["icon"], LucideIcon> = {
  Users,
  Code,
  BarChart3,
};

const EXIT_ANIMATION_MS = 600;

export function RolePicker() {
  const router = useRouter();
  const { setSelectedRole, selectedRole } = useRole();
  const [pending, setPending] = useState<UserRole | null>(null);
  // Drives the background's colour. Focus counts as well as hover, so the
  // effect responds to keyboard navigation too, not just the mouse.
  const [focusedRole, setFocusedRole] = useState<UserRole | null>(null);

  const handleSelect = useCallback(
    (role: UserRole) => {
      if (pending) return; // a selection is already animating out
      setSelectedRole(role);
      setPending(role);
      window.setTimeout(() => router.push(ROLE_CONFIG[role].href), EXIT_ANIMATION_MS);
    },
    [pending, router, setSelectedRole]
  );

  return (
    <main
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-4 py-16 transition-opacity duration-500 ${
        pending ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Static radial washes, painted as plain CSS gradients rather than the
          animated `blur-3xl` blobs this used to have. Those cost ~11fps on
          their own: they animated `scale()`, and scaling a 64px-blur layer
          forces the browser to re-rasterise the blur every single frame. The
          flow field now supplies the moving texture, so the depth underneath
          it can be completely static and free. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 8% 0%, rgba(244,114,182,0.22), transparent 60%), " +
            "radial-gradient(55rem 38rem at 95% 25%, rgba(129,140,248,0.20), transparent 60%), " +
            "radial-gradient(45rem 32rem at 40% 105%, rgba(103,232,249,0.20), transparent 60%)",
        }}
      />

      {/* Above the washes, below the content — the glass cards' own
          backdrop-blur then picks it up, which is most of the effect. */}
      <FlowFieldBackground activeRole={pending ?? focusedRole} />

      <div className="relative w-full max-w-6xl">
        <header className="mb-12 text-center">
          <h1
            className="animate-enter-fade text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
            style={{ animationDelay: "0.2s" }}
          >
            Who am I?
          </h1>
          <p
            className="animate-enter-fade mt-3 text-lg text-gray-600 md:text-xl"
            style={{ animationDelay: "0.4s" }}
          >
            Pick your role
          </p>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {roleList.map((role, index) => (
            <RoleCard
              key={role.id}
              role={role}
              index={index}
              isPending={pending === role.id}
              isCurrent={selectedRole === role.id}
              onSelect={handleSelect}
              onActivate={setFocusedRole}
            />
          ))}
        </div>

        <footer
          className="animate-enter-fade space-y-2 text-center"
          style={{ animationDelay: "1.4s" }}
        >
          <p className="text-xs text-gray-500 md:text-sm">Switch roles anytime using the sidebar</p>
          <p className="text-xs text-gray-400">
            Or skip the roles and{" "}
            <Link
              href="/portfolio"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              browse the full portfolio
            </Link>{" "}
            — {profile.name}, {profile.title}
          </p>
        </footer>
      </div>
    </main>
  );
}

type RoleCardProps = {
  role: RoleConfig;
  index: number;
  isPending: boolean;
  isCurrent: boolean;
  onSelect: (role: UserRole) => void;
  onActivate: (role: UserRole | null) => void;
};

function RoleCard({ role, index, isPending, isCurrent, onSelect, onActivate }: RoleCardProps) {
  const Icon = ICONS[role.icon];

  return (
    // One interactive element, not a clickable <div> wrapping a <button>:
    // nesting them would give the card two overlapping activation targets and
    // fire the handler twice on a button click. The whole card is the button.
    <button
      type="button"
      onClick={() => onSelect(role.id)}
      onMouseEnter={() => onActivate(role.id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(role.id)}
      onBlur={() => onActivate(null)}
      aria-label={`Select ${role.title} role`}
      // backdrop-blur-md, not -xl: a 24px backdrop blur over a canvas that
      // repaints every frame costs ~15fps on its own, and at these card sizes
      // 12px is visually indistinguishable.
      className={`role-card animate-enter-up group relative flex flex-col rounded-3xl border border-white/40 bg-white/25 p-6 text-left shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-3 hover:border-white/60 hover:bg-white/35 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-pink-50 md:p-8 ${
        role.glowClass
      } ${isPending ? "scale-[1.04] border-white/70 bg-white/40" : ""}`}
      style={{ animationDelay: `${0.6 + index * 0.2}s` }}
    >
      {isCurrent && (
        <span className="absolute right-4 top-4 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">
          Current
        </span>
      )}

      <div className="mb-6 flex justify-center">
        <span
          className={`animate-liquid flex h-20 w-20 items-center justify-center shadow-inner ${role.iconBgClass} ${role.iconClass}`}
        >
          <Icon className="h-10 w-10" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>

      <h2 className="text-center text-xl font-bold text-gray-900 md:text-2xl">{role.title}</h2>

      <p className="mt-2 flex-1 text-center text-sm leading-relaxed text-gray-600 md:text-base">
        {role.description}
      </p>

      {/* Palette preview — the three dashboards look genuinely different, and
          this is the cheapest way to say so before the visitor commits. */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {role.swatches.map((swatch) => (
          <span
            key={swatch}
            aria-hidden="true"
            className="h-2 w-8 rounded-full ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>

      {/* Visual affordance only — the card itself is the button, so this is
          aria-hidden and not focusable, avoiding a duplicate tab stop. */}
      <span
        aria-hidden="true"
        className="mt-6 block w-full rounded-lg bg-gradient-to-r from-primary-from to-primary-to px-6 py-3 text-center font-semibold text-white shadow-primary transition-all duration-300 group-hover:from-primary-to group-hover:to-primary-from group-active:scale-95"
      >
        {isPending ? "Opening…" : "Select Role"}
      </span>
    </button>
  );
}
