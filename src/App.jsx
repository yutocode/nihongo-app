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

// pages
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import WordPage from "./pages/WordPage";
import ResultPage from "./pages/ResultPage";
import LevelSelectPage from "./pages/LevelSelectPage";
import LessonSelectPage from "./pages/LessonSelectPage";
import Settings from "./pages/Settings";
import LanguageSettings from "./pages/LanguageSettings";
import MyWordbookPage from "./pages/MyWordbookPage";

// ブロック閲覧（新規）
import BrowseBlockPage from "./pages/BrowseBlockPage";

// alphabet
import AlphabetUnitsPage from "./pages/AlphabetUnitsPage";
import AlphabetUnitLessonPage from "./pages/AlphabetUnitLessonPage";

// grammar
import GrammarCategorySelectPage from "./pages/grammar/common/GrammarCategorySelectPage";
import GrammarLessonSelectPage from "./pages/grammar/common/GrammarLessonSelectPage";
import GrammarQuizPage from "./pages/grammar/common/GrammarQuizPage";

// N5 special quizzes
import ExistHaveQuizPage from "./pages/grammar/n5/ExistHaveQuizPage";
import N5ComparisonBlankQuizPage from "./pages/grammar/n5/N5ComparisonBlankQuizPage";
import N5IntentPlanQuizPage from "./pages/grammar/n5/N5IntentPlanQuizPage";
import N5AskPermitQuizPage from "./pages/grammar/n5/N5AskPermitQuizPage";

// adjective quiz
import AdjTypeQuizPage from "./pages/grammar/n5/AdjTypeQuizPage";

// word quiz
import WordQuizPage from "./pages/WordQuizPage";
import WordQuizLessonSelectPage from "./pages/WordQuizLessonSelectPage";

// reader
import ReaderPage from "./pages/ReaderPage";
import ReaderHubPage from "./pages/ReaderHubPage";
import StoryPlayer from "./pages/StoryPlayer.jsx";

// XP persistence
import { initUserXP, stopAutoSave, ensureUserDoc } from "./utils/xpPersistence";

/* ========= helpers ========= */
function AdjLevelRedirect() {
  const { level = "n5" } = useParams();
  return <Navigate to={`/adj/${level}/lesson1`} replace />;
}
function CompareAliasRedirect() {
  const { level = "n5" } = useParams();
  return <Navigate to={`/grammar/${level}/comparison`} replace />;
}
function normalizeLesson(key) {
  if (!key) return "Lesson1";
  const m = String(key).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : String(key);
}
function CompareLessonAliasRedirect() {
  const { level = "n5", lesson = "Lesson1" } = useParams();
  return (
    <Navigate
      to={`/grammar/${level}/comparison/${normalizeLesson(lesson)}`}
      replace
    />
  );
}

