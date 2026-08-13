"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import CompletionRing from "@/components/dashboard/CompletionRing";
import ActiveTaskItem from "@/components/dashboard/ActiveTaskItem";
import AssignedTaskItem from "@/components/dashboard/AssignedTaskItem";
import NotificationPreviewItem from "@/components/dashboard/NotificationPreviewItem";
import OnboardingDashboard from "@/components/dashboard/OnboardingDashboard";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setError("");
      try {
        const [dashboardRes, notificationsRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/notifications"),
        ]);
        setStats(dashboardRes.data.data);
        setNotifications(notificationsRes.data.data.notifications.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 py-12">
      {!isLoading && !error && stats && stats.totalWorkspaces > 0 && (
        <div className="mt-2">
          <PageHeader
            eyebrow={todayLabel}
            title={`Welcome back, ${firstName}`}
            subtitle={user?.email}
          />
        </div>
      )}

      {isLoading && (
        <div className="mt-10 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && stats && stats.totalWorkspaces === 0 && <OnboardingDashboard />}
      {!isLoading && !error && stats && stats.totalWorkspaces > 0 && (
        <>
          <div className="mt-8">
            <CompletionRing completed={stats.completedTasks} total={stats.totalTasks} />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-ink/50">
            Across all your workspaces
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Workspaces" value={stats.totalWorkspaces} color="brand" />
            <StatCard label="Projects" value={stats.totalProjects} color="brand" />
            <StatCard label="Total Tasks" value={stats.totalTasks} color="brand" />
            <StatCard label="Completed" value={stats.completedTasks} color="green" />
            <StatCard label="Overdue" value={stats.overdueTasks} color="red" />
          </div>

          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-ink/50">
            My tasks
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Assigned to me" value={stats.myTasks.total} color="brand" />
            <StatCard label="Completed" value={stats.myTasks.completed} color="green" />
            <StatCard label="Pending" value={stats.myTasks.pending} color="amber" />
            <StatCard label="Overdue" value={stats.myTasks.overdue} color="red" />
          </div>

          <div className="mb-6 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 lg:col-span-2">
              <h2 className="mb-1 px-3 text-sm font-medium uppercase tracking-wide text-ink/50">
                Active Tasks
              </h2>
              {stats.myActiveTasks.length === 0 ? (
                <p className="px-3 py-6 text-sm text-ink/40">
                  Nothing assigned to you right now.
                </p>
              ) : (
                <div className="divide-y divide-ink/5">
                  {stats.myActiveTasks.map((task) => (
                    <ActiveTaskItem key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <h2 className="mb-1 px-3 text-sm font-medium uppercase tracking-wide text-ink/50">
                Recent notifications
              </h2>
              {notifications.length === 0 ? (
                <p className="px-3 py-6 text-sm text-ink/40">Nothing new yet.</p>
              ) : (
                <div className="divide-y divide-ink/5">
                  {notifications.map((n) => (
                    <NotificationPreviewItem key={n._id} notification={n} />
                  ))}
                </div>
              )}
              <Link
                href="/notifications"
                className="mt-1 block px-3 py-2 text-xs font-medium text-brand hover:underline"
              >
                View all
              </Link>
            </div>
          </div>

          {stats.tasksAssignedByMe.length > 0 && (
            <div className="mb-16 rounded-2xl border border-ink/10 bg-white p-4">
              <h2 className="mb-1 px-3 text-sm font-medium uppercase tracking-wide text-ink/50">
                Assigned by You
              </h2>
              <div className="divide-y divide-ink/5">
                {stats.tasksAssignedByMe.map((task) => (
                  <AssignedTaskItem key={task._id} task={task} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
