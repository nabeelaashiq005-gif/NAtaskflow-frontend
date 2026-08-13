"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Button from "@/components/ui/Button";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57a4 4 0 1 1 5.66 5.66l-8.57 8.57a2 2 0 1 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

const typeIcons = {
  task_assigned: { icon: AssignmentIcon, classes: "bg-brand/10 text-brand" },
  workspace_invited: { icon: EnvelopeIcon, classes: "bg-brand/10 text-brand" },
  task_submitted: { icon: PaperclipIcon, classes: "bg-ink/10 text-ink/60" },
  task_updated: { icon: EditIcon, classes: "bg-ink/10 text-ink/60" },
  due_date_reminder: { icon: ClockIcon, classes: "bg-accent/10 text-accent" },
};

function notificationIcon(type) {
  return typeIcons[type] || { icon: BellIcon, classes: "bg-ink/10 text-ink/60" };
}

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

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  async function fetchNotifications() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data.notifications);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load notifications");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function handleClick(notification) {
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
      } catch {
        // non-critical — still navigate even if marking-as-read fails
      }
    }
    if (notification.link) {
      router.push(notification.link);
    }
  }

  async function handleMarkAllRead() {
    setIsMarkingAll(true);
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.response?.data?.message || "Could not mark all as read");
    } finally {
      setIsMarkingAll(false);
    }
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Stay in the loop"
          title="Notifications"
          subtitle="Updates on tasks and invitations"
          count={notifications.filter((n) => !n.isRead).length}
        />
        <Button
          variant="ghost"
          fullWidth={false}
          className="shrink-0 px-4 sm:mb-1"
          isLoading={isMarkingAll}
          disabled={!hasUnread}
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </Button>
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

      {!isLoading && !error && notifications.length === 0 && (
        <EmptyState
          icon={<BellIcon />}
          title="You're all caught up"
          body="No notifications right now. Updates about your tasks and workspaces will appear here."
        />
      )}

      {!isLoading && !error && notifications.length > 0 && (
        <div className="mt-8 flex flex-col gap-2">
          {notifications.map((notification) => {
            const type = notificationIcon(notification.type);
            const TypeIcon = type.icon;
            return (
              <button
                key={notification._id}
                onClick={() => handleClick(notification)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  notification.isRead
                    ? "border-ink/10 bg-white"
                    : "border-brand-light bg-brand-light/10 shadow-sm"
                } hover:bg-ink/5`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${type.classes}`}
                >
                  <TypeIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${notification.isRead ? "text-ink/70" : "font-medium text-ink"}`}
                  >
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}