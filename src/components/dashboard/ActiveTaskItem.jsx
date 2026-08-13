import Link from "next/link";
import PriorityBadge from "@/components/task/PriorityBadge";

function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.setHours(0, 0, 0, 0) - today) / 86400000);

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 0) return "Overdue";
  return `Due ${new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function ActiveTaskItem({ task }) {
  const dueLabel = formatDueDate(task.dueDate);
  const workspaceId =
    typeof task.workspace === "object" && task.workspace ? task.workspace._id : task.workspace;
  const projectId = task.project?._id;

  return (
    <Link
      href={workspaceId && projectId ? `/workspaces/${workspaceId}/projects/${projectId}` : "#"}
      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{task.title}</p>
        <p className="mt-0.5 truncate text-xs text-ink/40">{task.project?.name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {dueLabel && (
          <span className={`text-xs ${dueLabel === "Overdue" ? "text-accent" : "text-ink/40"}`}>
            {dueLabel}
          </span>
        )}
        <PriorityBadge priority={task.priority} />
      </div>
    </Link>
  );
}
