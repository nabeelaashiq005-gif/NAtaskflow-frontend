"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ActivityItem from "@/components/activity/ActivityItem";

export default function ActivityFeed({ workspaceId }) {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  async function fetchActivities(pageNum) {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/activities`, {
        params: { page: pageNum, limit: 15 },
      });
      setHasMore(data.data.pagination.hasMore);
      return data.data.activities;
    } catch (err) {
      setError(err.response?.data?.message || "Could not load activity");
      return [];
    }
  }

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const results = await fetchActivities(1);
      setActivities(results);
      setPage(1);
      setIsLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function handleLoadMore() {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const results = await fetchActivities(nextPage);
    setActivities((prev) => [...prev, ...results]);
    setPage(nextPage);
    setIsLoadingMore(false);
  }

  if (isLoading) return <p className="text-sm text-ink/50">Loading activity...</p>;

  if (error) {
    return <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>;
  }

  if (activities.length === 0) {
    return <p className="text-sm text-ink/40">No activity yet.</p>;
  }

  return (
    <div>
      <div className="divide-y divide-ink/5">
        {activities.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="mt-2 text-sm font-medium text-brand hover:underline disabled:opacity-60"
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
