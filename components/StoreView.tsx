 "use client";

import { useMemo, useState } from "react";
import type { ContentType, Drama } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  contentType: ContentType;
  setContentType: (value: ContentType) => void;
  goTheater: () => void;
  dramas: Drama[];
  t: Dictionary;
  notify: (message: string) => void;
};

export function StoreView({ contentType, setContentType, goTheater, dramas, t, notify }: Props) {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortMode, setSortMode] = useState<"hot" | "new">("hot");
  const cards = contentType === "growth" ? t.store.cards : t.store.finishedCards;
  const visibleDramas = useMemo(() => {
    const next = dramas.filter((drama) => {
      const text = `${drama.title} ${drama.cardTitle} ${drama.slug} ${drama.options.join(" ")}`.toLowerCase();
      return !query.trim() || text.includes(query.trim().toLowerCase());
    });
    return sortMode === "hot" ? next : [...next].reverse();
  }, [dramas, query, sortMode]);

  function updateSort(value: "hot" | "new") {
    setSortMode(value);
    notify(t.toast.filterUpdated);
  }

  return (
    <main className="view">
      <div className="screen-head">
        <h2>{t.store.title}</h2>
        <button className="outline-btn" type="button">▰</button>
      </div>
      <div className="search-row">
        <input className="search" placeholder={t.store.search} value={query} onChange={(event) => setQuery(event.target.value)} />
        <button className={`filter-btn ${filterOpen ? "active" : ""}`} type="button" onClick={() => setFilterOpen((value) => !value)}>☷</button>
      </div>
      {filterOpen ? (
        <section className="store-filter-panel">
          <button className={sortMode === "hot" ? "active" : ""} type="button" onClick={() => updateSort("hot")}>{t.market.heat}</button>
          <button className={sortMode === "new" ? "active" : ""} type="button" onClick={() => updateSort("new")}>{t.market.valuationRefreshed}</button>
          <span>{query || t.store.search}</span>
        </section>
      ) : null}
      <div className="store-tabs">
        <button className={contentType === "growth" ? "active" : ""} type="button" onClick={() => setContentType("growth")}>
          {t.store.growth}
        </button>
        <button className={contentType === "finished" ? "active" : ""} type="button" onClick={() => setContentType("finished")}>
          {t.store.finished}
        </button>
      </div>
      <section className="grid">
        {visibleDramas.map((drama) => {
          const index = dramas.findIndex((item) => item.id === drama.id);
          return (
          <article className="poster-card" key={drama.id} onClick={goTheater}>
            <div className="poster" style={{ "--poster": `url(${drama.poster})` } as React.CSSProperties}>
              <span className="stamp">{contentType === "growth" ? t.store.growth : t.store.premium}</span>
              <span className="stamp">{contentType === "growth" ? t.theater.storyVote : t.store.completed}</span>
              <div className="progress">
                <span style={{ width: `${contentType === "growth" ? drama.governance : 100}%` }} />
              </div>
              <small>{contentType === "growth" ? `${t.store.governance} ${drama.governance}%` : t.theater.watchProgress}</small>
            </div>
            <h3>{cards[index]?.title ?? drama.cardTitle}</h3>
            <p>{t.store.produced} {cards[index]?.progress ?? drama.ep} {t.store.chapters}</p>
            <button className="full-btn" type="button">{contentType === "growth" ? t.theater.openVotePanel : t.store.unlock}</button>
          </article>
          );
        })}
        {visibleDramas.length === 0 ? <p className="empty-state">{t.market.noResults}</p> : null}
      </section>
    </main>
  );
}
