export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && <p className="label-caps text-gold-700 mb-3">{eyebrow}</p>}
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-ink-soft text-[15px]">{description}</p>}
    </div>
  );
}
