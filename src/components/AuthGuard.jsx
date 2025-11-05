// src/components/AuthGuard.jsx
import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";         // ← 相対パスに調整してね（@未設定なら）
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

  // ★ 型記法を削除（JSXでは useRef(null)）
  const fetchedForUidRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const loadUserXP = async () => {
      if (!user) {
        setAuthReady?.(true);
        return;
      }

      if (fetchedForUidRef.current === user.uid) {
        setAuthReady?.(true);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!isActive) return;

        if (snap.exists()) {
          const data = snap.data();
          if (typeof data?.totalXP === "number") {
            setXPTotal?.(data.totalXP);
          } else {
            setXPTotal?.(0);
          }
        } else {
          setXPTotal?.(0);
        }

        fetchedForUidRef.current = user.uid;
      } catch (e) {
        console.warn("XPデータ読み込み失敗:", e);
      } finally {
        setAuthReady?.(true);
      }
    };

    if (!authReady) {
      loadUserXP();
    }

    return () => {
      isActive = false;
    };
  }, [user, authReady, setAuthReady, setXPTotal]);

  if (!authReady) {
    return <LoadingIllustration message={loadingMessage} size="md" showBackdrop />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (requireEmailVerified && user.emailVerified === false) {
    return <Navigate to="/settings" replace state={{ reason: "email_not_verified", from: location.pathname }} />;
  }

  return <>{children}</>;
}
