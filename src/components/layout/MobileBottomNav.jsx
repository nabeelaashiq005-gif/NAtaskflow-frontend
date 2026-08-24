"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  WorkspacesIcon,
  InvitationsIcon,
  NotificationsIcon,
} from "@/components/layout/navIcons";

export default function MobileBottomNav({ pendingCount, unreadNotifications }) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Home", icon: DashboardIcon },
    { href: "/workspaces", label: "Spaces", icon: WorkspacesIcon },
    { href: "/invitations", label: "Invites", icon: InvitationsIcon, badge: pendingCount },
    { href: "/notifications", label: "Alerts", icon: NotificationsIcon, badge: unreadNotifications },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-stretch justify-between px-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-ink/40"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className={`text-[10px] font-medium ${isActive ? "text-ink" : "text-ink/40"}`}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="absolute right-3.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-white">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}