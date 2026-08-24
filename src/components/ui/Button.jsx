export default function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  className = "",
  disabled = false,
  ...props
}) {
  const base = `rounded-lg px-4 py-2.5 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
    fullWidth ? "w-full" : ""
  }`;
  const variants = {
    primary: "bg-brand text-white hover:opacity-90",
    accent: "bg-brand text-white hover:opacity-90",
    ghost: "bg-transparent text-ink/70 hover:bg-ink/5 hover:text-ink",
  };

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
