"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Avatar from "@/components/ui/Avatar";

export default function ProjectMembersSelect({ workspaceId, selectedIds, onChange }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data } = await api.get(`/workspaces/${workspaceId}/members`);
        setMembers(data.data.members.filter((m) => m.status === "active"));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, [workspaceId]);

  function toggle(userId) {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  }

  if (isLoading) return <p className="text-sm text-ink/50">Loading members...</p>;

  return (
    <div className="flex flex-col gap-2">
      {members.map((m) => (
        <label
          key={m.user._id}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-ink/10 px-3 py-2 hover:bg-ink/5"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(m.user._id)}
            onChange={() => toggle(m.user._id)}
            className="h-4 w-4"
          />
          <Avatar name={m.user.name} src={m.user.avatar} size={28} />
          <span className="text-sm text-ink">{m.user.name}</span>
        </label>
      ))}
    </div>
  );
}
