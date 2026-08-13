"use client";

import { useState } from "react";
import TaskCard from "@/components/task/TaskCard";

export default function TaskColumn({
  title,
  status,
  tasks,
  canDrop,
  canCreateTask,
  getCanEditTask,
  onTaskClick,
  onDragStartTask,
  onDropTask,
  onAddClick,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e) {
    if (!canDrop) return;
    e.preventDefault(); // required to allow dropping
    setIsDragOver(true);
  }

  function handleDrop(e) {
    if (!canDrop) return;
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    onDropTask(taskId, status);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex-1 rounded-2xl p-3 transition-colors ${
        isDragOver ? "bg-brand-light/20" : "bg-ink/5"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-ink/70">
          {title} <span className="text-ink/40">({tasks.length})</span>
        </h3>
        {canCreateTask && status === "todo" && (
          <button
            onClick={onAddClick}
            className="text-sm font-medium text-brand hover:underline"
          >
            + Add
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canEdit={getCanEditTask(task)}
            onClick={() => onTaskClick(task)}
            onDragStart={onDragStartTask}
          />
        ))}
        {tasks.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-ink/30">No tasks</p>
        )}
      </div>
    </div>
  );
}
