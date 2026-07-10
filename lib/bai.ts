import { dramas } from "@/lib/data";

export type BaiValuationResult = {
  provider: "glm" | "mock";
  model: string;
  heatScore: number;
  storyScore: number;
  riskScore: number;
  valuationRange: string;
  valuationHorizon: string;
  generatedAt: string;
  summary: {
    zh: string;
    en: string;
  };
  branchOptions: string[];
};

type GlmMessage = {
  role: "system" | "user";
  content: string;
};

function clampScore(value: unknown, fallback: number) {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

function extractJson(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? content;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mockValuation(dramaId: string, locale: "zh" | "en" = "zh"): BaiValuationResult {
  const drama = dramas.find((item) => item.id === dramaId) ?? dramas[0];
  return {
    provider: "mock",
    model: "local-demo",
    heatScore: drama.ipCoin.heatScore,
    storyScore: drama.ipCoin.storyScore,
    riskScore: drama.ipCoin.riskScore,
    valuationRange: drama.ipCoin.valuationRange,
    valuationHorizon: drama.ipCoin.valuationHorizon[locale],
    generatedAt: new Date().toISOString(),
    summary: drama.ipCoin.baiSummary,
    branchOptions: drama.options.map((option) => `${option}线：延展角色冲突并制造下一集钩子`)
  };
}

function buildPrompt(dramaId: string, locale: "zh" | "en") {
  const drama = dramas.find((item) => item.id === dramaId) ?? dramas[0];
  return {
    drama,
    messages: [
      {
        role: "system",
        content: [
          "You are B.AI Compute inside MIRAGEA, an AI short-drama market product.",
          "Return strict JSON only. Do not include investment advice.",
          "The valuation is for hackathon product simulation and should be framed as content-market signal analysis."
        ].join(" ")
      },
      {
        role: "user",
        content: JSON.stringify({
          locale,
          task: "Generate IP coin valuation and 3 story branch suggestions.",
          drama: {
            title: drama.title,
            slug: drama.slug,
            episodeProgress: drama.ep,
            currentOptions: drama.options,
            governanceProgress: drama.governance,
            marketChange: drama.market,
            currentIpCoin: drama.ipCoin
          },
          expectedJsonShape: {
            heatScore: "0-100 number",
            storyScore: "0-100 number",
            riskScore: "0-100 number, lower is safer",
            valuationRange: "short price range string, e.g. $0.58 - $0.72",
            valuationHorizon: "forecast horizon string, e.g. next 24 hours",
            summaryZh: "one concise Chinese paragraph",
            summaryEn: "one concise English paragraph",
            branchOptions: ["3 concise Chinese branch ideas"]
          }
        })
      }
    ] satisfies GlmMessage[]
  };
}

export async function generateBaiValuation(dramaId: string, locale: "zh" | "en" = "zh"): Promise<BaiValuationResult> {
  const provider = process.env.BAI_PROVIDER ?? "glm";
  const apiKey = process.env.GLM_API_KEY ?? process.env.ZHIPU_API_KEY;
  const model = process.env.GLM_MODEL ?? "glm-4-flash";

  if (provider !== "glm" || !apiKey) {
    return mockValuation(dramaId, locale);
  }

  const { drama, messages } = buildPrompt(dramaId, locale);

  try {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.35,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) return mockValuation(dramaId, locale);

    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      model?: string;
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content);
    if (!parsed) return mockValuation(dramaId, locale);

    return {
      provider: "glm",
      model: payload.model ?? model,
      heatScore: clampScore(parsed.heatScore, drama.ipCoin.heatScore),
      storyScore: clampScore(parsed.storyScore, drama.ipCoin.storyScore),
      riskScore: clampScore(parsed.riskScore, drama.ipCoin.riskScore),
      valuationRange: typeof parsed.valuationRange === "string" ? parsed.valuationRange : drama.ipCoin.valuationRange,
      valuationHorizon: typeof parsed.valuationHorizon === "string" ? parsed.valuationHorizon : drama.ipCoin.valuationHorizon[locale],
      generatedAt: new Date().toISOString(),
      summary: {
        zh: typeof parsed.summaryZh === "string" ? parsed.summaryZh : drama.ipCoin.baiSummary.zh,
        en: typeof parsed.summaryEn === "string" ? parsed.summaryEn : drama.ipCoin.baiSummary.en
      },
      branchOptions: Array.isArray(parsed.branchOptions)
        ? parsed.branchOptions.slice(0, 3).map(String)
        : drama.options.map((option) => `${option}线：延展角色冲突并制造下一集钩子`)
    };
  } catch {
    return mockValuation(dramaId, locale);
  }
}
