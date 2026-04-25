import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    
    const prompt = `
You are a stress companion. The user previously completed a stress check with these scores (1-10, higher = more stress):
- Finances: ${previousData.fin}/10
- Prices: ${previousData.prices}/10
- Health: ${previousData.health}/10
- School/Work: ${previousData.school}/10
- Family: ${previousData.family}/10

The user is now asking a follow-up question related to their stress/wellbeing: "${message}"

Guidelines:
1. Acknowledge their current state based on the assessment data
2. Provide empathetic, helpful responses
3. Keep it brief (2-3 sentences)
4. If they ask unrelated questions, gently redirect to stress/wellness topics
5. Do NOT mention exact numbers or scores
`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ reply: result.response.text() });
  }

  // Regular chat message
  if (action === "chat" && body.message) {
    const result = await model.generateContent(body.message);
    return NextResponse.json({ reply: result.response.text() });
  }

  // Default fallback
  const { message } = body;
  const result = await model.generateContent(message || "Hello");
  return NextResponse.json({ reply: result.response.text() });
}
