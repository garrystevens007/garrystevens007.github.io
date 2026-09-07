import Image from "next/image";
import { Award, ExternalLink, FileText } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { certifications, linkedinCertificationsUrl, type Certification } from "@/lib/data";

// "Liquid glass" card: the real certificate image full-bleed as the
// background, a frosted/blurred translucent panel overlaid for the text, and
// a soft colored glow (the cert's own accent) bleeding through from a corner.
// Publications (no certificate image) fall back to a gradient built from the
// same accent instead of a photo.
const glowClasses: Record<Certification["accent"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const gradientClasses: Record<Certification["accent"], string> = {
  primary: "from-primary-from to-primary-to",
  info: "from-info-from to-info-to",
  success: "from-success-from to-success-to",
  warning: "from-warning-from to-warning-to",
  danger: "from-danger-from to-danger-to",
};

function CertificationCard({ cert }: { cert: Certification }) {
  const Icon = cert.kind === "publication" ? FileText : Award;

  const content = (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700">
      {/* Background: real certificate image, or a gradient for publications */}
      {cert.image ? (
        <Image
          src={cert.image}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="scale-105 object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[cert.accent]}`} />
      )}

      {/* Colored glow bleeding from a corner, blurred through the glass */}
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-70 blur-3xl ${glowClasses[cert.accent]}`} />
      <div className={`pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-50 blur-3xl ${glowClasses[cert.accent]}`} />

      {/* Dark scrim blending the image up into the panel, so it doesn't start
          with a hard edge. The panel's own tint (below) is what actually
          guarantees text contrast — a real certificate's background is often
          white right where the panel sits, so relying on the scrim alone
          (previously white-tinted glass) made text unreadable over those. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Frosted glass panel — dark-tinted (like iOS's own Liquid Glass over a
          bright wallpaper) so it stays legible regardless of what's behind it,
          while the blur still lets the image's colors/shapes show through muted. */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/35 p-4 backdrop-blur-lg transition-colors duration-300 group-hover:bg-black/45">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="flex items-start gap-2">
          <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-card bg-gradient-to-br ${gradientClasses[cert.accent]}`}>
            <Icon size={14} />
          </span>
          <div className="min-w-0">
            <h3 title={cert.title} className="line-clamp-2 text-sm font-semibold text-white">
              {cert.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/80">{cert.issuer}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-[11px] text-white/70">{cert.meta ?? cert.date}</span>
              {cert.verifyUrl && <ExternalLink size={12} className="flex-shrink-0 text-white/70" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (cert.verifyUrl) {
    return (
      <a href={cert.verifyUrl} target="_blank" rel="noreferrer" aria-label={`Verify: ${cert.title}`}>
        {content}
      </a>
    );
  }

  return content;
}

export function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          description="A curated selection — click a card to verify it."
        />
        <a
          href={linkedinCertificationsUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all on LinkedIn <ExternalLink size={14} />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} />
        ))}
      </div>
    </section>
  );
}