/* ========= App ========= */
const App = () => (
  <Router>
    <AppInitializer />
    <Routes>
      {/* public routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* protected routes */}
      <Route
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        {/* home & result */}
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />

        {/* lessons & words */}
        <Route path="/level" element={<LevelSelectPage />} />
        {/* alias */}
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/lessons/:level" element={<LessonSelectPage />} />
        <Route path="/words/:level/:lesson" element={<WordPage />} />

        {/* ▼ 新フロー：ブロック閲覧 */}
        {/* /browse/:level/:mode/:key
            mode: "pos" | "number" | "freq"
            key : 例 "pos-名詞-1" / "num-1" / "freq-5-1" など */}
        <Route path="/browse/:level/:mode/:key" element={<BrowseBlockPage />} />

        {/* my wordbook */}
        <Route path="/my-words" element={<MyWordbookPage />} />
        <Route path="/my" element={<Navigate to="/my-words" replace />} />

        {/* settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/language" element={<LanguageSettings />} />

        {/* alphabet */}
        <Route path="/alphabet" element={<AlphabetUnitsPage />} />
        <Route path="/alphabet/unit/:id" element={<AlphabetUnitLessonPage />} />
        <Route path="/kana" element={<Navigate to="/alphabet" replace />} />

        {/* grammar */}
        <Route path="/grammar/:level" element={<GrammarCategorySelectPage />} />
        <Route path="/grammar/:level/:category" element={<GrammarLessonSelectPage />} />
        <Route path="/grammar/:level/:category/:lesson" element={<GrammarQuizPage />} />

        {/* N5 special quizzes */}
        <Route path="/grammar/:level/comparison/:lesson" element={<N5ComparisonBlankQuizPage />} />
        <Route path="/grammar/:level/intent-plan/:lesson" element={<N5IntentPlanQuizPage />} />
        <Route path="/grammar/:level/exist-have/:lesson" element={<ExistHaveQuizPage />} />
        <Route path="/grammar/:level/ask-permit/:lesson" element={<N5AskPermitQuizPage />} />

        {/* legacy grammar aliases */}
        <Route path="/grammar/:level/compare" element={<CompareAliasRedirect />} />
        <Route path="/grammar/:level/compare/:lesson" element={<CompareLessonAliasRedirect />} />

        {/* adjective quiz */}
        <Route path="/adj" element={<Navigate to="/adj/n5/lesson1" replace />} />
        <Route path="/adj/:level" element={<AdjLevelRedirect />} />
        <Route path="/adj/:level/:lesson" element={<AdjTypeQuizPage />} />

        {/* word quiz */}
        <Route path="/word-quiz" element={<LevelSelectPage />} />
        <Route path="/word-quiz/:level" element={<WordQuizLessonSelectPage />} />
        <Route path="/word-quiz/:level/:lesson" element={<WordQuizPage />} />

        {/* reader */}
        <Route path="/reader" element={<Navigate to="/reader/n5" replace />} />
        <Route path="/reader/:level" element={<ReaderHubPage />} />
        <Route path="/reader/:level/:storyId" element={<ReaderPage />} />
        <Route path="/reader/:level/:storyId/play" element={<StoryPlayer />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  </Router>
);

/* ========= Auth & XP init ========= */
const AppInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const setUser = useAppStore((s) => s.setUser);
  const clearUser = useAppStore((s) => s.clearUser);
  const setAuthReady = useAppStore((s) => s.setAuthReady);

  const PUBLIC_PATHS = ["/", "/login", "/register", "/auth"];
  const PRIVATE_PREFIXES = [
    "/home", "/quiz", "/result",
    "/level", "/levels", "/lessons", "/words",
    "/browse",                    // ★ 追加：ブロック閲覧もガード
    "/my-words", "/word-quiz",
    "/settings", "/language",
    "/grammar", "/adj",
    "/alphabet", "/alphabet/unit",
    "/reader",
  ];

  const lastNavRef = useRef("");
  const navigateOnce = (to) => {
    if (!to || lastNavRef.current === to) return;
    lastNavRef.current = to;
    navigate(to, { replace: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const path = location.pathname || "/";

      if (user) {
        setUser(user);

        (async () => {
          try { await ensureUserDoc?.(user.uid); } catch (e) { console.warn(e); }
        })();

        try { initUserXP?.(user.uid); } catch (e) { console.warn("initUserXP failed:", e); }

        try {
          const st = useAppStore.getState?.();
          st?.loadDailyForUser?.(user.uid);
          st?.ensureDailyToday?.(user.uid);
        } catch (e) {
          console.warn("daily restore failed:", e);
        }

        if (PUBLIC_PATHS.includes(path)) navigateOnce("/home");
      } else {
        clearUser();
        try { stopAutoSave?.(); } catch {}
        const onPrivate = PRIVATE_PREFIXES.some((pre) => path.startsWith(pre));
        if (onPrivate) navigateOnce("/");
      }

      setAuthReady?.(true);
    });

    return () => { unsubscribe && unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default App;
