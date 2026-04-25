# SafeSpace — Frontend Documentation

> *"A place to land when everything feels heavy."*

SafeSpace is a mental health and stress awareness web platform built with Next.js. It provides a community feed for anonymous emotional expression, an AI-powered stress assessment tool, and a real-time chat interface backed by Google Gemini.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Pages & Features](#pages--features)
5. [API Routes](#api-routes)
6. [Environment Variables](#environment-variables)
7. [Getting Started](#getting-started)
8. [Architecture Notes](#architecture-notes)
9. [Key Components](#key-components)
10. [Data Models](#data-models)
11. [Deployment](#deployment)

---

## Project Overview

SafeSpace is a hackathon-built full-stack frontend that proxies requests to an external backend API and directly connects to MongoDB for stress assessment data. The app has three main areas:

| Area | Description |
|---|---|
| **Feed** | Anonymous community posts ("rants") with likes, comments, and real-time updates via SSE |
| **Chat** | AI-powered mental health chatbot with a guided stress assessment flow |
| **Auth** | Registration and login backed by an external REST API |

The app is fully anonymous-capable — users who are not logged in are assigned a browser-local `anonId` for storing assessment history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Icons | Lucide React |
| Fonts | Lora, DM Sans (Google Fonts) |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Database | MongoDB (via native driver) — used for stress assessments only |
| Runtime | Node.js |

---

## Project Structure

```
hackaton-frontend-main/
├── app/
│   ├── api/                        # Next.js API route handlers
│   │   ├── assessments/            # Stress assessment CRUD (MongoDB)
│   │   ├── auth/
│   │   │   ├── login/              # Auth proxy → external API
│   │   │   └── register/           # Registration proxy → external API
│   │   ├── comments/
│   │   │   └── [comment_id]/
│   │   │       └── like/           # Like/unlike a comment
│   │   ├── feed-stream/            # Server-Sent Events (SSE) live feed
│   │   ├── gemini/                 # AI analysis & chat (Gemini)
│   │   └── post/
│   │       └── [post_id]/
│   │           ├── comments/       # Post comments CRUD
│   │           ├── hide/           # Hide a post
│   │           └── like/           # Like/unlike a post
│   ├── chat/                       # /chat page entry point
│   ├── feed/                       # /feed page (main feed)
│   ├── login/                      # /login page
│   ├── register/                   # /register page
│   ├── globals.css
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   └── page.tsx                    # Root redirect → /feed
│
├── components/
│   ├── AvatarCircle.tsx
│   ├── ComposerModal.tsx           # New post creation modal
│   ├── FlairPill.tsx               # Emotion category badge
│   ├── LeftSidebar.tsx             # Navigation sidebar
│   ├── RantCard.tsx                # Individual post card
│   ├── RightSidebar.tsx            # Secondary sidebar
│   ├── SortTabs.tsx                # Feed sort controls
│   └── chat/
│       ├── ChatPage.tsx            # Full chat UI with stress flow
│       ├── ChatSidebar.tsx         # Session history panel
│       ├── MessageBubble.tsx       # Chat message display
│       ├── MoodPicker.tsx          # Mood selection UI
│       ├── QuickReplies.tsx        # Suggested reply chips
│       ├── RightPanel.tsx          # Stress assessment panel
│       └── TypingIndicator.tsx     # Animated "bot is typing"
│
├── lib/
│   ├── anon.ts                     # Anonymous user ID management
│   ├── chatData.ts                 # Chat constants & type definitions
│   ├── mongodb.ts                  # MongoDB client singleton
│   ├── rants.ts                    # Rant/post type definitions
│   └── useFeedStream.ts            # SSE client hook
│
├── public/                         # Static assets
├── next.config.ts                  # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## Pages & Features

### `/feed` — Community Feed

The main landing page after login. Displays a chronological feed of anonymous posts called "rants."

**Features:**
- Real-time post updates via Server-Sent Events (SSE) — new posts appear as a "banner" notification without disrupting scroll position
- Compose new posts via a modal (authenticated users only)
- Like, comment on, and hide posts
- Emotion flair tags (e.g. Anxiety, Burnout, Grief, Loneliness)
- Responsive layout with left navigation sidebar
- Logout and session management

**SSE Behavior:**
- On first connect, receives a full snapshot of the latest 20 posts
- Subsequent polls (every 5 seconds) emit only genuinely new posts
- A heartbeat is sent every 20 seconds to keep the connection alive

---

### `/chat` — AI Chat & Stress Assessment

An AI chatbot interface powered by Google Gemini, designed for mental health support.

**Features:**
- Free-form mental health conversation (filtered to relevant topics only)
- **Stress assessment flow** — triggered by keywords like "stressed", "anxious", "overwhelmed", etc.
  - Collects scores (1–10) for five life domains: Finances, Prices, Health, School/Work, Family
  - Displays a progress bar as the user steps through each domain
  - On completion, submits data to Gemini for AI analysis
  - Shows a computed stress score and level (Low / Moderate / High)
  - Saves the assessment to MongoDB for history tracking
- Post-assessment follow-up chat with full context passed to Gemini
- Quick reply suggestion chips
- Typing indicator animation
- Session sidebar for conversation history
- Right panel showing the stress assessment results

**Stress Score Formula:**
```
score = (fin × 2) + (prices × 1.5) + (health × 2.5) + (school × 2) + (family × 2)
score = min(100, max(0, score))
```

| Score Range | Level |
|---|---|
| 0 – 30 | Low |
| 31 – 60 | Moderate |
| 61 – 100 | High |

---

### `/login` — Authentication

Login form that submits credentials to the external backend API via the `/api/auth/login` proxy. On success, stores `token`, `user_id`, `nickname`, and `username` in `localStorage`.

---

### `/register` — Registration

Registration form requiring `nickname`, `username`, and `password`. Proxied to the external backend.

---

## API Routes

All routes live under `app/api/`. They act either as proxies to the external backend or as direct handlers (Gemini, MongoDB assessments).

### Authentication

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Proxy to `{API_URL}/users/login`. Returns `token`, `user_id`, `nickname`, `username`. |
| `POST` | `/api/auth/register` | Proxy to `{API_URL}/users/register`. Requires `nickname`, `username`, `password`. |

---

### Posts

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/post` | Fetch paginated posts. Query params: `skip`, `limit`, `user_id`. |
| `POST` | `/api/post` | Create a post. Body: `{ content, user_id }`. |
| `GET` | `/api/post/[post_id]/comments` | Get comments for a post. |
| `POST` | `/api/post/[post_id]/comments` | Create a comment. Body: `{ content, user_id }`. |
| `POST` | `/api/post/[post_id]/like` | Toggle like on a post. |
| `POST` | `/api/post/[post_id]/hide` | Hide a post from the current user's feed. |

---

### Comments

| Method | Route | Description |
|---|---|---|
| `GET/PUT/DELETE` | `/api/comments/[comment_id]` | CRUD for a single comment. |
| `POST` | `/api/comments/[comment_id]/like` | Toggle like on a comment. |

---

### Feed Stream

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/feed-stream` | Opens an SSE stream. Emits `snapshot` (initial load) and `new-posts` (incremental). Query param: `user_id`. |

**SSE Event Types:**
- `snapshot` — Full list of current posts (on first connect)
- `new-posts` — Array of posts newer than the last known post
- `: heartbeat` — Comment line sent every 20s to prevent connection timeout

---

### Gemini AI

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/gemini` | Multi-action AI endpoint. |

**Request body `action` values:**

| Action | Purpose | Required Fields |
|---|---|---|
| `analyze` | Generate stress analysis from domain scores | `stressData: { fin, prices, health, school, family }` |
| `chat` (with `context: "stress_follow_up"`) | Continue conversation with stress context | `message`, `previousData` |
| `chat` | General mental health chat | `message` |

**Topic filtering:** All chat messages are screened against a keyword allowlist. If an external classifier API (`{API_URL}/classify/`) is available, it is used; otherwise a local keyword fallback runs. Off-topic messages receive a standard rejection reply.

---

### Assessments (MongoDB)

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/assessments` | Save a stress assessment result. |
| `GET` | `/api/assessments?anonId=...&limit=...` | Retrieve past assessments for an anonymous user. |

**Saved document schema:**
```json
{
  "anonId": "string | null",
  "stressData": { "fin": 1-10, "prices": 1-10, "health": 1-10, "school": 1-10, "family": 1-10 },
  "analysisText": "string",
  "stressScore": "string",
  "stressLevel": "Low | Moderate | High",
  "createdAt": "ISODate",
  "source": "frontend-health"
}
```

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# External backend API base URL (no trailing slash)
API_URL=https://your-backend-api.com

# Also used in some client-side contexts
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key

# MongoDB connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/

# Optional: MongoDB database name (defaults to "frontend_health")
MONGODB_DB=frontend_health
```

> **Note:** `API_URL` is server-side only. `NEXT_PUBLIC_API_URL` is exposed to the browser. Both should point to the same backend in most deployments.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun
- A running instance of the backend API
- A MongoDB Atlas cluster (or local MongoDB)
- A Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd hackaton-frontend-main

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects automatically to `/feed`.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Starts Next.js in dev mode with hot reload |
| Build | `npm run build` | Creates an optimized production build |
| Start | `npm run start` | Runs the production build |
| Lint | `npm run lint` | Runs ESLint |

---

## Architecture Notes

### Request Flow

```
Browser
  │
  ▼
Next.js App Router (app/)
  │
  ├── Page Components (RSC + Client Components)
  │
  └── /api/* Route Handlers
        ├── Proxy routes → External Backend REST API
        ├── /api/gemini → Google Gemini API (server-side)
        └── /api/assessments → MongoDB (direct connection)
```

### Anonymous Identity

Users who have not logged in are assigned a UUID stored in `localStorage` under the key `alphabot_anon_id`. This ID is used to persist stress assessment history without requiring an account. The logic lives in `lib/anon.ts`.

### MongoDB Connection

The MongoDB client is managed as a singleton via `lib/mongodb.ts`. In development, it attaches to the global object to survive hot reloads. In production, it initializes once per process. The client is lazy — it does not connect during `next build`.

### SSE Live Feed

The feed uses a Server-Sent Events stream (`/api/feed-stream`) instead of WebSockets. The server polls the backend API every 5 seconds and pushes new posts to connected clients. The client-side hook (`lib/useFeedStream.ts`) manages the `EventSource` lifecycle and exposes `snapshot`, `new-posts`, and connection status callbacks to the feed page.

### AI Content Moderation

The Gemini route enforces topic relevance before responding. It first attempts to call `{API_URL}/classify/` with the user's message. If that endpoint is unavailable or returns an error, it falls back to a local keyword list covering stress, mental health, and financial topics. Messages that fail both checks receive a standard off-topic warning.

---

## Key Components

### `RantCard`
Displays a single community post with avatar, flair badge, body text, like count, and comment count. Handles inline comment expansion.

### `ComposerModal`
Full-screen modal for composing new posts. Includes character counting and anonymous toggle.

### `ChatPage`
The core of the chat experience. Manages conversation state, stress assessment multi-step flow, Gemini API calls, quick reply chips, and persistent assessment history via MongoDB.

### `RightPanel`
Displays the stress assessment summary: domain scores, computed stress level, AI-generated analysis text, and navigation back to the chat.

### `useFeedStream`
A React hook that creates and manages an `EventSource` connection to `/api/feed-stream`. Handles reconnection, heartbeat, and cleanup on unmount.

---

## Data Models

### Post (from backend API)

```typescript
type Post = {
  _id: string;
  content: string;
  user_id: string;
  nickname?: string;
  alias?: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  liked_by_user?: boolean;
  hidden?: boolean;
}
```

### Rant / Flair Types (frontend)

```typescript
type FlairType = "Anxiety" | "Burnout" | "Grief" | "Loneliness" | "Just venting" | "Feeling lost";
```

### Chat Message

```typescript
type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}
```

### Stress Assessment Input

```typescript
type StressInputData = {
  fin: number;     // Finances (1–10)
  prices: number;  // Prices/Cost of living (1–10)
  health: number;  // Health (1–10)
  school: number;  // School/Work (1–10)
  family: number;  // Family (1–10)
}
```

---

## Deployment

The recommended deployment platform is [Vercel](https://vercel.com), which provides zero-config Next.js support.

```bash
# Deploy to Vercel
npx vercel --prod
```

Set all environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

**Important deployment considerations:**
- The SSE route (`/api/feed-stream`) uses `runtime = "nodejs"` and `dynamic = "force-dynamic"`. Ensure your platform supports long-lived streaming responses.
- MongoDB must be reachable from your deployment region. Use MongoDB Atlas with network access open to `0.0.0.0/0` or restrict to Vercel's IP ranges.
- The `GEMINI_API_KEY` is server-side only and never exposed to the client.

---

## Contributing

This project was built for a hackathon. When extending it:

- Keep all AI prompts server-side (never expose API keys to the browser)
- New API routes should proxy through Next.js rather than calling the backend directly from the client
- Follow the existing component structure: page-level logic in `app/`, reusable UI in `components/`, and shared utilities in `lib/`
