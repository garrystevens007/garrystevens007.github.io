import Link from "next/link";
import { Download, Mail, MapPin } from "lucide-react";
// lucide-react v1 has no brand glyphs — these two are the local inline SVGs.
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { education, profile, resumeUrl, socials, yearsOfExperience } from "@/lib/data";

// Contact strip. There is deliberately NO phone number here, in the resume
// PDF, or anywhere else on the site — HR_DASHBOARD_SPECS.md includes a Phone
// card, but the standing privacy decision for this portfolio is that the phone
// number is never published. Location fills the fourth slot instead.
const contactCards: Array<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string | null;
  external: boolean;
}> = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: socials.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
    href: socials.linkedin,
    external: true,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: socials.github.replace(/^https?:\/\/(www\.)?/, ""),
    href: socials.github,
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: null,
    external: false,
  },
];

export function ProfileCard() {
  return (
    <section
      id="profile"
      className="relative overflow-hidden rounded-2xl border border-hr-border bg-gradient-to-br from-hr-accent-tint via-hr-card to-hr-canvas-2 shadow-warm-lg scroll-mt-24"
      aria-labelledby="profile-heading"
    >
      {/* Accent rail + a soft teal bloom in the corner: enough depth that the
          header reads as a designed surface rather than a white box. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hr-accent-from via-hr-accent to-hr-accent-to"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-hr-accent/10 blur-3xl"
      />

      <div className="relative p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[112px_1fr_auto] md:items-start md:gap-8">
          <div className="flex justify-center md:justify-start">
            <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-hr-accent-from to-hr-accent-to text-3xl font-bold text-white shadow-teal">
              GS
            </span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hr-accent">
              Candidate profile
            </p>
            <h1 id="profile-heading" className="mt-1 text-3xl font-bold text-hr-ink">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg font-semibold text-hr-accent">{profile.title}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-hr-muted md:justify-start">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.location}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-hr-ink-soft md:mx-0">
              {profile.summary}
            </p>

            <dl className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:justify-start">
              <Fact label="Experience" value={`${yearsOfExperience}+ years`} />
              <Fact label="Education" value={education.degree} />
              <Fact label="Availability" value={profile.availability} />
              <Fact label="Languages" value={profile.spokenLanguages.join(", ")} />
            </dl>
          </div>

          <div className="flex flex-col gap-3 md:w-48">
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-hr-accent-from to-hr-accent-to px-5 py-3 text-sm font-semibold text-white shadow-teal transition hover:from-hr-accent-to hover:to-hr-accent-from focus:outline-none focus-visible:ring-2 focus-visible:ring-hr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-hr-canvas"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CV
            </a>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-xl border border-hr-accent/30 bg-hr-card/70 px-5 py-3 text-sm font-semibold text-hr-accent transition hover:border-hr-accent/60 hover:bg-hr-card focus:outline-none focus-visible:ring-2 focus-visible:ring-hr-accent focus-visible:ring-offset-2 focus-visible:ring-offset-hr-canvas"
            >
              View Full Profile
            </Link>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 border-t border-hr-border pt-6 sm:grid-cols-2 md:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-hr-accent-soft/60 text-hr-accent-ink">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-hr-muted">
                    {card.label}
                  </span>
                  <span className="block truncate text-sm font-semibold text-hr-ink">
                    {card.value}
                  </span>
                </span>
              </>
            );

            const base =
              "flex items-center gap-3 rounded-xl border border-hr-border bg-hr-card p-3 transition";

            return card.href ? (
              <a
                key={card.label}
                href={card.href}
                {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className={`${base} hover:-translate-y-0.5 hover:border-hr-accent/40 hover:shadow-warm`}
              >
                {inner}
              </a>
            ) : (
              <div key={card.label} className={base}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-hr-muted">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-hr-ink">{value}</dd>
    </div>
  );
}
