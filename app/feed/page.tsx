"use client";

import React, { useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { RantCard } from '@/components/RantCard';
import { MOCK_RANTS, Rant } from '@/lib/rants';
import { Menu, PenLine, X } from 'lucide-react';

export default function FeedPage() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [rants, setRants] = useState(MOCK_RANTS);
  const [text, setText] = useState('');

  function handlePost() {
    if (!text.trim()) return;
    const newRant: Rant = {
      id: Date.now().toString(),
      alias: 'quietstranger_7',
      initials: 'Q7',
      avatarColor: 'bg-sage-300',
      timestamp: new Date().toISOString(),
      flair: 'Just venting',
      body: text.trim(),
      feltCount: 0,
      replyCount: 0,
    };
    setRants(prev => [newRant, ...prev]);
    setIsComposerOpen(false);
    setText('');
  }

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-0 flex justify-center">

      <LeftSidebar />

      <main className="flex-1 max-w-[600px] w-full min-h-screen py-8 md:px-6">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Menu className="text-stone-500" />
            <h1 className="font-lora text-xl text-sage-800 font-semibold">SafeSpace</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-xs font-medium text-sage-800">
            W
          </div>
        </div>

        {/* Compose Bar (Trigger) */}
        <div
          onClick={() => setIsComposerOpen(true)}
          className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4 mb-8 cursor-pointer hover:border-sage-300 hover:bg-sage-50/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-sage-300 flex items-center justify-center text-sm font-medium text-sage-800 shrink-0">W</div>
          <div className="text-stone-400 font-lora text-[15px]">What's on your mind today? You're safe here...</div>
        </div>

        {/* Feed Listing */}
        <div className="flex flex-col gap-4 pb-20 md:pb-8">
          {rants.map(rant => (
            <RantCard key={rant.id} rant={rant} />
          ))}
        </div>

      </main>

      <RightSidebar />

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsComposerOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-sage-500 hover:bg-sage-600 active:scale-95 transition-all text-white rounded-full flex items-center justify-center shadow-none border border-sage-600"
      >
        <PenLine size={24} />
      </button>

      {/* Inline Modal — walang separate component */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-xl p-6 flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h2 className="font-lora text-lg text-sage-800 font-semibold">Share a rant</h2>
              <button onClick={() => setIsComposerOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sage-300 flex items-center justify-center text-sm font-medium text-sage-800 shrink-0">W</div>
              <div>
                <div className="text-sm font-medium text-sage-800">quietstranger_7</div>
                <div className="text-xs text-stone-400">anonymous</div>
              </div>
            </div>

            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind? You're safe here..."
              className="w-full min-h-[140px] resize-none border-none outline-none text-[15px] font-lora text-stone-700 placeholder:text-stone-300"
            />

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="text-xs text-stone-400">{text.length} / 500</span>
              <button
                onClick={handlePost}
                disabled={!text.trim()}
                className="bg-sage-500 hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors"
              >
                Post
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}