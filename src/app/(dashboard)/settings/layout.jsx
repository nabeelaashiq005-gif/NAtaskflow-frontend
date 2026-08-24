"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MemberBar from "@/components/layout/MemberBar";
import {
  ProfileIcon,
  NotificationsIcon,
  PrivacyIcon,
  SecurityIcon,
} from "@/components/layout/navIcons";

const tabs = [
  { href: "/settings/profile", label: "Profile", icon: ProfileIcon },
  { href: "/settings/notifications", label: "Notifications", icon: NotificationsIcon },
  { href: "/settings/privacy", label: "Privacy", icon: PrivacyIcon },
  { href: "/settings/security", label: "Security", icon: SecurityIcon },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="px-6 py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Settings</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-brand hover:underline">
          ← Back to dashboard
        </Link>
      </header>

      <nav className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-ink/10 bg-white p-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-ink/60 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-6">
        <MemberBar />
        {children}
      </div>
    </div>
  );
}