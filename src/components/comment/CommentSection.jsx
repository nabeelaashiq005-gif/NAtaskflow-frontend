"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import CommentItem from "@/components/comment/CommentItem";
import Button from "@/components/ui/Button";

export default function CommentSection({ taskId, canComment, workspaceRole }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canManageAny = workspaceRole === "owner" || workspaceRole === "admin";

  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/tasks/${taskId}/comments`);
        setComments(data.data.comments);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load comments");
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [taskId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { content: newComment });
      setComments((prev) => [...prev, data.data.comment]);
      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleUpdated(updatedComment) {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  }

  function handleDeleted(commentId) {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  }

  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-wide text-ink/50">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {isLoading && <p className="py-3 text-sm text-ink/40">Loading comments...</p>}

      {!isLoading && (
        <div className="max-h-64 divide-y divide-ink/5 overflow-y-auto">
          {comments.length === 0 && (
            <p className="py-3 text-sm text-ink/40">No comments yet.</p>
          )}
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              canManageAny={canManageAny}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-accent">{error}</p>}

      {canComment && (
        <form onSubmit={handleSubmit} className="mt-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full resize-y rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" isLoading={isSubmitting} fullWidth={false} className="px-5">
              Post
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
