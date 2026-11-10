import Image from "next/image";
import { certifications, education, linkedinCertificationsUrl, type Certification } from "@/lib/data";

const CARD = "flex flex-col overflow-hidden rounded-[20px] border border-rule bg-card text-ink no-underline transition-colors hover:border-muted";

// doi.org / dl.acm.org links carry the DOI after "/doi/"; show it in the publication card's header.
function doiFrom(url?: string): string | undefined {
  if (!url) return undefined;
  const after = url.split("/doi/")[1] ?? url.split("doi.org/")[1];
  return after ? `doi:${after}` : undefined;
}

function Meta({ cert }: { cert: Certification }) {
  return (
    <span className="flex flex-col gap-1 p-4">
      <b className="text-[15px] font-semibold leading-snug">{cert.title}</b>
      <span className="text-[13px] text-muted">
        {cert.issuer} · {cert.date}
      </span>
      {cert.verifyUrl ? (
        <span className="text-[13px] text-accent">Verify ↗</span>
      ) : cert.credentialId ? (
        <span className="text-[13px] text-muted">ID {cert.credentialId}</span>
      ) : null}
    </span>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  // The publication has no image: a 4:3 alt block with the DOI at the top and the paper title at the bottom.
  const body =
    cert.kind === "publication" ? (
      <>
        <span className="flex aspect-[4/3] flex-col justify-between bg-alt p-[18px]">
          <span className="font-mono text-xs text-muted">{doiFrom(cert.verifyUrl)}</span>
          <span className="text-[15px] font-semibold leading-snug">{cert.title}</span>
        </span>
        <span className="flex flex-col gap-1 p-4">
          <b className="text-[15px] font-semibold leading-snug">Peer-reviewed publication</b>
          <span className="text-[13px] text-muted">
            {cert.issuer} · {cert.date}
          </span>
          <span className="text-[13px] text-accent">Read ↗</span>
        </span>
      </>
    ) : (
      <>
        <span className="relative block aspect-[4/3] bg-white">
          {cert.image && (
            <Image
              src={cert.image}
              alt=""
              fill
              sizes="(min-width: 820px) 25vw, 50vw"
              className="object-cover object-top"
            />
          )}
        </span>
        <Meta cert={cert} />
      </>
    );

  return cert.verifyUrl ? (
    <a href={cert.verifyUrl} target="_blank" rel="noreferrer" className={CARD} aria-label={`${cert.title} — open issuer page`}>
      {body}
    </a>
  ) : (
    <div className={CARD}>{body}</div>
  );
}

export function Credentials() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 nav:grid-cols-4">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
      <div className="grid gap-1.5 border-t border-rule pt-5 nav:grid-cols-[240px_minmax(0,1fr)]">
        <span className="pt-[3px] text-xs uppercase tracking-[0.04em] text-muted">Education</span>
        <span className="flex flex-wrap justify-between gap-x-6 gap-y-1.5">
          <span>
            <b className="font-semibold">{education.degree}</b>{" "}
            <span className="text-muted">
              · {education.school}, {education.location} · {education.period}
            </span>
          </span>
          <a href={linkedinCertificationsUrl} target="_blank" rel="noreferrer" className="text-[15px] text-accent">
            All certifications on LinkedIn ↗
          </a>
        </span>
      </div>
    </div>
  );
}
