"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarUpload() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const { data } = await api.patch("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data.data.user);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Avatar updated");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={user?.name} src={previewUrl ? null : user?.avatar} size={72} />
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Preview"
          className="h-[72px] w-[72px] rounded-full border border-ink/10 object-cover"
        />
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            fullWidth={false}
            className="px-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose photo
          </Button>
          {selectedFile && (
            <Button
              type="button"
              fullWidth={false}
              className="px-4"
              isLoading={isUploading}
              onClick={handleUpload}
            >
              Upload
            </Button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-accent">{error}</p>}
      </div>
    </div>
  );
}
