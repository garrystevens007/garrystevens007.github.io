import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DeviceShowcase, LaptopFrame, PhoneFrame } from "@/components/cases/Devices";
import { CaseDiagram } from "@/components/cases/Diagrams";
import { TryApp } from "@/components/cases/TryApp";
import { caseBySlug, cases } from "@/lib/data";

// Static export: every case page is generated at build time from content/cases.json; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = caseBySlug((await params).slug);
  return study ? { title: study.title, description: study.summary } : {};
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule py-10 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 className="font-serif text-2xl font-normal text-ink">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Points({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.title} className="relative border-b border-rule py-3 pl-7 text-ink-2 last:border-b-0">
          <span aria-hidden="true" className="absolute left-0 top-[1.4rem] h-0.5 w-3 bg-accent" />
          <strong className="font-semibold text-ink">{item.title}.</strong> {item.body}
        </li>
      ))}
    </ul>
  );
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const study = caseBySlug(slug);
  if (!study) notFound();

  const index = cases.findIndex((c) => c.slug === study.slug);
  const next = cases[(index + 1) % cases.length];
  const productName = study.title.split(":")[0];
  const desktopShots = study.gallery?.filter((g) => g.device !== "phone") ?? [];
  const phoneShots = study.gallery?.filter((g) => g.device === "phone") ?? [];
  const meta = [
    { label: "Role", value: study.role },
    { label: "Timeline", value: study.timeline },
    study.delivery && { label: "Delivery", value: study.delivery },
    study.status && { label: "Status", value: study.status },
  ].filter((m): m is { label: string; value: string } => Boolean(m));

  return (
    <article className="mx-auto max-w-page px-5 sm:px-8">
      <Link href="/#cases" className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
        <ArrowLeft size={15} /> All case studies
      </Link>

      <header className="pb-6 pt-10 sm:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Case study {String(index + 1).padStart(2, "0")} · {study.organisation} · {study.year}
        </p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-4xl font-normal leading-[1.08] text-ink sm:text-6xl">
          {study.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-ink-2 sm:text-xl">{study.headline}</p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="font-semibold text-ink">{m.label}</dt>
              <dd className="text-muted">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <DeviceShowcase desktop={study.hero?.desktop} phone={study.hero?.phone} />

      {study.stats && (
        <div className="my-10 grid grid-cols-2 border-b border-t border-b-rule border-t-ink lg:grid-cols-4">
          {study.stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-rule py-6 pr-5 ${i % 2 === 1 ? "border-l pl-5" : ""} ${i > 0 ? "lg:border-l lg:pl-5" : ""}`}
            >
              <div className="font-serif text-4xl leading-none text-ink sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <Block title="Context">
        {study.context.map((p) => (
          <p key={p} className="mb-4 max-w-[68ch] text-ink-2 last:mb-0">
            {p}
          </p>
        ))}
      </Block>
      <Block title="Approach">
        <Points items={study.approach} />
      </Block>
      <Block title="Impact">
        <Points items={study.impact} />
      </Block>

      {desktopShots.length > 0 && (
        <section className="grid gap-8 border-t border-rule py-12 md:grid-cols-2">
          {desktopShots.map((shot) => (
            <figure key={shot.src}>
              <LaptopFrame image={shot} />
              {shot.caption && <figcaption className="mt-6 text-sm text-muted">{shot.caption}</figcaption>}
            </figure>
          ))}
        </section>
      )}

      {phoneShots.length > 0 && (
        <section className="flex flex-wrap justify-center gap-10 border-t border-rule py-12">
          {phoneShots.map((shot) => (
            <figure key={shot.src} className="w-[240px]">
              <PhoneFrame image={shot} />
              {shot.caption && <figcaption className="mt-4 text-center text-sm text-muted">{shot.caption}</figcaption>}
            </figure>
          ))}
        </section>
      )}

      {study.diagram && (
        <Block title="Architecture">
          <div className="overflow-x-auto rounded-xl border border-rule bg-surface p-5">
            <CaseDiagram name={study.diagram} />
          </div>
        </Block>
      )}

      <Block title="Toolkit">
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-rule bg-surface px-3 py-1 text-xs text-ink-2">
              {tag}
            </li>
          ))}
        </ul>
      </Block>

      {study.tryApp && <TryApp product={productName} />}

      {study.footnote && <p className="pb-4 text-xs text-muted">{study.footnote}</p>}

      {next && next.slug !== study.slug && (
        <Link
          href={`/cases/${next.slug}/`}
          className="group mb-16 mt-8 flex items-center justify-between gap-6 border-t border-ink py-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Next case study</p>
            <p className="mt-2 font-serif text-2xl text-ink group-hover:text-accent">{next.title}</p>
          </div>
          <ArrowRight className="shrink-0 text-ink transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </article>
  );
}
