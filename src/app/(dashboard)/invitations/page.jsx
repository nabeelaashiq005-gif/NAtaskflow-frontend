"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import InvitationCard from "@/components/invitation/InvitationCard";
import BackToDashboard from "@/components/ui/BackToDashboard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  async function fetchInvitations() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/workspaces/invitations/pending");
      setInvitations(data.data.invitations);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load invitations");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function handleAccept(workspaceId) {
    setProcessingId(workspaceId);
    try {
      await api.post(`/workspaces/${workspaceId}/invitations/accept`);
      setInvitations((prev) => prev.filter((i) => i.workspace._id !== workspaceId));
      toast.success("Joined workspace");
    } catch (err) {
      setError(err.response?.data?.message || "Could not accept invitation");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDecline(workspaceId) {
    setProcessingId(workspaceId);
    try {
      await api.post(`/workspaces/${workspaceId}/invitations/decline`);
      setInvitations((prev) => prev.filter((i) => i.workspace._id !== workspaceId));
      toast("Invitation declined", { icon: "👋" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not decline invitation");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="px-6 py-12">
      <BackToDashboard />
      <div className="mt-4">
        <PageHeader
          eyebrow="Collaboration"
          title="Invitations"
          subtitle="Workspaces inviting you to join"
          count={invitations.length}
        />
      </div>

      {isLoading && (
        <div className="mt-8 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
      )}

      {!isLoading && !error && invitations.length === 0 && (
        <EmptyState
          icon={<MailIcon />}
          title="Inbox zero"
          body="You don't have any pending invitations right now."
        />
      )}

      {!isLoading && !error && invitations.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation._id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isProcessing={processingId === invitation.workspace._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}