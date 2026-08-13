import { forwardRef, useState } from "react";

const PasswordInput = forwardRef(function PasswordInput({ label, error, id, ...props }, ref) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isVisible ? "text" : "password"}
          className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 outline-none transition-colors focus:border-brand ${
            error ? "border-accent" : "border-ink/15"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
          aria-label={isVisible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {isVisible ? (
            <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
              <path
                d="M2.5 10.5S5.5 5 10 5s7.5 5.5 7.5 5.5-3 5.5-7.5 5.5S2.5 10.5 2.5 10.5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
              <path
                d="M2.5 10.5S5.5 5 10 5s7.5 5.5 7.5 5.5-3 5.5-7.5 5.5S2.5 10.5 2.5 10.5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 17L17 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
});

export default PasswordInput;