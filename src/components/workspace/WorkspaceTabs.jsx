"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkspaceTabs({ workspaceId, canManage }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/workspaces/${workspaceId}`, label: "Projects" },
    { href: `/workspaces/${workspaceId}/members`, label: "Members" },
  ];
  if (canManage) {
    tabs.push({ href: `/workspaces/${workspaceId}/settings`, label: "Settings" });
  }

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-ink/10 bg-white p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
            isActive(tab.href)
              ? "bg-accent text-white shadow-sm"
              : "text-ink/60 hover:bg-ink/5 hover:text-ink dark:text-ink/75"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}