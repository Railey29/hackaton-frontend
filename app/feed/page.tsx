"use client";

import React, { useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { SortTabs } from '@/components/SortTabs';
import { RantCard } from '@/components/RantCard';
import { ComposerModal } from '@/components/ComposerModal';
import { MOCK_RANTS } from '@/lib/rants';
import { Menu, PenLine } from 'lucide-react';

export default function FeedPage() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-0 flex justify-center">
      
      <LeftSidebar onShareRant={() => setIsComposerOpen(true)} />
      
      {/* Spacer for LeftSidebar fixed position equivalent */}
      <div className="w-[220px] shrink-0 hidden md:block" />

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

        {/* Feed Header */}
        <div className="mb-6">
          <h2 className="font-lora text-2xl font-medium text-stone-800 mb-6">What's weighing on you?</h2>
          <SortTabs />
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
          {MOCK_RANTS.map(rant => (
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

      {/* Modal */}
      {isComposerOpen && (
        <ComposerModal onClose={() => setIsComposerOpen(false)} />
      )}

    </div>
  );
}
