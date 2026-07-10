"use client";

import { useState } from "react";
import { dramas, paymentMethods, tradeTicks, type DemoPhase } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  notify: (message: string) => void;
  goTheater: () => void;
  openComments: () => void;
  comments: Array<{ author: string; bodyKey?: "commentOne" | "commentTwo"; body?: string }>;
  commentsCount: number;
  t: Dictionary;
  demoPhase: DemoPhase;
};

const optionPercents = [58, 27, 15];
const volumes = ["82.4K USDT", "39.6K USDT"];
const trendLines = [
  { color: "#ffce1f", points: "8,88 24,24 40,46 56,38 72,62 88,54 104,66 120,50 136,55 152,44 168,49 184,38 200,45 216,28 232,34 248,18" },
  { color: "#39a6ff", points: "8,52 24,68 40,70 56,74 72,67 88,76 104,72 120,82 136,64 152,70 168,78 184,60 200,42 216,36 232,30 248,22" },
  { color: "#ff8a1f", points: "8,64 24,62 40,78 56,70 72,72 88,66 104,58 120,62 136,74 152,68 168,63 184,66 200,72 216,69 232,76 248,58" }
];
const coinTrend = "8,82 28,74 48,78 68,60 88,68 108,42 128,49 148,35 168,40 188,28 208,34 228,21 248,26";

