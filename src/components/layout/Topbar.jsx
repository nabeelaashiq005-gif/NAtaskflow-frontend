"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { NotificationsIcon, SettingsIcon } from "@/components/layout/navIcons";
import api from "@/lib/axios";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspaces", label: "Workspaces" },
];

export default function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    async function fetchBadgeCounts() {
      try {
        const [invitesRes, notifsRes] = await Promise.all([
          api.get("/workspaces/invitations/pending"),
          api.get("/notifications"),
        ]);
        setPendingCount(invitesRes.data.data.invitations.length);
        setUnreadNotifications(notifsRes.data.data.unreadCount);
      } catch {
        // silently ignore — badges just won't show a count
      }
    }
    fetchBadgeCounts();
  }, [pathname]);

  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border-l-[3px] border-l-accent bg-ink/5 font-display text-xs font-semibold text-ink">
              T
            </span>
            <span className="font-display text-lg font-semibold text-ink">NATaskFlow</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${
                    isActive ? "text-brand" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/invitations"
              className={`relative text-sm font-medium ${
                pathname.startsWith("/invitations") ? "text-brand" : "text-ink/60 hover:text-ink"
              }`}
            >
              Invitations
              {pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="relative text-ink/60 hover:text-ink"
            aria-label="Notifications"
          >
            <NotificationsIcon className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            className={`text-ink/60 hover:text-ink ${
              pathname.startsWith("/settings") ? "text-brand" : ""
            }`}
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>
          <Link href="/settings/profile">
            <Avatar name={user?.name} src={user?.avatar} size={32} />
          </Link>
          <button
            onClick={logout}
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}