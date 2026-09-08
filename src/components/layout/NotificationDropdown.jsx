"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { NotificationsIcon } from "@/components/layout/navIcons";

const typeIcons = {
  task_assigned: "bg-brand/10 text-brand",
  workspace_invited: "bg-brand/10 text-brand",
  task_submitted: "bg-ink/10 text-ink/60",
  task_updated: "bg-ink/10 text-ink/60",
  due_date_reminder: "bg-accent/10 text-accent",
};

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <path
        d="M5 8a5 5 0 0110 0c0 3 1 4.5 1.5 5H3.5C4 12.5 5 11 5 8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PenIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M13.2 3.2l3.6 3.6L6.5 17.1l-4 1 1-4L13.2 3.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
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

export default function NotificationDropdown({ unreadNotifications }) {
  const router = useRouter();
  const boxRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data.notifications);
    } catch {
      // silently ignore — dropdown just won't list anything
    } finally {
      setIsLoading(false);
    }
  }

  function toggle() {
    setIsOpen((open) => {
      if (!open) fetchNotifications();
      return !open;
    });
  }

  async function handleClick(notification) {
    setIsOpen(false);
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification._id}/read`);
      } catch {
        // non-critical — still navigate even if marking-as-read fails
      }
    }
    if (notification.link) {
      router.push(notification.link);
    }
  }

  async function handleMarkAllRead() {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silently ignore
    }
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={toggle}
        aria-label="Notifications"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/5 ${
          isOpen ? "text-ink" : "text-ink/50 hover:text-ink dark:text-ink/75"
        }`}
      >
        <NotificationsIcon className="h-5 w-5" />
        {unreadNotifications > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-white">
            {unreadNotifications > 9 ? "9+" : unreadNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl shadow-ink/10 sm:w-96">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <PenIcon className="h-4 w-4 text-ink/50" />
              Notifications
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={!hasUnread}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-3 p-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-ink/5" />
                ))}
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-ink/40">
                <BellIcon />
                No notifications yet
              </p>
            )}

            {!isLoading && notifications.length > 0 && (
              <div className="divide-y divide-ink/5">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleClick(notification)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                      notification.isRead ? "bg-white hover:bg-ink/5" : "bg-brand-light/10 hover:bg-brand-light/20"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        typeIcons[notification.type] || "bg-ink/10 text-ink/60"
                      }`}
                    >
                      <BellIcon />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm ${notification.isRead ? "text-ink/70" : "font-medium text-ink"}`}
                      >
                        {notification.message}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink/40">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </span>
                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-ink/10 p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/notifications");
              }}
              className="w-full rounded-xl px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}