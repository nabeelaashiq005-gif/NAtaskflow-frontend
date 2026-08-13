"use client";

import PriorityBadge from "@/components/task/PriorityBadge";
import AssigneeAvatars from "@/components/task/AssigneeAvatars";

const priorityBorder = {
  high: "border-l-accent",
  medium: "border-l-warning",
  low: "border-l-success",
};

function formatDueDate(dueDate) {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));

  const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const isOverdue = diffDays < 0;
  return { label, isOverdue };
}

export default function TaskCard({ task, onClick }) {
  const due = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-l-4 border-ink/10 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md ${
        priorityBorder[task.priority] || priorityBorder.medium
      } cursor-pointer`}
    >
      <p className="font-display text-[15px] font-medium text-ink">{task.title}</p>

      {task.labels?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium text-ink/50"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {due && (
            <span className={`text-xs ${due.isOverdue ? "text-accent" : "text-ink/40"}`}>
              {due.label}
            </span>
          )}
          {task.submission?.fileUrl && (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              Submitted
            </span>
          )}
        </div>
        <AssigneeAvatars assignees={task.assignees} />
      </div>
    </div>
  );
}
