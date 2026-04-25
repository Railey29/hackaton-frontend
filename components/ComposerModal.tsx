"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

type ComposerModalProps = {
  onClose: () => void;
  onPost: (text: string) => void;
};

export function ComposerModal({ onClose, onPost }: ComposerModalProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (!text.trim()) return;
    onPost(text.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-xl p-6 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-lora text-lg text-sage-800 font-semibold">Share a rant</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage-300 flex items-center justify-center text-sm font-medium text-sage-800 shrink-0">
            W
          </div>
          <div>
            <div className="text-sm font-medium text-sage-800">quietstranger_7</div>
            <div className="text-xs text-stone-400">anonymous</div>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? You're safe here..."
          className="w-full min-h-[140px] resize-none border-none outline-none text-[15px] font-lora text-stone-700 placeholder:text-stone-300"
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">{text.length} / 500</span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="bg-sage-500 hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors"
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}