"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import ProjectMembersSelect from "@/components/project/ProjectMembersSelect";
import ActivityFeed from "@/components/activity/ActivityFeed";

export default function NewProjectPage() {
  const { workspaceId } = useParams();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/projects`, {
        ...values,
        memberIds: selectedMemberIds,
      });
      toast.success(`Project "${data.data.project.name}" created`);
      router.push(`/workspaces/${workspaceId}/projects/${data.data.project._id}`);
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/workspaces/${workspaceId}`} className="text-sm text-brand hover:underline">
        ← Back to workspace
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow="Workspace"
          title="Create a project"
          subtitle="Projects group the tasks your team needs to get done."
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <Input
                id="projectName"
                label="Project name"
                placeholder="Website Redesign"
                autoComplete="off"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              <Input
                id="projectDescription"
                label="Description (optional)"
                placeholder="Q3 marketing site refresh"
                autoComplete="off"
                {...register("description")}
              />
              <Input id="projectDueDate" label="Due date (optional)" type="date" {...register("dueDate")} />

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-ink/80">
                  Assign members (optional)
                </label>
                <p className="mb-2 text-xs text-ink/40">
                  You&apos;re added automatically — pick anyone else who should have access.
                </p>
                <ProjectMembersSelect
                  workspaceId={workspaceId}
                  selectedIds={selectedMemberIds}
                  onChange={setSelectedMemberIds}
                />
              </div>

              {serverError && (
                <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
                  {serverError}
                </p>
              )}

              <Button type="submit" isLoading={isSubmitting}>
                Create project
              </Button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
            Recent activity
          </h2>
          <div className="rounded-2xl border border-ink/10 bg-white p-4">
            <ActivityFeed workspaceId={workspaceId} />
          </div>
        </div>
      </div>
    </div>
  );
}