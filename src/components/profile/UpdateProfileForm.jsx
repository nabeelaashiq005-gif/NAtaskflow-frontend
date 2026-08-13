"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UpdateProfileForm() {
  const { user, updateUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: user?.name || "" } });

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const { data } = await api.patch("/users/me", values);
      updateUser(data.data.user);
      setSuccessMessage("Profile updated successfully");
      toast.success("Profile updated");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Input
        id="name"
        label="Full name"
        autoComplete="off"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
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
        Save changes
      </Button>
    </form>
  );
}
