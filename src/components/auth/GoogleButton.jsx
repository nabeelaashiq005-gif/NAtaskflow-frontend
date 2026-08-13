"use client";

export default function GoogleButton() {
  const handleGoogleSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    // Redirect the user directly to the backend Google auth URL
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-xs font-medium text-ink/40">OR</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-ink/15 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
      >
        <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]">
          <path
            fill="#4285F4"
            d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4a4.62 4.62 0 01-2 3.03v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32z"
          />
          <path
            fill="#34A853"
            d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.06v2.59A10 10 0 0010 20z"
          />
          <path
            fill="#FBBC05"
            d="M4.41 11.92A6.02 6.02 0 014.09 10c0-.67.11-1.32.32-1.92V5.49H1.06A10 10 0 000 10c0 1.61.39 3.14 1.06 4.51l3.35-2.59z"
          />
          <path
            fill="#EA4335"
            d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C14.95.99 12.7 0 10 0 6.09 0 2.71 2.24 1.06 5.49l3.35 2.59C5.2 5.72 7.4 3.96 10 3.96z"
          />
        </svg>
        Continue with Google
      </button>
    </>
  );
}