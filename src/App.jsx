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

// grammar (common)
import GrammarLevelSelectPage from "./pages/grammar/common/GrammarLevelSelectPage";
import GrammarCategorySelectPage from "./pages/grammar/common/GrammarCategorySelectPage";
import GrammarLessonSelectPage from "./pages/grammar/common/GrammarLessonSelectPage";
import GrammarQuizPage from "./pages/grammar/common/GrammarQuizPage";

// N5 special quizzes
import ExistHaveQuizPage from "./pages/grammar/n5/ExistHaveQuizPage";
import N5ComparisonBlankQuizPage from "./pages/grammar/n5/N5ComparisonBlankQuizPage";
import N5IntentPlanQuizPage from "./pages/grammar/n5/N5IntentPlanQuizPage";
import N5AskPermitQuizPage from "./pages/grammar/n5/N5AskPermitQuizPage";

// adj quiz
import AdjTypeQuizPage from "./pages/grammar/n5/AdjTypeQuizPage";

// word quiz
import WordQuizLevelSelectPage from "./pages/WordQuizLevelSelectPage";
import WordQuizLessonSelectPage from "./pages/WordQuizLessonSelectPage";
import WordQuizPage from "./pages/WordQuizPage";

// XP persistence
import { initUserXP, stopAutoSave } from "./utils/xpPersistence";

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
  return m ? `Lesson${m[1]}` : key;
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
      {/* public */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* protected */}
      <Route
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        {/* home */}
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />

        {/* words & lessons (単語カード系) */}
        <Route path="/level" element={<LevelSelectPage />} />
        <Route path="/lessons/:level" element={<LessonSelectPage />} />
        <Route path="/words/:level/:lesson" element={<WordPage />} />

        {/* my wordbook */}
        <Route path="/my-words" element={<MyWordbookPage />} />
        <Route path="/my" element={<Navigate to="/my-words" replace />} />

        {/* settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/language" element={<LanguageSettings />} />

        {/* grammar */}
        <Route path="/grammar" element={<GrammarLevelSelectPage />} />
        <Route path="/grammar/:level" element={<GrammarCategorySelectPage />} />
        <Route
          path="/grammar/:level/:category"
          element={<GrammarLessonSelectPage />}
        />
        <Route
          path="/grammar/:level/:category/:lesson"
          element={<GrammarQuizPage />}
        />

        {/* n5 special */}
        <Route
          path="/grammar/:level/comparison/:lesson"
          element={<N5ComparisonBlankQuizPage />}
        />
        <Route
          path="/grammar/:level/intent-plan/:lesson"
          element={<N5IntentPlanQuizPage />}
        />
        <Route
          path="/grammar/:level/exist-have/:lesson"
          element={<ExistHaveQuizPage />}
        />
        <Route
          path="/grammar/:level/ask-permit/:lesson"
          element={<N5AskPermitQuizPage />}
        />

        {/* legacy aliases */}
        <Route
          path="/grammar/:level/compare"
          element={<CompareAliasRedirect />}
        />
        <Route
          path="/grammar/:level/compare/:lesson"
          element={<CompareLessonAliasRedirect />}
        />

        {/* adjective quiz */}
        <Route path="/adj" element={<Navigate to="/adj/n5/lesson1" replace />} />
        <Route path="/adj/:level" element={<AdjLevelRedirect />} />
        <Route path="/adj/:level/:lesson" element={<AdjTypeQuizPage />} />

        {/* word quiz（独立ルーティング） */}
        <Route path="/word-quiz" element={<WordQuizLevelSelectPage />} />
        <Route path="/word-quiz/:level" element={<WordQuizLessonSelectPage />} />
        <Route path="/word-quiz/:level/:lesson" element={<WordQuizPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
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
    "/home",
    "/quiz",
    "/result",
    "/level",
    "/lessons",
    "/words",
    "/my-words",
    "/word-quiz", // クイズ配下も保護
    "/settings",
    "/language",
    "/grammar",
    "/adj",
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
        if (PUBLIC_PATHS.includes(path)) navigateOnce("/home");
      } else {
        clearUser();
        try {
          stopAutoSave?.();
        } catch {}
        const onPrivate = PRIVATE_PREFIXES.some((pre) => path.startsWith(pre));
        if (onPrivate) navigateOnce("/");
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [location.pathname, navigate, setUser, clearUser, setAuthReady]);

  return null;
};

export default App;
