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
    price: "$0.654"
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
    price: "$0.346"
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
  payments: ["USDT", "HTX", "Credit Card", "PayPal", "Web3 Wallet"]
} as const;

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
    role: "Episode generation, branch previews, cover assets, moderation assists",
    status: "AI pipeline"
  }
] as const;

export const titles: Record<TabKey, string> = {
  theater: "发现",
  store: "剧场",
  market: "预测市场",
  messages: "消息",
  profile: "NEO_DRAMA"
};

export const navCopy: Record<TabKey, [string, string]> = {
  theater: ["▥", "发现"],
  store: ["▣", "剧场"],
  market: ["▧", "预测市场"],
  messages: ["▱", "Vault"],
  profile: ["◉", "Profile"]
};
