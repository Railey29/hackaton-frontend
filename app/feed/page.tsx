"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { RantCard } from "@/components/RantCard";
import { MOCK_RANTS, Rant } from "@/lib/rants";
import { PenLine, X, Home, Clock, Menu } from "lucide-react";

export default function FeedPage() {
  const router = useRouter();
  const [alias, setAlias] = useState("quietstranger_7");
  const [initials, setInitials] = useState("Q7");
  const [avatarColor, setAvatarColor] = useState("bg-sage-300");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<"feed" | "chat">("feed");
  const [rants, setRants] = useState(() => MOCK_RANTS.map((r) => ({ ...r })));
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const savedAlias = localStorage.getItem("ss_alias");
    if (!savedAlias) {
      router.replace("/login");
      return;
    }

    const savedInitials = localStorage.getItem("ss_initials") ?? "Q7";
    const savedColor = localStorage.getItem("ss_avatarColor") ?? "bg-sage-300";
    const savedAnon = localStorage.getItem("ss_isAnonymous") === "true";
    const savedDisplayName = localStorage.getItem("ss_displayName");
    const isNewLogin = localStorage.getItem("ss_newLogin") === "true";

    setAlias(savedAlias);
    setInitials(savedInitials);
    setAvatarColor(savedColor);
    setIsAnonymous(savedAnon);

    localStorage.removeItem("ss_newLogin");
    if (savedDisplayName) {
      setDisplayName(savedDisplayName);
    } else {
      setDisplayName(savedAlias);
    }

    setTimeout(() => setReady(true), 50);
  }, [router]);

  // Derived: what name shows on posts
  const shownName = displayName || alias;
  const shownInitials = shownName.slice(0, 2).toUpperCase();

  function generateRandomName() {
    const adjectives = [
      "quiet",
      "gentle",
      "soft",
      "calm",
      "still",
      "misty",
      "golden",
      "silver",
      "velvet",
      "cosmic",
      "lunar",
      "solar",
      "wild",
      "brave",
      "bold",
      "swift",
      "clever",
      "lucky",
      "starry",
      "dreamy",
      "fuzzy",
      "chill",
      "tender",
      "vivid",
      "hollow",
      "faded",
      "neon",
      "rusty",
      "dusty",
      "hazy",
    ];
    const nouns = [
      "stranger",
      "wanderer",
      "soul",
      "spirit",
      "echo",
      "ember",
      "tide",
      "breeze",
      "cloud",
      "storm",
      "river",
      "meadow",
      "forest",
      "horizon",
      "whisper",
      "shadow",
      "spark",
      "comet",
      "petal",
      "stone",
      "bloom",
      "wave",
      "dusk",
      "dawn",
      "frost",
      "hollow",
      "valley",
      "lantern",
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    setDisplayName(`${adj}${noun}_${num}`);
  }

  function handlePost() {
    if (!text.trim()) return;
    const newRant: Rant = {
      id: Date.now().toString(),
      alias: shownName,
      initials: shownInitials,
      avatarColor,
      timestamp: new Date().toISOString(),
      flair: "Just venting",
      body: text.trim(),
      feltCount: 0,
      replyCount: 0,
    };
    MOCK_RANTS.unshift(newRant);
    setRants([...MOCK_RANTS]);
    setIsComposerOpen(false);
    setText("");
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-sage-300 border-t-sage-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-0 flex justify-center transition-opacity duration-300 opacity-100">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={[
          "fixed top-0 left-0 h-full w-[260px] bg-white border-r border-sage-200 z-30 transition-transform duration-300 ease-in-out lg:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex justify-end px-3 pt-3 pb-1">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-sage-50"
            aria-label="Close sidebar"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-4 pb-4 border-b border-stone-100">
          <h2 className="font-lora text-lg text-sage-800 font-semibold">
            SafeSpace
          </h2>
        </div>
        <nav className="flex flex-col gap-1 p-3 mt-2">
          <button
            onClick={() => {
              setActivePage("feed");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activePage === "feed"
                ? "bg-sage-100 text-sage-700"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <Home size={16} />
            Feed
          </button>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/chat");
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activePage === "chat"
                ? "bg-sage-100 text-sage-700"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <Clock size={16} />
            Chat
          </button>
        </nav>
      </aside>

      <LeftSidebar />

      <main className="flex-1 max-w-[600px] w-full min-h-screen py-8 md:px-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-[30px] h-[30px] rounded-[7px] border border-sage-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-sage-50 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={14} strokeWidth={1.5} />
            </button>
            <h1 className="font-lora text-xl text-sage-800 font-semibold">
              SafeSpace
            </h1>
          </div>
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-sage-800`}
          >
            {shownInitials}
          </div>
        </div>

        {/* Composer Prompt */}
        <div
          onClick={() => setIsComposerOpen(true)}
          className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4 mb-8 cursor-pointer hover:border-sage-300 hover:bg-sage-50/30 transition-colors"
        >
          <div
            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-sage-800 shrink-0`}
          >
            {shownInitials}
          </div>
          <div className="text-stone-400 font-lora text-[15px]">
            What's on your mind today? You're safe here...
          </div>
        </div>

        {/* Rant Feed */}
        <div className="flex flex-col gap-4 pb-20 md:pb-8">
          {rants.map((rant) => (
            <RantCard key={rant.id} rant={rant} />
          ))}
        </div>
      </main>

      <RightSidebar />

      {/* Mobile FAB */}
      <button
        onClick={() => setIsComposerOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-sage-500 hover:bg-sage-600 active:scale-95 transition-all text-white rounded-full flex items-center justify-center border border-sage-600"
      >
        <PenLine size={24} />
      </button>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-lora text-lg text-sage-800 font-semibold">
                Share a rant
              </h2>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-sage-800 shrink-0`}
              >
                {shownInitials}
              </div>
              <div>
                <div className="text-sm font-medium text-sage-800">
                  {shownName}
                </div>
                <div className="text-xs text-stone-400">
                  {isAnonymous ? "anonymous" : ""}
                </div>
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
              <span className="text-xs text-stone-400">
                {text.length} / 500
              </span>
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
