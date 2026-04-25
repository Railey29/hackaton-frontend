import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are SafeSpace, a warm and empathetic AI companion. 
Listen, validate feelings, and gently support the user. 
Do NOT give medical diagnoses or crisis intervention.
Keep responses short (2-4 sentences), compassionate, never clinical.`,
    });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Gemini Error:', error.message);
    return NextResponse.json(
      { reply: "Something went wrong. I'm still here — try again?" },
      { status: 200 }
    );
  }
}