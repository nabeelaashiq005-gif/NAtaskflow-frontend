"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/auth/GoogleButton";

export default function RegisterForm() {
  const { register: signUp } = useAuth();
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
      const { confirmPassword, ...payload } = values;
      await signUp(payload);
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message =
        (Array.isArray(errors) && errors.length > 0 && errors.join(" ")) ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="mb-2 font-display text-3xl font-semibold text-ink">
        Create your account
      </h2>
      <p className="mb-8 text-sm text-ink/50">
        Free to start, no credit card required.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Input
          id="name"
          label="Full name"
          placeholder="Ali Raza"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="off"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="8+ chars, 1 capital, 1 number, 1 special char"
          autoComplete="off"
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
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
        />

        {serverError && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <GoogleButton />

      <p className="mt-5 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}