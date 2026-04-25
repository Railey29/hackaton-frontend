import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 5000; // poll backend every 5 seconds

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id") ?? "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastPostId: string | null = null;
      let closed = false;

      // Clean up when client disconnects
      req.signal.addEventListener("abort", () => {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      });

      function send(event: string, data: unknown) {
        if (closed) return;
        try {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          closed = true;
        }
      }

      async function poll() {
        if (closed) return;

        try {
          const url = `${process.env.API_URL}/posts/?skip=0&limit=20${userId ? `&user_id=${userId}` : ""}`;
          const response = await fetch(url, { cache: "no-store" });
          const data = await response.json();

          if (!data.success) return;

          const posts: Array<{ _id: string }> = data.data ?? [];

          if (posts.length === 0) return;

          const newestId = posts[0]._id;

          if (lastPostId === null) {
            // First poll — send the full feed as initial snapshot
            send("snapshot", posts);
            lastPostId = newestId;
          } else if (newestId !== lastPostId) {
            // Find only the posts that are newer than the last known one
            const newPosts = posts.filter((p) => {
              // Walk until we hit the old lastPostId
              return p._id !== lastPostId;
            });

            // Only emit posts that appeared before the first known one
            const genuinelyNew: typeof posts = [];
            for (const p of posts) {
              if (p._id === lastPostId) break;
              genuinelyNew.push(p);
            }

            if (genuinelyNew.length > 0) {
              send("new-posts", genuinelyNew);
              lastPostId = newestId;
            }
          }
        } catch (err) {
          // network hiccup — keep going silently
          console.error("[feed-stream] poll error", err);
        }

        if (!closed) {
          await sleep(POLL_INTERVAL_MS);
          poll();
        }
      }

      // Send a heartbeat comment every 20s to keep the connection alive
      async function heartbeat() {
        while (!closed) {
          await sleep(20_000);
          if (!closed) {
            try {
              controller.enqueue(encoder.encode(": heartbeat\n\n"));
            } catch {
              closed = true;
              return;
            }
          }
        }
      }

      poll();
      heartbeat();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable nginx buffering
    },
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}