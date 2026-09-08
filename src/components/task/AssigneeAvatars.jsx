import Avatar from "@/components/ui/Avatar";

export default function AssigneeAvatars({ assignees = [], max = 3 }) {
  if (assignees.length === 0) return null;

  const visible = assignees.slice(0, max);
  const overflow = assignees.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user) => (
        <div key={user._id} className="rounded-full ring-2 ring-white dark:ring-slate-800">
          <Avatar name={user.name} src={user.avatar} size={24} />
        </div>
      ))}
      {overflow > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 text-[10px] font-medium text-ink/60 ring-2 ring-white dark:ring-slate-800">
          +{overflow}
        </div>
      )}
    </div>
  );
}
