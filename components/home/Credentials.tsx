import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import { certifications, education, linkedinCertificationsUrl, type Certification } from "@/lib/data";

// The certificate image full-bleed, with a frosted panel for the text. Kept from the previous design, restyled to
// the editorial palette. The publication has no image, so it gets a navy panel with the paper's title.
function CredentialCard({ cert }: { cert: Certification }) {
  const card = (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-rule bg-surface transition-transform duration-300 hover:-translate-y-1">
      {cert.image ? (
        <Image
          src={cert.image}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-start bg-[#0b1f3a] p-5">
          <FileText className="text-white/50" size={28} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/35 p-4 backdrop-blur-md">
        <h3 title={cert.title} className="line-clamp-2 text-sm font-semibold text-white">
          {cert.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-white/80">{cert.issuer}</p>
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-white/70">
          <span>{cert.meta ?? cert.date}</span>
          {cert.verifyUrl && <ArrowUpRight size={13} />}
        </div>
      </div>
    </div>
  );

  return cert.verifyUrl ? (
    <a href={cert.verifyUrl} target="_blank" rel="noreferrer" aria-label={`Verify: ${cert.title}`}>
      {card}
    </a>
  ) : (
    card
  );
}

export function Credentials() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert) => (
          <CredentialCard key={cert.id} cert={cert} />
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-between gap-6 border-t border-rule pt-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Education</p>
          <p className="mt-2 font-serif text-xl text-ink">{education.degree}</p>
          <p className="text-sm text-ink-2">
            {education.school}, {education.location} · {education.period}
          </p>
        </div>
        <a
          href={linkedinCertificationsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          All certifications on LinkedIn <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}
