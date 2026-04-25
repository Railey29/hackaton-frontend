"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

export interface Post {
  _id: string;
  user_id: string;
  content: string;
  moderation_label: string;
  likes: string[];
  comment_count: number;
  hidden_by: string[];
  created_at: string;
  updated_at: string;
}

type ComposerModalProps = {
  onClose: () => void;
  onPost: (post: Post) => void;
  userId: string;
  alias: string;
  initials: string;
  avatarColor: string;
};

export function ComposerModal({
  onClose,
  onPost,
  userId,
  alias,
  initials,
  avatarColor,
}: ComposerModalProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim(), user_id: userId }),
      });

      const data: { data: Post; error?: string } = await res.json();
      console.log("Create post response:", data);

      if (!res.ok) {
        setError(data.error || "Failed to post.");
        return;
      }

      onPost(data.data);
      onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-lora text-lg text-sage-800 font-semibold">
            Share a rant
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-sage-800 shrink-0`}
          >
            {initials}
          </div>
          <div>
            <div className="text-sm font-medium text-sage-800">{alias}</div>
          </div>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? You're safe here..."
          className="w-full min-h-[140px] resize-none border-none outline-none text-[15px] font-lora text-stone-700 placeholder:text-stone-300"
          maxLength={500}
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">{text.length} / 500</span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="bg-sage-500 hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
