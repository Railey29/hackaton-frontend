import { useEffect, useRef, useCallback } from "react";
import { Post } from "@/components/ComposerModal";

type FeedEvent =
  | { type: "snapshot"; posts: Post[] }
  | { type: "new-posts"; posts: Post[] }
  | { type: "connection"; status: "connected" | "disconnected" | "reconnecting" };

interface UseFeedStreamOptions {
  userId: string;
  enabled: boolean;
  onSnapshot: (posts: Post[]) => void;
  onNewPosts: (posts: Post[]) => void;
  onStatusChange?: (status: "connected" | "disconnected" | "reconnecting") => void;
}

export function useFeedStream({
  userId,
  enabled,
  onSnapshot,
  onNewPosts,
  onStatusChange,
}: UseFeedStreamOptions) {
  const esRef = useRef<EventSource | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 10;

  const connect = useCallback(() => {
    if (!enabled || !userId) return;

    // Clean up any existing connection
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const url = `/api/feed-stream?user_id=${encodeURIComponent(userId)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("snapshot", (e) => {
      retryCountRef.current = 0;
      onStatusChange?.("connected");
      try {
        const posts: Post[] = JSON.parse(e.data);
        onSnapshot(posts);
      } catch {
        console.error("[useFeedStream] bad snapshot payload");
      }
    });

    es.addEventListener("new-posts", (e) => {
      try {
        const posts: Post[] = JSON.parse(e.data);
        onNewPosts(posts);
      } catch {
        console.error("[useFeedStream] bad new-posts payload");
      }
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;

      if (retryCountRef.current >= MAX_RETRIES) {
        onStatusChange?.("disconnected");
        return;
      }

      onStatusChange?.("reconnecting");
      const delay = Math.min(1000 * 2 ** retryCountRef.current, 30_000);
      retryCountRef.current++;
      retryTimerRef.current = setTimeout(connect, delay);
    };
  }, [userId, enabled, onSnapshot, onNewPosts, onStatusChange]);

  useEffect(() => {
    if (!enabled) return;
    connect();

    return () => {
      esRef.current?.close();
      esRef.current = null;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [connect, enabled]);
}