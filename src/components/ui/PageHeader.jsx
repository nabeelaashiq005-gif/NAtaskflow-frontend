export default function PageHeader({ eyebrow, title, subtitle, count }) {
  return (
    <header>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      )}
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        {typeof count === "number" && (
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-sm font-bold text-brand">
            {count}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
    </header>
  );
}