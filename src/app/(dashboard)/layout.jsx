"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import api from "@/lib/axios";

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
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
  }, [pathname, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-11 w-11 animate-pulse items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            N
          </span>
          <p className="text-sm text-ink/40">Loading NATaskFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar pendingCount={pendingCount} unreadNotifications={unreadNotifications} />
      <TopNav pendingCount={pendingCount} unreadNotifications={unreadNotifications} />
      <main key={pathname} className="page-enter pt-16 pb-20 md:pb-12 md:pl-60 md:pt-16">
        {children}
      </main>
      <MobileBottomNav pendingCount={pendingCount} unreadNotifications={unreadNotifications} />
    </div>
  );
}