// src/pages/RankingPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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

function explainFirestoreError(err) {
  // FirebaseError には code が入る: e.g. "failed-precondition", "permission-denied"
  const code = err?.code || "";
  const msg = err?.message || "";

  if (code === "failed-precondition") {
    // 複合インデックス未作成のときに出やすい
    // console のエラーメッセージ内にインデックス作成リンクが出ます
    return "このクエリには複合インデックスが必要です。コンソールのエラーに表示されるリンクから作成してください。";
  }
  if (code === "permission-denied") {
    return "読み取り権限がありません。Firestore ルールを確認してください（公開条件とクエリ条件を一致させてください）。";
  }
  return `読み込みでエラーが発生しました: ${code || ""} ${msg || ""}`;
}

export default function RankingPage() {
  const user = useAppStore((s) => s.user);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState(null);

  const lastDocRef = useRef(null);

  const baseQuery = (opts = {}) =>
    query(
      collection(db, "users"),
      // ★ 公開ユーザーのみ（ルールと一致させること）
      where("privacy.showInRanking", "==", true),
      orderBy("totalXP", "desc"),
      ...(opts.startAfter ? [startAfter(opts.startAfter)] : []),
      limit(PAGE_SIZE)
    );

  const fetchFirst = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(baseQuery());
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      setRows(docs);
      lastDocRef.current = snap.docs.at(-1) || null;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      console.error(e);
      setError(explainFirestoreError(e));
      setRows([]);
      setEnd(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (end || !lastDocRef.current) return;
    setLoadingMore(true);
    setError(null);
    try {
      const snap = await getDocs(baseQuery({ startAfter: lastDocRef.current }));
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), __doc: d }));
      setRows((prev) => [...prev, ...docs]);
      lastDocRef.current = snap.docs.at(-1) || null;
      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      console.error(e);
      setError(explainFirestoreError(e));
      // ここで止めておくと連打で無限リトライしない
      setEnd(true);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myIndex = useMemo(
    () => rows.findIndex((r) => r.id === user?.uid),
    [rows, user?.uid]
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
        <div className="rk__empty">まだランキングに表示できるユーザーがいません。</div>
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
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
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

      {/* 自分の位置案内（ログイン時のみ表示） */}
      {!loading && user && myIndex === -1 && rows.length > 0 && (
        <div className="rk__mehint">
          あなたは現在このリスト外です（XPを増やすと表示されます）
        </div>
      )}
    </main>
  );
}
