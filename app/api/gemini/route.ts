import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

const DEFAULT_DISALLOWED_REPLY =
  "⚠️ Only stress or mental health related input is allowed.";

const FALLBACK_ALLOW_KEYWORDS = [
  "stress",
  "stressed",
  "anxious",
  "anxiety",
  "panic",
  "overwhelmed",
  "burnout",
  "pressure",
  "depressed",
  "sad",
  "mental",
  "suicide",
  "self harm",
  "self-harm",
  "hurt myself",
  "help",
  "therapy",
  "counseling",
  "finances",
  "money",
  "bills",
  "prices",
  "health",
  "school",
  "job",
  "work",
  "family",
];

function fallbackIsAllowed(text: string) {
  const t = (text || "").toLowerCase();
  return FALLBACK_ALLOW_KEYWORDS.some((kw) => t.includes(kw));
}

async function isAllowedMessage(text: string): Promise<boolean> {
  const trimmed = (text || "").trim();
  if (!trimmed) return false;

  const apiUrl = process.env.API_URL;
  if (!apiUrl) return fallbackIsAllowed(trimmed);

  try {
    const res = await fetch(`${apiUrl}/classify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return fallbackIsAllowed(trimmed);
    if (typeof data?.allowed === "boolean") return data.allowed;
    return fallbackIsAllowed(trimmed);
  } catch {
    return fallbackIsAllowed(trimmed);
  }
}

// Match the Python logic: weighted sum capped at 100.
function computeStressScore(
  fin: number,
  prices: number,
  health: number,
  school: number,
  family: number,
) {
  const score = fin * 2 + prices * 1.5 + health * 2.5 + school * 2 + family * 2;
  return Math.min(100, Math.max(0, score));
}

function getStressLevel(score: number) {
  if (score <= 30) return "Low";
  if (score <= 60) return "Moderate";
  return "High";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  // Handle different actions
  if (action === "analyze" && body.stressData) {
    const { fin, prices, health, school, family } = body.stressData;
    
    console.log("Analyzing stress data:", { fin, prices, health, school, family });
    
    const stressScore = computeStressScore(fin, prices, health, school, family);
    const stressLevel = getStressLevel(stressScore);

    // Find highest stress areas for targeted advice
    const areas = [
      { name: "Finances", score: fin },
      { name: "Prices", score: prices },
      { name: "Health", score: health },
      { name: "School/Work", score: school },
      { name: "Family", score: family },
    ];
    const highestAreas = [...areas].sort((a, b) => b.score - a.score).slice(0, 2);
    const highestAreaNames = highestAreas.map((a) => a.name).join(", ");

    const prompt = `
You are a stress analysis assistant.
Do not repeat the user's data back to them and do not mention any exact numbers or scores.
Only analyze their stress level and give practical advice.

## Assessment Scores (1-10 scale, higher = MORE stress):
- Finances: ${fin}/10
- Prices: ${prices}/10
- Health: ${health}/10
- School/Work: ${school}/10
- Family: ${family}/10

## Computed Metrics:
- Stress level: ${stressLevel}
- Highest-stress areas: ${highestAreaNames}

## Your Task:
1. Start with "Stress Analysis" header
2. Explain the main cause of stress
3. Identify the strongest factor
4. Give practical solutions (pack several actionable steps into a few sentences)
5. Use simple English. Keep it under 4-5 sentences.
6. Do NOT ask follow-up questions.
`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ 
      reply: result.response.text(), 
      stressScore: stressScore.toFixed(0),
      stressLevel
    });
  }

  // Handle stress follow-up context
  if (action === "chat" && body.context === "stress_follow_up" && body.previousData) {
    const { message, previousData } = body;

    const allowed = await isAllowedMessage(String(message ?? ""));
    if (!allowed) {
      return NextResponse.json({ reply: DEFAULT_DISALLOWED_REPLY });
    }

    const score = computeStressScore(
      previousData.fin,
      previousData.prices,
      previousData.health,
      previousData.school,
      previousData.family,
    );
    const level = getStressLevel(score);
    
    const prompt = `
You are a stress analysis assistant.

Only respond to stress or mental health related concerns.
Do not mention any exact numbers or scores. Do not repeat the user's data back to them.

Given:
- Financial stress: ${previousData.fin}/10
- Price stress: ${previousData.prices}/10
- Health stress: ${previousData.health}/10
- School/Job stress: ${previousData.school}/10
- Family stress: ${previousData.family}/10

Computed stress score: ${score.toFixed(0)}/100
Stress level: ${level}

User message:
"${message}"

Task:
1. Explain the main cause of stress
2. Identify the strongest factor
3. Give practical solutions
4. Use simple English
5. Give advice based on the user message
6. Keep response short (4-5 sentences only)
`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ reply: result.response.text() });
  }

  // Regular chat message
  if (action === "chat" && body.message) {
    const message = String(body.message ?? "");
    const allowed = await isAllowedMessage(message);
    if (!allowed) {
      return NextResponse.json({ reply: DEFAULT_DISALLOWED_REPLY });
    }

    const prompt = `
You are a stress analysis assistant.

Only respond to stress or mental health related concerns.
If the user asks something unrelated, respond: "${DEFAULT_DISALLOWED_REPLY}"

User message:
"${message}"

Task:
1. Keep it supportive and practical
2. Give actionable advice
3. Use simple English
4. Keep it short (4-5 sentences)
`;
    const result = await model.generateContent(prompt);
    return NextResponse.json({ reply: result.response.text() });
  }

  // Default fallback
  const { message } = body;
  const result = await model.generateContent(message || "Hello");
  return NextResponse.json({ reply: result.response.text() });
}
