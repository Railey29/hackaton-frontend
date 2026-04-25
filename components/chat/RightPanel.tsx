"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoodPicker } from './MoodPicker';

export function RightPanel() {
  const router = useRouter();
  const [heardStatus, setHeardStatus] = useState<string | null>(null);

  const handlePostToFeed = () => {
    // In a real app we might pass a param to open the modal directly, 
    // but navigating to /feed works for the mock layout requirements right now.
    router.push('/feed');
  };

  return (
    <div className="w-[220px] bg-white border-l border-sage-100 flex flex-col h-full overflow-y-auto">
      
      {/* Section 1 */}
      <div className="p-[14px] border-b border-sage-100">
        <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
          How are you right now?
        </h3>
        <MoodPicker />
      </div>

      {/* Section 2 */}
      <div className="p-[14px] border-b border-sage-100">
        <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
          Feeling heard today?
        </h3>
        <div className="flex gap-[4px]">
          {['Not yet', 'A little', 'Yes'].map(option => (
            <button
              key={option}
              onClick={() => setHeardStatus(heardStatus === option ? null : option)}
              className={`flex-1 py-[6px] rounded-[7px] border font-dm-sans text-[11px] transition-colors truncate px-1 text-center ${
                heardStatus === option
                  ? 'bg-sage-100 border-sage-300 text-sage-700 on'
                  : 'bg-white border-sage-100 text-stone-600 hover:bg-sage-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Section 3 */}
      <div className="m-[14px] bg-sage-50 border border-sage-200 rounded-[10px] p-[12px]">
        <h4 className="font-lora text-[13px] text-sage-800 font-semibold mb-1.5">Share with others</h4>
        <p className="text-[11px] text-sage-600 leading-[1.5] mb-3">
          Turn what you're feeling into an anonymous rant.
          Someone out there will feel less alone reading it.
        </p>
        <button 
          onClick={handlePostToFeed}
          className="w-full bg-sage-500 hover:opacity-85 text-white rounded-[7px] py-[6px] font-dm-sans text-[11px] font-medium transition-opacity"
        >
          Post to feed →
        </button>
      </div>

      {/* Section 4 */}
      <div className="px-[14px] pb-[14px]">
        <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
          Remember
        </h3>
        <div className="flex flex-col gap-2.5">
          {[
            "This conversation is private and tied only to your anonymous alias.",
            "AlphaBot won't diagnose you or give medical advice — just a space to breathe.",
            "If you're in crisis, please reach out to someone you trust or a local helpline."
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-[7px]">
              <div className="w-[4px] h-[4px] bg-sage-300 rounded-full shrink-0 mt-[6px]" />
              <p className="text-[11px] text-stone-600 leading-[1.4]">{tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
