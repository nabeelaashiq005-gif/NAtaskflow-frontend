"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

function NavItem({ href, label, icon: Icon, isActive, badge }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
        }`}
      />
      <span className="flex-1">{label}</span>
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

export default function Sidebar({ pendingCount, unreadNotifications }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const primaryNav = [
    { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
    { href: "/today", label: "Today", icon: TodayIcon },
    { href: "/upcoming", label: "Upcoming", icon: UpcomingIcon },
    { href: "/tasks", label: "All Tasks", icon: AllTasksIcon },
    { href: "/projects", label: "Projects", icon: ProjectsIcon },
    { href: "/search", label: "Search", icon: SearchIcon },
    { href: "/workspaces", label: "Workspaces", icon: WorkspacesIcon },
    { href: "/invitations", label: "Invitations", icon: InvitationsIcon, badge: pendingCount },
  ];

  const secondaryNav = [{ href: "/settings", label: "Settings", icon: SettingsIcon }];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-ink text-white md:flex">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink">
          <FlowMark className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-base font-semibold leading-tight">
            NATaskFlow
          </span>
          <span className="block text-xs leading-tight text-white/40">Smart collaboration</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {primaryNav.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname.startsWith(item.href)} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-4">
        {secondaryNav.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname.startsWith(item.href)} />
        ))}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogoutIcon className="h-[18px] w-[18px] text-white/40" />
          Log out
        </button>
      </div>
    </aside>
  );
}
