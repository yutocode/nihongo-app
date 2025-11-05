import React, { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { useAppStore } from "@/store/useAppStore";
import "@/styles/RankingPage.css";

const PAGE_SIZE = 25;

export default function RankingPage() {
  const user = useAppStore((s) => s.user);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);
  const lastDocRef = useRef(null);
  const fetchedCountRef = useRef(0); // rank番号のオフセット

  const fetchFirst = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        orderBy("totalXP", "desc"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      // 公開設定クライアントフィルタ（index不要にするため）
      const visible = docs.filter((u) => u?.privacy?.showInRanking !== false);
      setRows(visible);
      lastDocRef.current = snap.docs.at(-1) || null;
      fetchedCountRef.current = visible.length;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (end || !lastDocRef.current) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "users"),
        orderBy("totalXP", "desc"),
        startAfter(lastDocRef.current),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      const visible = docs.filter((u) => u?.privacy?.showInRanking !== false);
      setRows((prev) => [...prev, ...visible]);
      lastDocRef.current = snap.docs.at(-1) || null;
      fetchedCountRef.current += visible.length;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myIndex = useMemo(() => rows.findIndex((r) => r.id === user?.uid), [rows, user?.uid]);

  return (
    <main className="rk">
      <header className="rk__header">
        <h1>ランキング</h1>
        <p className="rk__sub">合計XPの高い順（公開設定オンのユーザー）</p>
      </header>

      {loading ? (
        <div className="rk__loading">読み込み中…</div>
      ) : rows.length === 0 ? (
        <div className="rk__empty">まだランキングに表示できるユーザーがいません。</div>
      ) : (
        <ol className="rk__list">
          {rows.map((u, idx) => (
            <li
              key={u.id}
              className={`rk__row ${u.id === user?.uid ? "is-me" : ""} ${idx < 3 ? `is-top${idx+1}` : ""}`}
            >
              <div className="rk__rank">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
              </div>
              <div className="rk__avatar">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt="" />
                ) : (
                  <div className="rk__avatarPh">{(u.displayName || "U").slice(0,1)}</div>
                )}
              </div>
              <div className="rk__meta">
                <div className="rk__name">{u.displayName || "ユーザー"}</div>
                <div className="rk__submeta">
                  {u.stats?.streakDays ? `🔥 ${u.stats.streakDays}日` : "—"}・
                  {u.jlptTarget || "目標未設定"}
                </div>
              </div>
              <div className="rk__xp">
                <span className="rk__xpNum">{u.totalXP ?? 0}</span>
                <span className="rk__xpUnit">XP</span>
              </div>
            </li>
          ))}
        </ol>
      )}

      {!loading && !end && (
        <div className="rk__more">
          <button className="btn" onClick={fetchMore} disabled={loadingMore}>
            {loadingMore ? "読み込み中…" : "もっと見る"}
          </button>
        </div>
      )}

      {/* 自分の位置（圏外のとき案内） */}
      {!loading && myIndex === -1 && rows.length > 0 && (
        <div className="rk__mehint">
          あなたは現在このリスト外です（XPを増やすと表示されます）
        </div>
      )}
    </main>
  );
}
