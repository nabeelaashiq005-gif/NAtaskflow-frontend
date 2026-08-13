"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import ActiveTaskItem from "@/components/dashboard/ActiveTaskItem";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setTasks([]);
      setHasSearched(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError("");
      api
        .get("/tasks/search", { params: { q: query } })
        .then(({ data }) => setTasks(data.data.tasks))
        .catch((err) => setError(err.response?.data?.message || "Search failed"))
        .finally(() => {
          setIsLoading(false);
          setHasSearched(true);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Find anything"
          title="Search"
          subtitle="Find tasks across all your workspaces"
        />
      </div>

      <div className="relative mt-6">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          autoFocus
          className="w-full rounded-2xl border border-ink/15 bg-white py-3.5 pl-12 pr-4 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink/40 focus:border-brand"
        />
        {hasQuery && (
          <button
            onClick={() => {
              setQuery("");
              setTasks([]);
              setHasSearched(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink/70"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && hasQuery && hasSearched && tasks.length === 0 && (
        <EmptyState
          icon={<ClipboardIcon />}
          title="No matching tasks"
          body={`Nothing matches "${query.trim()}". Try a different keyword or check the spelling.`}
        />
      )}

      {!isLoading && !error && !hasQuery && (
        <EmptyState
          icon={<SearchIcon />}
          title="Search your tasks"
          body="Type a keyword above and matching tasks will appear here instantly."
        />
      )}

      {!isLoading && !error && hasQuery && tasks.length > 0 && (
        <>
          <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
            {tasks.length} result{tasks.length > 1 ? "s" : ""} for &quot;{query.trim()}&quot;
          </p>
          <div className="divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white p-2">
            {tasks.map((task) => (
              <ActiveTaskItem key={task._id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}