export function MarketView({ notify, goTheater, openComments, commentsCount, comments, t, demoPhase }: Props) {
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});
  const [buyOption, setBuyOption] = useState("");
  const [tradeAmount, setTradeAmount] = useState("");
  const [query, setQuery] = useState("");
  const [paymentId, setPaymentId] = useState("htx");
  const [tradeCount, setTradeCount] = useState(0);
  const [detailTab, setDetailTab] = useState<"ip" | "prediction">("ip");
  const [infoTab, setInfoTab] = useState<"rules" | "background">("rules");
  const [activityTab, setActivityTab] = useState<"comments" | "positions" | "dynamics">("comments");
  const market = selectedMarket === null ? null : dramas[selectedMarket];
  const visibleDramas = dramas.filter((drama) => {
    const text = `${drama.title} ${drama.cardTitle} ${drama.slug} ${drama.ipCoin.symbol} ${drama.options.join(" ")}`.toLowerCase();
    return !query.trim() || text.includes(query.trim().toLowerCase());
  });

  function openMarket(index: number, tab: "ip" | "prediction" = "ip") {
    setSelectedMarket(index);
    setBuyOption("");
    setTradeAmount("");
    setDetailTab(tab);
    setInfoTab("rules");
    setActivityTab("comments");
  }

  function closeMarket() {
    setSelectedMarket(null);
    setBuyOption("");
    setTradeAmount("");
  }

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => {
      const next = !current[id];
      notify(next ? t.toast.favoriteAdded : t.toast.favoriteRemoved);
      return { ...current, [id]: next };
    });
  }

  function confirmTrade() {
    setTradeCount((current) => current + 1);
    notify(`${t.toast.trade} · ${paymentMethods.find((method) => method.id === paymentId)?.label ?? "HTX"}`);
    setBuyOption("");
    setTradeAmount("");
  }

  function renderPaymentMethods() {
    return (
      <div className="payment-methods" aria-label={t.market.paymentMethod}>
        {paymentMethods.map((method) => (
          <button
            className={paymentId === method.id ? "active" : ""}
            type="button"
            key={method.id}
            onClick={() => setPaymentId(method.id)}
          >
            <i>{method.icon}</i>
            <span>{method.label}</span>
            <small>{method.detail}</small>
          </button>
        ))}
      </div>
    );
  }

  function renderCoinSparkline() {
    return (
      <svg className="coin-sparkline" viewBox="0 0 256 94" role="img" aria-label={t.market.priceTrend}>
        <path className="grid-line" d="M8 26H248" />
        <path className="grid-line" d="M8 58H248" />
        <path className="grid-line" d="M8 86H248" />
        <polyline fill="none" points={coinTrend} stroke="#39ff55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d={`M${coinTrend} L248,92 L8,92 Z`} fill="rgba(57, 255, 85, 0.1)" />
      </svg>
    );
  }

  function renderValuationScore(label: string, value: number, tone: "good" | "warn" | "risk" = "good") {
    return (
      <div className={`valuation-score ${tone}`}>
        <span>{label}</span>
        <strong>{value}</strong>
        <i style={{ "--score": `${value}%` } as React.CSSProperties} />
      </div>
    );
  }

  function renderIpCoinPanel() {
    if (!market) return null;
    const coin = market.ipCoin;
    const localeKey = t.langLabel === "EN" ? "zh" : "en";
    const heatScore = coin.heatScore;
    const storyScore = coin.storyScore;
    const riskScore = coin.riskScore;
    const summary = coin.baiSummary[localeKey];

    return (
      <section className="ip-coin-panel">
        <div className="ip-coin-head">
          <div>
            <span className="panel-kicker">{t.market.ipCoinDetail}</span>
            <h3>{coin.symbol} <small>{coin.name}</small></h3>
          </div>
          <button className="pink-btn" type="button" onClick={() => setBuyOption(`${coin.symbol} ${t.market.dramaCoin}`)}>
            {t.theater.buy}
          </button>
        </div>

        <div className="coin-price-row">
          <strong>{coin.price}</strong>
          <span className={coin.change24h.startsWith("-") ? "down" : "up"}>{coin.change24h}</span>
          <small>{t.market.valuationRange}: {coin.valuationRange} · {t.market.valuationTime}: {coin.valuationUpdatedAt}</small>
        </div>

        {renderCoinSparkline()}

        <div className="coin-stat-grid">
          <div><span>{t.market.marketCap}</span><strong>{coin.marketCap}</strong></div>
          <div><span>FDV</span><strong>{coin.fdv}</strong></div>
          <div><span>{t.market.volume}</span><strong>{coin.volume24h}</strong></div>
          <div><span>{t.market.holders}</span><strong>{coin.holders}</strong></div>
          <div><span>{t.market.liquidity}</span><strong>{coin.liquidity}</strong></div>
          <div><span>{t.market.netFlow}</span><strong className={coin.flow24h.startsWith("-") ? "down" : "up"}>{coin.flow24h}</strong></div>
        </div>

        <section className="bai-valuation">
          <div>
            <span className="panel-kicker">{t.market.baiValuation}</span>
            <strong>{coin.valuationRange}</strong>
          </div>
          <span className="valuation-time">{t.market.valuationTime}: {coin.valuationUpdatedAt}</span>
          <div className="valuation-grid">
            {renderValuationScore(t.market.heat, heatScore)}
            {renderValuationScore(t.market.storyPotential, storyScore)}
            {renderValuationScore(t.market.risk, riskScore, "risk")}
          </div>
          <p>{summary}</p>
        </section>

        <section className="trade-tape">
          <div className="market-chart-head">
            <strong>{t.market.latestTrades}</strong>
            <span>{t.market.smartMoney} +3</span>
          </div>
          {tradeTicks.map((tick) => (
            <article key={`${tick[0]}-${tick[1]}-${tick[4]}`}>
              <b className={tick[0] === "SELL" ? "down" : "up"}>{tick[0]}</b>
              <span>{tick[1]}</span>
              <span>{tick[2]}</span>
              <small>{tick[3]} · {tick[4]}</small>
            </article>
          ))}
        </section>
      </section>
    );
  }

  function renderActivity() {
    if (!market) return null;

    if (activityTab === "positions") {
      return (
        <section className="market-activity">
          <article>
            <strong>NEO_DRAMA</strong>
            <span>{market.options[0]} · 1,200 USDT</span>
          </article>
          <article>
            <strong>Mirage_Dev</strong>
            <span>{market.options[1]} · 860 USDT</span>
          </article>
          <article>
            <strong>Kalyn</strong>
            <span>{market.options[2]} · 640 USDT</span>
          </article>
        </section>
      );
    }

    if (activityTab === "dynamics") {
      return (
        <section className="market-activity">
          <article>
            <strong>12:08</strong>
            <span>HTX Pay · {market.options[0]} · 80 USDT</span>
          </article>
          {tradeCount > 0 ? (
            <article>
              <strong>{t.market.tradeConfirming}</strong>
              <span>{buyOption || market.ipCoin.symbol} · #{tradeCount}</span>
            </article>
          ) : null}
          <article>
            <strong>12:03</strong>
            <span>{market.ipCoin.symbol} 买入 · 12,800 HTX</span>
          </article>
          <article>
            <strong>{market.ipCoin.valuationUpdatedAt.slice(11, 16)}</strong>
            <span>B.AI 估值 · {market.ipCoin.valuationRange} · {market.ipCoin.valuationUpdatedAt}</span>
          </article>
        </section>
      );
    }

    return (
      <section className="market-activity">
        <article>
          <strong>{t.market.sharedComments}</strong>
          <span>{commentsCount} {t.market.commentCountUnit}</span>
        </article>
        {comments.slice(0, 2).map((comment, index) => (
          <article key={`${comment.author}-${index}`}>
            <strong>{comment.author}</strong>
            <span>{comment.bodyKey === "commentOne" ? t.commentOne : comment.bodyKey === "commentTwo" ? t.commentTwo : comment.body}</span>
          </article>
        ))}
        <button className="outline-btn comment-sync-btn" type="button" onClick={openComments}>
          {t.market.openSharedComments}
        </button>
      </section>
    );
  }

  function renderTrendLineChart(marketOptions: string[], compact = false) {
    return (
      <div className={`trend-chart ${compact ? "compact-trend" : "detail-trend"}`} aria-label={t.market.liveTrend}>
        <div className="trend-legend">
          {marketOptions.map((option, index) => (
            <span key={option}>
              <i style={{ background: trendLines[index]?.color ?? "#0de7f3" }} />
              {option} {optionPercents[index] ?? 10}%
            </span>
          ))}
        </div>
        <svg viewBox="0 0 256 116" role="img" aria-label={t.market.liveTrend}>
          <path className="grid-line" d="M8 24H248" />
          <path className="grid-line" d="M8 58H248" />
          <path className="grid-line" d="M8 92H248" />
          {trendLines.map((line, index) => (
            <polyline
              fill="none"
              key={`${marketOptions[index] ?? index}-line`}
              points={line.points}
              stroke={line.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={compact ? "3" : "4"}
            />
          ))}
          {trendLines.map((line, index) => {
            const lastPoint = line.points.split(" ").slice(-1)[0].split(",");
            return <circle cx={lastPoint[0]} cy={lastPoint[1]} fill={line.color} key={`${marketOptions[index] ?? index}-dot`} r={compact ? "4" : "5"} />;
          })}
          <text className="axis-label" x="214" y="27">30%</text>
          <text className="axis-label" x="214" y="61">15%</text>
          <text className="axis-label" x="214" y="95">5%</text>
        </svg>
      </div>
    );
  }

  if (market) {
    return (
      <main className="view market-view market-detail-screen">
        <div className="detail-topbar">
          <button type="button" onClick={closeMarket} aria-label={t.market.back}>‹</button>
          <div>
            <span>{t.market.allMarkets}</span>
            <strong>{t.market.detailTitle}</strong>
          </div>
          <button
            className={`favorite-btn compact ${favoriteIds[market.id] ? "active" : ""}`}
            type="button"
            onClick={() => toggleFavorite(market.id)}
            aria-label={t.market.favorite}
          >
            ☆
          </button>
        </div>

        <section className="market-detail">
          <div className="market-detail-hero">
            <div className="detail-poster large" style={{ "--poster": `url(${market.poster})` } as React.CSSProperties} />
            <div>
              <span className="panel-kicker">{t.market.detailTitle}</span>
              <h2>{market.cardTitle}</h2>
              <p>{t.market.marketQuestion}</p>
              <button className="outline-btn" type="button" onClick={goTheater}>
                {t.market.watch}
              </button>
            </div>
          </div>

          <div className="detail-main-tabs" aria-label={t.market.detailTitle}>
            <button className={detailTab === "ip" ? "active" : ""} type="button" onClick={() => setDetailTab("ip")}>
              {t.market.ipCoinTab}
            </button>
            <button className={detailTab === "prediction" ? "active" : ""} type="button" onClick={() => setDetailTab("prediction")}>
              {t.market.predictionMarketTab}
            </button>
          </div>

          {detailTab === "ip" ? renderIpCoinPanel() : (
            <section className="detail-tab-panel prediction-detail-panel">
              <div className="market-chart-head">
                <strong>{t.market.liveTrend}</strong>
                <span>{t.market.deadline} {demoPhase.countdown}</span>
              </div>
              {renderTrendLineChart(market.options)}

              <h3 className="detail-subtitle">{t.market.orderOptions}</h3>
              <div className="market-option-list detail-options">
                {market.options.map((option, index) => {
                  const percent = optionPercents[index] ?? 10;
                  return (
                    <article key={option}>
                      <div>
                        <strong>{option}</strong>
                        <span>{t.theater.predictionShare} {percent}%</span>
                      </div>
                      <button className="pink-btn" type="button" onClick={() => setBuyOption(option)}>
                        {t.theater.buy}
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="info-tabs">
                <button className={infoTab === "rules" ? "active" : ""} type="button" onClick={() => setInfoTab("rules")}>
                  {t.market.rules}
                </button>
                <button className={infoTab === "background" ? "active" : ""} type="button" onClick={() => setInfoTab("background")}>
                  {t.market.background}
                </button>
              </div>
              <section className="rule-copy">
                <p>{infoTab === "rules" ? t.market.rulesText : t.market.backgroundText}</p>
              </section>

              <div className="info-tabs bottom-tabs">
                <button className={activityTab === "comments" ? "active" : ""} type="button" onClick={() => setActivityTab("comments")}>
                  {t.market.comments}
                </button>
                <button className={activityTab === "positions" ? "active" : ""} type="button" onClick={() => setActivityTab("positions")}>
                  {t.market.positions}
                </button>
                <button className={activityTab === "dynamics" ? "active" : ""} type="button" onClick={() => setActivityTab("dynamics")}>
                  {t.market.dynamics}
                </button>
              </div>
              {renderActivity()}
            </section>
          )}
        </section>

        {buyOption ? (
          <>
            <button
              className="trade-sheet-backdrop"
              type="button"
              aria-label={t.closeSheet}
              onClick={() => setBuyOption("")}
            />
            <section className="trade-sheet" aria-label={t.market.buyTitle} onClick={(event) => event.stopPropagation()}>
              <button className="sheet-close mini-close" type="button" onClick={() => setBuyOption("")} aria-label={t.closeSheet}>
                ×
              </button>
              <span className="panel-kicker">{t.market.buyTitle}</span>
              <div>
                <strong>{buyOption}</strong>
                <small>{market.cardTitle}</small>
              </div>
              <label>
                {t.market.buyAmount}
                <input
                  inputMode="decimal"
                  placeholder={paymentId === "htx" ? "120 HTX" : paymentId === "fiat" ? "$20" : paymentId === "ip" ? `30 ${market.ipCoin.symbol}` : "20 USDT"}
                  value={tradeAmount}
                  onChange={(event) => setTradeAmount(event.target.value)}
                />
              </label>
              <div className="amount-shortcuts" aria-label={t.market.buyAmount}>
                {["1", "5", "10", "100"].map((amount) => (
                  <button type="button" key={amount} onClick={() => setTradeAmount(amount)}>+{amount}</button>
                ))}
              </div>
              <span className="payment-label">{t.market.paymentMethod}</span>
              {renderPaymentMethods()}
              <p className="payment-hint">{t.market.paymentHint}</p>
              <button className="pink-btn" type="button" onClick={confirmTrade}>
                {t.market.trade}
              </button>
            </section>
          </>
        ) : null}
      </main>
    );
  }

  return (
    <main className="view market-view">
      <div className="market-search">
        <input
          placeholder={t.market.searchPlaceholder}
          aria-label={t.market.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {query ? (
        <div className="active-filter-line">
          <span>{t.market.selectedFilter}</span>
          <em>{query}</em>
        </div>
      ) : null}

      <section className="market-home-section prediction-home-section">
        <div className="market-home-head">
          <div>
            <h2>{t.market.predictionMarketTitle}</h2>
            <span>{t.market.predictionMarketSubtitle}</span>
          </div>
          <small>{demoPhase.countdown}</small>
        </div>
        <div className="prediction-card-list">
          {visibleDramas.map((drama) => {
            const index = dramas.findIndex((item) => item.id === drama.id);
            return (
              <article className="prediction-card" key={drama.id}>
                <button className="prediction-card-main" type="button" onClick={() => openMarket(index, "prediction")}>
                  <div className="prediction-poster" style={{ "--poster": `url(${drama.poster})` } as React.CSSProperties} />
                  <div>
                    <h3>{drama.cardTitle}</h3>
                    <div className="card-option-stack">
                      {drama.options.map((option, optionIndex) => (
                        <span key={option}>
                          <b>{option}</b>
                          <em>{optionPercents[optionIndex] ?? 10}%</em>
                        </span>
                      ))}
                    </div>
                    <span>{t.market.volume} {volumes[index] ?? "18.8K USDT"}</span>
                    <small>{t.market.enterDetail}</small>
                  </div>
                </button>
                <button
                  className={`favorite-btn ${favoriteIds[drama.id] ? "active" : ""}`}
                  type="button"
                  onClick={() => toggleFavorite(drama.id)}
                  aria-label={t.market.favorite}
                >
                  ☆
                </button>
              </article>
            );
          })}
          {visibleDramas.length === 0 ? <p className="empty-state">{t.market.noResults}</p> : null}
        </div>
      </section>

      <section className="market-home-section hot-ip-section">
        <div className="market-home-head">
          <div>
            <h2>{t.market.hotIpTitle}</h2>
            <span>{t.market.hotIpSubtitle}</span>
          </div>
          <small>24H</small>
        </div>
        <div className="market-ip-list">
          {visibleDramas.map((drama) => {
            const index = dramas.findIndex((item) => item.id === drama.id);
            return (
              <article className="ip-market-row" key={`${drama.id}-ip`}>
                <button className="ip-market-main" type="button" onClick={() => openMarket(index, "ip")}>
                  <div className="ip-token-mark" style={{ "--poster": `url(${drama.poster})` } as React.CSSProperties}>
                    <span>{drama.ipCoin.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <strong>{drama.ipCoin.symbol}</strong>
                    <span>{drama.title}</span>
                    <small>{t.market.valuationRange}: {drama.ipCoin.valuationRange} · {t.market.valuationTime}: {drama.ipCoin.valuationUpdatedAt}</small>
                  </div>
                  <div className="ip-price-cell">
                    <strong>{drama.ipCoin.price}</strong>
                    <em className={drama.ipCoin.change24h.startsWith("-") ? "down" : "up"}>{drama.ipCoin.change24h}</em>
                  </div>
                </button>
                <div className="ip-row-meta">
                  <span>{t.market.volume}<b>{drama.ipCoin.volume24h}</b></span>
                  <span>{t.market.marketCap}<b>{drama.ipCoin.marketCap}</b></span>
                  <span>{t.market.holders}<b>{drama.ipCoin.holders}</b></span>
                </div>
              </article>
            );
          })}
          {visibleDramas.length === 0 ? <p className="empty-state">{t.market.noResults}</p> : null}
        </div>
      </section>
    </main>
  );
}
