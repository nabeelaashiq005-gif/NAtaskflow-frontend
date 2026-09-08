export default function CompletionRing({ completed = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-ink/10 bg-white p-5 sm:col-span-2">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgb(var(--ink) / 0.08)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgb(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={total > 0 ? offset : circumference}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-semibold text-ink">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-ink/50">Overall completion</p>
        <p className="mt-1 font-display text-lg font-semibold text-ink">
          {completed} of {total} tasks done
        </p>
        <p className="mt-1 text-xs text-ink/40">Across all your workspaces</p>
      </div>
    </div>
  );
}
