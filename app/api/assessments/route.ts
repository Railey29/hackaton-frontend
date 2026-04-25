import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoClient, getMongoDbName } from "@/lib/mongodb";

type StressData = {
  fin: number;
  prices: number;
  health: number;
  school: number;
  family: number;
};

function isValidScore(n: unknown) {
  return typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 10;
}

function validateStressData(data: any): data is StressData {
  if (!data || typeof data !== "object") return false;
  return (
    isValidScore(data.fin) &&
    isValidScore(data.prices) &&
    isValidScore(data.health) &&
    isValidScore(data.school) &&
    isValidScore(data.family)
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { stressData, analysisText, stressScore, stressLevel, anonId } =
      body ?? {};

    if (!validateStressData(stressData)) {
      return NextResponse.json(
        { ok: false, error: "invalid_stressData" },
        { status: 400 },
      );
    }

    if (typeof analysisText !== "string" || analysisText.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "invalid_analysisText" },
        { status: 400 },
      );
    }

    const client = await getMongoClient();
    const db = client.db(getMongoDbName());
    const collection = db.collection("stress_assessments");

    const doc = {
      anonId: typeof anonId === "string" && anonId.trim() ? anonId.trim() : null,
      stressData,
      analysisText: analysisText.trim(),
      stressScore:
        typeof stressScore === "string" || typeof stressScore === "number"
          ? String(stressScore)
          : null,
      stressLevel: typeof stressLevel === "string" ? stressLevel : null,
      createdAt: new Date(),
      source: "frontend-health",
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json({
      ok: true,
      id: (result.insertedId as ObjectId).toString(),
    });
  } catch (err: any) {
    console.error("[/api/assessments] save error:", err);
    const msg = String(err?.message ?? "");
    const isDb =
      msg.includes("querySrv") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("MongoServerSelectionError");
    return NextResponse.json(
      { ok: false, error: isDb ? "db_unreachable" : "server_error" },
      { status: isDb ? 503 : 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const anonId = url.searchParams.get("anonId")?.trim();
    const limitRaw = url.searchParams.get("limit");
    const limit = Math.max(
      1,
      Math.min(50, limitRaw ? Number.parseInt(limitRaw, 10) : 20),
    );

    if (!anonId) {
      return NextResponse.json(
        { ok: false, error: "missing_anonId" },
        { status: 400 },
      );
    }

    const client = await getMongoClient();
    const db = client.db(getMongoDbName());
    const collection = db.collection("stress_assessments");

    const docs = await collection
      .find({ anonId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      ok: true,
      items: docs.map((d: any) => ({
        id: String(d._id),
        analysisText: typeof d.analysisText === "string" ? d.analysisText : "",
        stressLevel: typeof d.stressLevel === "string" ? d.stressLevel : null,
        stressScore: typeof d.stressScore === "string" ? d.stressScore : null,
        stressData: d.stressData ?? null,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      })),
    });
  } catch (err: any) {
    console.error("[/api/assessments] fetch error:", err);
    const msg = String(err?.message ?? "");
    const isDb =
      msg.includes("querySrv") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("MongoServerSelectionError");
    return NextResponse.json(
      { ok: false, error: isDb ? "db_unreachable" : "server_error" },
      { status: isDb ? 503 : 500 },
    );
  }
}
