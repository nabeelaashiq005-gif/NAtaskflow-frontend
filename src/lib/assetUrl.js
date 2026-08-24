// The backend stores either a relative path (e.g. "/uploads/avatars/x.jpg")
// or, when Cloudinary is configured, an absolute https URL. This helper
// builds a loadable URL for either case.
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export default function assetUrl(src) {
  if (!src) return null;
  return /^https?:\/\//i.test(src) ? src : `${API_ORIGIN}${src}`;
}