import Link from "next/link";
import Image from "next/image";
import { FlowMark } from "@/components/layout/navIcons";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ---------- Image side (hidden on small screens) ---------- */}
      <div className="relative hidden lg:block">
        <Image
          src="/login-photo.jpg"
          alt="Team collaborating on a project"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
      </div>

      {/* ---------- Form side ---------- */}
      <div className="relative flex flex-col justify-center bg-white px-6 py-20 sm:px-16 lg:px-24">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-brand" />

        <div className="absolute top-12 left-6 sm:left-16 lg:left-24 text-xs font-medium text-ink/50 dark:text-ink/75">
          <Link href="/" className="hover:text-ink transition-colors">
            ← Back to home
          </Link>
        </div>

        <div className="absolute top-10 right-6 sm:right-16 lg:right-24">
          <ThemeToggle />
        </div>

        <div className="mx-auto mt-6 w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <FlowMark className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-ink">NATaskFlow</span>
          </Link>

          {children}
        </div>
      </div>
    </main>
  );
}