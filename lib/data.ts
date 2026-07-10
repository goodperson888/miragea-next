export type TabKey = "theater" | "store" | "market" | "messages" | "profile";
export type ContentType = "growth" | "finished";

export const posters = {
  wolf: "/assets/posters/wolf-impact.svg",
  neon: "/assets/posters/neon-specter.svg",
  cyborg: "/assets/posters/neon-specter.svg",
  lab: "/assets/posters/cyber-pulse.svg",
  city: "/assets/posters/city-node.svg",
  vault: "/assets/posters/vault-core.svg",
  pulse: "/assets/posters/pulse-fragment.svg"
};

export const dramas = [
  {
    id: "drama8",
    title: "暗巷协议",
    cardTitle: "暗巷协议",
    slug: "Neon_Specter",
    ep: "12/20",
    governance: 75,
    poster: posters.wolf,
    options: ["复仇", "和解", "逃亡"],
    market: "+14.2%",
    price: "$0.654",
    ipCoin: {
      symbol: "ALLEY",
      name: "Alley Protocol IP",
      price: "$0.654",
      change24h: "+14.2%",
      marketCap: "$6.54M",
      fdv: "$18.2M",
      volume24h: "$842K",
      holders: "12,408",
      liquidity: "$1.28M",
      flow24h: "+$216K",
      supply: "10.0M / 28.0M",
      launchType: "Whitelist + Public Mint",
      unlock: "20% TGE, 6-month creator lock",
      valuationRange: "$0.58 - $0.72",
      valuationUpdatedAt: "2026-07-10 12:18 CST",
      heatScore: 92,
      storyScore: 88,
      riskScore: 32,
      baiSummary: {
        zh: "B.AI 识别到预告片复看率高、复仇线讨论集中、加权投票持续上升。由于流动性仍处早期，建议发行估值保持在温和区间。",
        en: "B.AI detects high trailer replay, strong revenge-arc discussion, and rising weighted votes. Suggested launch range stays moderate because liquidity is still early."
      }
    }
  },
  {
    id: "drama8b",
    title: "雨夜归档",
    cardTitle: "雨夜归档",
    slug: "Cyber_Pulse",
    ep: "04/15",
    governance: 40,
    poster: posters.vault,
    options: ["坦白", "追查", "隐瞒"],
    market: "-8.5%",
    price: "$0.346",
    ipCoin: {
      symbol: "RAIN",
      name: "Rain Archive IP",
      price: "$0.346",
      change24h: "-8.5%",
      marketCap: "$3.46M",
      fdv: "$9.8M",
      volume24h: "$396K",
      holders: "7,210",
      liquidity: "$740K",
      flow24h: "-$58K",
      supply: "10.0M / 28.4M",
      launchType: "Community Airdrop + LP",
      unlock: "15% TGE, 9-month creator lock",
      valuationRange: "$0.31 - $0.39",
      valuationUpdatedAt: "2026-07-10 11:58 CST",
      heatScore: 76,
      storyScore: 81,
      riskScore: 48,
      baiSummary: {
        zh: "B.AI 看到完播率和悬疑线留存稳定，但短期交易资金流降温。估值区间建议贴近当前价格。",
        en: "B.AI sees stable completion rate and mystery-arc retention, but short-term trade flow is cooling. Valuation range is held near current price."
      }
    }
  }
];

export type Drama = (typeof dramas)[number];

export const demoPhases = [
  {
    id: "t0",
    code: "T0",
    status: "vote-open",
    progress: 12,
    marketState: "OPEN",
    countdown: "23:48:12"
  },
  {
    id: "t23",
    code: "T+23h",
    status: "market-closed",
    progress: 72,
    marketState: "SEALED",
    countdown: "00:58:42"
  },
  {
    id: "t24",
    code: "T+24h",
    status: "settled",
    progress: 100,
    marketState: "SETTLED",
    countdown: "00:00:00"
  },
  {
    id: "next",
    code: "NEXT",
    status: "generating",
    progress: 38,
    marketState: "NEW ROUND",
    countdown: "AI: 38%"
  }
] as const;

export type DemoPhase = (typeof demoPhases)[number];

export const marketMechanics = {
  subject: "episode_vote_winner",
  marketTypes: ["cp_path", "key_twist", "ending"],
  optionsPerEpisode: "3-5",
  lifecycle: "24-72h",
  maker: "LMSR",
  evolution: "LMSR + CLOB",
  takeRate: "2%",
  settlement: "vote_snapshot",
  payments: ["Fiat", "USDT", "HTX", "IP Coin", "Web3 Wallet"]
} as const;

export const paymentMethods = [
  { id: "fiat", label: "Fiat", detail: "Card / PayPal", icon: "$" },
  { id: "u", label: "U", detail: "USDT balance", icon: "U" },
  { id: "htx", label: "HTX", detail: "HTX Pay", icon: "H" },
  { id: "ip", label: "IP Coin", detail: "Drama coin", icon: "IP" }
] as const;

export const ipLaunchRules = [
  ["Issuer", "Creator + MIRAGEA"],
  ["Supply", "28M fixed"],
  ["Initial Sale", "Whitelist / Public Mint"],
  ["Utility", "Vote boost, early access, extras"],
  ["Risk Control", "Lockup, cooldown, abnormal trade monitor"]
] as const;

export const tradeTicks = [
  ["BUY", "0.654", "12,800", "HTX", "12:18"],
  ["BUY", "0.651", "8,420", "USDT", "12:16"],
  ["SELL", "0.649", "3,100", "ALLEY", "12:11"],
  ["BUY", "0.646", "5,760", "HTX", "12:07"]
] as const;

export const ecosystemStack = [
  {
    id: "htx-api",
    name: "HTX API",
    role: "Asset, ticker, deposit, withdraw, ledger sync",
    status: "Integration-ready"
  },
  {
    id: "htx-token",
    name: "$HTX Economy",
    role: "Weighted votes, creator dividends, take-rate settlement, fee discounts",
    status: "Core model"
  },
  {
    id: "b-ai",
    name: "B.AI Compute",
    role: "Episode generation, branch previews, cover assets, IP valuation signals",
    status: "AI pipeline"
  }
] as const;

export const titles: Record<TabKey, string> = {
  theater: "发现",
  store: "剧场",
  market: "市场",
  messages: "消息",
  profile: "NEO_DRAMA"
};

export const navCopy: Record<TabKey, [string, string]> = {
  theater: ["▥", "发现"],
  store: ["▣", "剧场"],
  market: ["▧", "市场"],
  messages: ["▱", "Vault"],
  profile: ["◉", "Profile"]
};
