"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ActiveTaskItem from "@/components/dashboard/ActiveTaskItem";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export default function AllTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tasks")
      .then(({ data }) => setTasks(data.data.tasks))
      .catch((err) => setError(err.response?.data?.message || "Could not load tasks"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Task overview"
          title="All Tasks"
          subtitle="Every task across your projects and workspaces"
          count={tasks.length}
        />
      </div>

      {isLoading && (
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <EmptyState
          icon={<ListIcon />}
          title="No tasks yet"
          body="Tasks you're assigned across all your projects will show up here."
        />
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="mt-8 divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white p-2">
          {tasks.map((task) => (
            <ActiveTaskItem key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}