"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Message,
  INITIAL_MESSAGES,
  DEFAULT_QUICK_REPLIES,
  AFTER_RESPONSE_QUICK_REPLIES,
} from "@/lib/chatData";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { RightPanel } from "@/components/chat/RightPanel";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { QuickReplies } from "@/components/chat/QuickReplies";
import {
  Trash2,
  Share,
  MoreHorizontal,
  ArrowUp,
  Menu,
  Info,
  X,
} from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(DEFAULT_QUICK_REPLIES);
  const [selectedQuickReply, setSelectedQuickReply] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "18px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 80)}px`;
    }
  }, [inputText]);

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
    setIsRightPanelOpen(false);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputText.trim();
    if (!textToSend || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setQuickReplies([]);
    setSelectedQuickReply(undefined);
    if (textareaRef.current) textareaRef.current.style.height = "18px";

    setIsTyping(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

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
          text: "Something went wrong. I'm still here — try again?",
        },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        setQuickReplies(AFTER_RESPONSE_QUICK_REPLIES);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReplySelect = (reply: string) => {
    setSelectedQuickReply(reply);
    handleSend(reply);
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Hey, I'm glad you're back. What's on your mind today?",
      },
    ]);
    setQuickReplies(DEFAULT_QUICK_REPLIES);
    setSelectedQuickReply(undefined);
    setInputText("");
    setIsTyping(false);
    setIsSidebarOpen(false);
  };

  const anyPanelOpen = isSidebarOpen || isRightPanelOpen;

  return (
    <div className="h-screen w-full bg-stone-50 overflow-hidden flex justify-center items-center">
      {anyPanelOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <div className="w-full h-full flex max-w-[1400px] border-x border-sage-200 bg-stone-50 relative overflow-hidden">
        {/* Column 1: Sidebar */}
        <aside
          className={[
            "h-full z-30 transition-transform duration-300 ease-in-out",
            "lg:static lg:translate-x-0 lg:w-[210px] lg:shrink-0",
            "max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-[260px]",
            isSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          ].join(" ")}
        >
          <ChatSidebar
            onNewConversation={handleNewConversation}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>

        {/* Column 2: Main chat */}
        <main className="flex flex-col flex-1 min-w-0 h-full bg-stone-50 overflow-hidden">
          {/* Header */}
          <div className="h-[58px] bg-white border-b border-sage-100 flex items-center justify-between px-[14px] sm:px-[18px] shrink-0">
            <div className="flex items-center gap-[10px]">
              <button
                className="lg:hidden w-[30px] h-[30px] rounded-[7px] border border-sage-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-sage-50 transition-colors"
                onClick={() => {
                  setIsSidebarOpen(true);
                  setIsRightPanelOpen(false);
                }}
                aria-label="Open sidebar"
              >
                <Menu size={14} strokeWidth={1.5} />
              </button>

              <div className="w-[34px] h-[34px] rounded-full bg-sage-100 flex items-center justify-center border border-sage-200 shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-sage-500"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 9h.01" />
                  <path d="M16 9h.01" />
                  <path d="M8 15a4 4 0 0 0 8 0" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-lora text-[14px] text-sage-800 font-medium leading-none mb-1">
                  AlphaBot
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-[5px] h-[5px] rounded-full bg-sage-500" />
                  <span className="text-[11px] text-sage-500 leading-none">
                    Here for you
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                aria-label="Clear chat"
                className="w-[28px] h-[28px] rounded-[7px] border border-sage-100 flex items-center justify-center hover:bg-sage-50 transition-colors text-stone-400 hover:text-stone-600"
              >
                <Trash2 size={13} strokeWidth={1.4} />
              </button>
              <button
                aria-label="Share chat"
                className="hidden sm:flex w-[28px] h-[28px] rounded-[7px] border border-sage-100 items-center justify-center hover:bg-sage-50 transition-colors text-stone-400 hover:text-stone-600"
              >
                <Share size={13} strokeWidth={1.4} />
              </button>
              <button
                aria-label="More options"
                className="hidden sm:flex w-[28px] h-[28px] rounded-[7px] border border-sage-100 items-center justify-center hover:bg-sage-50 transition-colors text-stone-400 hover:text-stone-600"
              >
                <MoreHorizontal size={13} strokeWidth={1.4} />
              </button>
              <button
                className="xl:hidden w-[28px] h-[28px] rounded-[7px] border border-sage-100 flex items-center justify-center hover:bg-sage-50 transition-colors text-stone-400 hover:text-stone-600"
                onClick={() => {
                  setIsRightPanelOpen(true);
                  setIsSidebarOpen(false);
                }}
                aria-label="Open info panel"
              >
                <Info size={13} strokeWidth={1.4} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-[14px] sm:px-[18px] py-[16px] flex flex-col gap-[12px]"
            role="log"
            aria-live="polite"
          >
            <div className="text-[10px] text-stone-400 text-center uppercase tracking-wider mb-2 font-medium">
              Today · Apr 25
            </div>

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <QuickReplies
            replies={quickReplies}
            onSelect={handleQuickReplySelect}
            selectedReply={selectedQuickReply}
          />

          {/* Input Area */}
          <div className="px-[12px] sm:px-[14px] py-[10px] bg-white border-t border-sage-100 shrink-0 flex flex-col">
            <div className="flex items-end gap-[8px] w-full">
              <div className="flex-1 border border-sage-200 rounded-[10px] bg-stone-50 px-[11px] py-[7px] flex items-center gap-[7px] focus-within:border-sage-400 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (selectedQuickReply && e.target.value !== selectedQuickReply) {
                      setSelectedQuickReply(undefined);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Say anything — this is your space..."
                  aria-label="Type your message"
                  className="w-full bg-transparent border-none outline-none resize-none font-dm-sans text-[13px] text-sage-800 placeholder:text-stone-400"
                  style={{ minHeight: "18px", maxHeight: "80px" }}
                />
              </div>

              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
                className="w-[34px] h-[34px] sm:w-[30px] sm:h-[30px] shrink-0 rounded-[7px] bg-sage-500 hover:bg-sage-600 disabled:opacity-35 disabled:hover:bg-sage-500 flex items-center justify-center transition-all"
                aria-label="Send message"
              >
                <ArrowUp size={16} className="text-white" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-[6px] text-center text-[10px] text-stone-400 uppercase tracking-widest bg-stone-50 py-[3px] rounded">
              AlphaBot is an AI companion · Not a crisis service · Always anonymous
            </div>
          </div>
        </main>

        {/* Column 3: Right Panel */}
        <aside
          className={[
            "h-full bg-stone-50 border-l border-sage-200 z-30 transition-transform duration-300 ease-in-out",
            "xl:static xl:translate-x-0 xl:w-[220px] xl:shrink-0",
            "max-xl:fixed max-xl:top-0 max-xl:right-0 max-xl:w-[260px]",
            isRightPanelOpen ? "max-xl:translate-x-0" : "max-xl:translate-x-full",
          ].join(" ")}
        >
          <div className="xl:hidden flex justify-start px-3 pt-3 pb-1">
            <button
              onClick={() => setIsRightPanelOpen(false)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-sage-50"
              aria-label="Close info panel"
            >
              <X size={14} />
            </button>
          </div>
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}