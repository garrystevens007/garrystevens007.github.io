import { Award, BookOpen, ExternalLink, FileText } from "lucide-react";
import { SectionHeader } from "@/components/layout/RoleShell";
import {
  certifications,
  education,
  linkedinCertificationsUrl,
  profile,
} from "@/lib/data";

export function EducationCard() {
  return (
    <section aria-labelledby="education-heading">
      <SectionHeader
        id="education"
        title="Education & Credentials"
        subtitle="Degree, certifications, and published work"
      />
      <h2 id="education-heading" className="sr-only">
        Education and Credentials
      </h2>

      <div className="overflow-hidden rounded-2xl border border-hr-border bg-hr-card shadow-warm">
        <div className="grid gap-6 p-6 sm:grid-cols-[84px_1fr] sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-hr-accent-soft to-hr-accent-tint">
            <BookOpen className="h-7 w-7 text-hr-accent-ink" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-hr-ink">{education.degree}</h3>
            <p className="mt-1 text-lg font-semibold text-hr-accent">{education.school}</p>
            <p className="mt-2 text-sm text-hr-muted">
              {education.location} · {education.period}
            </p>
          </div>
        </div>

        {/* Stands in for the spec's "Key Coursework" — the underlying CV
            records areas of expertise rather than a course list, so this
            shows the real thing instead of inventing module names. */}
        <details className="border-t border-hr-border bg-hr-canvas/50 px-6 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-hr-accent">
            Areas of expertise ({profile.areasOfExpertise.length})
          </summary>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.areasOfExpertise.map((area) => (
              <li
                key={area}
                className="rounded-full border border-hr-accent/20 bg-hr-accent-tint px-3 py-1 text-xs text-hr-accent-ink"
              >
                {area}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {certifications.map((cert) => {
          const Icon = cert.kind === "publication" ? FileText : Award;
          const isPublication = cert.kind === "publication";
          return (
            <li
              key={cert.id}
              className="flex gap-4 rounded-2xl border border-hr-border bg-hr-card p-5 shadow-warm transition hover:-translate-y-0.5 hover:border-hr-accent/40 hover:shadow-warm-lg"
            >
              <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                  isPublication
                    ? "bg-hr-clay-tint text-hr-clay"
                    : "bg-hr-accent-soft/60 text-hr-accent-ink"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    isPublication ? "text-hr-clay" : "text-hr-accent"
                  }`}
                >
                  {isPublication ? "Publication" : "Certificate"}
                </p>
                <h4 className="mt-1 text-sm font-semibold text-hr-ink">{cert.title}</h4>
                <p className="mt-1 text-xs text-hr-muted">
                  {cert.issuer} · {cert.date}
                </p>
                {cert.meta && <p className="mt-1 text-xs text-hr-ink-soft">{cert.meta}</p>}
                {cert.credentialId && (
                  <p className="mt-1 truncate text-xs text-hr-muted/80">ID: {cert.credentialId}</p>
                )}
                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-hr-accent hover:underline"
                  >
                    Verify
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <a
        href={linkedinCertificationsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-hr-accent hover:underline"
      >
        View all certifications on LinkedIn
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
