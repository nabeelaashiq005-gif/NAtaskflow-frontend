const colorStyles = {
  brand: "bg-brand-light/30 text-brand-dark dark:bg-brand/20 dark:text-brand-light",
  green: "bg-success/10 text-success",
  amber: "bg-warning/10 text-warning",
  red: "bg-accent/15 text-accent",
};

export default function StatCard({ label, value, color = "brand" }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-sm text-ink/50">{label}</p>
      <p
        className={`mt-2 inline-flex rounded-lg px-2.5 py-1 font-display text-2xl font-semibold ${colorStyles[color]}`}
      >
        {value}
      </p>
    </div>
  );
}
