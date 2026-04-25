"use client";

import React, { useEffect, useState } from "react";
import { HISTORY_ITEMS } from "@/lib/chatData";
import { Plus, ArrowLeft, X } from "lucide-react";
import Link from "next/link";

type ChatSidebarProps = {
  onNewConversation: () => void;
  onClose?: () => void;
};

export function ChatSidebar({ onNewConversation, onClose }: ChatSidebarProps) {
  const [alias, setAlias] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    setAlias(localStorage.getItem("ss_alias") ?? "");
    setInitials(localStorage.getItem("ss_initials") ?? "");
  }, []);

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

      {/* Label */}
      <div className="text-[10px] uppercase tracking-[0.06em] text-stone-400 px-[14px] pt-3 pb-1 font-semibold">
        Recent
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-2 scrollbar-thin">
        {HISTORY_ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`px-2.5 py-2 rounded-lg cursor-pointer transition-colors hi ${i === 0 ? "bg-sage-100 on" : "hover:bg-sage-50"}`}
          >
            <div className="text-[12px] text-sage-800 font-medium truncate hi-title">
              {item.title}
            </div>
            <div className="text-[10px] text-stone-400 mt-px hi-date">
              {item.date}
            </div>
          </div>
        ))}
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
