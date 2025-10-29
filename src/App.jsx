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
import BrowseBlockPage from "./pages/BrowseBlockPage";

// alphabet
import AlphabetUnitsPage from "./pages/AlphabetUnitsPage";
import AlphabetUnitLessonPage from "./pages/AlphabetUnitLessonPage";

// grammar (common)
import GrammarCategorySelectPage from "./pages/grammar/common/GrammarCategorySelectPage";
import GrammarLessonSelectPage from "./pages/grammar/common/GrammarLessonSelectPage";
import GrammarQuizPage from "./pages/grammar/common/GrammarQuizPage";

// N4 grammar
import N4ComparisonBlankQuizPage from "./pages/grammar/n4/N4ComparisonBlankQuizPage";
import N4TenseAspectJLPTPage from "./pages/grammar/n4/N4TenseAspectJLPTPage";

// N5 special quizzes
import ExistHaveQuizPage from "./pages/grammar/n5/ExistHaveQuizPage";
import N5IntentPlanQuizPage from "./pages/grammar/n5/N5IntentPlanQuizPage";
import N5AskPermitQuizPage from "./pages/grammar/n5/N5AskPermitQuizPage";

// adjective
import AdjTypeQuizPage from "./pages/grammar/n5/AdjTypeQuizPage";

// word quizzes
import WordQuizPage from "./pages/WordQuizPage";
import WordQuizLessonSelectPage from "./pages/WordQuizLessonSelectPage";

// reader
import ReaderPage from "./pages/ReaderPage";
import ReaderHubPage from "./pages/ReaderHubPage";
import StoryPlayer from "./pages/StoryPlayer.jsx";

// verb conjugation quiz
import GrammarVerbQuizPage from "./pages/GrammarVerbQuizPage";

// XP persistence
import { initUserXP, stopAutoSave, ensureUserDoc } from "./utils/xpPersistence";

/* ========= helpers ========= */
function AdjLevelRedirect() {
  const { level = "n5" } = useParams();
  return <Navigate to={`/adj/${level}/lesson1`} replace />;
}
function normalizeLesson(key) {
  if (!key) return "Lesson1";
  const m = String(key).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : String(key);
}

/** 旧比較URL互換: /grammar/:level/compare → /grammar/n4/comparison/Lesson1 */
function CompareAliasRedirect() {
  return <Navigate to={`/grammar/n4/comparison/${normalizeLesson("Lesson1")}`} replace />;
}
/** 旧比較URL互換: /grammar/:level/compare/:lesson → /grammar/n4/comparison/:lesson */
function CompareLessonAliasRedirect() {
  const { lesson = "Lesson1" } = useParams();
  return <Navigate to={`/grammar/n4/comparison/${normalizeLesson(lesson)}`} replace />;
}
/** 旧比較URL互換: /grammar/:level/comparison/:lesson → /grammar/n4/comparison/:lesson */
function ComparisonLegacyRedirect() {
  const { lesson = "Lesson1" } = useParams();
  return <Navigate to={`/grammar/n4/comparison/${normalizeLesson(lesson)}`} replace />;
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
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/lessons/:level" element={<LessonSelectPage />} />
        <Route path="/words/:level/:lesson" element={<WordPage />} />

        {/* browse block */}
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

        {/* grammar hub */}
        <Route path="/grammar/:level" element={<GrammarCategorySelectPage />} />
        <Route path="/grammar/:level/:category" element={<GrammarLessonSelectPage />} />
        <Route path="/grammar/:level/:category/:lesson" element={<GrammarQuizPage />} />

        {/* verb conjugation quiz */}
        <Route path="/grammar/:level/verb-forms/:lesson" element={<GrammarVerbQuizPage />} />

        {/* N4 comparison official lesson routes (一覧ページから遷移) */}
        {/* ✅ ここはリダイレクトを置かない */}
        <Route path="/grammar/n4/comparison/:lesson" element={<N4ComparisonBlankQuizPage />} />

        {/* N4 tense-aspect (JLPT) official lesson routes */}
        {/* ✅ ここもリダイレクトを置かない */}
        <Route path="/grammar/n4/tense-aspect-jlpt/:lesson" element={<N4TenseAspectJLPTPage />} />

        {/* legacy comparison redirects to N4 */}
        <Route path="/grammar/:level/comparison/:lesson" element={<ComparisonLegacyRedirect />} />
        <Route path="/grammar/:level/compare" element={<CompareAliasRedirect />} />
        <Route path="/grammar/:level/compare/:lesson" element={<CompareLessonAliasRedirect />} />

        {/* N5 special grammar quizzes (比較は無し) */}
        <Route path="/grammar/:level/intent-plan/:lesson" element={<N5IntentPlanQuizPage />} />
        <Route path="/grammar/:level/exist-have/:lesson" element={<ExistHaveQuizPage />} />
        <Route path="/grammar/:level/ask-permit/:lesson" element={<N5AskPermitQuizPage />} />

        {/* adjective quiz */}
        <Route path="/adj" element={<Navigate to="/adj/n5/lesson1" replace />} />
        <Route path="/adj/:level" element={<AdjLevelRedirect />} />
        <Route path="/adj/:level/:lesson" element={<AdjTypeQuizPage />} />

        {/* word quizzes */}
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
    "/home",
    "/quiz",
    "/result",
    "/level",
    "/levels",
    "/lessons",
    "/words",
    "/browse",
    "/my-words",
    "/word-quiz",
    "/settings",
    "/language",
    "/grammar",
    "/adj",
    "/alphabet",
    "/alphabet/unit",
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
          try {
            await ensureUserDoc?.(user.uid);
          } catch (e) {
            console.warn(e);
          }
        })();

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

      setAuthReady?.(true);
    });

    return () => unsubscribe && unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default App;
