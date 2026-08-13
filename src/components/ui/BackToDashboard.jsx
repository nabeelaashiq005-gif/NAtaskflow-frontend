import Link from "next/link";

export default function BackToDashboard() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-dark hover:underline"
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
        <path
          d="M11 4L5 10l6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to dashboard
    </Link>
  );
}
