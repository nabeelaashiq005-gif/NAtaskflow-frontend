"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function InviteMemberForm({ workspaceId, onInvited }) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { role: "member" } });

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/members`, values);
      onInvited(data.data.member);
      setSuccessMessage("Invitation sent — they'll see it under their Invitations tab.");
      reset({ email: "", role: "member" });
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" className="flex gap-3">
      <div className="flex-1">
        <Input
          id="inviteEmail"
          label="Email"
          type="email"
          placeholder="teammate@example.com"
          autoComplete="off"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
      </div>

      <div>
        <label htmlFor="inviteRole" className="mb-1.5 block text-sm font-medium text-ink/80">
          Role
        </label>
        <select
          id="inviteRole"
          {...register("role")}
          className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink"
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <div className="self-end">
        <Button type="submit" isLoading={isSubmitting} fullWidth={false} className="px-5">
          Invite
        </Button>
      </div>

      {serverError && (
        <p className="basis-full rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {serverError}
        </p>
      )}
      {successMessage && (
        <p className="basis-full rounded-lg bg-brand-light/30 px-3 py-2 text-sm text-brand-dark">
          {successMessage}
        </p>
      )}
    </form>
  );
}
