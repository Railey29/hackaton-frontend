"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { RantCard } from "@/components/RantCard";
import { ComposerModal } from "@/components/ComposerModal";
import { Post } from "@/components/ComposerModal";
import { useFeedStream } from "@/lib/useFeedStream";
import {
  PenLine,
  X,
  Home,
  Clock,
  Menu,
  ArrowUp,
  WifiOff,
  LogOut,
} from "lucide-react";

const MOTIVATIONAL_BOT_ID = "69ece87cf045acdc65d4b574";

export default function FeedPage() {
  const router = useRouter();
  const [alias, setAlias] = useState("");
  const [userId, setUserId] = useState("");
  const [initials, setInitials] = useState("Q7");
  const [avatarColor, setAvatarColor] = useState("bg-sage-300");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<"feed" | "chat">("feed");
  const [rants, setRants] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [ready, setReady] = useState(false);
  const [displayName, setDisplayName] = useState("");

  // SSE state
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [streamStatus, setStreamStatus] = useState<
    "connected" | "disconnected" | "reconnecting" | "idle"
  >("idle");
  const feedTopRef = useRef<HTMLDivElement>(null);

  // ── SSE handlers ──────────────────────────────────────────────────────────
  const handleSnapshot = useCallback((posts: Post[]) => {
    setRants(posts);
    setLoadingPosts(false);
  }, []);

  const handleNewPosts = useCallback((posts: Post[]) => {
    setPendingPosts((prev) => {
      const existingIds = new Set(prev.map((p) => p._id));
      const fresh = posts.filter((p) => !existingIds.has(p._id));
      return [...fresh, ...prev];
    });
  }, []);

  const handleStatusChange = useCallback(
    (status: "connected" | "disconnected" | "reconnecting") => {
      setStreamStatus(status);
    },
    [],
  );

  useFeedStream({
    userId,
    enabled: ready && !!userId,
    onSnapshot: handleSnapshot,
    onNewPosts: handleNewPosts,
    onStatusChange: handleStatusChange,
  });

  // ── Auth bootstrap ────────────────────────────────────────────────────────
  useEffect(() => {
    const savedAlias = localStorage.getItem("ss_alias");
    const savedUserId = localStorage.getItem("ss_user_id");

    if (!savedAlias || !savedUserId) {
      router.replace("/login");
      return;
    }

    const savedInitials = localStorage.getItem("ss_initials") ?? "Q7";
    const savedColor = localStorage.getItem("ss_avatarColor") ?? "bg-sage-300";
    const savedAnon = localStorage.getItem("ss_isAnonymous") === "true";
    const savedDisplayName = localStorage.getItem("ss_displayName");
    const savedNickname = localStorage.getItem("ss_nickname");

    Promise.resolve().then(() => {
      setAlias(savedAlias);
      setUserId(savedUserId);
      setInitials(savedInitials);
      setAvatarColor(savedColor);
      setIsAnonymous(savedAnon);
      setDisplayName(savedDisplayName || savedNickname || savedAlias);
      localStorage.removeItem("ss_newLogin");
      setTimeout(() => setReady(true), 50);
    });
  }, [router]);

  // ── Motivational bot ──────────────────────────────────────────────────────
  useEffect(() => {
    async function postMotivationalQuote() {
      try {
        const quoteRes = await fetch(
          "https://hackathon-backend-production-c1f0.up.railway.app/motivational/",
        );
        const quoteData = await quoteRes.json();
        const quote: string = quoteData?.data?.quote;
        if (!quote) return;

        const postRes = await fetch("/api/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: quote,
            user_id: MOTIVATIONAL_BOT_ID,
          }),
        });
        const data = await postRes.json();
        if (postRes.ok && data.data) {
          // Add directly to feed — no need to queue as pending
          setRants((prev) => [data.data, ...prev]);
        }
      } catch {
        console.error("Failed to post motivational quote");
      }
    }

    const timeout = setTimeout(() => {
      postMotivationalQuote();
      const interval = setInterval(postMotivationalQuote, 2 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const shownName = displayName || alias;
  const shownInitials = shownName.slice(0, 2).toUpperCase();

  function flushPending() {
    if (pendingPosts.length === 0) return;
    setRants((prev) => {
      const existingIds = new Set(prev.map((p) => p._id));
      const fresh = pendingPosts.filter((p) => !existingIds.has(p._id));
      return [...fresh, ...prev];
    });
    setPendingPosts([]);
    feedTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleNewPost(post: Post) {
    setRants((prev) => [post, ...prev]);
  }

  function handleLogout() {
    localStorage.removeItem("ss_alias");
    localStorage.removeItem("ss_user_id");
    localStorage.removeItem("ss_initials");
    localStorage.removeItem("ss_avatarColor");
    localStorage.removeItem("ss_isAnonymous");
    localStorage.removeItem("ss_displayName");
    localStorage.removeItem("ss_nickname");
    router.replace("/login");
  }

  // ── Loading guard ─────────────────────────────────────────────────────────
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
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left text-red-400 hover:bg-red-50 hover:text-red-500 mt-2"
          >
            <LogOut size={16} />
            Logout
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
          <div className="flex items-center gap-2">
            <ConnectionPill status={streamStatus} />
            <div
              className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-medium text-sage-800`}
            >
              {shownInitials}
            </div>
          </div>
        </div>

        {/* Desktop connection status */}
        <div className="hidden md:flex items-center justify-end gap-3 mb-2">
          <ConnectionPill status={streamStatus} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>

        {/* Scroll anchor */}
        <div ref={feedTopRef} />

        {/* Composer Prompt */}
        <div
          onClick={() => setIsComposerOpen(true)}
          className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4 mb-4 cursor-pointer hover:border-sage-300 hover:bg-sage-50/30 transition-colors"
        >
          <div
            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium text-sage-800 shrink-0`}
          >
            {shownInitials}
          </div>
          <div className="text-stone-400 font-lora text-[15px]">
            What&apos;s on your mind today? You&apos;re safe here...
          </div>
        </div>

        {/* New posts banner */}
        {pendingPosts.length > 0 && (
          <button
            onClick={flushPending}
            className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 active:scale-[.98] transition-all text-white text-sm font-medium shadow-sm"
          >
            <ArrowUp size={15} />
            {pendingPosts.length} new{" "}
            {pendingPosts.length === 1 ? "post" : "posts"} — tap to load
          </button>
        )}

        {/* Rant Feed */}
        {loadingPosts ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-6 h-6 rounded-full border-2 border-sage-300 border-t-sage-600 animate-spin" />
            <p className="text-xs text-stone-400">Connecting to live feed…</p>
          </div>
        ) : rants.length === 0 ? (
          <div className="text-center text-stone-400 font-lora text-sm py-10">
            No posts yet. Be the first to share!
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-20 md:pb-8">
            {rants.map((rant) => (
              <RantCard
                key={rant._id || `post-${rant.created_at}`}
                rant={rant}
                currentUserId={userId}
              />
            ))}
          </div>
        )}
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
        <ComposerModal
          onClose={() => setIsComposerOpen(false)}
          onPost={handleNewPost}
          userId={userId}
          alias={shownName}
          initials={shownInitials}
          avatarColor={avatarColor}
        />
      )}
    </div>
  );
}

// ── Connection status pill ────────────────────────────────────────────────────
function ConnectionPill({
  status,
}: {
  status: "connected" | "disconnected" | "reconnecting" | "idle";
}) {
  if (status === "idle") return null;

  const cfg = {
    connected: {
      dot: (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      ),
      label: "Live",
      cls: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    reconnecting: {
      dot: (
        <span className="w-1.5 h-1.5 rounded-full border border-amber-400 border-t-transparent animate-spin inline-block" />
      ),
      label: "Reconnecting",
      cls: "text-amber-600 bg-amber-50 border-amber-100",
    },
    disconnected: {
      dot: <WifiOff size={10} />,
      label: "Offline",
      cls: "text-stone-400 bg-stone-50 border-stone-100",
    },
  } as const;

  const { dot, label, cls } = cfg[status];

  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}
    >
      {dot}
      {label}
    </span>
  );
}
