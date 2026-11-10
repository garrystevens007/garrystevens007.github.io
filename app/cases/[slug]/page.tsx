import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DeviceShowcase, LaptopFrame, PhoneFrame } from "@/components/cases/Devices";
import { CaseDiagram } from "@/components/cases/Diagrams";
import { TryApp } from "@/components/cases/TryApp";
import { caseBySlug, cases, type CaseBrand, type CaseStudy, type ProductPage } from "@/lib/data";

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

function DesignDecisions({ design }: { design: NonNullable<CaseStudy["design"]> }) {
  return (
    <Block title="Design decisions">
      {design.intro && <p className="mb-4 max-w-[68ch] text-ink-2">{design.intro}</p>}
      <Points items={design.points} />
    </Block>
  );
}

// From Dompi to Momoni. These cards keep a light background even in dark mode, because Momo is a black cat and the
// brand rule is "on dark grounds, Momo sits on a peach disc or a light tile". Text colours are fixed to Momoni ink.
const BRAND_CARD = "rounded-2xl border border-[#EBDDD3] bg-white p-[22px] text-[#1F1A17] dark:bg-[#FFF1EA]";
const BRAND_LABEL = "text-xs font-semibold uppercase tracking-[0.14em] text-[#5E534C]";

function MomoniBrand({ brand }: { brand: CaseBrand }) {
  const shareLabel = brand.palette.map((c) => `${c.name} ${c.share}%`).join(", ");
  return (
    <Block title={brand.title}>
      {brand.story.map((p) => (
        <p key={p} className="mb-4 max-w-[68ch] text-ink-2 last:mb-0">
          {p}
        </p>
      ))}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className={BRAND_CARD}>
          <p className={BRAND_LABEL}>Logo</p>
          <div className="mt-4 flex items-end gap-4">
            {brand.logo.before && (
              <figure>
                <Image src={brand.logo.before.src} alt="" width={512} height={512} className="h-16 w-auto" />
                <figcaption className="mt-2 text-[13px] text-[#5E534C]">{brand.logo.before.label}</figcaption>
              </figure>
            )}
            <span aria-hidden="true" className="pb-6 text-2xl text-[#B5531A]">
              →
            </span>
            <figure>
              <Image src={brand.logo.mark.src} alt="" width={200} height={214} className="h-16 w-auto" />
              <figcaption className="mt-2 text-[13px] text-[#5E534C]">{brand.logo.mark.label}</figcaption>
            </figure>
            <figure className="min-w-0 flex-1">
              <Image src={brand.logo.lockup.src} alt={brand.logo.lockup.alt} width={465} height={120} className="h-11 w-auto" />
              <figcaption className="mt-2 text-[13px] text-[#5E534C]">{brand.logo.lockup.label}</figcaption>
            </figure>
          </div>
        </div>

        <div className={BRAND_CARD}>
          <p className={BRAND_LABEL}>Colour · Tuxedo + accent</p>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {brand.palette.map((c) => (
              <div key={c.hex}>
                <div className="h-14 w-full rounded-lg border border-[#EBDDD3]" style={{ backgroundColor: c.hex }} />
                <div className="mt-2 text-[13px] font-medium text-[#1F1A17]">{c.name}</div>
                <div className="font-mono text-[11px] text-[#5E534C]">{c.hex}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full" role="img" aria-label={`Colour shares: ${shareLabel}`}>
            {brand.palette.map((c) => (
              <span
                key={c.hex}
                style={{ flexGrow: c.share, backgroundColor: c.hex }}
                className="block border-r border-[#EBDDD3] last:border-r-0"
              />
            ))}
          </div>
          {brand.paletteNote && <p className="mt-3 text-[13px] text-[#5E534C]">{brand.paletteNote}</p>}
        </div>

        <div className={`${BRAND_CARD} md:col-span-2`}>
          <p className={BRAND_LABEL}>Five expressions, one per screen</p>
          <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
            {brand.expressions.map((e) => (
              <figure key={e.name} className="text-center">
                <Image src={e.src} alt="" width={200} height={200} className="mx-auto h-auto w-full max-w-[88px]" />
                <figcaption className="mt-2 text-[13px] font-bold text-[#1F1A17]">{e.name}</figcaption>
                <p className="text-[12px] text-[#5E534C]">{e.when}</p>
              </figure>
            ))}
          </div>
          {brand.expressionsNote && <p className="mt-4 text-[13px] text-[#5E534C]">{brand.expressionsNote}</p>}
        </div>
      </div>
    </Block>
  );
}

// The product page (/momoni/) is a self-contained static page in public/, not a Next route, so this is a plain
// anchor: a Next <Link> would prefetch its RSC tree (/momoni/__next._tree.txt), which does not exist, and 404.
function ProductPageCard({ page }: { page: ProductPage }) {
  return (
    <a
      href={page.href}
      className="my-12 grid items-center gap-8 rounded-3xl border border-[#EBDDD3] bg-[#FFF1EA] p-8 text-[#1F1A17] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-[1fr_1.1fr]"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B5531A]">Product page</p>
        <h2 className="mt-3 font-serif text-[32px] font-normal leading-[1.1]">{page.title}</h2>
        <p className="mt-3 text-[#5E534C]">{page.body}</p>
        <span className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#F2762E] px-5 font-bold text-[#1F1A17]">
          {page.cta} →
        </span>
      </div>
      <div className="overflow-hidden rounded-[14px] shadow-xl">
        <Image
          src={page.image.src}
          alt={page.image.alt}
          width={1920}
          height={1200}
          sizes="(min-width: 768px) 560px, 90vw"
          className="block h-auto w-full"
        />
      </div>
    </a>
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
        {study.formerly && (
          <p className="mt-[18px] inline-flex items-center gap-2 rounded-full border border-rule bg-surface py-1.5 pl-1.5 pr-3 text-[13px] text-ink-2">
            <Image
              src="/images/cases/momoni/brand/momoni-mark.svg"
              alt=""
              width={200}
              height={214}
              className="h-6 w-auto"
            />
            Formerly {study.formerly} · renamed and redesigned in {study.year}
          </p>
        )}
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
      {study.design && <DesignDecisions design={study.design} />}
      {study.brand && <MomoniBrand brand={study.brand} />}
      {study.productPage && <ProductPageCard page={study.productPage} />}
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
