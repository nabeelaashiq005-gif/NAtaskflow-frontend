import { redirect } from "next/navigation";

// The standalone /profile page was merged into /settings/profile.
// Keep this redirect so any old links/bookmarks still work.
export default function ProfileRedirectPage() {
  redirect("/settings/profile");
}
