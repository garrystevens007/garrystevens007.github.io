import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExperienceAccordion } from "@/components/home/ExperienceAccordion";
import { Credentials } from "@/components/home/Credentials";
import {
  cases,
  certifications,
  experience,
  profile,
  resumeUrl,
  skillCategories,
  socials,
  yearsOfExperience,
  type TileVisual,
} from "@/lib/data";

const publications = certifications.filter((c) => c.kind === "publication").length;

// Section shell: 1080 px content, 72 px vertical padding on phones, 112 px above 820 px. `tone` alternates bg/alt.
function Section({ id, tone = "bg", className = "", children }: { id?: string; tone?: "bg" | "alt"; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`${tone === "alt" ? "bg-alt" : "bg-bg"} py-[72px] nav:py-28`}>
      <div className={`mx-auto flex max-w-page flex-col px-5 nav:px-8 ${className}`}>{children}</div>
    </section>
  );
}

function SectionHead({ number, title, lead }: { number: string; title: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="m-0 font-mono text-[13px] text-muted">{number}</p>
      <h2 className="m-0 text-[clamp(34px,4.6vw,56px)] font-semibold leading-[1.07] tracking-[-0.025em]">{title}</h2>
      {lead && <p className="m-0 max-w-[34em] text-[21px] text-ink-2">{lead}</p>}
    </div>
  );
}

function monthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

// "United Kingdom, Remote" → "remote (UK)".
function remoteLabel(location: string): string {
  const [place, mode] = location.split(",").map((s) => s.trim());
  const codes: Record<string, string> = { "United Kingdom": "UK", "United States": "US" };
  const code = codes[place] ?? place;
  return mode ? `${mode.toLowerCase()} (${code})` : place;
}

const withStop = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);
const sentence = (s: string) => withStop(s.charAt(0).toUpperCase() + s.slice(1));

