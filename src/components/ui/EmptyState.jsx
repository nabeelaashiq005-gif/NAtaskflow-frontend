export default function EmptyState({ icon, title, body, action }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white px-6 py-12 text-center">
      {icon && (
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-ink/40">
          {icon}
        </span>
      )}
      <p className="mt-4 font-display text-lg font-semibold text-ink">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-ink/50">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}