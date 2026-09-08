"use client";

import Avatar from "@/components/ui/Avatar";

const roleOptions = ["admin", "member", "viewer"];

export default function MemberList({ members, myRole, currentUserId, onRemove, onRoleChange }) {
  const canManage = myRole === "owner" || myRole === "admin";
  const canChangeRoles = myRole === "owner";

  return (
    <div className="divide-y divide-ink/10">
      {members.map((m) => {
        const isSelf = m.user._id === currentUserId;
        const isOwner = m.role === "owner";
        const isPending = m.status === "invited";

        return (
          <div key={m._id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Avatar name={m.user.name} src={m.user.avatar} size={40} />
              <div>
                <p className="text-sm font-medium text-ink">
                  {m.user.name} {isSelf && <span className="text-ink/40">(you)</span>}
                </p>
                <p className="text-xs text-ink/50">{m.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isPending && (
                <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                  Pending
                </span>
              )}

              {!isPending && canChangeRoles && !isOwner && !isSelf ? (
                <select
                  value={m.role}
                  onChange={(e) => onRoleChange(m.user._id, e.target.value)}
                  className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-sm text-ink capitalize"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                !isPending && (
                  <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-medium capitalize text-ink/70">
                    {m.role}
                  </span>
                )
              )}

              {canManage && !isOwner && !isSelf && (
                <button
                  onClick={() => onRemove(m.user._id)}
                  className="text-sm text-accent hover:underline"
                >
                  {isPending ? "Cancel invite" : "Remove"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
