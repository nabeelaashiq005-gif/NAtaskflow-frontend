"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm() {
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
      await api.patch("/users/me/password", values);
      setSuccessMessage("Password changed successfully");
      reset();
      toast.success("Password changed");
    } catch (error) {
      const errs = error.response?.data?.errors;
      const message =
        (Array.isArray(errs) && errs.length > 0 && errs.join(" ")) ||
        error.response?.data?.message ||
        "Something went wrong";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Input
        id="currentPassword"
        label="Current password"
        type="password"
        autoComplete="off"
        error={errors.currentPassword?.message}
        {...register("currentPassword", { required: "Current password is required" })}
      />
      <Input
        id="newPassword"
        label="New password"
        type="password"
        placeholder="8+ chars, 1 capital, 1 number, 1 special char"
        autoComplete="off"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required: "New password is required",
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
            message: "Must include an uppercase letter, a number, and a special character",
          },
        })}
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
        Change password
      </Button>
    </form>
  );
}
