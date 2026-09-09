"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  DashboardIcon,
  TodayIcon,
  UpcomingIcon,
  AllTasksIcon,
  ProjectsIcon,
  SearchIcon,
  WorkspacesIcon,
  InvitationsIcon,
  SettingsIcon,
  LogoutIcon,
  FlowMark,
} from "@/components/layout/navIcons";
import NotificationDropdown from "@/components/layout/NotificationDropdown";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/today", label: "Today", icon: TodayIcon },
  { href: "/upcoming", label: "Upcoming", icon: UpcomingIcon },
  { href: "/tasks", label: "All Tasks", icon: AllTasksIcon },
  { href: "/projects", label: "Projects", icon: ProjectsIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/workspaces", label: "Workspaces", icon: WorkspacesIcon },
  { href: "/invitations", label: "Invitations", icon: InvitationsIcon, badge: true },
];

const secondaryNav = [{ href: "/settings", label: "Settings", icon: SettingsIcon }];

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DrawerItem({ item, pathname, pendingCount, onNavigate }) {
  const isActive = pathname.startsWith(item.href);
  const Icon = item.icon;
  const badge = item.badge ? pendingCount : 0;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-accent text-white"
          : "text-white/75 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          isActive ? "text-white" : "text-white/55 group-hover:text-white/80"
        }`}
      />
      <span className="flex-1">{item.label}</span>
      {badge > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
            isActive ? "bg-white/25 text-white" : "bg-accent text-white"
          }`}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}

export default function TopNav({ pendingCount = 0, unreadNotifications }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-ink/10 bg-white md:left-60">
        <div className="flex h-full items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink md:hidden"
            >
              <MenuIcon />
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2 md:hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                <FlowMark className="h-4 w-4" />
              </span>
              <span className="hidden truncate font-display text-base font-semibold text-ink min-[400px]:inline">
                NATaskFlow
              </span>
            </Link>
            <span className="hidden truncate text-sm font-semibold text-ink md:block">
              Smart collaboration Dashboard
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <NotificationDropdown unreadNotifications={unreadNotifications} />
            <Link
              href="/settings"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink dark:text-ink/75 sm:flex"
            >
              <SettingsIcon className="h-5 w-5" />
            </Link>
            <Link href="/settings/profile" className="ml-1 block" onClick={() => setIsOpen(false)}>
              <Avatar name={user?.name} src={user?.avatar} size={40} />
            </Link>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink text-white transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink dark:bg-white/10 dark:text-white">
              <FlowMark className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-base font-semibold leading-tight">
                NATaskFlow
              </span>
              <span className="block text-xs leading-tight text-white/50">Smart collaboration</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {primaryNav.map((item) => (
            <DrawerItem
              key={item.href}
              item={item}
              pathname={pathname}
              pendingCount={pendingCount}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          {secondaryNav.map((item) => (
            <DrawerItem key={item.href} item={item} pathname={pathname} onNavigate={() => setIsOpen(false)} />
          ))}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogoutIcon className="h-[18px] w-[18px] text-white/55" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}