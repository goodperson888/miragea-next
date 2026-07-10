"use client";

import { useEffect, useState } from "react";
import { demoPhases, dramas, navCopy, titles, type ContentType, type TabKey } from "@/lib/data";
import { dictionaries, type Locale } from "@/lib/i18n";
import { MarketView } from "@/components/MarketView";
import { MessagesView } from "@/components/MessagesView";
import { ProfileView } from "@/components/ProfileView";
import { StoreView } from "@/components/StoreView";
import { TheaterView } from "@/components/TheaterView";

export function AppShell() {
  const [tab, setTab] = useState<TabKey>("theater");
  const [contentType, setContentType] = useState<ContentType>("growth");
  const [locale, setLocale] = useState<Locale>("zh");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [sheet, setSheet] = useState<"risk" | "comments" | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<Array<{ author: string; bodyKey?: "commentOne" | "commentTwo"; body?: string }>>([
    { author: "Mirage_Dev", bodyKey: "commentOne" },
    { author: "Neon_Specter", bodyKey: "commentTwo" }
  ]);
  const [toast, setToast] = useState("");
  const t = dictionaries[locale];
  const demoPhase = demoPhases[phaseIndex];

  useEffect(() => {
    document.documentElement.lang = "zh-CN";
    window.localStorage.setItem("miragea-locale", "zh");
  }, [locale]);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    ethereum.request<string[]>({ method: "eth_accounts" }).then((accounts) => {
      setWalletAddress(accounts[0] ?? "");
    }).catch(() => undefined);
    ethereum.request<string>({ method: "eth_chainId" }).then(setChainId).catch(() => undefined);

    const handleAccounts = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? (args[0] as string[]) : [];
      setWalletAddress(accounts[0] ?? "");
    };
    const handleChain = (...args: unknown[]) => {
      if (typeof args[0] === "string") setChainId(args[0]);
    };

    ethereum.on?.("accountsChanged", handleAccounts);
    ethereum.on?.("chainChanged", handleChain);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccounts);
      ethereum.removeListener?.("chainChanged", handleChain);
    };
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  async function switchToBaseSepolia() {
    const ethereum = window.ethereum;
    if (!ethereum) {
      notify(t.wallet.missing);
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x14a34" }]
      });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
      if (code !== 4902) {
        notify(t.wallet.switchRejected);
        return;
      }
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x14a34",
          chainName: "Base Sepolia",
          nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://sepolia.base.org"],
          blockExplorerUrls: ["https://sepolia.basescan.org"]
        }]
      });
    }
    const currentChain = await ethereum.request<string>({ method: "eth_chainId" });
    setChainId(currentChain);
    notify(t.wallet.networkReady);
  }

  async function connectWallet() {
    const ethereum = window.ethereum;
    if (!ethereum) {
      notify(t.wallet.missing);
      return;
    }

    try {
      const accounts = await ethereum.request<string[]>({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0] ?? "");
      notify(t.wallet.connected);
      await switchToBaseSepolia();
    } catch {
      notify(t.wallet.switchRejected);
    }
  }

  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : t.wallet.connect;
  const networkLabel = chainId === "0x14a34" ? t.wallet.shortNetwork : "EVM";

  function showRiskNotice() {
    setSheet("risk");
  }

  function openComments() {
    setSheet("comments");
  }

  function sendComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = commentDraft.trim();
    if (!body) return;
    setComments((current) => [
      ...current,
      { author: walletAddress ? shortAddress : "You", body }
    ]);
    setCommentDraft("");
    notify(t.comments.sent);
  }

  const commonProps = {
    contentType,
    setContentType,
    notify,
    openComments,
    commentsCount: comments.length,
    goTheater: () => setTab("theater"),
    goMarket: () => setTab("market"),
    dramas,
    t,
    demoPhase
  };

  return (
    <div className={`app-shell tab-${tab} content-${contentType}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <p className="eyebrow">MIRAGEA AI</p>
            <h1>{titles[tab]}</h1>
          </div>
        </div>
        <div className="top-actions">
          <button className={`wallet-btn ${walletAddress ? "connected" : ""}`} type="button" onClick={connectWallet}>
            <span>{shortAddress}</span>
            {walletAddress ? <small>{networkLabel}</small> : null}
          </button>
          <button className="sim-badge" id="riskBadge" type="button" onClick={showRiskNotice}>
            <span>{tab === "market" ? t.demoBadge : "8,420 HTX"}</span>
            <b>▣</b>
          </button>
        </div>
      </header>

      {tab === "theater" && <TheaterView {...commonProps} />}
      {tab === "store" && <StoreView {...commonProps} />}
      {tab === "market" && (
        <MarketView
          notify={notify}
          goTheater={() => setTab("theater")}
          openComments={openComments}
          comments={comments}
          commentsCount={comments.length}
          t={t}
          demoPhase={demoPhase}
        />
      )}
      {tab === "messages" && <MessagesView t={t} />}
      {tab === "profile" && <ProfileView t={t} notify={notify} />}

      <button
        className="demo-cycle"
        type="button"
        onClick={() => setPhaseIndex((value) => (value + 1) % demoPhases.length)}
      >
        <span>{t.demoCycle.title}</span>
        <strong>{demoPhase.code}</strong>
        <small>{t.demoCycle.phases[demoPhase.id]}</small>
        <b>{t.demoCycle.next}</b>
      </button>

      <nav className="bottom-nav" aria-label={t.navAria}>
        {(Object.keys(navCopy) as TabKey[]).map((item) => {
          const [icon] = navCopy[item];
          return (
            <button
              className={`nav-item ${tab === item ? "active" : ""}`}
              data-tab={item}
              key={item}
              type="button"
              onClick={() => {
                setSheet(null);
                setTab(item);
              }}
            >
              <span>{icon}</span>
              <small>{t.nav[item]}</small>
            </button>
          );
        })}
      </nav>

      <button
        className={`sheet-backdrop ${sheet ? "open" : ""}`}
        type="button"
        aria-label={t.closeSheet}
        aria-hidden={!sheet}
        tabIndex={sheet ? 0 : -1}
        onClick={() => setSheet(null)}
      />
      <section className={`sheet ${sheet ? "open" : ""}`} aria-hidden={!sheet} onClick={(event) => event.stopPropagation()}>
        {sheet === "risk" ? (
          <>
            <h2>{t.riskTitle}</h2>
            <p className="muted">
              {t.riskBody}
            </p>
            <button className="pink-btn" type="button" onClick={() => setSheet(null)}>
              {t.confirm}
            </button>
          </>
        ) : null}
        {sheet === "comments" ? (
          <>
            <div className="sheet-head">
              <h2>{t.commentsTitle}</h2>
              <button className="sheet-close" type="button" onClick={() => setSheet(null)} aria-label={t.closeSheet}>
                ×
              </button>
            </div>
            <div className="record-list comment-list">
              {comments.map((comment, index) => (
                <article className="panel comment-card" key={`${comment.author}-${index}`}>
                  <strong>{comment.author}</strong>
                  <p className="muted">
                    {comment.bodyKey === "commentOne" ? t.commentOne : comment.bodyKey === "commentTwo" ? t.commentTwo : comment.body}
                  </p>
                </article>
              ))}
            </div>
            <form className="comment-form" onSubmit={sendComment}>
              <input
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.currentTarget.value)}
                placeholder={t.comments.placeholder}
                aria-label={t.comments.placeholder}
              />
              <button className="pink-btn" type="submit">
                {t.send}
              </button>
            </form>
          </>
        ) : null}
      </section>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
