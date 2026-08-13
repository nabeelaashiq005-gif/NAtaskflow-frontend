"use client";

import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { useAuth } from "@/context/AuthContext";
import SettingsSection from "@/components/settings/SettingsSection";

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 10a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="3.5" />
      <path d="m10 13 9-9M16 4l4 4M13 7l4 4" />
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

export default function SettingsSecurityPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <SettingsSection
        icon={<LinkIcon />}
        title="Sign-in methods"
        description="Accounts and credentials you can use to sign in."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/5 text-sm font-bold text-ink/60">
                @
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Email &amp; password</p>
                <p className="text-xs text-ink/40">{user?.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light/40 text-base font-bold text-brand-dark">
                G
              </span>
              <p className="text-sm font-medium text-ink">Google</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user?.googleId
                  ? "bg-success/10 text-success"
                  : "bg-ink/5 text-ink/40"
              }`}
            >
              {user?.googleId ? "Connected" : "Not connected"}
            </span>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={<KeyIcon />}
        title="Change password"
        description="Keep your account secure with a strong password."
      >
        {user?.googleId && (
          <p className="mb-4 text-sm text-ink/50">
            Your account is connected with Google. If you never set a password, you won&apos;t be
            able to use the &quot;current password&quot; field below with your Google-linked
            account&apos;s password — in that case, the form below will not work.
          </p>
        )}
        <ChangePasswordForm />
      </SettingsSection>

      <SettingsSection
        icon={<ShieldIcon />}
        title="Security tips"
        description="Quick habits that keep your account safe."
      >
        <ul className="space-y-2 text-sm text-ink/60">
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Use a password you don&apos;t reuse anywhere else.
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Turn on Google 2-Step Verification if you use Google sign-in.
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Keep your email recovery address up to date for account changes.
          </li>
        </ul>
      </SettingsSection>
    </div>
  );
}