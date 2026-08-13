import Link from "next/link";

const roleColors = {
  owner: "bg-ink text-white",
  admin: "bg-ink/10 text-ink",
  member: "bg-ink/10 text-ink/70",
  viewer: "bg-ink/5 text-ink/50",
};

export default function WorkspaceCard({ workspace }) {
  return (
    <Link
      href={`/workspaces/${workspace._id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{workspace.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            roleColors[workspace.myRole] || roleColors.member
          }`}
        >
          {workspace.myRole}
        </span>
      </div>
      {workspace.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{workspace.description}</p>
      )}
    </Link>
  );
}
