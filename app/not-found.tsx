import Link from "next/link";

// Static export writes this to out/404.html, which GitHub Pages serves for
// any unmatched path — so a mistyped URL lands here instead of on Pages'
// own generic 404.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-4 text-center">
      <p className="text-6xl font-bold text-gray-900">404</p>
      <p className="mt-3 text-gray-600">That page doesn&apos;t exist.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/roles"
          className="rounded-lg bg-gradient-to-r from-primary-from to-primary-to px-6 py-2.5 font-semibold text-white shadow-primary transition hover:from-primary-to hover:to-primary-from"
        >
          Back to Role Picker
        </Link>
        <Link
          href="/portfolio"
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Full Portfolio
        </Link>
      </div>
    </main>
  );
}
