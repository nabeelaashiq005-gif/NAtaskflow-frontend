"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import TaskCard from "@/components/task/TaskCard";

export default function TaskBoard({ workspaceId, projectId, projectMembers, workspaceRole }) {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isManager = workspaceRole === "owner" || workspaceRole === "admin";
  const canCreateTask = isManager;

  async function fetchTasks() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/projects/${projectId}/tasks`);
      setTasks(data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (isLoading) {
    return <p className="text-sm text-ink/50">Loading tasks...</p>;
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      <div className="mb-4 flex justify-end">
        {canCreateTask && (
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/tasks/new`}
            className="rounded-lg bg-gradient-to-r from-brand to-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + New task
          </Link>
        )}
      </div>

      <div className="divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white">
        {tasks.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink/40">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() =>
                router.push(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}