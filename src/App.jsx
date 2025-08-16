// src/App.jsx
import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
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

// ★ XP 永続化ユーティリティ
import { initUserXP, stopAutoSave } from "./utils/xpPersistence";

const App = () => {
  return (
    <Router>
      <AppInitializer /> {/* ログイン状態 & XP/デイリー復元 */}
      <Routes>
        {/* 公開ルート */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* 認証後ルート */}
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
        </Route>

        {/* 404 フォールバック */}
        <Route path="*" element={<AuthPage />} />
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
  ];

  // 重複遷移防止
  const lastNavRef = useRef("");
  const navigateOnce = (to) => {
    if (lastNavRef.current === to) return;
    lastNavRef.current = to;
    navigate(to, { replace: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const path = location.pathname;

      if (user) {
        setUser(user);

        // ★ XP復元はノンブロッキング（体感を速く）
        try {
          initUserXP(user.uid);
        } catch (e) {
          console.warn("initUserXP fire-and-forget failed:", e);
        }

        // ★ デイリー（今日のノルマ）もユーザー別に復元
        try {
          const st = useAppStore.getState();
          st.loadDailyForUser(user.uid);
          st.ensureDailyToday(user.uid);
        } catch (e) {
          console.warn("daily restore failed:", e);
        }

        // 公開ページに居たらホームへ
        if (PUBLIC_PATHS.includes(path)) navigateOnce("/home");
      } else {
        clearUser();
        stopAutoSave(); // XPの自動保存監視を解除

        // 未ログインで私的ページに居たら公開トップへ
        const onPrivate = PRIVATE_PREFIXES.some((pre) => path.startsWith(pre));
        if (onPrivate) navigateOnce("/");
      }

      // 画面表示OK
      setAuthReady(true);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

export default App;