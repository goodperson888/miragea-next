import { posters } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

export function ProfileView({ t }: { t: Dictionary }) {
  return (
    <main className="view">
      <section className="profile-top">
        <div className="avatar" style={{ "--poster": `url(${posters.cyborg})` } as React.CSSProperties} />
        <div>
          <strong>Neon_Specter</strong> <span className="vip">VIP 4</span><br />
          <span className="muted mini">ID: 88294-MIRAGEA</span>
        </div>
        <strong className="muted">›</strong>
      </section>
      <section className="panel asset-board">
        <div className="asset-label">{t.profile.assetTitle}</div>
        <div className="asset-value"><strong style={{ color: "var(--pink)" }}>14,320.75</strong><span>$HTX-E</span></div>
        <div className="asset-grid">
          <div className="asset-mini"><p>{t.profile.universal}</p><strong>10,420.00</strong></div>
          <div className="asset-mini"><p>{t.profile.prediction}</p><strong style={{ color: "var(--cyan)" }}>3,900.75</strong></div>
        </div>
      </section>
      <div className="fav-tabs">
        <button className="active" type="button">{t.profile.favorites}</button>
        <button type="button">{t.profile.likes}</button>
        <button type="button">{t.profile.history}</button>
      </div>
      <div className="chip-row">
        <button className="chip">{t.profile.growth}</button>
        <button className="chip">{t.profile.finished}</button>
        <button className="chip">{t.profile.sort}</button>
      </div>
      <section className="mini-grid">
        <div className="mini-poster" style={{ "--poster": `url(${posters.neon})` } as React.CSSProperties} />
        <div className="mini-poster" style={{ "--poster": `url(${posters.pulse})` } as React.CSSProperties} />
        <div className="mini-poster add-card">+</div>
      </section>
      <div className="section-title"><h2 style={{ color: "#fff", fontSize: 22 }}>{t.profile.recordCenter}</h2></div>
      <section className="grid">
        {t.profile.records.map((item) => (
          <button className="panel" style={{ textAlign: "left" }} key={item[0]} type="button">
            <strong>{item[0]}</strong><br /><span className="muted mini">{item[1]}</span>
          </button>
        ))}
      </section>
      <div className="section-title"><h2 style={{ color: "#fff", fontSize: 22 }}>{t.profile.settings}</h2></div>
      <section className="panel settings">
        {t.profile.settingRows.map((row) => (
          <div className="setting-row" key={row[1]}>
            <span className="muted">{row[0]}</span>
            <span>{row[1]}</span>
            {row[2] === "toggle" ? <span className="toggle" /> : <strong className="mini" style={{ color: row[2] === "LINKED" ? "var(--green)" : "var(--muted)" }}>{row[2]}</strong>}
          </div>
        ))}
      </section>
      <button className="outline-btn logout" type="button">{t.profile.logout}</button>
    </main>
  );
}
