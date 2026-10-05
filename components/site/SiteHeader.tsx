import Link from "next/link";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { profile, resumeUrl } from "@/lib/data";

// Section links point at the home page's anchors, so they also work from a case study page.
const NAV = [
  { href: "/#cases", label: "Case studies" },
  { href: "/#experience", label: "Experience" },
  { href: "/#credentials", label: "Credentials" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="print-hide sticky top-0 z-30 border-b border-rule/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-wide text-ink">
          {profile.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-2 transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-2 hidden rounded-full border border-ink/20 px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper sm:inline-block"
          >
            Résumé
          </a>
          <ThemeToggle />
        </nav>
      </div>
      {/* Phones: the same links as a scrollable row under the name. */}
      <nav aria-label="Sections" className="border-t border-rule/60 md:hidden">
        <ul className="mx-auto flex max-w-page gap-6 overflow-x-auto px-5 py-2.5">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} className="text-sm text-ink-2 hover:text-accent">
                {item.label}
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-ink-2 hover:text-accent">
              Résumé
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
