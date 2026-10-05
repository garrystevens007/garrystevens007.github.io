// The editorial section opener: a numbered eyebrow, a serif title and an optional one-line standfirst.
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 border-t border-ink pt-6 dark:border-ink/60">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        {index && <span className="mr-3 text-muted">{index}</span>}
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-[22ch] font-serif text-3xl font-normal leading-tight text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-[60ch] text-ink-2">{description}</p>}
    </div>
  );
}
