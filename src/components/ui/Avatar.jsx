const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, src, size = 64 }) {
  const dimension = `${size}px`;
  // The backend stores a relative path like "/uploads/avatars/xyz.jpg" —
  // prefix it with the API's origin so the browser can actually load it.
  const imageUrl = src ? `${API_ORIGIN}${src}` : null;

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name || "User avatar"}
        style={{ width: dimension, height: dimension }}
        className="rounded-full object-cover border border-ink/10"
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="flex items-center justify-center rounded-full bg-gradient-to-r from-brand to-accent text-white font-medium"
    >
      {getInitials(name) || "?"}
    </div>
  );
}
