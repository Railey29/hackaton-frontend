import React from 'react';
import { Rant } from '@/lib/rants';
import { AvatarCircle } from './AvatarCircle';
import { FlairPill } from './FlairPill';
import { Heart, MessageCircle, Share } from 'lucide-react';

export function RantCard({ rant }: { rant: Rant }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-4 hover:border-sage-300 transition-colors">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarCircle initials={rant.initials} avatarColor={rant.avatarColor} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-600">{rant.alias}</span>
            </div>
            <div className="text-xs text-stone-400 mt-0.5">{rant.timestamp}</div>
          </div>
        </div>
        <FlairPill flair={rant.flair} />
      </div>

      {/* Body */}
      <div className="font-lora text-stone-600 text-[15px] leading-relaxed">
        {rant.body}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-2 pt-4 border-t border-stone-100">
        <button className="flex items-center gap-1.5 text-stone-400 hover:text-sage-600 transition-colors text-sm font-medium">
          <MessageCircle size={18} />
          <span>{rant.replyCount} replies</span>
        </button>
      </div>

    </div>
  );
}
