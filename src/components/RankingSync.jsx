// src/components/RankingSync.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase-config";
import { useAppStore } from "@/store/useAppStore";

const COLLECTION = "ranking";

const safeStr = (v) => String(v ?? "").trim();
const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// ✅ 「ランキングに載せたいXP」をストアから取る
// 優先：合計(total系) → 無ければ バナーで増えてる into を採用（まず連動させる）
function pickRankingXp(state) {
  const total =
    state?.xp?.total ??
    state?.xp?.totalXp ??
    state?.xp?.xpTotal ??
    state?.totalXp ??
    state?.xpTotal ??
    state?.profile?.xpTotal ??
    state?.profile?.stats?.xpTotal;

  if (Number.isFinite(Number(total))) return Number(total);

  const into = state?.xp?.into;
  if (Number.isFinite(Number(into))) return Number(into);

  return 0;
}

export default function RankingSync() {
  const authReady = useAppStore((s) => s.authReady);
  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.profile);

  const rankingXp = useAppStore((s) => pickRankingXp(s));

  const level = useAppStore((s) => s.level) || profile?.level || "n5";

  const isPublic =
    profile?.privacy?.showInRanking ??
    profile?.showInRanking ??
    profile?.rankingPublic ??
    profile?.isPublic ??
    true;

  const uid = safeStr(user?.uid);
  const displayName = safeStr(
    profile?.displayName || user?.displayName || user?.email || "",
  );

  const avatarHeadKey = safeStr(profile?.avatarHeadKey || profile?.avatarVariant || "base");
  const avatarBodyKey = safeStr(profile?.avatarBodyKey || profile?.avatarVariant || "base");

  const payload = useMemo(
    () => ({
      uid,
      displayName: displayName || "User",
      level: safeStr(level || "n5"),
      xp: safeNum(rankingXp, 0),
      isPublic: !!isPublic,
      showInRanking: !!isPublic, // 互換用（RankingPageは見てないけど残す）
      avatarHeadKey: avatarHeadKey || "base",
      avatarBodyKey: avatarBodyKey || "base",
      updatedAt: serverTimestamp(),
    }),
    [uid, displayName, level, rankingXp, isPublic, avatarHeadKey, avatarBodyKey],
  );

  const lastWrittenRef = useRef({ uid: "", xp: null, isPublic: null });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!authReady) return;
    if (!uid) return;

    // ✅ Firestore write は Firebase Auth が生きてないと必ず失敗
    const cu = auth?.currentUser;
    if (!cu || cu.uid !== uid) {
      // eslint-disable-next-line no-console
      console.log("[RankingSync] skip (no firebase auth)", {
        storeUid: uid,
        currentUserUid: cu?.uid || null,
      });
      return;
    }

    const prev = lastWrittenRef.current;
    const shouldWrite =
      prev.uid !== uid || prev.xp !== payload.xp || prev.isPublic !== payload.isPublic;

    if (!shouldWrite) {
      // eslint-disable-next-line no-console
      console.log("[RankingSync] skip (no changes):", { xp: payload.xp, isPublic: payload.isPublic });
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        // eslint-disable-next-line no-console
        console.log("[RankingSync] write ->", { uid, xp: payload.xp, isPublic: payload.isPublic });

        await setDoc(doc(db, COLLECTION, uid), payload, { merge: true });

        lastWrittenRef.current = { uid, xp: payload.xp, isPublic: payload.isPublic };

        // eslint-disable-next-line no-console
        console.log("[RankingSync] write OK");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[RankingSync] write FAILED:", e);
      }
    }, 500);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [authReady, uid, payload]);

  return null;
}