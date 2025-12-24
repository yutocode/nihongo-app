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
import CatAvatar, { isPartKey } from "@/components/ui/CatAvatar/CatAvatar";
import "@/styles/RankingPage.css";

const PAGE_SIZE = 25;
const FIRESTORE_TIMEOUT_MS = 15000;
const COLLECTION = "ranking";

function withTimeout(promise, label, ms = FIRESTORE_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label}_TIMEOUT`)), ms),
    ),
  ]);
}

function safeStr(v) {
  return String(v ?? "").trim();
}
function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function normalizeKey(key, fallback = "base") {
  const k = safeStr(key);
  return isPartKey(k) ? k : fallback;
}
function formatLevel(v) {
  const s = safeStr(v).toLowerCase();
  if (!s) return "—";
  return s.startsWith("n") ? s.toUpperCase() : s;
}

export default function RankingPage() {
  const user = useAppStore((s) => s.user);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState(null);

  const lastDocRef = useRef(null);

  const buildQuery = useCallback(
    ({ afterDoc } = {}) => {
      const base = [
        collection(db, COLLECTION),
        where("isPublic", "==", true),
        orderBy("xp", "desc"),
        ...(afterDoc ? [startAfter(afterDoc)] : []),
        limit(PAGE_SIZE),
      ];
      return query(...base);
    },
    [],
  );

  const fetchFirst = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = buildQuery();
      const snap = await withTimeout(getDocs(q), "RANKING_FETCH_FIRST");

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(list);

      lastDocRef.current = snap.docs.length
        ? snap.docs[snap.docs.length - 1]
        : null;

      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[Ranking] fetchFirst error", e);

      if (String(e?.message || "").includes("TIMEOUT")) {
        setError("通信が不安定なため、ランキングを読み込めませんでした。");
      } else if (e?.code === "failed-precondition") {
        setError(
          "ランキングを読み込めませんでした（インデックスが必要です）。Firebase のエラーURLからインデックスを作成してください。",
        );
      } else if (e?.code === "permission-denied") {
        setError(
          "ランキングを読み込めませんでした（Firestore ルールで拒否されています）。ranking の read 設定を確認してください。",
        );
      } else {
        setError("ランキングを読み込めませんでした。");
      }

      setRows([]);
      setEnd(true);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  const fetchMore = useCallback(async () => {
    if (end || !lastDocRef.current) return;

    setLoadingMore(true);
    setError(null);

    try {
      const q = buildQuery({ afterDoc: lastDocRef.current });
      const snap = await withTimeout(getDocs(q), "RANKING_FETCH_MORE");

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows((prev) => [...prev, ...list]);

      lastDocRef.current = snap.docs.length
        ? snap.docs[snap.docs.length - 1]
        : null;

      setEnd(snap.empty || snap.size < PAGE_SIZE);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[Ranking] fetchMore error", e);

      if (e?.code === "failed-precondition") {
        setError(
          "追加のランキングを読み込めませんでした（インデックスが必要です）。Firebase のエラーURLからインデックスを作成してください。",
        );
      } else if (e?.code === "permission-denied") {
        setError("追加のランキングを読み込めませんでした（権限エラー）。");
      } else {
        setError("追加のランキングを読み込めませんでした。");
      }
      setEnd(true);
    } finally {
      setLoadingMore(false);
    }
  }, [end, buildQuery]);

  useEffect(() => {
    fetchFirst();
  }, [fetchFirst]);

  const myIndex = useMemo(
    () => rows.findIndex((r) => safeStr(r.uid || r.id) === user?.uid),
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
          <div className="rk__more">
            <button className="btn" onClick={fetchFirst}>
              再読み込み
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rk__loading">読み込み中…</div>
      ) : rows.length === 0 ? (
        <div className="rk__empty">まだランキングに表示できるユーザーがいません。</div>
      ) : (
        <ol className="rk__list">
          {rows.map((u, idx) => {
            const uid = safeStr(u.uid || u.id);
            const name = safeStr(u.displayName) || "ユーザー";
            const level = formatLevel(u.level);
            const xp = safeNum(u.xp, 0);

            const headKey = normalizeKey(u.avatarHeadKey || u.avatarVariant, "base");
            const bodyKey = normalizeKey(u.avatarBodyKey || u.avatarVariant, "base");

            const isMe = uid && uid === user?.uid;

            return (
              <li
                key={uid || u.id || String(idx)}
                className={`rk__row ${isMe ? "is-me" : ""} ${
                  idx < 3 ? `is-top${idx + 1}` : ""
                }`}
              >
                <div className="rk__rank">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                </div>

                <div className="rk__avatar" aria-label="avatar">
                  <CatAvatar
                    headKey={headKey}
                    bodyKey={bodyKey}
                    part="full"
                    title={`${name} avatar`}
                  />
                </div>

                <div className="rk__meta">
                  <div className="rk__name">{name}</div>
                  <div className="rk__submeta">{level}</div>
                </div>

                <div className="rk__xp">
                  <span className="rk__xpNum">{xp}</span>
                  <span className="rk__xpUnit">XP</span>
                </div>
              </li>
            );
          })}
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