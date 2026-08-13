"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/workspaces", values);
      toast.success(`Workspace "${data.data.workspace.name}" created`);
      router.push("/workspaces");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-6 py-12">
      <Link href="/workspaces" className="text-sm text-brand hover:underline">
        ← All workspaces
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow="Your space"
          title="Create a workspace"
          subtitle="A workspace keeps your projects and team together."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="workspaceName"
          label="Workspace name"
          placeholder="Acme Startup"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
        />
        <Input
          id="workspaceDescription"
          label="Description (optional)"
          placeholder="Our product team's shared workspace"
          autoComplete="off"
          {...register("description")}
        />

        {serverError && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {serverError}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Create workspace
        </Button>
        </form>
      </div>
    </div>
  );
}