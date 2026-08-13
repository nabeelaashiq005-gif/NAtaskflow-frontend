const priorityStyles = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-accent/10 text-accent",
};

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        priorityStyles[priority] || priorityStyles.medium
      }`}
    >
      {priority}
    </span>
  );
}
