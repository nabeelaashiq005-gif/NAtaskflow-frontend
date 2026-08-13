"use client";

import RequestEmailChangeForm from "@/components/profile/RequestEmailChangeForm";
import { useAuth } from "@/context/AuthContext";
import SettingsSection from "@/components/settings/SettingsSection";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function SettingsPrivacyPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <SettingsSection
        icon={<MailIcon />}
        title="Email address"
        description="This email is used for your account identity and notifications. Only you can view or change it."
      >
        <RequestEmailChangeForm />
      </SettingsSection>

      <SettingsSection
        icon={<ShieldIcon />}
        title="Account data"
        description="Snapshot of your account information."
      >
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-ink/[0.03] px-4 py-3">
            <dt className="text-ink/50">Email verified</dt>
            <dd className="font-semibold text-ink">{user?.isEmailVerified ? "Yes" : "No"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-ink/[0.03] px-4 py-3">
            <dt className="text-ink/50">Sign-in method</dt>
            <dd className="font-semibold text-ink">
              {user?.googleId ? "Google" : "Email & password"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-ink/[0.03] px-4 py-3">
            <dt className="text-ink/50">Member since</dt>
            <dd className="font-semibold text-ink">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
        </dl>
      </SettingsSection>
    </div>
  );
}