"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import SettingsSection from "@/components/settings/SettingsSection";

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.03a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.03a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.03a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
    </svg>
  );
}

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams();
  const router = useRouter();
  const [myRole, setMyRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchWorkspace() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}`);
        setMyRole(data.data.myRole);
        reset({
          name: data.data.workspace.name,
          description: data.data.workspace.description || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this workspace");
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkspace();
  }, [workspaceId, reset]);

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      await api.patch(`/workspaces/${workspaceId}`, values);
      setSuccessMessage("Workspace updated successfully");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Delete this workspace permanently? This cannot be undone and all its data will be lost."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    setServerError("");
    try {
      await api.delete(`/workspaces/${workspaceId}`);
      router.push("/workspaces");
      toast.success("Workspace deleted");
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not delete workspace");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <div className="h-16 animate-pulse rounded-2xl bg-ink/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12">
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      </div>
    );
  }

  const isManager = myRole === "owner" || myRole === "admin";

  return (
    <div className="px-6 py-12">
      <Link href={`/workspaces/${workspaceId}`} className="text-sm text-brand hover:underline">
        ← Back to workspace
      </Link>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Workspace management
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Workspace settings</h1>
        <p className="mt-1.5 text-sm text-ink/60">Update this workspace's name and details.</p>
      </div>

      <div className="mt-5">
        <WorkspaceTabs workspaceId={workspaceId} canManage={isManager} />
      </div>

      <div className="mt-6 space-y-6">
        <SettingsSection
          icon={<GearIcon />}
          title="General information"
          description="The name and description shown to everyone in the workspace."
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <div className="space-y-4">
              <Input
                id="settingsName"
                label="Workspace name"
                autoComplete="off"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              <Input
                id="settingsDescription"
                label="Description"
                autoComplete="off"
                {...register("description")}
              />
            </div>

            {serverError && (
              <p className="mb-4 mt-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
                {serverError}
              </p>
            )}
            {successMessage && (
              <p className="mb-4 mt-4 rounded-lg bg-brand-light/30 px-3 py-2 text-sm text-brand-dark">
                {successMessage}
              </p>
            )}

            <div className="mt-5">
              <Button type="submit" isLoading={isSubmitting} fullWidth={false} className="px-6">
                Save changes
              </Button>
            </div>
          </form>
        </SettingsSection>

        {myRole === "owner" && (
          <SettingsSection
            danger
            icon={<TrashIcon />}
            title="Danger zone"
            description="Deleting a workspace permanently removes it and all its data. This cannot be undone."
          >
            <Button
              variant="ghost"
              fullWidth={false}
              className="border border-accent px-5 text-accent hover:bg-accent/10"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </SettingsSection>
        )}
      </div>
    </div>
  );
}