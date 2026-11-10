import Link from "next/link";

// Static export writes this to out/404.html, which GitHub Pages serves for any unmatched path.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-page flex-col items-start justify-center px-5 sm:px-8">
      <p className="font-mono text-[13px] text-muted">404</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.03em] text-ink">That page doesn&apos;t exist.</h1>
      <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg hover:opacity-90">
        Back to the home page
      </Link>
    </section>
  );
}
