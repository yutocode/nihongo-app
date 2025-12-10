// src/pages/AppleCallback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRedirectResult } from "firebase/auth";

import { auth } from "../firebase/firebase-config";
import { useAppStore } from "../store/useAppStore";
import LoadingIllustration from "../components/LoadingIllustration";

const SESSION_USER_STORAGE_KEY = "nihongoapp_session_user";

function saveSessionUser(sessionUser) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SESSION_USER_STORAGE_KEY,
      JSON.stringify(sessionUser),
    );
  } catch (e) {
    console.warn("[AppleCallback] sessionUser 保存失敗:", e);
  }
}

export default function AppleCallback() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log("[AppleCallback] redirect result:", result);

        if (!isMounted) return;

        if (result?.user) {
          const fbUser = result.user;

          // Firebase User から sessionUser を組み立てる
          let idToken;
          try {
            idToken = await fbUser.getIdToken();
          } catch (e) {
            console.warn("[AppleCallback] getIdToken failed:", e);
          }

          const sessionUser = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            displayName: fbUser.displayName || "",
            providerId:
              fbUser.providerData?.[0]?.providerId ||
              fbUser.providerId ||
              "apple.com",
            idToken,
            // refreshToken は無くても動くので、あれば保存する程度
            refreshToken: fbUser.stsTokenManager?.refreshToken,
          };

          // Zustand に保存
          setUser?.(sessionUser);
          // localStorage にも保存（再起動後の自動ログイン用）
          saveSessionUser(sessionUser);

          // 新規ユーザーかどうか（tokenResponse に isNewUser が入ってくることが多い）
          const isNew =
            result._tokenResponse?.isNewUser === true ||
            result._tokenResponse?.isNewUser === "true";

          try {
            if (isNew) {
              window.localStorage.setItem("needsOnboarding", "1");
            } else {
              window.localStorage.removeItem("needsOnboarding");
            }
          } catch (e) {
            console.warn("[AppleCallback] needsOnboarding 保存失敗:", e);
          }

          // 画面遷移：新規ならオンボーディング、既存ならホーム
          if (isNew) {
            navigate("/onboarding", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } else {
          console.log("[AppleCallback] no user in redirect result");
          navigate("/auth", { replace: true }); // 失敗したらログインへ戻す
        }
      } catch (e) {
        console.error("[AppleCallback] getRedirectResult error:", e);
        navigate("/auth", { replace: true });
      }
    };

    check();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  return (
    <LoadingIllustration
      message="Appleアカウントでサインインしています…"
      size="md"
      showBackdrop
    />
  );
}