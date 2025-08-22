// src/App.jsx
import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase-config";
import { useAppStore } from "./store/useAppStore";
import "./styles/Global.css";

import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";

import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import WordPage from "./pages/WordPage";
import ResultPage from "./pages/ResultPage";
import RankingPage from "./pages/RankingPage";
import LevelSelectPage from "./pages/LevelSelectPage";
import LessonSelectPage from "./pages/LessonSelectPage";
import Settings from "./pages/Settings";
import LanguageSettings from "./pages/LanguageSettings";

// 文法ページ群
import GrammarLevelSelectPage from "./pages/GrammarLevelSelectPage";
import GrammarCategorySelectPage from "./pages/GrammarCategorySelectPage";
import GrammarLessonSelectPage from "./pages/GrammarLessonSelectPage";
import GrammarQuizPage from "./pages/GrammarQuizPage";
import ExistHaveQuizPage from "./pages/ExistHaveQuizPage"; // ★ 追加

// 形容詞（い/な）二択クイズ
import AdjTypeQuizPage from "./pages/AdjTypeQuizPage";

// XP 永続化ユーティリティ
import { initUserXP, stopAutoSave } from "./utils/xpPersistence";

// /adj/:level → /adj/:level/lesson1 に安全リダイレクト
function AdjLevelRedirect() {
  const { level = "n5" } = useParams();
  return <Navigate to={`/adj/${level}/lesson1`} replace />;
}

const App = () => {
  return (
    <Router>
      <AppInitializer />
      <Routes>
        {/* 公開ルート */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* 認証後ルート（共通レイアウト配下） */}
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/level" element={<LevelSelectPage />} />
          <Route path="/lessons/:level" element={<LessonSelectPage />} />
          <Route path="/words/:level/:lesson" element={<WordPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/language" element={<LanguageSettings />} />

          {/* 文法：レベル → カテゴリ → レッスン → クイズ */}
          <Route path="/grammar" element={<GrammarLevelSelectPage />} />
          <Route path="/grammar/:level" element={<GrammarCategorySelectPage />} />
          <Route path="/grammar/:level/:category" element={<GrammarLessonSelectPage />} />

          {/* ★ 存在・所有（ある/いる/持つ）は専用クイズページへ */}
          <Route
            path="/grammar/:level/exist-have/:lesson"
            element={<ExistHaveQuizPage />}
          />

          {/* その他カテゴリのクイズ（従来汎用） */}
          <Route
            path="/grammar/:level/:category/:lesson"
            element={<GrammarQuizPage />}
          />

          {/* ★ 形容詞二択クイズ */}
          <Route path="/adj" element={<Navigate to="/adj/n5/lesson1" replace />} />
          <Route path="/adj/:level" element={<AdjLevelRedirect />} />
          <Route path="/adj/:level/:lesson" element={<AdjTypeQuizPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

const AppInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const setUser = useAppStore((s) => s.setUser);
  const clearUser = useAppStore((s) => s.clearUser);
  const setAuthReady = useAppStore((s) => s.setAuthReady);

  const PUBLIC_PATHS = ["/", "/login", "/register", "/auth"];
  const PRIVATE_PREFIXES = [
    "/home",
    "/quiz",
    "/result",
    "/ranking",
    "/level",
    "/lessons",
    "/words",
    "/settings",
    "/language",
    "/grammar",
    "/adj",
  ];

  // 重複遷移防止
  const lastNavRef = useRef("");
  const navigateOnce = (to) => {
    if (!to) return;
    if (lastNavRef.current === to) return;
    lastNavRef.current = to;
    navigate(to, { replace: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const path = location.pathname || "/";

      if (user) {
        setUser(user);

        // XP / デイリーの復元
        try {
          initUserXP?.(user.uid);
        } catch (e) {
          console.warn("initUserXP failed:", e);
        }
        try {
          const st = useAppStore.getState?.();
          st?.loadDailyForUser?.(user.uid);
          st?.ensureDailyToday?.(user.uid);
        } catch (e) {
          console.warn("daily restore failed:", e);
        }

        // 公開ページにいるなら /home へ
        if (PUBLIC_PATHS.includes(path)) navigateOnce("/home");
      } else {
        clearUser();
        try {
          stopAutoSave?.();
        } catch {}

        // 未ログインで私的ページなら公開トップへ
        const onPrivate = PRIVATE_PREFIXES.some((pre) => path.startsWith(pre));
        if (onPrivate) navigateOnce("/");
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

export default App;