function Hero() {
  const current = experience[0];
  const lead = profile.heroLead.replace("{years}", String(yearsOfExperience));
  const panel = [
    { label: "Role", value: `${current.role}, ${current.company}` },
    { label: "Since", value: `${monthYear(current.start)} · ${remoteLabel(current.location)}` },
    ...profile.panel,
  ];
  const glance = [
    { label: "Years in backend engineering", value: `${yearsOfExperience}+`, note: "enterprise and research platforms" },
    { label: "Students trained in Java", value: "500+", note: "national upskilling programme" },
    { label: "Case studies", value: String(cases.length), note: "research platform to my own product" },
    {
      label: publications === 1 ? "Peer-reviewed publication" : "Peer-reviewed publications",
      value: String(publications),
      note: "ACM Digital Library",
    },
  ];

  return (
    <section id="top" className="mx-auto max-w-page px-5 pb-[72px] pt-24 nav:px-8">
      <div className="flex flex-col items-stretch gap-14 nav:flex-row nav:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <p className="m-0 font-mono text-[13px] text-muted">
            {profile.name} — {profile.title}
          </p>
          <h1 className="m-0 max-w-[13ch] text-[clamp(44px,6.4vw,80px)] font-semibold leading-[1.04] tracking-[-0.035em]">
            I build secure, reliable systems, and the products that run on them.
          </h1>
          <p className="m-0 max-w-[30em] text-[clamp(19px,1.9vw,24px)] leading-[1.38] tracking-[-0.01em] text-ink-2">{lead}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="#contact"
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-[22px] text-[17px] font-medium text-on-accent no-underline"
            >
              Get in touch
            </Link>
            <Link href="#work" className="inline-flex items-center gap-1 text-[17px] text-accent">
              See selected work <span aria-hidden="true">›</span>
            </Link>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[17px] text-accent">
              Résumé (PDF) <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>

        <aside
          aria-label="Profile summary"
          className="w-full overflow-hidden rounded-[18px] border border-rule bg-card shadow-soft nav:w-[340px] nav:flex-none"
        >
          <div className="flex items-center gap-[7px] border-b border-rule px-3.5 py-3">
            <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
            <span className="mr-10 flex-1 text-center font-mono text-xs text-muted">about-garry</span>
          </div>
          <div className="flex flex-col gap-3.5 px-[22px] pb-[18px] pt-[22px]">
            <div className="flex items-center gap-3.5">
              <Image src="/g-mark-ink.svg" alt="" width={52} height={52} className="rounded-[13px] dark:shadow-[0_0_0_1px_#48484A]" />
              <div>
                <div className="text-xl font-semibold tracking-[-0.02em]">{profile.name}</div>
                <div className="text-[13px] text-muted">{profile.title}</div>
              </div>
            </div>
            <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 gap-y-[7px] font-mono text-[12.5px] leading-[1.5]">
              {panel.map((row) => (
                <Fragment key={row.label}>
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="m-0">{row.value}</dd>
                </Fragment>
              ))}
              <dt className="text-muted">Status</dt>
              <dd className="m-0 flex items-center gap-[7px]">
                <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                {profile.availability}
              </dd>
            </dl>
          </div>
        </aside>
      </div>

      <dl className="mt-[88px] grid grid-cols-2 gap-0 border-t border-rule nav:grid-cols-4">
        {glance.map((g) => (
          <div key={g.label} className="pr-6 pt-6">
            <dt className="text-xs uppercase tracking-[0.04em] text-muted">{g.label}</dt>
            <dd className="m-0 mt-1.5 text-[44px] font-semibold leading-none tracking-[-0.03em]">{g.value}</dd>
            <dd className="m-0 mt-1 text-sm text-muted">{g.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TileCode({ lines }: { lines: Extract<TileVisual, { type: "code" }>["lines"] }) {
  return (
    <div aria-hidden="true" className="mt-1.5 rounded-[14px] bg-alt px-[18px] py-4 font-mono text-[12.5px] leading-[1.9] text-ink-2">
      {lines.map((line) => (
        <div key={line.path ?? line.note}>
          {line.method && <span className="text-accent">{line.method} </span>}
          {line.path && <span>{line.path}</span>}
          {line.note && <span className="text-muted">{line.method || line.path ? `  ${line.note}` : line.note}</span>}
        </div>
      ))}
    </div>
  );
}

function TileVisualView({ visual }: { visual: TileVisual }) {
  if (visual.type === "figure") {
    return (
      <div className="mt-1.5 flex items-baseline gap-3">
        <span className="text-[88px] font-semibold leading-none tracking-[-0.05em] text-accent">{visual.value}</span>
        <span className="max-w-[12ch] text-[15px] text-muted">{visual.label}</span>
      </div>
    );
  }
  return <TileCode lines={visual.lines} />;
}

function Work() {
  const [featured, ...rest] = cases;
  const colon = featured.title.indexOf(":");
  const titleMain = colon === -1 ? featured.title : featured.title.slice(0, colon).trim();
  const titleSub = colon === -1 ? "" : featured.title.slice(colon + 1).trim();

  return (
    <Section id="work" tone="alt" className="gap-10">
      <span id="cases" aria-hidden="true" />
      <SectionHead number="01 — Work" title="Selected work." lead="Problems I owned end to end: the situation, what I did, and what changed." />
      <div className="grid grid-cols-1 gap-5 nav:grid-cols-2">
        <Link
          href={`/cases/${featured.slug}/`}
          className="group flex flex-col overflow-hidden rounded-[28px] bg-card text-ink no-underline transition-transform duration-300 hover:scale-[1.008] motion-reduce:transition-none motion-reduce:hover:scale-100 nav:col-span-2 nav:flex-row nav:items-stretch"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-11">
            <p className="m-0 font-mono text-xs text-muted">
              {featured.organisation} · {featured.year}
            </p>
            <h3 className="m-0 text-[40px] font-semibold leading-[1.08] tracking-[-0.03em]">{titleMain}</h3>
            {titleSub && <p className="m-0 text-[21px] font-medium leading-[1.3] tracking-[-0.01em]">{sentence(titleSub)}</p>}
            <p className="m-0 text-[16px] text-ink-2">{featured.summary}</p>
            {featured.stats && (
              <div className="mt-2 flex gap-7">
                {featured.stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div className="text-[28px] font-semibold tracking-[-0.02em]">{s.value}</div>
                    <div className="max-w-[13ch] text-[13px] text-muted">{s.short ?? s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-1 flex flex-wrap gap-1.5">
              {featured.tags.slice(0, 4).map((t) => (
                <span key={t} className="inline-flex min-h-[30px] items-center rounded-full bg-alt px-3 text-[13px] text-ink-2">
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-auto pt-3 text-[17px] text-accent">Read the case study ›</span>
          </div>
          {featured.hero?.desktop && (
            <div className="flex min-w-0 flex-[1.15] items-end pt-11">
              <Image
                src={featured.hero.desktop.src}
                alt={featured.hero.desktop.alt}
                width={1920}
                height={1200}
                sizes="(min-width: 820px) 540px, 90vw"
                className="block w-full rounded-tl-xl shadow-device"
              />
            </div>
          )}
        </Link>

        {rest.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}/`}
            className="group flex flex-col gap-3.5 rounded-[28px] bg-card p-10 text-ink no-underline transition-transform duration-300 hover:scale-[1.008] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <p className="m-0 font-mono text-xs text-muted">
              {c.organisation} · {c.year}
            </p>
            <h3 className="m-0 text-[30px] font-semibold leading-[1.12] tracking-[-0.025em]">{withStop(c.tileTitle ?? c.title)}</h3>
            <p className="m-0 text-[16px] text-ink-2">{c.summary}</p>
            {c.tileVisual && <TileVisualView visual={c.tileVisual} />}
            <span className="mt-auto pt-2.5 text-[17px] text-accent">Read the case study ›</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" tone="bg" className="gap-8">
      <SectionHead number="02 — Experience" title="Where I’ve done the work." />
      <ExperienceAccordion items={experience} />
    </Section>
  );
}

function Skills() {
  const spoken = profile.spokenLanguages.map((l) => (l === "English" ? "English (B2, EF SET)" : l)).join(" · ");
  const rows = [...skillCategories.map((c) => ({ label: c.category, value: c.skills.map((s) => s.name).join(" · ") })), { label: "Spoken languages", value: spoken }];
  return (
    <Section id="skills" tone="alt" className="gap-10">
      <SectionHead number="03 — Skills" title="Tech specs." />
      <div className="grid grid-cols-1 gap-14 nav:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="flex flex-col gap-3.5">
          <p className="m-0 text-xs uppercase tracking-[0.04em] text-muted">Focus areas</p>
          <ol className="m-0 flex list-none flex-col p-0">
            {profile.areasOfExpertise.map((area, i) => (
              <li
                key={area}
                className={`border-t border-rule py-[11px] text-[16px] ${i === profile.areasOfExpertise.length - 1 ? "border-b" : ""}`}
              >
                {area}
              </li>
            ))}
          </ol>
        </div>
        <dl className="m-0 border-b border-rule">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1.5 border-t border-rule py-5 nav:grid-cols-[240px_minmax(0,1fr)] nav:gap-6">
              <dt className="font-semibold">{row.label}</dt>
              <dd className="m-0 text-ink-2">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" tone="alt" className="items-center gap-[18px] text-center">
      <p className="m-0 font-mono text-[13px] text-muted">05 — Contact</p>
      <h2 className="m-0 max-w-[16ch] text-[clamp(34px,4.6vw,56px)] font-semibold leading-[1.07] tracking-[-0.025em]">
        Have a problem worth solving? Let&rsquo;s talk.
      </h2>
      <p className="m-0 max-w-[32em] text-[19px] text-ink-2">
        {profile.availability}. I reply to every message personally, usually within a day.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-2.5 text-[clamp(22px,3vw,32px)] font-semibold tracking-[-0.02em] text-accent no-underline"
      >
        {profile.email}
      </a>
      <div className="mt-1.5 flex flex-wrap justify-center gap-x-7 gap-y-2">
        <a className="inline-flex items-center gap-1 text-[17px] text-accent" href={socials.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a className="inline-flex items-center gap-1 text-[17px] text-accent" href={socials.github} target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a className="inline-flex items-center gap-1 text-[17px] text-accent" href={resumeUrl} target="_blank" rel="noreferrer">
          Résumé (PDF) <span aria-hidden="true">↗</span>
        </a>
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <Skills />
      <Section id="credentials" tone="bg" className="gap-10">
        <SectionHead number="04 — Credentials" title="Certifications, research and education." lead="Each card opens the issuer’s verification page." />
        <Credentials />
      </Section>
      <Contact />
    </>
  );
}
