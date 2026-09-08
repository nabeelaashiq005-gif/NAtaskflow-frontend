"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Button from "@/components/ui/Button";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function WorkspaceRow({ workspace }) {
  const roleColors = {
    owner: "bg-accent text-white",
    admin: "bg-ink/10 text-ink",
    member: "bg-ink/10 text-ink/70",
    viewer: "bg-ink/5 text-ink/50",
  };
  return (
    <Link
      href={`/workspaces/${workspace._id}`}
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
        {(workspace.name || "?")
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold text-ink">{workspace.name}</p>
        {workspace.description && (
          <p className="truncate text-sm text-ink/60">{workspace.description}</p>
        )}
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
          roleColors[workspace.myRole] || roleColors.member
        }`}
      >
        {workspace.myRole}
      </span>
    </Link>
  );
}

function WorkspaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchWorkspaces() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/workspaces");
      setWorkspaces(data.data.workspaces);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load workspaces");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Your space"
          title="Workspaces"
          subtitle="Organize your projects and team members"
          count={workspaces.length}
        />
        <Link href="/workspaces/new">
          <Button fullWidth={false} className="shrink-0 px-4 sm:mb-1">
            + New workspace
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && workspaces.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={<WorkspaceIcon />}
            title="No workspaces yet"
            body="A workspace keeps your projects and team together. Create your first one to get started."
            action={
              <Link href="/workspaces/new">
                <Button fullWidth={false} className="px-4">
                  Create your first workspace
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {!isLoading && !error && workspaces.length > 0 && (
        <div className="mt-8 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
          {workspaces.map((workspace) => (
            <WorkspaceRow key={workspace._id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}