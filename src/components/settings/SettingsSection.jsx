export default function SettingsSection({ icon, title, description, children, danger }) {
  return (
    <section
      className={`rounded-2xl border bg-white p-6 ${
        danger ? "border-accent/30 bg-accent/5" : "border-ink/10"
      }`}
    >
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-accent/10 text-accent" : "bg-ink/5 text-ink/50"
            }`}
          >
            {icon}
          </span>
        )}
        <div>
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink/50">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}