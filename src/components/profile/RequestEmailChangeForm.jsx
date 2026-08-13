"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RequestEmailChangeForm() {
  const { user, updateUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/users/me/email", values);
      updateUser(data.data.user);
      setSuccessMessage(data.message);
      reset();
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 text-sm text-ink/70">
        <p>
          Current email: <span className="font-medium text-ink">{user?.email}</span>
        </p>
        {user?.pendingEmail && (
          <p className="mt-1 text-accent">
            Pending verification: {user.pendingEmail} — check the backend
            terminal for the verification link.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="newEmail"
          label="New email"
          type="email"
          autoComplete="off"
          error={errors.newEmail?.message}
          {...register("newEmail", {
            required: "New email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Input
          id="emailChangePassword"
          label="Confirm your password"
          type="password"
          autoComplete="off"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

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
          Send verification link
        </Button>
      </form>
    </div>
  );
}
