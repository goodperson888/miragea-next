import { NextResponse } from "next/server";
import { demoPhases, dramas, ecosystemStack, ipLaunchRules, marketMechanics, paymentMethods, tradeTicks } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    mode: "testnet-simulation",
    mechanics: marketMechanics,
    ecosystemStack,
    paymentMethods,
    ipLaunchRules,
    assets: {
      totalPredictionAssets: 42850.25,
      usdtBalance: 12400,
      htxBalance: 325120.5,
      ipCoinBalance: 18420
    },
    activeMarkets: dramas.map((drama, index) => ({
      id: `DRAMA8-${index === 0 ? "A" : "B"}`,
      dramaId: drama.id,
      subject: marketMechanics.subject,
      marketType: index === 0 ? "key_twist" : "cp_path",
      path: index === 0 ? "RESET_PATH" : "ALLIANCE_PATH",
      price: drama.price,
      change: drama.market,
      maker: marketMechanics.maker,
      takeRate: marketMechanics.takeRate,
      lifecycle: marketMechanics.lifecycle,
      settlement: marketMechanics.settlement,
      ipCoin: drama.ipCoin,
      latestTrades: tradeTicks,
      phase: demoPhases[0]
    })),
    generatedAt: new Date().toISOString()
  });
}
