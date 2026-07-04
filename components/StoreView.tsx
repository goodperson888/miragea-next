import type { ContentType, Drama } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  contentType: ContentType;
  setContentType: (value: ContentType) => void;
  goTheater: () => void;
  dramas: Drama[];
  t: Dictionary;
};

export function StoreView({ contentType, setContentType, goTheater, dramas, t }: Props) {
  const cards = contentType === "growth" ? t.store.cards : t.store.finishedCards;

  return (
    <main className="view">
      <div className="screen-head">
        <h2>{t.store.title}</h2>
        <button className="outline-btn" type="button">▰</button>
      </div>
      <div className="search-row">
        <input className="search" placeholder={t.store.search} />
        <button className="filter-btn" type="button">☷</button>
      </div>
      <div className="store-tabs">
        <button className={contentType === "growth" ? "active" : ""} type="button" onClick={() => setContentType("growth")}>
          {t.store.growth}
        </button>
        <button className={contentType === "finished" ? "active" : ""} type="button" onClick={() => setContentType("finished")}>
          {t.store.finished}
        </button>
      </div>
      <section className="grid">
        {dramas.map((drama, index) => (
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
        ))}
      </section>
    </main>
  );
}
