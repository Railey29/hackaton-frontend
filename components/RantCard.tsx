"use client";

import React, { useState } from "react";

export interface Rant {
  id: string;
  alias: string;
  initials: string;
  avatarColor: string;
  timestamp: string;
  flair: string;
  body: string;
  feltCount: number;
  replyCount: number;
}

interface Comment {
  id: string;
  alias: string;
  initials: string;
  text: string;
}

interface RantCardProps {
  rant: Rant;
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
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RantCard({ rant }: RantCardProps) {
  const [liked, setLiked] = useState(false);
  const [feltCount, setFeltCount] = useState(rant.feltCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(rant.body);
  const [bodyText, setBodyText] = useState(rant.body);
  const [hidden, setHidden] = useState(false);

  function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setFeltCount(newLiked ? feltCount + 1 : feltCount - 1);
  }

  function handleSaveEdit() {
    if (!editText.trim()) return;
    setBodyText(editText.trim());
    setEditing(false);
  }

  function handleCancelEdit() {
    setEditText(bodyText);
    setEditing(false);
  }

  function handleSubmitComment() {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        alias: "quietstranger_7",
        initials: "Q7",
        text: commentInput.trim(),
      },
    ]);
    setCommentInput("");
  }

  function handleDeleteComment(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div
      className={`bg-white rounded-xl border border-stone-200 p-4 transition-opacity ${
        hidden ? "opacity-40" : "opacity-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-full ${rant.avatarColor} flex items-center justify-center text-xs font-medium text-sage-800 shrink-0`}
        >
          {rant.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-sage-800">{rant.alias}</div>
          <div className="text-xs text-stone-400">
            {formatTimestamp(rant.timestamp)}
          </div>
        </div>
        <span className="text-xs text-sage-700 bg-sage-100 rounded-full px-3 py-1 whitespace-nowrap">
          {rant.flair}
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
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-orange-500" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <HeartIcon filled={liked} />
          <span>{feltCount} felt this</span>
        </button>

        {/* Comments toggle */}
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChatIcon />
          <span>
            {comments.length} {comments.length === 1 ? "reply" : "replies"}
          </span>
        </button>

        <div className="flex-1" />

        {/* Edit */}
        {!editing && (
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
        )}

        {/* Hide/Unhide */}
        <button
          onClick={() => setHidden((h) => !h)}
          className={`transition-colors p-1 rounded-lg ${
            hidden
              ? "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              : "text-stone-400 hover:text-red-500 hover:bg-red-50"
          }`}
          title={hidden ? "Unhide post" : "Hide post"}
        >
          {hidden ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-3">
          {comments.length === 0 && (
            <p className="text-xs text-stone-400 text-center">
              No replies yet. Be the first!
            </p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 shrink-0">
                {c.initials}
              </div>
              <div className="flex-1 bg-stone-50 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-stone-700">
                  {c.alias}
                </div>
                <div className="text-sm text-stone-500 mt-0.5 leading-snug">
                  {c.text}
                </div>
              </div>
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="text-stone-300 hover:text-red-400 transition-colors text-xs mt-1 px-1"
                title="Delete comment"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Comment Input */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-sage-200 flex items-center justify-center text-[10px] font-medium text-sage-800 shrink-0">
              W
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
