"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Toggle from "@/components/ui/Toggle";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import SettingsSection from "@/components/settings/SettingsSection";

const typeIcons = {
  task_assigned: { icon: AssignmentIcon, classes: "bg-brand/10 text-brand" },
  workspace_invited: { icon: EnvelopeIcon, classes: "bg-brand/10 text-brand" },
  task_submitted: { icon: PaperclipIcon, classes: "bg-ink/10 text-ink/60" },
  task_updated: { icon: EditIcon, classes: "bg-ink/10 text-ink/60" },
  due_date_reminder: { icon: ClockIcon, classes: "bg-accent/10 text-accent" },
  general: { icon: MegaphoneIcon, classes: "bg-ink/10 text-ink/60" },
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

function AssignmentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7" />
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

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
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

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

const NOTIFICATION_OPTIONS = [
  {
    key: "taskAssigned",
    icon: AssignmentIcon,
    title: "New task assigned",
    description: "When someone assigns you a new task",
  },
  {
    key: "dueDateReminder",
    icon: ClockIcon,
    title: "Due date reminder",
    description: "When one of your tasks is about to be due",
  },
  {
    key: "taskUpdated",
    icon: EditIcon,
    title: "Task revised",
    description: "When a task assigned to you is updated or revised",
  },
  {
    key: "budgetAlerts",
    icon: BudgetIcon,
    title: "Budget alerts",
    description: "When a project's budget or deadline is approaching",
  },
  {
    key: "generalNotifications",
    icon: MegaphoneIcon,
    title: "General notifications",
    description: "Announcements and updates from the app",
  },
];

export default function SettingsNotificationsPage() {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences(user.notificationPreferences);
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/notifications")
      .then(({ data }) => setNotifications(data.data.notifications.slice(0, 5)))
      .catch(() => setNotifications([]));
  }, []);

  async function handleToggle(key, value) {
    const previous = preferences;
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setSavingKey(key);
    try {
      const { data } = await api.patch("/users/me/notification-preferences", {
        [key]: value,
      });
      setPreferences(data.data.notificationPreferences);
      updateUser({ notificationPreferences: data.data.notificationPreferences });
    } catch (error) {
      setPreferences(previous);
      toast.error(error.response?.data?.message || "Could not update preference");
    } finally {
      setSavingKey(null);
    }
  }

  if (!preferences) {
    return <Skeleton className="h-40 rounded-2xl" />;
  }

  const enabledCount = NOTIFICATION_OPTIONS.filter((o) => preferences[o.key]).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BellIcon />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-ink">Notification summary</p>
              <p className="text-sm text-ink/50">
                Updates that reach you about tasks and workspaces
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              {enabledCount} of {NOTIFICATION_OPTIONS.length} enabled
            </span>
            {enabledCount === NOTIFICATION_OPTIONS.length && (
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/60">
                All on
              </span>
            )}
          </div>
        </div>
      </section>

      <SettingsSection
        icon={<BellIcon />}
        title="Your notifications"
        description="Your most recent notifications, all in one place."
      >
        {notifications === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-ink/5" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<BellIcon />}
            title="You're all caught up"
            body="No notifications right now. Updates about your tasks and workspaces will appear here."
          />
        ) : (
          <ul className="divide-y divide-ink/10">
            {notifications.map((notification) => {
              const type = notificationIcon(notification.type);
              const TypeIcon = type.icon;
              return (
                <li key={notification._id} className="flex items-start gap-3 py-3">
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
                    <p className="mt-0.5 text-xs text-ink/40">{timeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <Link
          href="/notifications"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-accent"
        >
          View all notifications
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </SettingsSection>

      <SettingsSection
        icon={<BellIcon />}
        title="Notification preferences"
        description="Choose which notifications you'd like to receive."
      >
        <ul className="divide-y divide-ink/10">
          {NOTIFICATION_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            return (
              <li key={option.key} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink/50">
                    <OptionIcon />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{option.title}</p>
                    <p className="text-sm text-ink/50">{option.description}</p>
                  </div>
                </div>
                <Toggle
                  checked={!!preferences[option.key]}
                  disabled={savingKey === option.key}
                  label={option.title}
                  onChange={(value) => handleToggle(option.key, value)}
                />
              </li>
            );
          })}
        </ul>
      </SettingsSection>
    </div>
  );
}