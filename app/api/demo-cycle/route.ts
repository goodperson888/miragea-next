import { NextResponse } from "next/server";
import { demoPhases } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    phases: demoPhases,
    note: "Hackathon demo cycle only. No real trading or settlement is performed."
  });
}
