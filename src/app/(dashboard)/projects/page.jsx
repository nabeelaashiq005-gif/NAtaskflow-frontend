"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}

const PALETTE = ["bg-brand/15 text-brand", "bg-accent/15 text-accent", "bg-ink/10 text-ink/70"];

function avatarColor(index, name) {
  return PALETTE[index % PALETTE.length] || PALETTE[0];
}

function initials(name) {
  return (name || "?").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function MemberStack({ members, projectId }) {
  if (!members || members.length === 0) return null;
  const shown = members.slice(0, 3);
  const rest = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((member, i) => (
        <span
          key={`${projectId}-${member._id}`}
          title={member.name}
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white ${avatarColor(i, member.name)}`}
        >
          {initials(member.name)}
        </span>
      ))}
      {rest > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/70 ring-2 ring-white">
          +{rest}
        </span>
      )}
    </div>
  );
}

function formatDue(dueDate) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.setHours(0, 0, 0, 0) - today) / 86400000);
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  if (diff < 0) return "Past due";
  return `Due ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function buildGroups(projects) {
  const groups = {};
  for (const project of projects) {
    const key = project.workspace?._id || "other";
    const name = project.workspace?.name || "Other workspaces";
    if (!groups[key]) groups[key] = { name, projects: [] };
    groups[key].projects.push(project);
  }
  return Object.values(groups);
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/projects")
      .then(({ data }) => setProjects(data.data.projects))
      .catch((err) => setError(err.response?.data?.message || "Could not load projects"))
      .finally(() => setIsLoading(false));
  }, []);

  const groups = buildGroups(projects);
  const totalMembers = new Set(projects.flatMap((p) => (p.members || []).map((m) => m._id))).size;

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Workspace overview"
          title="Projects"
          subtitle="Every project across your workspaces"
          count={projects.length}
        />
      </div>

      {isLoading && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          icon={<FolderIcon />}
          title="No projects yet"
          body="Create a workspace, then add a project to start organizing your work."
          action={
            <Link
              href="/workspaces"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Go to workspaces
            </Link>
          }
        />
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="mt-8 space-y-6">
          {totalMembers > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {projects.length} project{projects.length > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/60">
                {totalMembers} member{totalMembers > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {groups.map((group) => (
            <section key={group.name}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                  {group.name}
                </h2>
                <span className="text-xs font-medium text-ink/40">
                  {group.projects.length} project{group.projects.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {group.projects.map((project, i) => (
                  <Link
                    key={project._id}
                    href={`/workspaces/${project.workspace?._id || project.workspace}/projects/${project._id}`}
                    className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${avatarColor(i, project.name)}`}
                      >
                        {initials(project.name)}
                      </span>
                      {project.dueDate && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            formatDue(project.dueDate)?.includes("Past")
                              ? "bg-accent/10 text-accent"
                              : "bg-ink/5 text-ink/60"
                          }`}
                        >
                          {formatDue(project.dueDate)}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold text-ink group-hover:text-brand">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink/60">{project.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-3">
                      <MemberStack members={project.members} projectId={project._id} />
                      <span className="text-xs font-medium text-ink/40">
                        {project.members?.length || 0} member{project.members?.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}