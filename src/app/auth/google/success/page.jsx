"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function GoogleSuccessContent() {
  const { loginWithToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login?error=OAuthFailed");
      return;
    }

    loginWithToken(token).catch(() => {
      setError("Could not complete Google sign-in. Please try again.");
      setTimeout(() => router.replace("/login?error=OAuthFailed"), 1500);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p className="text-sm text-ink/50">{error || "Signing you in with Google..."}</p>;
}

export default function GoogleSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Suspense fallback={<p className="text-sm text-ink/50">Loading...</p>}>
        <GoogleSuccessContent />
      </Suspense>
    </main>
  );
}