"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function TaskIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="3" y="4.5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 9h7M6.5 12.5h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="7.5" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.5" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 16.5c.8-2.6 2.7-4 5-4s4.2 1.4 5 4M11.5 12.2c1.9.1 3.4 1.2 4 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RocketIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 6C7.5 5.5 5 7 4.5 10l3 1.5L10 14l2.5-2.5L15.5 10C15 7 12.5 5.5 10 6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 17c1-.5 2.5-.6 3.5-.2M16.5 6c-.6-2-2-3-4-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3v3M10 14v3M3 10h3M14 10h3M5.5 5.5l2 2M12.5 12.5l2 2M14.5 5.5l-2 2M7.5 12.5l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const steps = [
  {
    icon: RocketIcon,
    title: "Create a workspace",
    body: "Give your team a home to organize projects, tasks, and people.",
    action: "Start here",
  },
  {
    icon: TaskIcon,
    title: "Add your first project",
    body: "Break work into boards and tasks so nothing slips through.",
    action: "Plan work",
  },
  {
    icon: TeamIcon,
    title: "Invite your teammates",
    body: "Assign tasks, track progress, and ship together in real time.",
    action: "Build your team",
  },
];

const features = [
  {
    icon: TaskIcon,
    title: "Task management",
    body: "Priorities, due dates, and statuses keep every task on track.",
  },
  {
    icon: TeamIcon,
    title: "Team collaboration",
    body: "Assign work to teammates and watch progress update live.",
  },
  {
    icon: SparkIcon,
    title: "Clear activity feed",
    body: "See who did what, and when, across your whole workspace.",
  },
];

export default function OnboardingDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Welcome, {firstName}
      </h1>

      <section className="relative mt-6 overflow-hidden rounded-3xl bg-ink p-10 text-white sm:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
        />

        <p className="relative max-w-xl text-base leading-relaxed text-white/70">
          Your workspace is ready when you are. NATaskFlow gives you a single place
          to manage projects, assign tasks, and keep your team moving.
        </p>

        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <RocketIcon className="h-4 w-4" />
            Create your first workspace
          </Link>
          <Link
            href="/invitations"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Check invitations
          </Link>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6">
          <div>
            <p className="text-sm font-medium text-ink">Setup progress</p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">
              0<span className="text-base font-normal text-ink/40"> / 3 steps</span>
            </p>
          </div>
          <div className="mt-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div className="h-full w-0 rounded-full bg-brand transition-all duration-500" />
            </div>
            <p className="mt-3 text-xs text-ink/50">
              Complete the steps below and your dashboard comes to life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
          {[
            { label: "Workspaces", value: 0 },
            { label: "Projects", value: 0 },
            { label: "Tasks", value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/50">{stat.label}</p>
              <p className="mt-2 inline-flex rounded-lg bg-brand-light/30 px-2.5 py-1 font-display text-2xl font-semibold text-brand-dark">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-brand">
        Getting started
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Link
            key={step.title}
            href="/workspaces"
            className="group rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light/25 text-brand-dark">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink font-display text-xs font-semibold text-white">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{step.body}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:underline">
              {step.action}
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-brand">
        What you can do
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-ink/10 bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{feature.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
