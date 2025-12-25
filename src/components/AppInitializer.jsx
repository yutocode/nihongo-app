import React, { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, ensureAuthPersistence } from "@/firebase/firebase-config";
import { useAppStore } from "@/store/useAppStore";

function safeStr(v) {
  return String(v ?? "").trim();
}

function buildDefaultUserDoc(firebaseUser) {
  const displayName =
    safeStr(firebaseUser?.displayName) ||
    safeStr(firebaseUser?.email?.split("@")?.[0]) ||
    "User";

  return {
    // ✅ 既存互換のため残しつつ、ランキングで使える形も入れる
    displayName,
    jlptTarget: "N5",
    level: "N5",

    // avatarKey を使ってる画面があるなら残す
    avatarKey: "pandaBand",
    // RankingSync / RankingPage が拾えるように（なければ base でOK）
    avatarHeadKey: "base",
    avatarBodyKey: "base",

    bio: "",

    // daily は用途が別の可能性が高いので「空」を初期値にする（上書き事故防止）
    daily: {},

    privacy: {
      showInRanking: true,
      showStreakPublic: true,
    },

    // users側の合計XP（必要なら）
    xpTotal: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export default function AppInitializer() {
  const unsubProfileRef = useRef(null);

  useEffect(() => {
    // ✅ iOS/Capacitorで Auth 復元を安定させる（あれば実行）
    Promise.resolve(ensureAuthPersistence?.()).catch(() => {});

    const setStore = (patch) => {
      if (useAppStore?.setState) useAppStore.setState(patch);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // 既存の profile listener を解除
      if (unsubProfileRef.current) {
        try {
          unsubProfileRef.current();
        } catch {}
        unsubProfileRef.current = null;
      }

      if (!firebaseUser) {
        // ✅ Firebaseログインが無い＝RankingSyncが書けない状態
        setStore({
          user: null,
          profile: null,
          authReady: true,
        });
        return;
      }

      const uid = safeStr(firebaseUser.uid);
      const email = safeStr(firebaseUser.email);
      const displayName = safeStr(firebaseUser.displayName);

      // ✅ store.user は「シンプルで安定した形」に統一
      setStore({
        user: {
          uid,
          email,
          displayName,
          providerId:
            firebaseUser.providerData?.[0]?.providerId ||
            firebaseUser.providerId ||
            "firebase",
        },
        authReady: true,
      });

      if (!uid) return;

      const userRef = doc(db, "users", uid);

      // ✅ users/{uid} が無ければ作る
      try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, buildDefaultUserDoc(firebaseUser), {
            merge: true,
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[AppInitializer] ensure users doc failed:", e);
      }

      // ✅ users/{uid} を監視して store.profile を常に最新にする
      unsubProfileRef.current = onSnapshot(
        userRef,
        (snap) => {
          const data = snap.exists() ? snap.data() : null;
          setStore({ profile: data || null });
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.error("[AppInitializer] users onSnapshot error:", err);
          setStore({ profile: null });
        },
      );
    });

    return () => {
      if (unsubProfileRef.current) {
        try {
          unsubProfileRef.current();
        } catch {}
      }
      try {
        unsubscribeAuth();
      } catch {}
    };
  }, []);

  return null;
}