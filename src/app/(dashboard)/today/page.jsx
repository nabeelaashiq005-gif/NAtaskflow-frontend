"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ActiveTaskItem from "@/components/dashboard/ActiveTaskItem";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function buildGroups(tasks) {
  const groups = {};
  for (const task of tasks) {
    const key = task.project?._id || "uncategorized";
    const name = task.project?.name || "Uncategorized";
    if (!groups[key]) groups[key] = { name, tasks: [] };
    groups[key].tasks.push(task);
  }
  return groups;
}

export default function TodayPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tasks/today")
      .then(({ data }) => setTasks(data.data.tasks))
      .catch((err) => setError(err.response?.data?.message || "Could not load today's tasks"))
      .finally(() => setIsLoading(false));
  }, []);

  const groupList = Object.values(buildGroups(tasks));
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Task overview"
          title="Today"
          subtitle={todayLabel}
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
          icon={<CalendarIcon />}
          title="You're all caught up"
          body="Nothing is due today. Enjoy the calm, or get ahead on what's coming up."
        />
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="mt-8 space-y-6">
          {groupList.map((group) => (
            <section key={group.name}>
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                  {group.name}
                </h2>
                <span className="text-xs font-medium text-ink/40">
                  {group.tasks.length} task{group.tasks.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white p-2">
                {group.tasks.map((task) => (
                  <ActiveTaskItem key={task._id} task={task} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}