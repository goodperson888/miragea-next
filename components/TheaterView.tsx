"use client";

import { useEffect, useRef, useState } from "react";
import { posters, tradeTicks, type ContentType, type DemoPhase, type Drama } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  contentType: ContentType;
  setContentType: (value: ContentType) => void;
  notify: (message: string) => void;
  openComments: () => void;
  goMarket: () => void;
  commentsCount: number;
  dramas: Drama[];
  t: Dictionary;
  demoPhase: DemoPhase;
};

export function TheaterView({ notify, openComments, goMarket, t, demoPhase, commentsCount, dramas }: Props) {
  const [selectedOption, setSelectedOption] = useState("");
  const [sealedVote, setSealedVote] = useState("");
  const [buyOption, setBuyOption] = useState("");
  const [voteTradeAmount, setVoteTradeAmount] = useState("");
  const [detailDramaIndex, setDetailDramaIndex] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState<"ip" | "prediction">("ip");
  const [detailTradeSide, setDetailTradeSide] = useState<"buy" | "sell" | "">("");
  const [detailTradeAmount, setDetailTradeAmount] = useState("");
  const [detailPredictionOption, setDetailPredictionOption] = useState("");
  const [detailPredictionAmount, setDetailPredictionAmount] = useState("");
  const [detailRange, setDetailRange] = useState("1H");
  const [activeIndex, setActiveIndex] = useState(0);
  const [finishedEpisodeIndex, setFinishedEpisodeIndex] = useState(0);
  const [unlockedEpisodes, setUnlockedEpisodes] = useState(() => new Set([7, 8, 9]));
  const [likedEpisodes, setLikedEpisodes] = useState<Record<string, boolean>>({});
  const [likePulse, setLikePulse] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVotePanelOpen, setIsVotePanelOpen] = useState(false);
  const [isVoteAccessOpen, setIsVoteAccessOpen] = useState(false);
  const [episodeProgress, setEpisodeProgress] = useState(0);
  const tapTimerRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const feedRef = useRef<HTMLElement>(null);

  const voteOptions = [
    { label: t.theater.voteOptions[0], percent: 63 },
    { label: t.theater.voteOptions[1], percent: 24 },
    { label: t.theater.voteOptions[2], percent: 13 }
  ];
  const trendLines = [
    { label: voteOptions[0].label, color: "#ffce1f", percent: voteOptions[0].percent, points: "8,74 28,44 48,52 68,35 88,62 108,49 128,56 148,32 168,38 188,24 208,30 228,18" },
    { label: voteOptions[1].label, color: "#39a6ff", percent: voteOptions[1].percent, points: "8,42 28,68 48,61 68,75 88,66 108,54 128,72 148,70 168,58 188,48 208,28 228,36" },
    { label: voteOptions[2].label, color: "#ff8a1f", percent: voteOptions[2].percent, points: "8,58 28,62 48,72 68,64 88,70 108,76 128,61 148,67 168,71 188,63 208,69 228,54" }
  ];

  const finishedEpisodes = [
    {
      ep: 7,
      title: t.theater.finishedTitle,
      desc: t.theater.finishedDesc,
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster: posters.vault
    },
    {
      ep: 8,
      title: "雨夜归档：双面审判",
      desc: t.theater.finishedDesc,
      src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      poster: posters.city
    },
    {
      ep: 9,
      title: "雨夜归档：最后证词",
      desc: t.theater.finishedDesc,
      src: "https://www.w3schools.com/html/movie.mp4",
      poster: posters.pulse
    }
  ];
  const currentFinishedEpisode = finishedEpisodes[finishedEpisodeIndex];
  const finalFinishedEp = finishedEpisodes[finishedEpisodes.length - 1].ep;

  const feedItems = [
    {
      id: "growth-wolf-7",
      kind: "growth" as const,
      ep: "EP07",
      title: t.theater.growthTitle,
      desc: t.theater.growthDesc,
      src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      poster: posters.wolf,
      likes: 2300
    },
    {
      id: "finished-rain-7",
      kind: "finished" as const,
      ep: `EP${String(currentFinishedEpisode.ep).padStart(2, "0")}/EP${String(finalFinishedEp).padStart(2, "0")}`,
      episode: currentFinishedEpisode.ep,
      title: currentFinishedEpisode.title,
      desc: currentFinishedEpisode.desc,
      src: currentFinishedEpisode.src,
      poster: currentFinishedEpisode.poster,
      likes: 1840
    },
    {
      id: "growth-future-8",
      kind: "growth" as const,
      ep: "EP08",
      title: t.theater.altGrowthTitle,
      desc: t.theater.altGrowthDesc,
      src: "https://media.w3.org/2010/05/bunny/trailer.mp4",
      poster: posters.lab,
      likes: 1688
    }
  ];

  const activeItem = feedItems[activeIndex];
  const isCurrentUnlocked = activeItem.kind === "growth" || unlockedEpisodes.has(activeItem.episode);

  useEffect(() => {
    setSelectedOption("");
    setSealedVote("");
    setBuyOption("");
    setVoteTradeAmount("");
    setDetailDramaIndex(null);
    setDetailTab("ip");
    setDetailTradeSide("");
    setDetailTradeAmount("");
    setDetailPredictionOption("");
    setDetailPredictionAmount("");
    setIsVotePanelOpen(false);
    setIsVoteAccessOpen(false);
    setEpisodeProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex !== 1) return;
    setEpisodeProgress(0);
    window.setTimeout(() => {
      activeVideo()?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, 0);
  }, [finishedEpisodeIndex, activeIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video || index === activeIndex) return;
      video.pause();
    });

    const video = videoRefs.current[activeIndex];
    setEpisodeProgress(0);
    if (!video) {
      setIsPlaying(false);
      return;
    }

    if (isCurrentUnlocked) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [activeIndex, isCurrentUnlocked]);

  function activeVideo() {
    return videoRefs.current[activeIndex];
  }

  function updateEpisodeProgress(video: HTMLVideoElement | null) {
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      setEpisodeProgress(0);
      return;
    }
    setEpisodeProgress(Math.min(100, Math.max(0, (video.currentTime / video.duration) * 100)));
  }

  function scrubEpisode(value: number) {
    const video = activeVideo();
    setEpisodeProgress(value);
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = (value / 100) * video.duration;
  }

  function handleFeedScroll() {
    const feed = feedRef.current;
    if (!feed) return;
    const nextIndex = Math.min(feedItems.length - 1, Math.max(0, Math.round(feed.scrollTop / Math.max(1, feed.clientHeight))));
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  }

  function submitVote() {
    if (!selectedOption) {
      notify(t.toast.selectOptionFirst);
      return;
    }
    setIsVoteAccessOpen(true);
  }

  function completeVote(message: string) {
    setIsVoteAccessOpen(false);
    setSealedVote(selectedOption);
    notify(`${message}，${t.toast.vote}`);
  }

  function unlockCurrent(message: string) {
    const item = activeItem;
    if (item.kind !== "finished") return;
    setUnlockedEpisodes((current) => {
      const next = new Set(current);
      next.add(item.episode);
      return next;
    });
    notify(message);
    window.setTimeout(() => activeVideo()?.play().catch(() => setIsPlaying(false)), 0);
  }

  function playFinishedEpisode(nextIndex: number) {
    setFinishedEpisodeIndex(Math.min(finishedEpisodes.length - 1, Math.max(0, nextIndex)));
  }

  function playNextFinishedEpisode() {
    playFinishedEpisode(finishedEpisodeIndex + 1);
  }

  function togglePlayback() {
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }
    const video = activeVideo();
    if (!video) return;
    if (!isCurrentUnlocked) {
      notify(t.theater.unlockHint);
      return;
    }

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function formatCount(value: number) {
    return value >= 1000 ? value.toLocaleString("en-US") : String(value);
  }

  function closeBuyDrawer() {
    setBuyOption("");
    setVoteTradeAmount("");
  }

  function dramaIndexForEpisode(item: (typeof feedItems)[number]) {
    if (item.id.includes("rain")) return Math.min(1, dramas.length - 1);
    return 0;
  }

  function openDramaDetail(index: number, tab: "ip" | "prediction" = "ip") {
    setDetailDramaIndex(index);
    setDetailTab(tab);
    setDetailTradeSide("");
    setDetailTradeAmount("");
    setDetailPredictionOption("");
    setDetailPredictionAmount("");
    setIsVotePanelOpen(false);
  }

  function closeDramaDetail() {
    setDetailDramaIndex(null);
    setDetailTab("ip");
    setDetailTradeSide("");
    setDetailTradeAmount("");
    setDetailPredictionOption("");
    setDetailPredictionAmount("");
  }

  function confirmDetailTrade(drama: Drama) {
    const side = detailTradeSide === "sell" ? t.theater.sell : t.theater.buy;
    notify(`${drama.ipCoin.symbol} ${side} · ${t.toast.trade}`);
    setDetailTradeSide("");
    setDetailTradeAmount("");
  }

  function confirmDetailPredictionTrade() {
    notify(`${detailPredictionOption} · ${t.toast.trade}`);
    setDetailPredictionOption("");
    setDetailPredictionAmount("");
  }

  function toggleLike(id: string, forceLike = false) {
    setLikedEpisodes((current) => {
      if (forceLike && current[id]) return current;
      return { ...current, [id]: forceLike ? true : !current[id] };
    });
    setLikePulse(id);
    window.setTimeout(() => setLikePulse(""), 520);
  }

  function handleEpisodeTap(id: string) {
    if (isVotePanelOpen) {
      setIsVotePanelOpen(false);
      return;
    }
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
      toggleLike(id, true);
      return;
    }
    tapTimerRef.current = window.setTimeout(() => {
      tapTimerRef.current = null;
      togglePlayback();
    }, 180);
  }

  function renderTimeline(index: number) {
    if (index !== activeIndex || !isCurrentUnlocked) return null;
    return (
      <input
        className="video-timeline"
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={episodeProgress}
        style={{ "--progress": `${episodeProgress}%` } as React.CSSProperties}
        onChange={(event) => scrubEpisode(Number(event.currentTarget.value))}
        onTouchStart={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
        aria-label={t.theater.watchProgress}
      />
    );
  }

  function renderTrendLineChart(labels: readonly string[] = voteOptions.map((option) => option.label)) {
    return (
      <div className="trend-chart compact-trend" aria-label={t.theater.liveVoteChart}>
        <div className="trend-legend">
          {trendLines.map((line, index) => (
            <span key={line.label}>
              <i style={{ background: line.color }} />
              {labels[index] ?? line.label} {line.percent}%
            </span>
          ))}
        </div>
        <svg viewBox="0 0 236 92" role="img" aria-label={t.theater.liveVoteChart}>
          <path className="grid-line" d="M8 24H228" />
          <path className="grid-line" d="M8 48H228" />
          <path className="grid-line" d="M8 72H228" />
          {trendLines.map((line) => (
            <polyline
              fill="none"
              key={line.label}
              points={line.points}
              stroke={line.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          ))}
          {trendLines.map((line) => {
            const lastPoint = line.points.split(" ").slice(-1)[0].split(",");
            return <circle cx={lastPoint[0]} cy={lastPoint[1]} fill={line.color} key={`${line.label}-dot`} r="4" />;
          })}
        </svg>
      </div>
    );
  }

  function renderVotePanel() {
    const activeDrama = dramas[0];
    const coin = activeDrama.ipCoin;
    const activeDramaIndex = 0;

    return (
      <div className="vote-terminal story-vote-panel" onClick={(event) => event.stopPropagation()}>
        <button className="vote-close" type="button" onClick={() => setIsVotePanelOpen(false)}>
          {t.theater.closeVotePanel}
        </button>
        <section className="vote-panel-section">
          <div className="terminal-head">
            <div>
              <p className="panel-kicker">{t.theater.storyVote}</p>
              <h2>{t.theater.storyVote}</h2>
              <p>{t.theater.voteDesc}</p>
            </div>
            <div className="blackbox">
              <span>{demoPhase.marketState}</span>
              <span>{demoPhase.countdown}</span>
              <em>{demoPhase.code}</em>
            </div>
          </div>
          <div className="vote-options">
            {voteOptions.map((option) => (
              <button
                className={`vote-option percent-option ${selectedOption === option.label ? "selected" : ""}`}
                key={option.label}
                type="button"
                onClick={() => {
                  setSelectedOption(option.label);
                  notify(t.toast.optionSelected);
                }}
              >
                <span>{option.label}</span>
                <strong>{option.percent}%</strong>
                <i style={{ width: `${option.percent}%` }} />
              </button>
            ))}
          </div>
          <button className="pink-btn panel-submit" type="button" onClick={submitVote}>
            {t.theater.voteNow}
          </button>
          {isVoteAccessOpen ? (
            <>
              <button className="inline-drawer-backdrop" type="button" aria-label={t.closeSheet} onClick={() => setIsVoteAccessOpen(false)} />
              <div className="eligibility-box access-drawer">
                <button className="sheet-close mini-close" type="button" onClick={() => setIsVoteAccessOpen(false)} aria-label={t.closeSheet}>
                  ×
                </button>
                <strong>{t.theater.getVoteAccess}</strong>
                <button type="button" onClick={() => completeVote(t.toast.share)}>{t.theater.shareToVote}</button>
                <button type="button" onClick={() => completeVote(t.wallet.connected)}>{t.theater.holdHtxToVote}</button>
              </div>
            </>
          ) : null}
          {sealedVote ? (
            <section className="vote-market-cta">
              <div>
                <strong>{sealedVote}</strong>
                <span>{t.theater.voteMarketHint}</span>
              </div>
              <button className="outline-btn" type="button" onClick={goMarket}>
                {t.theater.viewMarket}
              </button>
            </section>
          ) : null}
        </section>

        <section className="vote-panel-section market-in-vote">
          <p className="panel-kicker">{t.theater.predictionMarket}</p>
          <h3>{t.theater.predictResult}</h3>
          <p>{t.theater.predictQuestion}</p>
          {renderTrendLineChart()}
          <div className="market-option-list">
            {voteOptions.map((option) => (
              <article key={option.label}>
                <div>
                  <strong>{option.label}</strong>
                  <span>{t.theater.predictionShare} {option.percent}%</span>
                </div>
                <button className="outline-btn" type="button" onClick={() => setBuyOption(option.label)}>
                  {t.theater.buy}
                </button>
              </article>
            ))}
          </div>
          {buyOption ? (
            <>
              <button className="inline-drawer-backdrop" type="button" aria-label={t.closeSheet} onClick={closeBuyDrawer} />
              <div className="buy-drawer theater-buy-drawer">
                <button className="sheet-close mini-close" type="button" onClick={closeBuyDrawer} aria-label={t.closeSheet}>
                  ×
                </button>
                <div>
                  <strong>{buyOption}</strong>
                  <span>{t.theater.buyAmount}</span>
                </div>
                <input
                  inputMode="decimal"
                  placeholder={buyOption.includes(coin.symbol) ? `100 ${coin.symbol}` : "20 USDT"}
                  value={voteTradeAmount}
                  onChange={(event) => setVoteTradeAmount(event.target.value)}
                />
                <div className="amount-shortcuts" aria-label={t.theater.buyAmount}>
                  {["1", "5", "10", "100"].map((amount) => (
                    <button type="button" key={amount} onClick={() => setVoteTradeAmount(amount)}>+{amount}</button>
                  ))}
                </div>
                <button className="pink-btn" type="button" onClick={() => {
                  notify(t.toast.trade);
                  closeBuyDrawer();
                }}>
                  {t.theater.trade}
                </button>
              </div>
            </>
          ) : null}
        </section>

        <section className="vote-panel-section ip-coin-in-vote">
          <div className="ip-vote-head">
            <div>
              <p className="panel-kicker">{t.market.ipCoinDetail}</p>
              <h3>{coin.symbol} <small>{activeDrama.title}</small></h3>
            </div>
            <button className="outline-btn" type="button" onClick={() => openDramaDetail(activeDramaIndex, "ip")}>
              {t.market.openDetail}
            </button>
          </div>
          <div className="ip-vote-quote">
            <div>
              <span>{t.market.priceTrend}</span>
              <strong>{coin.price}</strong>
              <em className={coin.change24h.startsWith("-") ? "down" : "up"}>{coin.change24h}</em>
            </div>
            <div>
              <span>{t.market.volume}</span>
              <strong>{coin.volume24h}</strong>
              <em>{t.market.holders} {coin.holders}</em>
            </div>
          </div>
          <svg className="ip-vote-sparkline" viewBox="0 0 220 70" role="img" aria-label={t.market.priceTrend}>
            <path className="grid-line" d="M8 20H212" />
            <path className="grid-line" d="M8 48H212" />
            <polyline fill="none" points="8,56 26,48 44,51 62,37 80,42 98,29 116,34 134,22 152,28 170,18 188,24 212,14" stroke="#39ff55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </svg>
          <div className="ip-vote-actions">
            <button className="pink-btn" type="button" onClick={() => setBuyOption(`${coin.symbol} ${t.theater.buy}`)}>
              {t.theater.buy}
            </button>
            <button className="outline-btn" type="button" onClick={() => setBuyOption(`${coin.symbol} ${t.theater.sell}`)}>
              {t.theater.sell}
            </button>
          </div>
        </section>
      </div>
    );
  }

  function renderDramaDetailDrawer() {
    if (detailDramaIndex === null) return null;
    const drama = dramas[detailDramaIndex] ?? dramas[0];
    const coin = drama.ipCoin;
    const chartByRange: Record<string, string> = {
      "1H": "8,72 28,64 48,68 68,48 88,55 108,36 128,43 148,28 168,32 188,20 208,26 228,16",
      "4H": "8,58 28,62 48,52 68,44 88,50 108,34 128,38 148,30 168,24 188,27 208,19 228,22",
      "1D": "8,78 28,70 48,74 68,66 88,58 108,62 128,44 148,52 168,40 188,35 208,42 228,28"
    };

    return (
      <>
        <button className="drama-detail-backdrop" type="button" aria-label={t.closeSheet} onClick={closeDramaDetail} />
        <section className="drama-detail-drawer" aria-label={t.theater.dramaDetail}>
          <button className="sheet-close mini-close" type="button" onClick={closeDramaDetail} aria-label={t.closeSheet}>
            ×
          </button>
          <div className="drama-detail-hero">
            <div className="detail-poster mini" style={{ "--poster": `url(${drama.poster})` } as React.CSSProperties} />
            <div>
              <span className="panel-kicker">{t.theater.dramaDetail}</span>
              <h2>{drama.title}</h2>
              <p>{coin.name}</p>
            </div>
          </div>

          <div className="detail-main-tabs" aria-label={t.theater.dramaDetail}>
            <button className={detailTab === "ip" ? "active" : ""} type="button" onClick={() => setDetailTab("ip")}>
              {t.market.ipCoinTab}
            </button>
            <button className={detailTab === "prediction" ? "active" : ""} type="button" onClick={() => setDetailTab("prediction")}>
              {t.market.predictionMarketTab}
            </button>
          </div>

          {detailTab === "ip" ? (
            <>
              <div className="detail-coin-header">
                <div>
                  <strong>{coin.symbol}</strong>
                  <span>{t.market.dramaCoin}</span>
                </div>
                <div>
                  <b>{coin.price}</b>
                  <em className={coin.change24h.startsWith("-") ? "down" : "up"}>{coin.change24h}</em>
                </div>
              </div>

              <div className="detail-range-tabs" aria-label={t.market.priceTrend}>
                {["1H", "4H", "1D"].map((range) => (
                  <button className={detailRange === range ? "active" : ""} type="button" key={range} onClick={() => setDetailRange(range)}>
                    {range}
                  </button>
                ))}
              </div>
              <svg className="detail-coin-chart" viewBox="0 0 236 96" role="img" aria-label={t.market.priceTrend}>
                <path className="grid-line" d="M8 24H228" />
                <path className="grid-line" d="M8 52H228" />
                <path className="grid-line" d="M8 80H228" />
                <polyline fill="none" points={chartByRange[detailRange]} stroke="#39ff55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>

              <div className="detail-coin-stats">
                <span>{t.market.volume}<b>{coin.volume24h}</b></span>
                <span>{t.market.marketCap}<b>{coin.marketCap}</b></span>
                <span>{t.market.liquidity}<b>{coin.liquidity}</b></span>
                <span>{t.market.netFlow}<b className={coin.flow24h.startsWith("-") ? "down" : "up"}>{coin.flow24h}</b></span>
              </div>

              <div className="detail-trade-actions">
                <button className={detailTradeSide === "buy" ? "pink-btn active" : "pink-btn"} type="button" onClick={() => setDetailTradeSide("buy")}>
                  {t.theater.buy}
                </button>
                <button className={detailTradeSide === "sell" ? "outline-btn active" : "outline-btn"} type="button" onClick={() => setDetailTradeSide("sell")}>
                  {t.theater.sell}
                </button>
              </div>

              {detailTradeSide ? (
                <div className="detail-trade-box">
                  <label>
                    {detailTradeSide === "sell" ? t.theater.sell : t.theater.buy} {coin.symbol}
                    <input
                      inputMode="decimal"
                      placeholder={detailTradeSide === "sell" ? `100 ${coin.symbol}` : "20 USDT"}
                      value={detailTradeAmount}
                      onChange={(event) => setDetailTradeAmount(event.target.value)}
                    />
                  </label>
                  <div className="amount-shortcuts" aria-label={t.theater.buyAmount}>
                    {["1", "5", "10", "100"].map((amount) => (
                      <button type="button" key={amount} onClick={() => setDetailTradeAmount(amount)}>+{amount}</button>
                    ))}
                  </div>
                  <button className="pink-btn" type="button" onClick={() => confirmDetailTrade(drama)}>
                    {t.theater.trade}
                  </button>
                </div>
              ) : null}

              <section className="detail-trade-tape">
                <div className="market-chart-head">
                  <strong>{t.market.latestTrades}</strong>
                  <span>{t.market.smartMoney}</span>
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
            </>
          ) : (
            <section className="detail-tab-panel drama-prediction-panel">
              <div className="market-chart-head">
                <strong>{t.market.liveTrend}</strong>
                <span>{t.market.deadline} {demoPhase.countdown}</span>
              </div>
              {renderTrendLineChart(drama.options)}
              <div className="market-option-list detail-options">
                {drama.options.map((option, index) => (
                  <article key={option}>
                    <div>
                      <strong>{option}</strong>
                      <span>{t.theater.predictionShare} {voteOptions[index]?.percent ?? 10}%</span>
                    </div>
                    <button className="pink-btn" type="button" onClick={() => {
                      setDetailPredictionOption(option);
                      setDetailPredictionAmount("");
                    }}>
                      {t.theater.buy}
                    </button>
                  </article>
                ))}
              </div>
              {detailPredictionOption ? (
                <div className="detail-trade-box">
                  <label>
                    {detailPredictionOption}
                    <input
                      inputMode="decimal"
                      placeholder="20 USDT"
                      value={detailPredictionAmount}
                      onChange={(event) => setDetailPredictionAmount(event.target.value)}
                    />
                  </label>
                  <div className="amount-shortcuts" aria-label={t.theater.buyAmount}>
                    {["1", "5", "10", "100"].map((amount) => (
                      <button type="button" key={amount} onClick={() => setDetailPredictionAmount(amount)}>+{amount}</button>
                    ))}
                  </div>
                  <button className="pink-btn" type="button" onClick={confirmDetailPredictionTrade}>
                    {t.theater.trade}
                  </button>
                </div>
              ) : null}
            </section>
          )}
        </section>
      </>
    );
  }

  return (
    <main className="view theater-view">
      <section className="video-feed scroll-feed" ref={feedRef} onScroll={handleFeedScroll}>
        {feedItems.map((episode, index) => {
          const isActive = index === activeIndex;
          const liked = Boolean(likedEpisodes[episode.id]);
          const likeCount = episode.likes + (liked ? 1 : 0);
          const isUnlocked = episode.kind === "growth" || unlockedEpisodes.has(episode.episode);

          return (
            <article
              className={`episode ${episode.kind === "growth" ? "growth-episode" : "finished-episode"}`}
              key={episode.id}
              style={{ "--poster": `url(${episode.poster})` } as React.CSSProperties}
            >
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className="episode-video"
                src={episode.src}
                poster={episode.poster}
                autoPlay={isActive && isUnlocked}
                muted
                controls={false}
                loop={episode.kind === "growth"}
                playsInline
                preload="metadata"
                onPlay={() => {
                  if (isActive) setIsPlaying(true);
                }}
                onPause={() => {
                  if (isActive) setIsPlaying(false);
                }}
                onLoadedMetadata={() => {
                  if (isActive) updateEpisodeProgress(videoRefs.current[index]);
                }}
                onTimeUpdate={() => {
                  if (isActive) updateEpisodeProgress(videoRefs.current[index]);
                }}
                onEnded={() => {
                  if (episode.kind === "finished") playNextFinishedEpisode();
                }}
              />
              <button
                className="video-hit-area"
                type="button"
                onClick={() => handleEpisodeTap(episode.id)}
                aria-label={isActive && isPlaying ? t.theater.pause : t.theater.play}
              />
              <div className={`like-burst ${likePulse === episode.id ? "show" : ""}`}>♥</div>
              {renderTimeline(index)}
              <button
                className="playback-toggle"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  togglePlayback();
                }}
              >
                {isActive && isPlaying ? "Ⅱ" : "▶"}
                <span>{isActive && isPlaying ? t.theater.pause : t.theater.play}</span>
              </button>
              <div className="video-status">
                <span>{episode.kind === "growth" ? t.theater.discoverSignal : isUnlocked ? t.theater.unlocked : t.theater.preview}</span>
                <b>{episode.ep}</b>
              </div>
              <div className="side-actions" onClick={(event) => event.stopPropagation()}>
                <button className={`round-action like-action ${liked ? "active" : ""}`} type="button" onClick={() => toggleLike(episode.id)}>
                  ♥<small>{formatCount(likeCount)}</small>
                </button>
                <button className="round-action" type="button" onClick={openComments}>▢<small>{formatCount(commentsCount)}</small></button>
                <button className="round-action" type="button" onClick={() => notify(t.toast.share)}>⌁<small>share</small></button>
                <button className="round-action" type="button" onClick={() => notify(t.toast.save)}>☆<small>save</small></button>
              </div>

              {episode.kind === "growth" && isVotePanelOpen && isActive ? renderVotePanel() : null}

              {episode.kind === "growth" && (!isVotePanelOpen || !isActive) ? (
                <div className="watch-overlay" onClick={(event) => event.stopPropagation()}>
                  <div>
                    <div className="status-pill inline">
                      <i /> {t.theater.growthBadge}
                    </div>
                    <button className="drama-title-trigger" type="button" onClick={() => openDramaDetail(dramaIndexForEpisode(episode))}>
                      <h2>{episode.title}</h2>
                    </button>
                    <p>{episode.desc}</p>
                  </div>
                  <button
                    className="pink-btn watch-vote-btn"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsVotePanelOpen(true);
                    }}
                  >
                    {t.theater.openVotePanel}
                  </button>
                </div>
              ) : null}

              {episode.kind === "finished" ? (
                isUnlocked ? (
                  <div className="watch-overlay finished-watch-overlay" onClick={(event) => event.stopPropagation()}>
                    <div>
                      <div className="status-pill inline pay">
                        <i /> {t.theater.finishedBadge}
                      </div>
                      <button className="drama-title-trigger" type="button" onClick={() => openDramaDetail(dramaIndexForEpisode(episode))}>
                        <h2>{episode.title}</h2>
                      </button>
                      <p>{episode.desc}</p>
                    </div>
                    <button
                      className="next-episode-btn"
                      type="button"
                      onClick={() => playNextFinishedEpisode()}
                      disabled={finishedEpisodeIndex >= finishedEpisodes.length - 1}
                    >
                      {finishedEpisodeIndex >= finishedEpisodes.length - 1
                        ? t.theater.endEpisode
                        : `${t.theater.nextEpisode} EP${String(finishedEpisodes[finishedEpisodeIndex + 1].ep).padStart(2, "0")}`}
                    </button>
                    <div className="episode-switcher mixed-switcher" aria-label="Episode switcher">
                      <button type="button" onClick={() => playFinishedEpisode(finishedEpisodeIndex - 1)} disabled={finishedEpisodeIndex === 0}>↑</button>
                      <strong>{String(currentFinishedEpisode.ep).padStart(2, "0")}/{String(finalFinishedEp).padStart(2, "0")}</strong>
                      <button type="button" onClick={() => playFinishedEpisode(finishedEpisodeIndex + 1)} disabled={finishedEpisodeIndex === finishedEpisodes.length - 1}>↓</button>
                    </div>
                  </div>
                ) : (
                  <div className="vote-terminal finished-lock-panel" onClick={(event) => event.stopPropagation()}>
                    <div className="status-pill pay">
                      <i /> {t.theater.finishedBadge}
                    </div>
                    <div className="terminal-head">
                      <div>
                        <h2>{episode.title}</h2>
                        <p>{t.theater.unlockHint}</p>
                      </div>
                      <div className="blackbox">
                        <span>PAYWALL</span>
                        <span>LOCKED</span>
                        <em>{episode.ep}</em>
                      </div>
                    </div>
                    <div className="unlock-actions">
                      <button className="pink-btn" type="button" onClick={() => unlockCurrent(t.theater.unlockToast)}>
                        {t.theater.unlockWithHtx}
                      </button>
                      <button className="outline-btn" type="button" onClick={() => unlockCurrent(t.theater.adToast)}>
                        {t.theater.unlockByAd}
                      </button>
                      <button className="outline-btn" type="button" onClick={() => unlockCurrent(t.theater.vipToast)}>
                        {t.theater.unlockVip}
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </article>
          );
        })}
      </section>
      {renderDramaDetailDrawer()}
    </main>
  );
}
