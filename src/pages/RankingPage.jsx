// src/pages/RankingPage.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { useAppStore } from "@/store/useAppStore";
import "@/styles/RankingPage.css";

const PAGE_SIZE = 25;
const FIRESTORE_TIMEOUT_MS = 15000; // 15秒で諦める

// Promise にタイムアウトをつけるヘルパー
function withTimeout(promise, label, ms = FIRESTORE_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label}_TIMEOUT`)), ms),
    ),
  ]);
}

export default function RankingPage() {
  const user = useAppStore((s) => s.user);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState(null);

  const lastDocRef = useRef(null);

  const fetchFirst = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[Ranking] fetchFirst start");

      const q = query(
        collection(db, "users"),
        where("privacy.showInRanking", "==", true),
        orderBy("xpTotal", "desc"),
        limit(PAGE_SIZE),
      );

      const snap = await withTimeout(getDocs(q), "RANKING_FETCH_FIRST");
      console.log("[Ranking] fetchFirst size =", snap.size);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      setRows(list);
      lastDocRef.current = snap.docs.at(-1) || null;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      console.error("[Ranking] fetchFirst error", e);
      if (e?.message?.includes("TIMEOUT")) {
        setError("通信が不安定なため、ランキングを読み込めませんでした。（iOSアプリのネットワーク設定を確認してください）");
      } else {
        setError("ランキングを読み込めませんでした（インデックスまたはルールを確認してください）。");
      }
      setRows([]);
      setEnd(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (end || !lastDocRef.current) return;
    setLoadingMore(true);
    setError(null);
    try {
      console.log("[Ranking] fetchMore start");

      const q = query(
        collection(db, "users"),
        where("privacy.showInRanking", "==", true),
        orderBy("xpTotal", "desc"),
        startAfter(lastDocRef.current),
        limit(PAGE_SIZE),
      );

      const snap = await withTimeout(getDocs(q), "RANKING_FETCH_MORE");
      console.log("[Ranking] fetchMore size =", snap.size);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      setRows((prev) => [...prev, ...list]);
      lastDocRef.current = snap.docs.at(-1) || null;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      console.error("[Ranking] fetchMore error", e);
      if (e?.message?.includes("TIMEOUT")) {
        setError("通信が不安定なため、追加のランキングを読み込めませんでした。");
      } else {
        setError("追加のランキングを読み込めませんでした。");
      }
      setEnd(true);
    } finally {
      setLoadingMore(false);
    }
  }, [end]);

  useEffect(() => {
    fetchFirst();
  }, [fetchFirst]);

  const myIndex = useMemo(
    () => rows.findIndex((r) => r.id === user?.uid),
    [rows, user?.uid],
  );

  return (
    <main className="rk">
      <header className="rk__header">
        <h1>ランキング</h1>
        <p className="rk__sub">合計XPの高い順（公開設定オンのユーザー）</p>
      </header>

      {error && (
        <div className="rk__error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rk__loading">読み込み中…</div>
      ) : rows.length === 0 ? (
        <div className="rk__empty">
          まだランキングに表示できるユーザーがいません。
        </div>
      ) : (
        <ol className="rk__list">
          {rows.map((u, idx) => (
            <li
              key={u.id}
              className={`rk__row ${u.id === user?.uid ? "is-me" : ""} ${
                idx < 3 ? `is-top${idx + 1}` : ""
              }`}
            >
              <div className="rk__rank">
                {idx === 0
                  ? "🥇"
                  : idx === 1
                  ? "🥈"
                  : idx === 2
                  ? "🥉"
                  : idx + 1}
              </div>

              <div className="rk__avatar">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt="" />
                ) : (
                  <div className="rk__avatarPh">
                    {(u.displayName || "U").slice(0, 1)}
                  </div>
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
                <span className="rk__xpNum">{u.xpTotal ?? 0}</span>
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

      {!loading && user && myIndex === -1 && rows.length > 0 && (
        <div className="rk__mehint">
          あなたは現在このリスト外です（XPを増やすと表示されます）
        </div>
      )}
    </main>
  );
}