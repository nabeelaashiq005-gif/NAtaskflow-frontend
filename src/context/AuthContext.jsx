"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until we've checked session
  const [authSuccess, setAuthSuccess] = useState("");
  const router = useRouter();

  // On first app load, we don't have an access token in memory yet
  // (it's not persisted). So we silently try to use the httpOnly
  // refresh cookie to get a fresh one. If that fails, the user is
  // simply not logged in — no error shown.
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await api.post("/auth/refresh-token");
        setAccessToken(data.data.accessToken);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  function showAuthSuccess(message) {
    setAuthSuccess(message);
    setTimeout(() => {
      setAuthSuccess("");
    }, 1800);
  }

  async function register({ name, email, password }) {
    const { data } = await api.post("/auth/register", { name, email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    showAuthSuccess("Account created successfully");
    setTimeout(() => router.push("/dashboard"), 1600);
  }

  async function login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    showAuthSuccess("Login Successfully");
    setTimeout(() => router.push("/dashboard"), 1600);
  }
// Used by the Google OAuth callback page: the backend already verified
  // the user with Google and handed us a short-lived access token via the
  // redirect URL. We just need to load it into memory and fetch the
  // profile, exactly like a normal login would.
  async function loginWithToken(token) {
    setAccessToken(token);
    const meRes = await api.get("/auth/me");
    setUser(meRes.data.data.user);
    showAuthSuccess("Login Successfully");
    setTimeout(() => router.push("/dashboard"), 1600);
  }
  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
  }

  // Merge partial changes (e.g. new name or avatar) into the current user
  // object without needing to re-fetch /auth/me from the server.
  function updateUser(partialUser) {
    setUser((prev) => ({ ...prev, ...partialUser }));
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, register, login, loginWithToken, logout, updateUser }}
    >
      {children}
      {authSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-md">
          <div className="success-pop flex flex-col items-center gap-5 rounded-3xl border border-ink/10 bg-white px-16 py-12 shadow-2xl shadow-ink/10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-success">
                <path
                  d="M5 13l4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-center font-display text-2xl font-semibold text-ink">
              {authSuccess}
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}