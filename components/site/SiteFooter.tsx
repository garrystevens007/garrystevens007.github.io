import { profile } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col items-start gap-3 px-5 pb-7 pt-6 text-xs text-muted nav:flex-row nav:items-center nav:justify-between nav:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </span>
        <span className="font-mono">Built with Next.js · static on GitHub Pages</span>
      </div>
    </footer>
  );
}
