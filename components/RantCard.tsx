"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/components/ComposerModal";

interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: string[];
  created_at: string;
}

interface RantCardProps {
  rant: Post;
  currentUserId: string;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke={filled ? "#d85a30" : "currentColor"}
      fill={filled ? "#d85a30" : "none"}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function formatTimestamp(iso: string) {
  if (!iso) return "Unknown date";
  const cleaned = iso.replace(/(\.\d{3})\d+/, "$1");
  return new Date(cleaned).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RantCard({ rant, currentUserId }: RantCardProps) {
  const [liked, setLiked] = useState(
    (rant.likes ?? []).includes(currentUserId),
  );
  const [feltCount, setFeltCount] = useState(rant.likes?.length ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(rant.comment_count);
  const [commentInput, setCommentInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(rant.content);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [bodyText, setBodyText] = useState(rant.content);
  const [hidden, setHidden] = useState(
    (rant.hidden_by ?? []).includes(currentUserId),
  );
  const [deleted, setDeleted] = useState(false);

  const isOwner = rant.user_id === currentUserId;

  async function fetchComments() {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/post/${rant._id}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.data);
    } catch {
      console.error("Failed to fetch comments");
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleToggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) {
      await fetchComments();
    }
  }

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setFeltCount(newLiked ? feltCount + 1 : feltCount - 1);
    try {
      await fetch(`/api/post/${rant._id}/like?user_id=${currentUserId}`, {
        method: "POST",
      });
    } catch {
      // revert on error
      setLiked(!newLiked);
      setFeltCount(newLiked ? feltCount : feltCount + 1);
    }
  }

  async function handleSaveEdit() {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`/api/post/${rant._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editText.trim(),
          user_id: currentUserId,
        }),
      });
      if (!res.ok) return;
      setBodyText(editText.trim());
      setEditing(false);
    } catch {
      console.error("Failed to update post");
    }
  }

  function handleCancelEdit() {
    setEditText(bodyText);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(
        `/api/post/${rant._id}?user_id=${currentUserId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) return;
      setDeleted(true);
    } catch {
      console.error("Failed to delete post");
    }
  }

  async function handleHide() {
    const next = !hidden;
    setHidden(next);
    try {
      await fetch(`/api/post/${rant._id}/hide?user_id=${currentUserId}`, {
        method: "POST",
      });
    } catch {
      setHidden(!next);
    }
  }

