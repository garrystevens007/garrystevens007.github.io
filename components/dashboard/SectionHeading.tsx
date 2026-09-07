type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold text-neutral-800 dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
