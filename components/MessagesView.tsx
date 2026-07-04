import { posters } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

export function MessagesView({ t }: { t: Dictionary }) {
  return (
    <main className="view">
      <div className="screen-head">
        <h2>{t.messages.title}</h2>
        <button className="outline-btn" type="button">⚙</button>
      </div>
      <section className="message-cats">
        {[
          ["▰", t.messages.cats[0], true],
          ["▣", t.messages.cats[1], false],
          ["▱", t.messages.cats[2], true],
          ["⌁", t.messages.cats[3], false]
        ].map(([icon, label, unread]) => (
          <button className="cat" key={String(label)} type="button">
            <span className="cat-icon">{icon}</span>
            {unread ? <i className="unread" /> : null}
            <small>{label}</small>
          </button>
        ))}
      </section>
      <article className="announcement">
        <div className="cat-icon">✪</div>
        <div>
          <h3>{t.messages.announcementTitle}</h3>
          <p className="muted" style={{ margin: 0 }}>{t.messages.announcementBody}</p>
        </div>
        <strong className="muted">›</strong>
      </article>
      <div className="section-title pink">
        <h2 style={{ fontSize: 16, color: "#bba2af" }}>{t.messages.recent}</h2>
        <strong style={{ color: "var(--cyan)" }}>{t.messages.clear}</strong>
      </div>
      <section className="message-list">
        {t.messages.rows.map((item, index) => (
          <article className="card message" key={`${item[0]}-${item[2]}`}>
            <div
              className="thumb"
              style={{ "--poster": index === 0 ? `url(${posters.vault})` : index === 2 ? `url(${posters.cyborg})` : "linear-gradient(135deg,#123,#333)" } as React.CSSProperties}
            >
              {index === 1 ? "↻" : ""}
            </div>
            <div><h3>{item[0]}</h3><p>{item[1]}</p></div>
            <span className="muted">{item[2]}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
