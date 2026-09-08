"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";
import TaskBoard from "@/components/task/TaskBoard";

const statusColors = {
  active: "bg-ink/10 text-ink",
  archived: "bg-ink/10 text-ink/60",
  completed: "bg-success/10 text-success",
};

export default function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [myWorkspaceRole, setMyWorkspaceRole] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/projects/${projectId}`);
        setProject(data.data.project);
        setMyWorkspaceRole(data.data.myWorkspaceRole);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this project");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-5 w-full max-w-lg" />
          <Skeleton className="h-16 rounded-2xl" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12">
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
        <Link
          href={`/workspaces/${workspaceId}`}
          className="mt-4 inline-block text-sm text-brand hover:underline"
        >
          ← Back to workspace
        </Link>
      </div>
    );
  }

  const canEdit = myWorkspaceRole !== "viewer";

  return (
    <div className="px-6 py-12">
      <Link href={`/workspaces/${workspaceId}`} className="text-sm text-brand hover:underline">
        ← Back to workspace
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
              {project.name}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                statusColors[project.status] || statusColors.active
              }`}
            >
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="mt-2 max-w-2xl text-base text-ink/60">{project.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink/50">
            {project.dueDate && (
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Due {new Date(project.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {project.members?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {project.members.length} member{project.members.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {(myWorkspaceRole === "owner" || myWorkspaceRole === "admin") && (
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
            className="rounded-xl border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Settings
          </Link>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink/50">
          Assigned members
        </h2>
        {project.members.length === 0 ? (
          <p className="text-sm text-ink/50">No members assigned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {project.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-3"
              >
                <Avatar name={member.name} src={member.avatar} size={28} />
                <span className="text-sm text-ink">{member.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink/50">
          Tasks
        </h2>
        <TaskBoard
          workspaceId={workspaceId}
          projectId={projectId}
          projectMembers={project.members}
          canEdit={myWorkspaceRole !== "viewer"}
          workspaceRole={myWorkspaceRole}
        />
      </div>
    </div>
  );
}
