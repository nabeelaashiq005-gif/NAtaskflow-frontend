"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ActivityFeed from "@/components/activity/ActivityFeed";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

const projectStatusColors = {
  active: "bg-ink/10 text-ink",
  archived: "bg-ink/10 text-ink/60",
  completed: "bg-green-100 text-green-700",
};

function ProjectRow({ project, workspaceId }) {
  return (
    <Link
      href={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-bold text-white">
        {(project.name || "?")
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold text-ink">{project.name}</p>
        {project.description && <p className="truncate text-sm text-ink/60">{project.description}</p>}
      </div>
      <div className="hidden shrink-0 items-center gap-3 text-xs text-ink/40 sm:flex">
        <span>
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </span>
        {project.dueDate && (
          <span>
            Due{" "}
            {new Date(project.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
          projectStatusColors[project.status] || projectStatusColors.active
        }`}
      >
        {project.status}
      </span>
    </Link>
  );
}

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function workspaceInitials(name) {
  return (name || "?").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function WorkspaceHomePage() {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const isManager = myRole === "owner" || myRole === "admin";

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      const [workspaceRes, projectsRes] = await Promise.all([
        api.get(`/workspaces/${workspaceId}`),
        api.get(`/workspaces/${workspaceId}/projects`),
      ]);
      setWorkspace(workspaceRes.data.data.workspace);
      setMyRole(workspaceRes.data.data.myRole);
      setProjects(projectsRes.data.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this workspace");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <div className="h-16 animate-pulse rounded-2xl bg-ink/5" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12">
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
        <Link href="/workspaces" className="mt-4 inline-block text-sm text-brand hover:underline">
          ← Back to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <Link href="/workspaces" className="text-sm text-brand hover:underline">
        ← All workspaces
      </Link>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Workspace</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
            {workspaceInitials(workspace.name)}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">{workspace.name}</h1>
            {workspace.description && (
              <p className="mt-1 text-sm text-ink/60">{workspace.description}</p>
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <WorkspaceTabs workspaceId={workspaceId} canManage={isManager} />
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink/70">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold capitalize text-ink/60">
              {myRole}
            </span>
          </div>
        </div>
      </header>

      <div className={`mt-8 grid grid-cols-1 gap-8 ${isManager ? "lg:grid-cols-4" : ""}`}>
        <div className={isManager ? "lg:col-span-3" : ""}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
              Projects
            </h2>
            {isManager && (
              <Link href={`/workspaces/${workspaceId}/projects/new`}>
                <Button fullWidth={false} className="px-4">
                  + New project
                </Button>
              </Link>
            )}
          </div>

          {projects.length === 0 && (
            <EmptyState
              icon={<FolderIcon />}
              title="No projects yet"
              body={
                isManager
                  ? "Create the first project to start organizing tasks in this workspace."
                  : "No projects have been created in this workspace yet."
              }
              action={
                isManager ? (
                  <Link href={`/workspaces/${workspaceId}/projects/new`}>
                    <Button fullWidth={false} className="px-4">
                      Create your first project
                    </Button>
                  </Link>
                ) : null
              }
            />
          )}

          {projects.length > 0 && (
            <div className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
              {projects.map((project) => (
                <ProjectRow key={project._id} project={project} workspaceId={workspaceId} />
              ))}
            </div>
          )}
        </div>

        {isManager && (
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
              Recent activity
            </h2>
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <ActivityFeed workspaceId={workspaceId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}