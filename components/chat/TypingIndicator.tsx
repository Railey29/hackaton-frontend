import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end max-w-[400px] mr" aria-label="Sage is typing">
      {/* Bot Avatar */}
      <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 bg-sage-100 text-sage-700 mav">
        S
      </div>

      {/* Bubble with dots */}
      <div className="px-[13px] py-[14px] bg-white border border-sage-100 rounded-[14px] rounded-bl-[3px] flex items-center gap-[4px] h-[35px]">
        <style>{`
          @keyframes bop {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: var(--color-sage-300);
            animation: bop 1s infinite alternate;
          }
          .d1 { animation-delay: 0s; }
          .d2 { animation-delay: 0.2s; }
          .d3 { animation-delay: 0.4s; }
        `}</style>
        <div className="dot d1" />
        <div className="dot d2" />
        <div className="dot d3" />
      </div>
    </div>
  );
}
