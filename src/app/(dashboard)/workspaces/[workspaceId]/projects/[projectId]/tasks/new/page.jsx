"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default function NewTaskPage() {
  const { workspaceId, projectId } = useParams();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [projectMembers, setProjectMembers] = useState(null);
  const [membersError, setMembersError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { priority: "medium" } });

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadMembers() {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProjectMembers(data.data.project?.members || []);
    } catch (err) {
      setMembersError(err.response?.data?.message || "Could not load members");
    }
  }

  function toggleAssignee(userId) {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function onSubmit(values) {
    setServerError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/projects/${projectId}/tasks`, {
        ...values,
        assignees: selectedAssignees,
      });
      toast.success("Task created");
      router.push(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks/${data.data.task._id}`
      );
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-6 py-12">
      <Link
        href={`/workspaces/${workspaceId}/projects/${projectId}`}
        className="text-sm text-brand hover:underline"
      >
        ← Back to project
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow="Project"
          title="New task"
          subtitle="Create a task and assign it to a member of this project."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="taskTitle"
          label="Title"
          placeholder="Design homepage mockup"
          autoComplete="off"
          error={errors.title?.message}
          {...register("title", {
            required: "Title is required",
            minLength: { value: 2, message: "Title must be at least 2 characters" },
          })}
        />
        <Input
          id="taskDescription"
          label="Description (optional)"
          placeholder="Figma mockup for the new homepage"
          autoComplete="off"
          {...register("description")}
        />

        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label htmlFor="taskPriority" className="mb-1.5 block text-sm font-medium text-ink/80">
              Priority
            </label>
            <select
              id="taskPriority"
              {...register("priority")}
              className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex-1">
            <Input id="taskDueDate" label="Due date" type="date" {...register("dueDate")} />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-ink/80">Assignees</label>
          {!projectMembers && !membersError && (
            <p className="text-sm text-ink/50">Loading members...</p>
          )}
          {membersError && <p className="text-sm text-accent">{membersError}</p>}
          {projectMembers && projectMembers.length === 0 && (
            <p className="text-sm text-ink/40">No members in this project yet.</p>
          )}
          {projectMembers && projectMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {projectMembers.map((member) => (
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
          )}
        </div>

        {serverError && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {serverError}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Create task
        </Button>
        </form>
      </div>
    </div>
  );
}