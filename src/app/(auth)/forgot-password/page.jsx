"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", values);
      setEmail(values.email);
      setSent(true);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <h2 className="mb-2 font-display text-3xl font-semibold text-ink">Check your inbox</h2>
        <p className="mb-6 text-sm text-ink/50">
          We sent a 6-digit verification code to <span className="font-medium text-ink">{email}</span>.
          The code expires in 1 hour.
        </p>
        <div className="mb-6 rounded-xl border border-ink/10 bg-ink/[0.03] p-4 text-sm text-ink/60">
          <p className="font-medium text-ink">📨 Email sent</p>
          <p className="mt-1">
            The code has been emailed to you. Check your inbox (and the spam folder) for a message
            from NATaskFlow.
          </p>
        </div>
        <Link
          href={`/reset-password?email=${encodeURIComponent(email)}`}
          className="block rounded-lg bg-gradient-to-r from-brand to-accent px-6 py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          I have a code — set a new password
        </Link>
        <p className="mt-4 text-center text-sm text-ink/60">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-medium text-accent hover:underline"
          >
            Try again
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-2 font-display text-3xl font-semibold text-ink">Reset your password</h2>
      <p className="mb-8 text-sm text-ink/50">
        Enter the email address you signed up with and we&apos;ll send you a 6-digit
        verification code.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />

        {serverError && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          Send code
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
