"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";

export default function MemberBar() {
  const { user } = useAuth();
  const role = user?.role || "member";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} src={user?.avatar} size={64} />
          <div>
            <p className="font-display text-xl font-semibold text-ink">{user?.name || "—"}</p>
            <p className="text-sm text-ink/50">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:ml-auto sm:items-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              role === "owner"
                ? "bg-brand text-white"
                : role === "admin"
                ? "bg-accent/15 text-accent"
                : "bg-ink/5 text-ink/70"
            }`}
          >
            {role}
          </span>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                user?.isEmailVerified
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {user?.isEmailVerified ? "Verified" : "Email not verified"}
            </span>
            {user?.googleId && (
              <span className="rounded-full bg-brand-light/40 px-3 py-1 text-xs font-semibold text-brand-dark">
                Google connected
              </span>
            )}
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/60">
              Joined{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}