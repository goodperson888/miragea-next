import { NextResponse } from "next/server";
import { generateBaiValuation } from "@/lib/bai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as {
    dramaId?: string;
    locale?: "zh" | "en";
  };

  const result = await generateBaiValuation(body.dramaId ?? "drama8", body.locale ?? "zh");

  return NextResponse.json({
    mode: result.provider === "glm" ? "real-ai" : "mock-fallback",
    ...result
  });
}
