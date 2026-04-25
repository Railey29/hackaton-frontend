import React from 'react';
import { FlairType } from '@/lib/rants';
import { FlairPill } from './FlairPill';

const TAGS: FlairType[] = [
  'Anxiety', 'Burnout', 'Grief', 'Loneliness', 'Just venting', 'Feeling lost'
];

export function RightSidebar() {
  return (
    <aside className="w-[200px] hidden lg:block flex-col pt-8 pb-8">
      
      {/* Stat Widget */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <h3 className="font-lora text-[15px] font-semibold text-sage-800 mb-2">You're not alone</h3>
        <p className="text-[13px] text-stone-500 leading-relaxed">
          <strong className="text-stone-700">1,284</strong> people shared a rant this week.
        </p>
      </div>

      {/* Tag Cloud */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Browse by feeling</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <FlairPill key={tag} flair={tag} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">How this works</h3>
        <div className="text-[13px] text-stone-500 leading-relaxed">
          SafeSpace uses temporary, anonymous aliases. Your real identity is forever hidden. No judgment, just a place to land.
        </div>
      </div>

    </aside>
  );
}
