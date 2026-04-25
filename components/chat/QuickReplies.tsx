import React from 'react';

type QuickRepliesProps = {
  replies: string[];
  onSelect: (reply: string) => void;
  selectedReply?: string;
  onAskAI?: (message: string) => Promise<void>;
};

export function QuickReplies({ replies, onSelect, selectedReply, onAskAI }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[5px] px-[18px] pb-2 pt-2">
      {replies.map((reply, i) => {
        const isSelected = selectedReply === reply;
        return (
          <button
            key={i}
            onClick={() => {
              onSelect(reply);
              onAskAI?.(reply);
            }}
            className={`px-[12px] py-[5px] rounded-[20px] border font-dm-sans text-[11px] transition-colors qr ${
              isSelected
                ? 'bg-sage-100 border-sage-400 text-sage-700 on'
                : 'border-sage-300 text-sage-600 hover:bg-sage-100 hover:border-sage-400 hover:text-sage-700'
            }`}
          >
            {reply}
          </button>
        );
      })}
    </div>
  );
}