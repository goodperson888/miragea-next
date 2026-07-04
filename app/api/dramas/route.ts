import { NextResponse } from "next/server";
import { dramas } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    items: dramas,
    generatedAt: new Date().toISOString()
  });
}
