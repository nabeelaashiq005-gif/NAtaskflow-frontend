import Link from "next/link";

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
    if (count >= 1) return `${count}${label[0]} ago`;
  }
  return "just now";
}

export default function NotificationPreviewItem({ notification }) {
  return (
    <Link
      href={notification.link || "/notifications"}
      className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5"
    >
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          notification.isRead ? "bg-ink/15" : "bg-brand"
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm text-ink/80">{notification.message}</p>
        <p className="mt-0.5 text-xs text-ink/40">{timeAgo(notification.createdAt)}</p>
      </div>
    </Link>
  );
}
