import { ArrowUpRight, Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/icons";
import { socials, tryAppMailto } from "@/lib/data";

// "I'd like to try this app": access is by invitation, so the visitor asks by email (a ready-made message) or on
// LinkedIn, and Garry sends the access himself.
export function TryApp({ product }: { product: string }) {
  return (
    <section className="my-16 rounded-2xl border border-rule bg-surface p-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Early access</p>
      <h2 className="mt-3 font-serif text-3xl font-normal text-ink">I&apos;d like to try {product}</h2>
      <p className="mt-3 max-w-[58ch] text-ink-2">
        {product} is a private project I keep developing. Send me a note and I will share access with you personally.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={tryAppMailto(product)}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          <Mail size={16} /> Request access by email
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <LinkedinIcon size={15} /> Message me on LinkedIn <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
