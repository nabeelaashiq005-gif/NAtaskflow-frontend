"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetEmail = searchParams.get("email") || "";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        email: values.email,
        otp: values.otp,
        password: values.password,
      });
      router.push("/login?reset=success");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="mb-2 font-display text-3xl font-semibold text-ink">Set a new password</h2>
      <p className="mb-8 text-sm text-ink/50">
        Enter the 6-digit verification code we emailed you, then choose a new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          defaultValue={presetEmail}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Input
          id="otp"
          label="Verification code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="6-digit code"
          autoComplete="one-time-code"
          error={errors.otp?.message}
          {...register("otp", {
            required: "Verification code is required",
            pattern: { value: /^\d{6}$/, message: "Code must be 6 digits" },
          })}
        />
        <PasswordInput
          id="password"
          label="New password"
          placeholder="8+ chars, 1 capital, 1 number, 1 special char"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
              message: "Must include an uppercase letter, a number, and a special character",
            },
          })}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === getValues("password") || "Passwords do not match",
          })}
        />

        {serverError && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          Reset password
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
