import React from 'react';
import { Message } from '@/lib/chatData';

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';

  // Process text to render <i> tags if present (from the dummy data)
  const renderText = (text: string) => {
    const parts = text.split(/(<i>.*?<\/i>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<i>') && part.endsWith('</i>')) {
        return <i key={i} className="text-sage-500 italic">{part.slice(3, -4)}</i>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex gap-2 items-end max-w-[400px] ${!isBot ? 'flex-row-reverse ml-auto mr u' : 'mr'}`}>
      
      {/* Avatar */}
      <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 mav ${
        isBot ? 'bg-sage-100 text-sage-700' : 'bg-sage-200 text-sage-800'
      }`}>
        {isBot ? 'S' : 'Y'}
      </div>

      {/* Bubble */}
      <div className={`px-[13px] py-[10px] text-[13px] leading-[1.6] bub whitespace-pre-wrap ${
        isBot 
          ? 'bg-white border border-sage-100 text-sage-800 font-lora rounded-[14px] rounded-bl-[3px]' 
          : 'bg-sage-500 text-white rounded-[14px] rounded-br-[3px]'
      }`}>
        {renderText(message.text)}
      </div>

    </div>
  );
}
