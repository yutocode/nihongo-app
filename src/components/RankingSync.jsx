import React, { useEffect, useMemo, useRef } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { useAppStore } from "@/store/useAppStore";

const COLLECTION = "ranking";

function safeStr(v) {
  return String(v ?? "").trim();
}
function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function RankingSync() {
  const authReady = useAppStore((s) => s.authReady);
  const user = useAppStore((s) => s.user);

  const profile = useAppStore((s) => s.profile);
  const level = useAppStore((s) => s.level) || "n5";
  const xp =
    useAppStore((s) => s.xp) ??
    useAppStore((s) => s.totalXp) ??
    useAppStore((s) => s.xpTotal) ??
    0;

  // 公開フラグ（どこに入ってても拾う）
  const isPublic =
    profile?.isPublic ??
    profile?.showInRanking ??
    profile?.privacy?.showInRanking ??
    user?.isPublic ??
    user?.showInRanking ??
    true;

  const uid = safeStr(user?.uid);
  const displayName = safeStr(profile?.displayName || user?.displayName || user?.email || "");

  const avatarHeadKey = safeStr(
    profile?.avatarHeadKey || user?.avatarHeadKey || profile?.avatarVariant || "base",
  );
  const avatarBodyKey = safeStr(
    profile?.avatarBodyKey || user?.avatarBodyKey || profile?.avatarVariant || "base",
  );

  const payload = useMemo(() => {
    return {
      uid,
      displayName: displayName || "User",
      level: safeStr(level || "n5"),
      xp: safeNum(xp, 0),

      // ✅ ランキングの条件は isPublic に統一
      isPublic: !!isPublic,
      // 互換のため残す（古いUI/コードが見ても困らない）
      showInRanking: !!isPublic,

      avatarHeadKey: avatarHeadKey || "base",
      avatarBodyKey: avatarBodyKey || "base",

      updatedAt: serverTimestamp(),
    };
  }, [uid, displayName, level, xp, isPublic, avatarHeadKey, avatarBodyKey]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!authReady) return;
    if (!uid) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      try {
        await setDoc(doc(db, COLLECTION, uid), payload, { merge: true });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[RankingSync] write failed:", e);
      }
    }, 800);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [authReady, uid, payload]);

  return null;
}