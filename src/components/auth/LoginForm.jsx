"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const { login } = useAuth();
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
      await login(values);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="off"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />

      {serverError && (
        <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="accent" isLoading={isSubmitting}>
  Log in
</Button>

      <p className="mt-4 text-center text-sm text-ink/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
