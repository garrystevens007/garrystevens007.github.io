import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { profile, resumeUrl } from "@/lib/data";

// Anchors point at the home page's sections, so the nav also works from a case study page. "#cases" stays a valid
// alias of "#work" (an empty anchor in app/page.tsx), so old links keep scrolling to the work section.
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#credentials", label: "Credentials" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="print-hide sticky top-0 z-30 border-b border-rule bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8]">
      <div className="mx-auto flex h-12 max-w-page items-center gap-2 px-5 nav:px-8">
        <Link href="/#top" className="inline-flex min-h-11 items-center gap-2.5 text-ink no-underline">
          <Image
            src="/g-mark-ink.svg"
            alt=""
            width={24}
            height={24}
            className="rounded-md dark:shadow-[0_0_0_1px_#48484A]"
          />
          <span className="text-sm font-semibold tracking-[-0.01em]">{profile.name}</span>
        </Link>
        <div className="flex-1" />
        <nav aria-label="Sections" className="hidden items-center nav:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2.5 text-xs leading-[48px] text-ink/80 no-underline transition-opacity hover:text-ink hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-2 inline-flex min-h-[28px] items-center rounded-full bg-ink px-3 text-xs font-medium text-bg no-underline"
        >
          Résumé
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
