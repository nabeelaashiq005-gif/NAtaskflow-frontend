"use client";

import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SettingsSection from "@/components/settings/SettingsSection";

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
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

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <SettingsSection icon={<CameraIcon />} title="Profile photo" description="This photo is shown next to your name across workspaces.">
        <AvatarUpload />
      </SettingsSection>

      <SettingsSection icon={<UserIcon />} title="Basic information" description="Update your name and how you appear to others.">
        <UpdateProfileForm />
      </SettingsSection>
    </div>
  );
}