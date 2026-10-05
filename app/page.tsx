import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Credentials } from "@/components/home/Credentials";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cases, certifications, experience, profile, resumeUrl, skillCategories, socials, yearsOfExperience } from "@/lib/data";

const publications = certifications.filter((c) => c.kind === "publication").length;

// Every figure here is a fact from the CV or the content files, never an estimate.
const glance = [
  { value: `${yearsOfExperience}+`, label: "years in backend engineering, on enterprise and research platforms" },
  { value: "500+", label: "students trained in Java in a national upskilling programme" },
  { value: String(cases.length), label: "case studies, from a research platform to a product of my own" },
  { value: String(publications), label: publications === 1 ? "peer-reviewed publication in the ACM Digital Library" : "peer-reviewed publications" },
];

function Hero() {
  return (
    <section className="mx-auto max-w-page px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
      <p className="animate-rise text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        {profile.title} · {profile.location}
      </p>
      <h1 className="animate-rise mt-5 max-w-[17ch] font-serif text-5xl font-normal leading-[1.04] text-ink sm:text-7xl">
        I build secure, reliable systems, and the products that run on them.
      </h1>
      <p className="animate-rise mt-7 max-w-[60ch] text-lg text-ink-2 [animation-delay:120ms]">{profile.summary}</p>
      <div className="animate-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
        <Link
          href="#cases"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          See case studies <ArrowRight size={16} />
        </Link>
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Get in touch
        </Link>
        <span className="ml-1 inline-flex items-center gap-2 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          {profile.availability}
        </span>
      </div>

      <dl className="mt-20 grid grid-cols-2 border-b border-t border-b-rule border-t-ink lg:grid-cols-4">
        {glance.map((g, i) => (
          <div key={g.label} className={`border-rule py-6 pr-5 ${i % 2 === 1 ? "border-l pl-5" : ""} ${i > 0 ? "lg:border-l lg:pl-5" : ""}`}>
            <dt className="sr-only">{g.label}</dt>
            <dd>
              <span className="block font-serif text-5xl leading-none text-ink">{g.value}</span>
              <span className="mt-3 block text-sm text-muted">{g.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Cases() {
  const [featured, ...rest] = cases;
  return (
    <section id="cases" className="mx-auto max-w-page scroll-mt-20 px-5 py-16 sm:px-8">
      <SectionHeader
        index="01"
        eyebrow="Selected case studies"
        title="Problems I have owned end to end"
        description="Each one told the way I would brief a client: the situation, what I did, and what changed."
      />

      {featured && (
        <Link href={`/cases/${featured.slug}/`} className="group grid items-center gap-10 rounded-2xl border border-rule bg-surface p-6 transition-colors hover:border-ink/40 sm:p-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              01 · {featured.organisation} · {featured.year}
            </p>
            <h3 className="mt-3 font-serif text-3xl font-normal leading-tight text-ink group-hover:text-accent">{featured.title}</h3>
            <p className="mt-4 text-ink-2">{featured.summary}</p>
            {featured.stats && (
              <div className="mt-6 flex gap-8">
                {featured.stats.slice(0, 2).map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-3xl text-ink">{s.value}</div>
                    <div className="mt-1 max-w-[18ch] text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink">
              Read the case study <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          {featured.hero?.desktop && (
            <div className="overflow-hidden rounded-lg border border-rule shadow-device">
              <Image
                src={featured.hero.desktop.src}
                alt={featured.hero.desktop.alt}
                width={1920}
                height={1200}
                sizes="(min-width: 1024px) 560px, 90vw"
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}
        </Link>
      )}

      <ol className="mt-6">
        {rest.map((c, i) => (
          <li key={c.slug} className="border-b border-rule">
            <Link href={`/cases/${c.slug}/`} className="group grid gap-2 py-7 sm:grid-cols-[80px_1fr_auto] sm:items-baseline sm:gap-8">
              <span className="font-serif text-xl text-muted">{String(i + 2).padStart(2, "0")}</span>
              <div>
                <h3 className="font-serif text-2xl font-normal text-ink group-hover:text-accent">{c.title}</h3>
                <p className="mt-2 max-w-[70ch] text-sm text-ink-2">{c.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-muted">
                {c.organisation} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-page scroll-mt-20 px-5 py-16 sm:px-8">
      <SectionHeader index="02" eyebrow="Experience" title="Where I have done the work" />
      <ol>
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="grid gap-4 border-b border-rule py-9 first:pt-0 md:grid-cols-[220px_1fr] md:gap-10">
            <div>
              <p className="text-sm font-semibold text-ink">{role.period}</p>
              <p className="mt-1 text-sm text-muted">{role.location}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-ink">
                {role.role} <span className="text-muted">·</span> {role.company}
              </h3>
              <p className="mt-2 max-w-[68ch] text-ink-2">{role.summary}</p>
              <ul className="mt-4 space-y-2">
                {role.bullets.map((b) => (
                  <li key={b} className="relative max-w-[72ch] pl-6 text-sm text-ink-2">
                    <span aria-hidden="true" className="absolute left-0 top-[0.65rem] h-px w-3 bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">{role.skills.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="mx-auto max-w-page scroll-mt-20 px-5 py-16 sm:px-8">
      <SectionHeader index="03" eyebrow="Capabilities" title="What I bring to a team" />
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <ol className="grid gap-x-8 sm:grid-cols-2">
          {profile.areasOfExpertise.map((area, i) => (
            <li key={area} className="flex gap-4 border-b border-rule py-4">
              <span className="font-serif text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink">{area}</span>
            </li>
          ))}
        </ol>
        <dl className="space-y-5">
          {skillCategories.map((cat) => (
            <div key={cat.category}>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{cat.category}</dt>
              <dd className="mt-1 text-ink-2">{cat.skills.map((s) => s.name).join(" · ")}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Spoken languages</dt>
            <dd className="mt-1 text-ink-2">{profile.spokenLanguages.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-page scroll-mt-20 px-5 pb-24 pt-16 sm:px-8">
      <div className="rounded-2xl bg-[#0b1f3a] px-7 py-14 text-white sm:px-14 dark:bg-surface">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8a37f]">05 · Contact</p>
        <h2 className="mt-4 max-w-[18ch] font-serif text-4xl font-normal leading-tight sm:text-5xl">
          Have a problem worth solving? Let&apos;s talk.
        </h2>
        <p className="mt-4 max-w-[56ch] text-white/75">
          {profile.availability}. I reply to every message personally, usually within a day.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0b1f3a] hover:bg-white/90">
            <Mail size={16} /> {profile.email}
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium hover:border-white">
            <LinkedinIcon size={15} /> LinkedIn
          </a>
          <a href={socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium hover:border-white">
            <GithubIcon size={15} /> GitHub
          </a>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium hover:border-white">
            Résumé (PDF) <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Cases />
      <Experience />
      <Capabilities />
      <section id="credentials" className="mx-auto max-w-page scroll-mt-20 px-5 py-16 sm:px-8">
        <SectionHeader index="04" eyebrow="Credentials" title="Certifications, research and education" description="Select a card to verify it with the issuer." />
        <Credentials />
      </section>
      <Contact />
    </>
  );
}
