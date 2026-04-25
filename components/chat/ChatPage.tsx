"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { MessageBubble } from "@/components/MessageBubble";
import { QuickReplies } from "@/components/QuickReplies";
import { RightPanel } from "@/components/RightPanel";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Message, INITIAL_MESSAGES, DEFAULT_QUICK_REPLIES } from "@/lib/chatData";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedReply, setSelectedReply] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || isTyping) return;

    // 1. Show user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMessage.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setSelectedReply(undefined);

    try {
      // 2. Call Gemini API
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.trim() }),
      });

      const data = await res.json();

      // 3. Show bot reply
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply ?? "I'm here. Tell me more.",
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    setMessages(INITIAL_MESSAGES);
    setSelectedReply(undefined);
  };

  return (
    <div className="flex h-screen bg-sage-50 overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          onNewConversation={handleNewConversation}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        <QuickReplies
          replies={DEFAULT_QUICK_REPLIES}
          onSelect={(reply) => {
            setSelectedReply(reply);
            handleSend(reply);
          }}
          selectedReply={selectedReply}
        />

        {/* Text Input */}
        <div className="px-[18px] pb-4 pt-1">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}

// ── Chat Input ────────────────────────────────────────────────────────────────
function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="flex gap-2 items-end border border-sage-200 rounded-[12px] bg-white px-3 py-2">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Say anything — this is your space..."
        disabled={disabled}
        className="flex-1 resize-none bg-transparent font-dm-sans text-[13px] text-sage-800 placeholder:text-stone-300 outline-none leading-[1.5] disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="text-sage-500 hover:text-sage-700 transition-colors disabled:opacity-30 pb-[1px]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
        </svg>
      </button>
    </div>
  );
}
const res = await fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMessage.trim() }),
});

const data = await res.json();
console.log("FULL API RESPONSE:", JSON.stringify(data)); // 👈 add this