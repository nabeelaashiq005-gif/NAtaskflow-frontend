import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, id, ...props }, ref) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand ${
          error ? "border-accent" : "border-ink/15"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
});

export default Input;

