"use client";

import React, { useEffect, useState } from "react";
import { Plus, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { getOrCreateAnonId } from "@/lib/anon";

type AssessmentItem = {
  id: string;
  analysisText: string;
  stressLevel: string | null;
  createdAt: string | null;
};

type ChatSidebarProps = {
  onNewConversation: () => void;
  onClose?: () => void;
};

export function ChatSidebar({ onNewConversation, onClose }: ChatSidebarProps) {
  const [alias, setAlias] = useState("");
  const [initials, setInitials] = useState("");
  const [items, setItems] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setAlias(localStorage.getItem("ss_alias") ?? "");
    setInitials(localStorage.getItem("ss_initials") ?? "");
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const anonId = getOrCreateAnonId();
        if (!anonId) return;
        const res = await fetch(
          `/api/assessments?anonId=${encodeURIComponent(anonId)}&limit=50`,
        );
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          setItems([]);
          setError(
            data?.error === "db_unreachable"
              ? "Database unreachable. Check your MongoDB connection."
              : "Failed to load analytics.",
          );
          return;
        }
        if (data?.ok && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("Failed to load analytics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const levelColor =
    (level: string | null) =>
      level === "High"
        ? "text-red-700 bg-red-50 border-red-100"
        : level === "Moderate"
          ? "text-yellow-700 bg-yellow-50 border-yellow-100"
          : "text-green-700 bg-green-50 border-green-100";

  return (
    <div className="w-[210px] bg-white border-r border-sage-100 flex flex-col h-full overflow-hidden">
      {/* Top Section */}
      <div className="p-4 pt-3 pb-0 px-[14px]">
        {/* Back to Feed + X row */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/feed"
            className="flex items-center gap-1.5 text-stone-400 hover:text-sage-700 transition-colors w-fit"
          >
            <ArrowLeft size={13} strokeWidth={1.8} />
            <span className="font-dm-sans text-[11px] font-medium">
              Back to Feed
            </span>
          </Link>

          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-stone-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        <h1 className="font-lora text-[18px] text-sage-900 font-semibold mb-3">
          SafeSpace
        </h1>

        <button
          onClick={onNewConversation}
          className="w-full bg-sage-500 text-white rounded-lg flex items-center justify-center gap-1.5 py-2 hover:opacity-85 transition-opacity"
        >
          <Plus size={11} strokeWidth={1.5} />
          <span className="font-dm-sans text-[12px] font-medium">
            New conversation
          </span>
        </button>
      </div>

      {/* AI Analytics */}
      <div className="flex-1 overflow-y-auto px-[10px] pb-2 scrollbar-thin">
        <div className="px-1 pt-3 pb-2">
          <div className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold">
            AI Analytics
          </div>
          <div className="text-[10px] text-stone-400 mt-1">
            Your past stress analyses
          </div>
        </div>

        {loading && (
          <div className="px-1 text-[11px] text-stone-500">
            Loading analyses...
          </div>
        )}

        {!loading && error && (
          <div className="px-1 text-[11px] text-red-600">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="px-1 text-[11px] text-stone-500">
            No analyses yet.
          </div>
        )}

        <div className="flex flex-col gap-2 pb-2">
          {items.map((it) => {
            const isOpen = selectedId === it.id;
            const createdLabel = it.createdAt
              ? new Date(it.createdAt).toLocaleString()
              : "Unknown date";
            const preview = it.analysisText.split("\n").find(Boolean) ?? it.analysisText;
            return (
              <button
                key={it.id}
                onClick={() => setSelectedId(isOpen ? null : it.id)}
                className="text-left rounded-[10px] border border-sage-100 bg-white hover:bg-sage-50 transition-colors px-2.5 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-sage-800 font-medium truncate">
                    {preview || "Stress Analysis"}
                  </div>
                  <div
                    className={[
                      "shrink-0 text-[9px] px-1.5 py-0.5 rounded border",
                      levelColor(it.stressLevel),
                    ].join(" ")}
                  >
                    {it.stressLevel ?? "N/A"}
                  </div>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  {createdLabel}
                </div>
                {isOpen && (
                  <div className="mt-2 text-[11px] text-stone-700 leading-[1.45] whitespace-pre-wrap max-h-[180px] overflow-y-auto pr-1">
                    {it.analysisText}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 px-[14px] border-t border-sage-100 flex items-center gap-2">
        <div className="w-[26px] h-[26px] rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-[10px] font-bold shrink-0">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-sage-800 font-medium leading-tight">
            {alias}
          </span>
          <span className="text-[10px] text-stone-400 leading-tight">
            anonymous
          </span>
        </div>
      </div>
    </div>
  );
}