  async function handleSubmitComment() {
    if (!commentInput.trim()) return;
    try {
      const res = await fetch(`/api/post/${rant._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentInput.trim(),
          user_id: currentUserId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((prev) => [...prev, data.data]);
        setCommentCount((c) => c + 1);
        setCommentInput("");
      }
    } catch {
      console.error("Failed to submit comment");
    }
  }

  async function handleDeleteComment(comment_id: string) {
    try {
      const res = await fetch(
        `/api/comments/${comment_id}?user_id=${currentUserId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) return;
      setComments((prev) => prev.filter((c) => c._id !== comment_id));
      setCommentCount((c) => c - 1);
    } catch {
      console.error("Failed to delete comment");
    }
  }

  async function handleLikeComment(comment_id: string) {
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== comment_id) return c;
        const alreadyLiked = c.likes.includes(currentUserId);
        return {
          ...c,
          likes: alreadyLiked
            ? c.likes.filter((id) => id !== currentUserId)
            : [...c.likes, currentUserId],
        };
      }),
    );
    try {
      await fetch(`/api/comments/${comment_id}/like?user_id=${currentUserId}`, {
        method: "POST",
      });
    } catch {
      // revert on error
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== comment_id) return c;
          const alreadyLiked = c.likes.includes(currentUserId);
          return {
            ...c,
            likes: alreadyLiked
              ? c.likes.filter((id) => id !== currentUserId)
              : [...c.likes, currentUserId],
          };
        }),
      );
    }
  }

  function handleStartEditComment(comment: Comment) {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
    setEditingCommentText("");
  }

  async function handleSaveEditComment(comment_id: string) {
    if (!editingCommentText.trim()) return;
    try {
      const res = await fetch(`/api/comments/${comment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editingCommentText.trim(),
          user_id: currentUserId,
        }),
      });
      if (!res.ok) return;
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment_id
            ? { ...c, content: editingCommentText.trim() }
            : c,
        ),
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch {
      console.error("Failed to edit comment");
    }
  }

  if (deleted) return null;

  return (
    <div
      className={`bg-white rounded-xl border border-stone-200 p-4 transition-opacity ${hidden ? "opacity-40" : "opacity-100"}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-sage-200 flex items-center justify-center text-xs font-medium text-sage-800 shrink-0">
          {rant.user_id?.slice(0, 2).toUpperCase() ?? "??"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-sage-800">
            {isOwner ? "You" : `user_${rant.user_id?.slice(-4) ?? "????"}`}
          </div>
          <div className="text-xs text-stone-400">
            {formatTimestamp(rant.created_at)}
          </div>
        </div>
        <span className="text-xs text-sage-700 bg-sage-100 rounded-full px-3 py-1 whitespace-nowrap">
          {rant.moderation_label === "support_needed"
            ? "Support needed"
            : "Just venting"}
        </span>
      </div>

      {/* Body / Edit Mode */}
      {editing ? (
        <div className="mb-3">
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full min-h-[80px] resize-none border border-stone-200 rounded-lg px-3 py-2 text-[15px] font-lora text-stone-700 outline-none focus:border-sage-300 transition-colors"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancelEdit}
              className="text-sm text-stone-400 border border-stone-200 rounded-lg px-3 py-1 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
              className="text-sm text-white bg-sage-500 hover:bg-sage-600 disabled:opacity-40 rounded-lg px-3 py-1 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="font-lora text-[15px] text-stone-700 leading-relaxed mb-3">
          {bodyText}
        </p>
      )}

      {hidden && (
        <p className="text-xs text-stone-400 text-center mb-3">Post hidden</p>
      )}

      {/* Action Bar */}
      <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-orange-500" : "text-stone-400 hover:text-stone-600"}`}
        >
          <HeartIcon filled={liked} />
          <span>{feltCount} felt this</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChatIcon />
          <span>
            {commentCount} {commentCount === 1 ? "reply" : "replies"}
          </span>
        </button>

        <div className="flex-1" />

        {isOwner && !editing && (
          <>
            <button
              onClick={() => {
                setEditText(bodyText);
                setEditing(true);
              }}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-50"
              title="Edit post"
            >
              <EditIcon />
            </button>
            <button
              onClick={handleDelete}
              className="text-stone-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
              title="Delete post"
            >
              <TrashIcon />
            </button>
          </>
        )}

        <button
          onClick={handleHide}
          className={`transition-colors p-1 rounded-lg ${hidden ? "text-stone-400 hover:text-stone-600 hover:bg-stone-50" : "text-stone-400 hover:text-red-500 hover:bg-red-50"}`}
          title={hidden ? "Unhide post" : "Hide post"}
        >
          {hidden ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-3">
          {loadingComments ? (
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 rounded-full border-2 border-sage-300 border-t-sage-600 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-stone-400 text-center">
              No replies yet. Be the first!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 shrink-0">
                  {c.user_id?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
                <div className="flex-1 bg-stone-50 rounded-lg px-3 py-2">
                  <div className="text-xs font-medium text-stone-700">
                    {c.user_id === currentUserId
                      ? "You"
                      : `user_${c.user_id?.slice(-4)}`}
                  </div>
                  {editingCommentId === c._id ? (
                    <div className="mt-1">
                      <textarea
                        autoFocus
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="w-full text-sm border border-stone-200 rounded-lg px-2 py-1.5 outline-none focus:border-sage-300 resize-none transition-colors"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button
                          onClick={() => handleSaveEditComment(c._id)}
                          disabled={!editingCommentText.trim()}
                          className="text-xs text-white bg-sage-500 hover:bg-sage-600 disabled:opacity-40 rounded-full px-3 py-1 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditComment}
                          className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded-full px-3 py-1 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-stone-500 mt-0.5 leading-snug">
                        {c.content}
                      </div>
                      <button
                        onClick={() => handleLikeComment(c._id)}
                        className={`flex items-center gap-1 mt-1.5 text-xs transition-colors ${c.likes.includes(currentUserId) ? "text-orange-500" : "text-stone-400 hover:text-stone-600"}`}
                      >
                        <HeartIcon filled={c.likes.includes(currentUserId)} />
                        {c.likes.length > 0 && <span>{c.likes.length}</span>}
                      </button>
                    </>
                  )}
                </div>
                {c.user_id === currentUserId && editingCommentId !== c._id && (
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      onClick={() => handleStartEditComment(c)}
                      className="text-stone-300 hover:text-stone-500 transition-colors p-0.5 rounded"
                      title="Edit comment"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-stone-300 hover:text-red-400 transition-colors p-0.5 rounded"
                      title="Delete comment"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Comment Input */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-sage-200 flex items-center justify-center text-[10px] font-medium text-sage-800 shrink-0">
              {currentUserId.slice(0, 2).toUpperCase()}
            </div>
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Write a reply..."
              className="flex-1 text-sm border border-stone-200 rounded-full px-3 py-1.5 outline-none focus:border-sage-300 transition-colors bg-white placeholder:text-stone-300"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentInput.trim()}
              className="text-xs text-white bg-sage-500 hover:bg-sage-600 disabled:opacity-40 rounded-full px-3 py-1.5 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
