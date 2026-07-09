 "use client";

import { useState } from "react";
import { posters } from "@/lib/data";
import type { BaiValuationResult } from "@/lib/bai";
import type { Dictionary } from "@/lib/i18n";

export function ProfileView({ t, notify }: { t: Dictionary; notify: (message: string) => void }) {
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const [chip, setChip] = useState("growth");
  const [creatorStatus, setCreatorStatus] = useState<readonly string[]>(t.profile.creatorStats);
  const [creatorBranches, setCreatorBranches] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  async function runCreatorAction(kind: "bai" | "ip") {
    const isZh = t.langLabel === "EN";
    if (kind === "bai") {
      setIsGenerating(true);
      try {
        const response = await fetch("/api/bai/valuation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dramaId: "drama8", locale: isZh ? "zh" : "en" })
        });
        if (!response.ok) throw new Error("B.AI generation failed");
        const result = await response.json() as BaiValuationResult;
        setCreatorBranches(result.branchOptions);
        setCreatorStatus(isZh
          ? [`${result.branchOptions.length} 个生成分支`, `估值 ${result.valuationRange}`, `${result.provider.toUpperCase()} ${result.model}`]
          : [`${result.branchOptions.length} new branches`, `Valuation ${result.valuationRange}`, `${result.provider.toUpperCase()} ${result.model}`]);
        notify(t.profile.creatorQueued);
      } catch {
        setCreatorStatus(isZh ? ["4 个草稿", "14 个分支", "B.AI 结果 3"] : ["4 drafts", "14 branches", "B.AI results 3"]);
        notify(t.profile.creatorQueued);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    setCreatorStatus(isZh ? ["4 个草稿", "14 个分支", "IP 草案 1"] : ["4 drafts", "14 branches", "IP draft 1"]);
    notify(t.profile.ipDraftReady);
  }

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
      <section className="creator-studio-card">
        <div>
          <span className="panel-kicker">{t.profile.creatorStudio}</span>
          <h2>{t.profile.generateWithBai}</h2>
          <p>{t.profile.creatorSubtitle}</p>
        </div>
        <div className="creator-stat-row">
          {creatorStatus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {creatorBranches.length ? (
          <div className="creator-branch-list">
            {creatorBranches.map((branch) => (
              <span key={branch}>{branch}</span>
            ))}
          </div>
        ) : null}
        <div className="creator-actions">
          <button className="pink-btn" type="button" onClick={() => runCreatorAction("bai")}>{isGenerating ? t.market.generatingValuation : t.profile.createDrama}</button>
          <button className="outline-btn" type="button" onClick={() => runCreatorAction("ip")}>{t.profile.issueIpCoin}</button>
        </div>
      </section>
      <div className="fav-tabs">
        {t.profile.workspaceTabs.map((tab, index) => (
          <button className={workspaceTab === index ? "active" : ""} type="button" key={tab} onClick={() => setWorkspaceTab(index)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="chip-row">
        <button className={`chip ${chip === "growth" ? "active" : ""}`} type="button" onClick={() => setChip("growth")}>{t.profile.growth}</button>
        <button className={`chip ${chip === "finished" ? "active" : ""}`} type="button" onClick={() => setChip("finished")}>{t.profile.finished}</button>
        <button className={`chip ${chip === "sort" ? "active" : ""}`} type="button" onClick={() => setChip("sort")}>{t.profile.sort}</button>
      </div>
      <div className="profile-state-line">
        <span>{t.profile.selected}</span>
        <strong>{t.profile.workspaceTabs[workspaceTab]} · {chip}</strong>
      </div>
      <section className="mini-grid">
        <div className="mini-poster" style={{ "--poster": `url(${posters.neon})` } as React.CSSProperties} />
        <div className="mini-poster" style={{ "--poster": `url(${workspaceTab === 2 ? posters.vault : posters.pulse})` } as React.CSSProperties} />
        <div className="mini-poster add-card">+</div>
      </section>
      <div className="section-title"><h2 style={{ color: "#fff", fontSize: 22 }}>{t.profile.recordCenter}</h2></div>
      <section className="grid">
        {t.profile.records.map((item) => (
          <button className="panel interactive-panel" style={{ textAlign: "left" }} key={item[0]} type="button" onClick={() => notify(`${item[0]} · ${t.toast.settingUpdated}`)}>
            <strong>{item[0]}</strong><br /><span className="muted mini">{item[1]}</span>
          </button>
        ))}
      </section>
      <div className="section-title"><h2 style={{ color: "#fff", fontSize: 22 }}>{t.profile.settings}</h2></div>
      <section className="panel settings">
        {t.profile.settingRows.map((row) => (
          <button className="setting-row" key={row[1]} type="button" onClick={() => {
            if (row[2] === "toggle") setPushEnabled((value) => !value);
            notify(t.toast.settingUpdated);
          }}>
            <span className="muted">{row[0]}</span>
            <span>{row[1]}</span>
            {row[2] === "toggle" ? <span className={`toggle ${pushEnabled ? "on" : ""}`} /> : <strong className="mini" style={{ color: row[2] === "LINKED" ? "var(--green)" : "var(--muted)" }}>{row[2]}</strong>}
          </button>
        ))}
      </section>
      <button className="outline-btn logout" type="button">{t.profile.logout}</button>
    </main>
  );
}
