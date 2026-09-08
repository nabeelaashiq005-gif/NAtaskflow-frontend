"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SettingsIcon } from "@/components/layout/navIcons";
import NotificationDropdown from "@/components/layout/NotificationDropdown";

export default function TopNav({ unreadNotifications }) {
  const { user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-30 hidden h-16 border-b border-ink/10 bg-white md:block md:left-60">
      <div className="flex h-full items-center justify-between gap-2 px-6">
        <span className="text-sm font-semibold text-ink">Smart collaboration Dashboard</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationDropdown unreadNotifications={unreadNotifications} />
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink dark:text-ink/75"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>
          <Link href="/settings/profile" className="ml-2 block">
            <Avatar name={user?.name} src={user?.avatar} size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}