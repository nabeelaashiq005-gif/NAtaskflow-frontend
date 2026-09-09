import Link from "next/link";
import { FlowMark } from "@/components/layout/navIcons";
import ThemeToggle from "@/components/ui/ThemeToggle";

const audiences = ["Students", "Freelancers", "Startups", "Small teams"];

// ---------- Small inline icons (kept local to this page, stroke-based to match navIcons) ----------
function BoardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.2 3.5v13M12.8 3.5v13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function RolesIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="7" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.8 16c.6-2.6 2.2-4 4.2-4s3.6 1.4 4.2 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12.8 16c.4-1.9 1.4-3.1 2.9-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function SubmissionIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M5 2.5h7l3 3v12H5v-15z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 2.5v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.3 12.3l2 2 3.4-3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ActivityIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M2.5 10.5h3l2-5.5 3 10 2-7 1.5 2.5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const valueProps = [
  { icon: RolesIcon, label: "Owner, admin & member roles" },
  { icon: BoardIcon, label: "A real Kanban board" },
  { icon: SubmissionIcon, label: "File submissions & review" },
  { icon: ActivityIcon, label: "Comments & activity log" },
];

const steps = [
  {
    title: "Create a workspace",
    body: "Set up a home for your team and invite people in with the right role.",
  },
  {
    title: "Break work into tasks",
    body: "Add projects, then tasks with a priority, a due date, and an assignee.",
  },
  {
    title: "Track it to done",
    body: "Assignees submit their work; owners and admins review and mark it done.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas">
      {/* ---------- Top nav ---------- */}
      <header className="bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-ink dark:bg-white/10 dark:text-white">
              <FlowMark className="h-4.5 w-4.5" />
            </span>
            <span className="hidden truncate font-display text-lg font-semibold text-white min-[420px]:inline">
              NATaskFlow
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle inverse />
            <Link
              href="/login"
              className="text-sm font-medium text-white/60 hover:text-white dark:text-white/80"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="whitespace-nowrap rounded-lg bg-accent px-3 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-sm"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <div>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 py-24 lg:flex-row lg:items-center lg:py-28">
          <div className="flex-1 text-center lg:text-left">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 dark:text-ink/70">
              Plan · Assign · Ship
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl">
              Every task, filed where it belongs.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-ink/60 dark:text-ink/85 lg:mx-0">
              NATaskFlow is the shared workspace for students, freelancers, and
              small teams — workspaces, projects, and a real Kanban board,
              without the bloat.
            </p>

            <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm lg:mx-0 lg:justify-start">
              <span className="font-medium text-ink/40 dark:text-ink/60">Built for</span>
              {audiences.map((a, i) => (
                <span key={a} className="font-display font-medium text-ink/70 dark:text-ink/85">
                  {a}
                  {i < audiences.length - 1 && (
                    <span className="ml-2 text-ink/20 dark:text-ink/40">·</span>
                  )}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/register"
                className="rounded-lg bg-accent px-6 py-3 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-ink/15 px-6 py-3 font-medium text-ink transition-colors hover:bg-ink/5"
              >
                Log in
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink/40 dark:text-ink/60">Free to start. No credit card required.</p>
          </div>

          <div className="w-full max-w-2xl flex-1">
            <div className="group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-ink/15 transition-transform duration-300 hover:-translate-y-1 hover:shadow-ink/20">
              <img
                src="/hero-team.jpg"
                alt="Team collaborating on a project"
                className="h-[470px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Value prop strip ---------- */}
      <div className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-6 py-8 sm:grid-cols-4">
          {valueProps.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 shrink-0 text-brand dark:text-brand-dark" />
              <span className="text-sm font-medium text-ink/70 dark:text-ink/85">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Feature 1: Workspaces & Projects ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-dark">
              Workspaces
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              One workspace per team, as many projects as you need.
            </h2>
            <p className="mt-4 max-w-md text-ink/60 dark:text-ink/85">
              Create a workspace for your team, invite people with a role
              that matches their responsibility, and organize the work into
              projects — nothing gets lost between chats and spreadsheets.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40 dark:text-ink/60">
              Acme Marketing Team
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {["Website Redesign", "Q3 Campaign"].map((name) => (
                <div key={name} className="rounded-xl border border-ink/10 p-3">
                  <p className="font-display text-sm font-medium text-ink">{name}</p>
                  <p className="mt-1 text-xs text-ink/40 dark:text-ink/60">Active</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Feature 2: Kanban board ---------- */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 grid grid-cols-3 gap-2 rounded-2xl border border-ink/10 bg-ink/5 p-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md lg:order-1">
              {[
                { label: "To Do", items: [{ p: "high" }] },
                { label: "In Progress", items: [{ p: "medium" }, { p: "low" }] },
                { label: "Done", items: [{ p: "low" }] },
              ].map((col) => (
                <div key={col.label} className="rounded-lg bg-white p-2">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-ink/40 dark:text-ink/60">
                    {col.label}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {col.items.map((item, i) => (
                      <div key={i} className="h-8 rounded-md bg-canvas" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-dark">
                Task management
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                A real Kanban board, not a to-do list pretending.
              </h2>
              <p className="mt-4 max-w-md text-ink/60 dark:text-ink/85">
                Owners and admins set priority, due dates, and assignees.
                Assignees submit their finished work as a file — everyone
                sees exactly where a task stands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Feature 3: Comments & Activity ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-dark">
              Collaboration
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Discuss the work right where it happens.
            </h2>
            <p className="mt-4 max-w-md text-ink/60 dark:text-ink/85">
              Comment on any task, and keep a running activity log of who
              did what — so nobody has to ask &quot;wait, what changed?&quot;
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex gap-2.5">
              <div className="h-7 w-7 shrink-0 rounded-full bg-brand" />
              <div>
                <p className="text-sm font-medium text-ink">Sara Malik</p>
                <p className="mt-0.5 text-sm text-ink/60 dark:text-ink/85">
                  Mockup looks great — pushing to staging now.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 border-t border-ink/10 pt-3 text-xs text-ink/40 dark:text-ink/65">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Ali marked &quot;Fix login redirect bug&quot; as done · 2h ago
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-t border-ink/10 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand dark:text-brand-dark">
              How it works
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              From workspace to shipped task, in three steps.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative pl-12 sm:pl-0 sm:text-center">
                <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-white sm:static sm:mx-auto sm:mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink/60 dark:text-ink/85">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Get your team organized today.
          </h2>
          <p className="mt-3 text-white/60">Free to start. No credit card required.</p>
         <Link
  href="/register"
  className="mt-8 inline-block rounded-lg bg-accent px-7 py-3 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
>
  Create your workspace
</Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-ink/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink/40 dark:text-ink/75 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
              <FlowMark className="h-3.5 w-3.5" />
            </span>
            <span className="font-display font-medium text-ink/70 dark:text-ink/85">NATaskFlow</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-ink/70 dark:hover:text-ink">Log in</Link>
            <Link href="/register" className="hover:text-ink/70 dark:hover:text-ink">Sign up</Link>
          </div>
          <p>© {new Date().getFullYear()} NATaskFlow. Built for teams that ship.</p>
        </div>
      </footer>
    </main>
  );
}