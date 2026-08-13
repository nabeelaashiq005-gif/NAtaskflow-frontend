"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import MemberList from "@/components/workspace/MemberList";
import InviteMemberForm from "@/components/workspace/InviteMemberForm";
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs";
import SettingsSection from "@/components/settings/SettingsSection";

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function MembersPage() {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      const [workspaceRes, membersRes] = await Promise.all([
        api.get(`/workspaces/${workspaceId}`),
        api.get(`/workspaces/${workspaceId}/members`),
      ]);
      setMyRole(workspaceRes.data.data.myRole);
      setMembers(membersRes.data.data.members);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load members");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  function handleInvited() {
    fetchData();
  }

  async function handleRemove(userId) {
    setActionError("");
    if (!confirm("Remove this member from the workspace?")) return;
    try {
      await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
      toast.success("Member removed");
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not remove member");
    }
  }

  async function handleRoleChange(userId, newRole) {
    setActionError("");
    try {
      await api.patch(`/workspaces/${workspaceId}/members/${userId}`, { role: newRole });
      setMembers((prev) =>
        prev.map((m) => (m.user._id === userId ? { ...m, role: newRole } : m))
      );
      toast.success("Role updated");
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not update role");
    }
  }

  const isManager = myRole === "owner" || myRole === "admin";
  const activeMembers = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "invited");

  return (
    <div className="px-6 py-12">
      <Link href={`/workspaces/${workspaceId}`} className="text-sm text-brand hover:underline">
        ← Back to workspace
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Workspace management
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Members</h1>
          <p className="mt-1.5 text-sm text-ink/60">
            {activeMembers.length} active member{activeMembers.length !== 1 ? "s" : ""}
            {pendingMembers.length > 0 &&
              ` · ${pendingMembers.length} pending`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <WorkspaceTabs workspaceId={workspaceId} canManage={isManager} />
      </div>

      {isLoading && (
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8">
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isManager && (
          <SettingsSection
            icon={<UserPlusIcon />}
            title="Invite a member"
            description="Invite someone to collaborate in this workspace."
          >
            <InviteMemberForm workspaceId={workspaceId} onInvited={handleInvited} />
            <p className="mt-2 text-xs text-ink/40">
              Note: the person must already have a NATaskFlow account with this email.
            </p>
          </SettingsSection>
        )}

        <SettingsSection
          icon={<UserIcon />}
          title="All members"
          description="Manage roles and remove people from this workspace."
        >
          {actionError && (
            <p className="mb-3 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
              {actionError}
            </p>
          )}
          <MemberList
            members={members}
            myRole={myRole}
            currentUserId={user?._id}
            onRemove={handleRemove}
            onRoleChange={handleRoleChange}
          />
        </SettingsSection>
        </div>
      )}
    </div>
  );
}