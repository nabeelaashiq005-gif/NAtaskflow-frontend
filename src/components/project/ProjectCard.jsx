import Link from "next/link";

const statusColors = {
  active: "bg-ink/10 text-ink",
  archived: "bg-ink/10 text-ink/60",
  completed: "bg-success/10 text-success",
};

export default function ProjectCard({ project, workspaceId }) {
  return (
    <Link
      href={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{project.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            statusColors[project.status] || statusColors.active
          }`}
        >
          {project.status}
        </span>
      </div>

      {project.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{project.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-ink/40">
        <span>
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </span>
        {project.dueDate && (
          <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
        )}
      </div>
    </Link>
  );
}
