"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ActiveTaskItem from "@/components/dashboard/ActiveTaskItem";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function CalendarClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M12 7v5l3 2" />
      <path d="M15 2v4h4" />
    </svg>
  );
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function buildGroups(tasks) {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(now);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(tomorrow);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const groups = [
    { key: "tomorrow", label: "Tomorrow", tasks: [] },
    { key: "week", label: "This week", tasks: [] },
    { key: "later", label: "Later", tasks: [] },
  ];
  const map = { tomorrow: 0, week: 1, later: 2 };

  for (const task of tasks) {
    const due = startOfDay(task.dueDate);
    let bucket = "later";
    if (due === startOfDay(tomorrow) && due >= today) bucket = "tomorrow";
    else if (due < weekEnd.getTime() && due >= startOfDay(tomorrow)) bucket = "week";
    groups[map[bucket]].tasks.push(task);
  }
  return groups;
}

export default function UpcomingPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tasks/upcoming")
      .then(({ data }) => setTasks(data.data.tasks))
      .catch((err) => setError(err.response?.data?.message || "Could not load upcoming tasks"))
      .finally(() => setIsLoading(false));
  }, []);

  const groups = buildGroups(tasks).filter((g) => g.tasks.length > 0);

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Task overview"
          title="Upcoming"
          subtitle="Tasks due over the next few days"
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
          icon={<CalendarClockIcon />}
          title="Nothing on the horizon"
          body="No upcoming deadlines right now. New tasks with due dates will show up here."
        />
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="mt-8 space-y-6">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                  {group.label}
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