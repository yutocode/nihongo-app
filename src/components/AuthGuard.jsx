// src/components/AuthGuard.jsx
import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import LoadingIllustration from "../components/LoadingIllustration";

export default function AuthGuard({
  children,
  requireEmailVerified = false,
  loadingMessage = "サインイン状態を確認中…",
}) {
  const location = useLocation();

  const user = useAppStore((s) => s.user);
  const authReady = useAppStore((s) => s.authReady);
  const setXPTotal = useAppStore((s) => s.setXPTotal);
  const setAuthReady = useAppStore((s) => s.setAuthReady);

  // どの uid で XP を読み込んだかを記録して、無駄な再読込を防ぐ
  const fetchedForUidRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const loadUserXP = async () => {
      if (!user) {
        // ログアウト状態なら XP は 0 扱いにして authReady だけ true
        setXPTotal?.(0);
        setAuthReady?.(true);
        return;
      }

      // 同じ uid に対しては 1 回だけ読み込み
      if (fetchedForUidRef.current === user.uid) {
        setAuthReady?.(true);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!isActive) return;

        if (snap.exists()) {
          const data = snap.data();

          // いろんなフィールド名に対応して XP を取得
          const xp =
            typeof data?.totalXP === "number"
              ? data.totalXP
              : typeof data?.xpTotal === "number"
              ? data.xpTotal
              : typeof data?.xp === "number"
              ? data.xp
              : 0;

          console.log("[AuthGuard] loaded XP from Firestore:", xp, data);
          setXPTotal?.(xp);
        } else {
          console.log("[AuthGuard] no user doc, XP = 0");
          setXPTotal?.(0);
        }

        fetchedForUidRef.current = user.uid;
      } catch (e) {
        console.warn("XPデータ読み込み失敗:", e);
        setXPTotal?.(0);
      } finally {
        setAuthReady?.(true);
      }
    };

    // まだ authReady が false のときだけ読み込む
    if (!authReady) {
      console.log("[AuthGuard] start loadUserXP, user:", user?.uid);
      loadUserXP();
    }

    return () => {
      isActive = false;
    };
  }, [user, authReady, setAuthReady, setXPTotal]);

  // ===== ここからガード処理 =====

  if (!authReady) {
    return (
      <LoadingIllustration
        message={loadingMessage}
        size="md"
        showBackdrop
      />
    );
  }

  // 未ログイン → /auth へ
  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // メール確認が必須 & 未確認 → settings へ
  if (requireEmailVerified && user.emailVerified === false) {
    return (
      <Navigate
        to="/settings"
        replace
        state={{
          reason: "email_not_verified",
          from: location.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}