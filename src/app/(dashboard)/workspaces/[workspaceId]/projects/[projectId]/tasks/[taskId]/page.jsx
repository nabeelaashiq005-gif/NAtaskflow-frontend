"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import assetUrl from "@/lib/assetUrl";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";
import PriorityBadge from "@/components/task/PriorityBadge";
import CommentSection from "@/components/comment/CommentSection";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SubmissionSection({ task, currentUserId, onSubmissionUploaded }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const isAssignee = task.assignees?.some((a) => a._id === currentUserId);
  const submission = task.submission;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post(`/tasks/${task._id}/submission`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSubmissionUploaded(data.data.task);
      toast.success("Work submitted");
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!isAssignee && !submission?.fileUrl) return null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
        Submission
      </p>

      {submission?.fileUrl ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-ink/[0.02] p-4">
          <div className="min-w-0">
            <a
              href={assetUrl(submission.fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-medium text-brand hover:underline"
            >
              {submission.fileName}
            </a>
            <p className="mt-0.5 text-xs text-ink/40">
              {submission.uploadedBy?.name || "Someone"} · {formatDate(submission.uploadedAt)}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
            Submitted
          </span>
        </div>
      ) : (
        <p className="rounded-xl bg-ink/[0.02] p-4 text-sm text-ink/40">Nothing submitted yet.</p>
      )}

      {isAssignee && (
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.zip"
            onChange={handleFileChange}
            className="hidden"
            id={`submission-input-${task._id}`}
          />
          <label
            htmlFor={`submission-input-${task._id}`}
            className="inline-block cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {isUploading
              ? "Uploading..."
              : submission?.fileUrl
                ? "Replace file"
                : "Upload your work (PDF or ZIP, max 50MB)"}
          </label>
          {error && <p className="mt-1.5 text-xs text-accent">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [workspaceRole, setWorkspaceRole] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchTask() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setTask(data.data.task);
        setCanEdit(data.data.canEdit || false);
        setWorkspaceRole(data.data.workspaceRole || "");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this task");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    async function fetchProjectMembers() {
      if (!task) return;
      try {
        const { data } = await api.get(`/projects/${task.project._id}`);
        setProjectMembers(data.data.project?.members || []);
      } catch {
        // non-fatal — assignee picker simply falls back to current assignees
      }
    }
    fetchProjectMembers();
  }, [task]);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
      setSelectedAssignees(task.assignees.map((a) => a._id));
    }
  }, [task, reset]);

  function toggleAssignee(userId) {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function onSave(values) {
    setServerError("");
    setIsSaving(true);
    try {
      const { data } = await api.patch(`/tasks/${task._id}`, values);
      if (canEdit) {
        await api.patch(`/tasks/${task._id}/assign`, { assignees: selectedAssignees });
      }
      const refreshed = await api.get(`/tasks/${task._id}`);
      setTask(refreshed.data.data.task);
      setIsEditing(false);
      toast.success("Task updated");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not delete task");
    }
  }

  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="px-6 py-12">
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {error || "Task not found"}
        </p>
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}`}
          className="mt-4 inline-block text-sm text-brand hover:underline"
        >
          ← Back to project
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <Link
        href={`/workspaces/${workspaceId}/projects/${projectId}`}
        className="text-sm text-brand hover:underline"
      >
        ← Back to {task.project?.name || "project"}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-ink">{task.title}</h1>
          <p className="mt-1 text-xs text-ink/40">
            {task.workspace?.name || "Workspace"} · {task.project?.name || "Project"}
            {task.createdBy?.name && <> · Assigned by {task.createdBy.name}</>}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="shrink-0 rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
          >
            {isEditing ? "Cancel" : "Edit task"}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
          {statusLabels[task.status] || task.status}
        </span>
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
            Due {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.description && (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
            Description
          </p>
          <p className="whitespace-pre-wrap text-sm text-ink/70">{task.description}</p>
        </div>
      )}

      {task.assignees?.length > 0 && (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
            Assignees
          </p>
          <div className="flex flex-wrap gap-2">
            {task.assignees.map((a) => (
              <span
                key={a._id}
                className="flex items-center gap-1.5 rounded-full border border-ink/10 px-2.5 py-1 text-xs text-ink/70"
              >
                <Avatar name={a.name} src={a.avatar} size={18} />
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {isEditing && canEdit && (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
          <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off">
            <Input
              id="editTaskTitle"
              label="Title"
              autoComplete="off"
              error={errors.title?.message}
              {...register("title", {
                required: "Title is required",
                minLength: { value: 2, message: "Title must be at least 2 characters" },
              })}
            />
            <Input
              id="editTaskDescription"
              label="Description"
              autoComplete="off"
              {...register("description")}
            />

            <div className="mb-4 flex gap-3">
              <div className="flex-1">
                <label
                  htmlFor="editTaskStatus"
                  className="mb-1.5 block text-sm font-medium text-ink/80"
                >
                  Status
                </label>
                <select
                  id="editTaskStatus"
                  {...register("status")}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="editTaskPriority"
                  className="mb-1.5 block text-sm font-medium text-ink/80"
                >
                  Priority
                </label>
                <select
                  id="editTaskPriority"
                  {...register("priority")}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <Input id="editTaskDueDate" label="Due date" type="date" {...register("dueDate")} />

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Assignees</label>
              <div className="flex flex-wrap gap-2">
                {projectMembers.length > 0
                  ? projectMembers.map((member) => (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => toggleAssignee(member._id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          selectedAssignees.includes(member._id)
                            ? "border-brand bg-accent text-white"
                            : "border-ink/15 text-ink/60 hover:bg-ink/5"
                        }`}
                      >
                        {member.name}
                      </button>
                    ))
                  : task.assignees.length > 0 &&
                    task.assignees.map((member) => (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => toggleAssignee(member._id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          selectedAssignees.includes(member._id)
                            ? "border-brand bg-accent text-white"
                            : "border-ink/15 text-ink/60 hover:bg-ink/5"
                        }`}
                      >
                        {member.name}
                      </button>
                    ))}
              </div>
            </div>

            {serverError && (
              <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
                {serverError}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Button type="submit" isLoading={isSaving} fullWidth={false} className="px-6">
                Save changes
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-accent hover:underline"
              >
                Delete task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        <SubmissionSection
          task={task}
          currentUserId={user?._id}
          onSubmissionUploaded={(updatedTask) => setTask(updatedTask)}
        />
      </div>

      <div className="mt-6">
        <CommentSection
          taskId={task._id}
          canComment={workspaceRole !== "viewer"}
          workspaceRole={workspaceRole}
        />
      </div>
    </div>
  );
}