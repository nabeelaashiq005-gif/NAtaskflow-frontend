"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Avatar from "@/components/ui/Avatar";

export default function CommentItem({ comment, currentUserId, canManageAny, onUpdated, onDeleted }) {
  const isAuthor = comment.author._id === currentUserId;
  const canEdit = isAuthor;
  const canDelete = isAuthor || canManageAny;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!content.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      const { data } = await api.patch(`/comments/${comment._id}`, { content });
      onUpdated(data.data.comment);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update comment");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${comment._id}`);
      onDeleted(comment._id);
      toast.success("Comment deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment");
    }
  }

  return (
    <div className="flex gap-2.5 py-2.5">
      <Avatar name={comment.author.name} src={comment.author.avatar} size={28} />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{comment.author.name}</span>
          <span className="text-xs text-ink/40">
            {new Date(comment.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {comment.editedAt && " (edited)"}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
            <div className="mt-1.5 flex gap-3 text-xs">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="font-medium text-brand hover:underline disabled:opacity-60"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setContent(comment.content);
                }}
                className="text-ink/50 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink/80">{comment.content}</p>
        )}

        {error && <p className="mt-1 text-xs text-accent">{error}</p>}

        {!isEditing && (canEdit || canDelete) && (
          <div className="mt-1 flex gap-3 text-xs">
            {canEdit && (
              <button onClick={() => setIsEditing(true)} className="text-ink/40 hover:text-ink">
                Edit
              </button>
            )}
            {canDelete && (
              <button onClick={handleDelete} className="text-ink/40 hover:text-accent">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
