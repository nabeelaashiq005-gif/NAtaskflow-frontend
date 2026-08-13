"use client";

import Button from "@/components/ui/Button";

export default function InvitationCard({ invitation, onAccept, onDecline, isProcessing }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5">
      <div>
        <p className="font-medium text-ink">{invitation.workspace?.name}</p>
        {invitation.workspace?.description && (
          <p className="mt-0.5 text-sm text-ink/60">{invitation.workspace.description}</p>
        )}
        <p className="mt-1 text-xs text-ink/40">
          Invited by {invitation.invitedBy?.name} as{" "}
          <span className="capitalize">{invitation.role}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          fullWidth={false}
          className="px-4"
          isLoading={isProcessing}
          onClick={() => onAccept(invitation.workspace._id)}
        >
          Accept
        </Button>
        <Button
          variant="ghost"
          fullWidth={false}
          className="px-4"
          isLoading={isProcessing}
          onClick={() => onDecline(invitation.workspace._id)}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
