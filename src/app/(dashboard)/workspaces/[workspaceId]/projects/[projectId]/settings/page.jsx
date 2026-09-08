"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ProjectMembersSelect from "@/components/project/ProjectMembersSelect";

export default function ProjectSettingsPage() {
  const { workspaceId, projectId } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isSavingMembers, setIsSavingMembers] = useState(false);
  const [membersMessage, setMembersMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/projects/${projectId}`);
        const project = data.data.project;
        reset({
          name: project.name,
          description: project.description || "",
          status: project.status,
          dueDate: project.dueDate ? project.dueDate.slice(0, 10) : "",
        });
        setSelectedMemberIds(project.members.map((m) => m._id));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this project");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [projectId, reset]);

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      await api.patch(`/projects/${projectId}`, values);
      setSuccessMessage("Project updated successfully");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveMembers() {
    setIsSavingMembers(true);
    setMembersMessage("");
    try {
      await api.post(`/projects/${projectId}/members`, { memberIds: selectedMemberIds });
      setMembersMessage("Members updated successfully");
    } catch (err) {
      setMembersMessage(err.response?.data?.message || "Could not update members");
    } finally {
      setIsSavingMembers(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project permanently? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectId}`);
      router.push(`/workspaces/${workspaceId}`);
      toast.success("Project deleted");
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not delete project");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/workspaces/${workspaceId}/projects/${projectId}`}
        className="text-sm text-brand hover:underline"
      >
        ← Back to project
      </Link>

      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Project settings</h1>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <Input
            id="projectSettingsName"
            label="Project name"
            autoComplete="off"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
          <Input
            id="projectSettingsDescription"
            label="Description"
            autoComplete="off"
            {...register("description")}
          />
          <Input id="projectSettingsDueDate" label="Due date" type="date" {...register("dueDate")} />

          <div className="mb-4">
            <label htmlFor="projectStatus" className="mb-1.5 block text-sm font-medium text-ink/80">
              Status
            </label>
            <select
              id="projectStatus"
              {...register("status")}
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {serverError && (
            <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
              {serverError}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 rounded-lg bg-brand-light/30 px-3 py-2 text-sm text-brand-dark">
              {successMessage}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting} fullWidth={false} className="px-6">
            Save changes
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink/50">
          Assigned members
        </h2>
        <ProjectMembersSelect
          workspaceId={workspaceId}
          selectedIds={selectedMemberIds}
          onChange={setSelectedMemberIds}
        />

        {membersMessage && (
          <p className="mt-3 rounded-lg bg-brand-light/30 px-3 py-2 text-sm text-brand-dark">
            {membersMessage}
          </p>
        )}

        <Button
          fullWidth={false}
          className="mt-4 px-6"
          isLoading={isSavingMembers}
          onClick={handleSaveMembers}
        >
          Save members
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
          Danger zone
        </h2>
        <p className="mb-4 text-sm text-ink/60">
          Deleting a project permanently removes it. This cannot be undone.
        </p>
        <Button
          variant="ghost"
          fullWidth={false}
          className="border border-accent px-5 text-accent hover:bg-accent/10"
          isLoading={isDeleting}
          onClick={handleDelete}
        >
          Delete project
        </Button>
      </section>
    </div>
  );
}
