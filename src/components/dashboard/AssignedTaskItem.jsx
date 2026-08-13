import Link from "next/link";
import PriorityBadge from "@/components/task/PriorityBadge";
import Avatar from "@/components/ui/Avatar";

export default function AssignedTaskItem({ task }) {
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
        <div className="flex -space-x-1.5">
          {task.assignees?.length > 0 ? (
            task.assignees
              .slice(0, 3)
              .map((a) => <Avatar key={a._id} name={a.name} src={a.avatar} size={22} />)
          ) : (
            <span className="text-xs text-ink/30">Unassigned</span>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
    </Link>
  );
}
