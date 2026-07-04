import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    unread: 3,
    items: [
      {
        type: "series-update",
        title: "Neon_Specter new episode is live",
        target: "/?tab=theater"
      },
      {
        type: "asset-settlement",
        title: "+120.50 HTX settled from Market",
        target: "/?tab=market"
      },
      {
        type: "contributor-announcement",
        title: "Contributor announcement generated",
        target: "/?tab=messages"
      }
    ],
    generatedAt: new Date().toISOString()
  });
}
