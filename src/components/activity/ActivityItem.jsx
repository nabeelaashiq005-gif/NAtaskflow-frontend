import Avatar from "@/components/ui/Avatar";

const typeIcons = {
  workspace_created: "🏢",
  member_invited: "✉️",
  member_joined: "👋",
  member_removed: "🚪",
  project_created: "📁",
  project_updated: "✏️",
  project_deleted: "🗑️",
  task_created: "✅",
  task_updated: "🔄",
  task_assigned: "👤",
  task_completed: "🎉",
  task_deleted: "🗑️",
  comment_added: "💬",
};

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secondsInUnit] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Avatar name={activity.actor?.name} src={activity.actor?.avatar} size={28} />
      <div className="flex-1">
        <p className="text-sm text-ink/80">
          <span className="mr-1">{typeIcons[activity.type] || "•"}</span>
          {activity.message}
        </p>
        <p className="mt-0.5 text-xs text-ink/40">{timeAgo(activity.createdAt)}</p>
      </div>
    </div>
  );
}
