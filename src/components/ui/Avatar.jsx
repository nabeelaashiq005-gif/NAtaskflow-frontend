import assetUrl from "@/lib/assetUrl";

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
  const imageUrl = assetUrl(src);

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
      className="flex items-center justify-center rounded-full bg-brand text-white font-medium"
    >
      {getInitials(name) || "?"}
    </div>
  );
}