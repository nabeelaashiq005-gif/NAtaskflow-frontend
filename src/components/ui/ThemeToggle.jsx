"use client";

import { useTheme } from "@/context/ThemeContext";

function SunIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4M15.7 15.7l-1.4-1.4M5.7 5.7L4.3 4.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M15.5 12.6A6.5 6.5 0 0 1 7.4 4.5 6.5 6.5 0 1 0 15.5 12.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle({ className = "", inverse = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const colorClasses = inverse
    ? "text-white/60 transition-colors hover:bg-white/10 hover:text-white"
    : "text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClasses} ${className}`}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}