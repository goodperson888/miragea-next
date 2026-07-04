"use client";

import { useState } from "react";
import { dramas, type DemoPhase } from "@/lib/data";
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

export function MarketView({ notify, goTheater, openComments, commentsCount, comments, t, demoPhase }: Props) {
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});
  const [buyOption, setBuyOption] = useState("");
  const [infoTab, setInfoTab] = useState<"rules" | "background">("rules");
  const [activityTab, setActivityTab] = useState<"comments" | "positions" | "dynamics">("comments");
  const market = selectedMarket === null ? null : dramas[selectedMarket];

  function openMarket(index: number) {
    setSelectedMarket(index);
    setBuyOption("");
    setInfoTab("rules");
    setActivityTab("comments");
  }

  function closeMarket() {
    setSelectedMarket(null);
    setBuyOption("");
  }

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => ({ ...current, [id]: !current[id] }));
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
            <span>买入 {market.options[0]} · 80 USDT</span>
          </article>
          <article>
            <strong>12:03</strong>
            <span>买入 {market.options[1]} · 45 USDT</span>
          </article>
          <article>
            <strong>11:58</strong>
            <span>盘口收藏 +18</span>
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

        {buyOption ? (
          <>
            <button
              className="sheet-backdrop open trade-backdrop"
              type="button"
              aria-label={t.closeSheet}
              onClick={() => setBuyOption("")}
            />
            <section className="trade-sheet" aria-label={t.market.buyTitle}>
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
                <input inputMode="decimal" placeholder="20 USDT" />
              </label>
              <div className="amount-shortcuts" aria-label={t.market.buyAmount}>
                {["1", "5", "10", "100"].map((amount) => (
                  <button type="button" key={amount}>+{amount}</button>
                ))}
              </div>
              <button className="pink-btn" type="button" onClick={() => notify(t.toast.trade)}>
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
        <input placeholder={t.market.searchPlaceholder} aria-label={t.market.searchPlaceholder} />
      </div>

      <section className="tag-rail" aria-label="Market tags">
        {t.market.tags.map((tag) => (
          <button type="button" key={tag}>{tag}</button>
        ))}
      </section>

      <div className="section-title compact">
        <h2>{t.market.allMarkets}</h2>
        <span className="muted mini">{t.market.vol}</span>
      </div>

      <section className="prediction-card-list">
        {dramas.map((drama, index) => (
          <article className="prediction-card" key={drama.id}>
            <button className="prediction-card-main" type="button" onClick={() => openMarket(index)}>
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
        ))}
      </section>
    </main>
  );
}
