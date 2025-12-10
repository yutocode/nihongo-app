// src/App.jsx
import React, { useEffect, useRef, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/firebase-config";
import { useAppStore } from "./store/useAppStore";
import "./styles/Global.css";

/* ===== Layout / Guards ===== */
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import LoadingIllustration from "./components/LoadingIllustration";

/* ===== Optional pages ===== */
import ProfilePage from "./pages/ProfilePage";

/* ===== public pages ===== */
import AuthPage from "./pages/AuthPage";
import AppleCallback from "./pages/AppleCallback";

/* ===== protected pages ===== */
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
import ExamPage from "./pages/ExamPage";
import RankingPage from "./pages/RankingPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import ContactPage from "./pages/ContactPage";

/* onboarding */
import Onboarding from "./pages/Onboarding";

/* alphabet */
import AlphabetUnitsPage from "./pages/AlphabetUnitsPage";
import AlphabetUnitLessonPage from "./pages/AlphabetUnitLessonPage";

/* grammar (common) */
import GrammarCategorySelectPage from "./pages/grammar/common/GrammarCategorySelectPage";
import GrammarLessonSelectPage from "./pages/grammar/common/GrammarLessonSelectPage";
import GrammarQuizPage from "./pages/grammar/common/GrammarQuizPage";

/* paraphrase (common path) */
import ParaphraseQuizPage from "./pages/grammar/common/ParaphraseQuizPage";

/* N4 grammar */
import N4ComparisonBlankQuizPage from "./pages/grammar/n4/N4ComparisonBlankQuizPage";
import N4TenseAspectJLPTPage from "./pages/grammar/n4/N4TenseAspectJLPTPage";

/* N5 special quizzes */
import ExistHaveQuizPage from "./pages/grammar/n5/ExistHaveQuizPage";
import N5IntentPlanQuizPage from "./pages/grammar/n5/N5IntentPlanQuizPage";
import N5AskPermitQuizPage from "./pages/grammar/n5/N5AskPermitQuizPage";

/* adjective */
import AdjTypeQuizPage from "./pages/grammar/n5/AdjTypeQuizPage";

/* word quizzes */
import WordQuizPage from "./pages/WordQuizPage";
import WordQuizLessonSelectPage from "./pages/WordQuizLessonSelectPage";

/* reader */
import ReaderPage from "./pages/ReaderPage";
import ReaderHubPage from "./pages/ReaderHubPage";
import StoryPlayer from "./pages/StoryPlayer.jsx";

/* verb conjugation */
import GrammarVerbQuizPage from "./pages/GrammarVerbQuizPage";

/* N3 special */
import N3VoiceQuizPage from "./pages/grammar/n3/N3VoiceQuizPage";
import N3ConcessionQuizPage from "./pages/grammar/n3/N3ConcessionQuizPage";

/* legal (public) */
import Tokusho from "./pages/legal/Tokusho";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";

/* XP persistence */
import { initUserXP, stopAutoSave, ensureUserDoc } from "./utils/xpPersistence";

/* AdMob */
import { initAdMob } from "@/utils/admobClient";

/* ====== ゲストモード（本番は false） ====== */
const GUEST_MODE = false;

/* ========= helpers ========= */
function normalizeLesson(key) {
  if (!key) return "Lesson1";
  const m = String(key).match(/lesson\s*(\d+)/i);
  return m ? `Lesson${m[1]}` : String(key);
}

function AdjLevelRedirect() {
  const { level = "n5" } = useParams();
  return <Navigate to={`/adj/${level}/lesson1`} replace />;
}

function CompareAliasRedirect() {
  return (
    <Navigate
      to={`/grammar/n4/comparison/${normalizeLesson("Lesson1")}`}
      replace
    />
  );
}

function CompareLessonAliasRedirect() {
  const { lesson = "Lesson1" } = useParams();
  return (
    <Navigate
      to={`/grammar/n4/comparison/${normalizeLesson(lesson)}`}
      replace
    />
  );
}

function ComparisonLegacyRedirect() {
  const { lesson = "Lesson1" } = useParams();
  return (
    <Navigate
      to={`/grammar/n4/comparison/${normalizeLesson(lesson)}`}
      replace
    />
  );
}

/* ========= scroll reset ========= */
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);
  return null;
}

/* ========= ルート用リダイレクト ========= */
function RootRedirect() {
  const user = useAppStore((s) => s.user);
  const authReady = useAppStore((s) => s.authReady);

  if (!authReady) {
    return (
      <LoadingIllustration
        message="起動中です…"
        size="md"
        showBackdrop
      />
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }
  return <Navigate to="/auth" replace />;
}

/* ========= /auth 用のガード付きエントリ ========= */
function AuthEntry() {
  const user = useAppStore((s) => s.user);
  const authReady = useAppStore((s) => s.authReady);

  if (!authReady) {
    return (
      <LoadingIllustration
        message="起動中です…"
        size="md"
        showBackdrop
      />
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <AuthPage />;
}

/* ========= App ========= */
const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ScrollToTop />
    <AppInitializer />
    <Suspense
      fallback={
        <LoadingIllustration
          message="画面を読み込み中…"
          size="md"
          showBackdrop
        />
      }
    >
      <Routes>
        {/* public */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth" element={<AuthEntry />} />

        {/* onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Apple サインインのリダイレクト受け取り用 */}
        <Route path="/callback" element={<AppleCallback />} />

        {/* 旧URLは全部 /auth に寄せる */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* legal */}
        <Route path="/legal/tokusho" element={<Tokusho />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />

        {/* app (protected) */}
        <Route
          element={
            GUEST_MODE ? (
              <Layout />
            ) : (
              <AuthGuard>
                <Layout />
              </AuthGuard>
            )
          }
        >
          {/* home & basics */}
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />

          {/* ranking */}
          <Route path="/ranking" element={<RankingPage />} />

          {/* support */}
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* exam */}
          <Route path="/exam/:examId" element={<ExamPage />} />

          {/* lessons & words */}
          <Route path="/level" element={<LevelSelectPage />} />
          <Route path="/levels" element={<LevelSelectPage />} />
          <Route path="/lessons/:level" element={<LessonSelectPage />} />
          <Route path="/browse/:level/:lesson" element={<WordPage />} />
          <Route
            path="/browse/:level/:mode/:key"
            element={<BrowseBlockPage />}
          />

          {/* my wordbook */}
          <Route path="/my-words" element={<MyWordbookPage />} />
          <Route path="/my" element={<Navigate to="/my-words" replace />} />

          {/* settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/language" element={<LanguageSettings />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* alphabet */}
          <Route path="/alphabet" element={<AlphabetUnitsPage />} />
          <Route
            path="/alphabet/unit/:id"
            element={<AlphabetUnitLessonPage />}
          />
          <Route path="/kana" element={<Navigate to="/alphabet" replace />} />

          {/* grammar hub */}
          <Route
            path="/grammar/:level"
            element={<GrammarCategorySelectPage />}
          />
          <Route
            path="/grammar/:level/:category"
            element={<GrammarLessonSelectPage />}
          />

          {/* N5 special quizzes */}
          <Route
            path="/grammar/n5/exist-have/:lesson"
            element={<ExistHaveQuizPage />}
          />
          <Route
            path="/grammar/n5/intent-plan/:lesson"
            element={<N5IntentPlanQuizPage />}
          />
          <Route
            path="/grammar/n5/ask-permit/:lesson"
            element={<N5AskPermitQuizPage />}
          />

          {/* N3 dedicated routes */}
          <Route
            path="/grammar/n3/concession/:lesson"
            element={<N3ConcessionQuizPage />}
          />
          <Route
            path="/grammar/:level/voice/:lesson"
            element={<N3VoiceQuizPage />}
          />

          {/* paraphrase */}
          <Route
            path="/grammar/:level/paraphrase/:lesson"
            element={<ParaphraseQuizPage />}
          />

          {/* generic grammar */}
          <Route
            path="/grammar/:level/:category/:lesson"
            element={<GrammarQuizPage />}
          />

          {/* verb conjugation */}
          <Route
            path="/grammar/:level/verb-forms/:lesson"
            element={<GrammarVerbQuizPage />}
          />

          {/* N4 official */}
          <Route
            path="/grammar/n4/comparison/:lesson"
            element={<N4ComparisonBlankQuizPage />}
          />
          <Route
            path="/grammar/n4/tense-aspect-jlpt/:lesson"
            element={<N4TenseAspectJLPTPage />}
          />

          {/* legacy redirects */}
          <Route
            path="/grammar/:level/comparison/:lesson"
            element={<ComparisonLegacyRedirect />}
          />
          <Route
            path="/grammar/:level/compare"
            element={<CompareAliasRedirect />}
          />
          <Route
            path="/grammar/:level/compare/:lesson"
            element={<CompareLessonAliasRedirect />}
          />

          {/* adjective quiz */}
          <Route
            path="/adj"
            element={<Navigate to="/adj/n5/lesson1" replace />}
          />
          <Route path="/adj/:level" element={<AdjLevelRedirect />} />
          <Route path="/adj/:level/:lesson" element={<AdjTypeQuizPage />} />

          {/* word quizzes */}
          <Route path="/word-quiz" element={<LevelSelectPage />} />
          <Route
            path="/word-quiz/:level"
            element={<WordQuizLessonSelectPage />}
          />
          <Route
            path="/word-quiz/:level/:lesson"
            element={<WordQuizPage />}
          />

          {/* reader */}
          <Route path="/reader" element={<Navigate to="/reader/n5" replace />} />
          <Route path="/reader/:level" element={<ReaderHubPage />} />
          <Route path="/reader/:level/:storyId" element={<ReaderPage />} />
          <Route
            path="/reader/:level/:storyId/play"
            element={<StoryPlayer />}
          />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

/* ========= Auth & XP init ========= */

const SESSION_USER_STORAGE_KEY = "nihongoapp_session_user";

const AppInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const setUser = useAppStore((s) => s.setUser);
  const clearUser = useAppStore((s) => s.clearUser);
  const setAuthReady = useAppStore((s) => s.setAuthReady);

  const PUBLIC_PATHS = [
    "/",
    "/auth",
    "/login",
    "/register",
    "/legal/tokusho",
    "/legal/terms",
    "/legal/privacy",
    "/callback",
    "/onboarding",
  ];

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
    "/exam",
    "/profile",
    "/ranking",
    "/help",
    "/contact",
  ];

  const lastNavRef = useRef("");
  const navigateOnce = (to) => {
    if (!to || lastNavRef.current === to) return;
    lastNavRef.current = to;
    navigate(to, { replace: true });
  };

  // ① 起動時に localStorage のセッションから復元
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(SESSION_USER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.uid) {
        console.log("[Auth] restore sessionUser from storage:", parsed.uid);
        setUser?.(parsed);
      }
    } catch (e) {
      console.warn("[Auth] restore sessionUser failed:", e);
    }
  }, [setUser]);

  // ② Firebase Auth の状態監視（ただし「セッションユーザー優先」で判定）
  useEffect(() => {
    let isMounted = true;

    // Firebaseから何も返ってこないとき用のタイムアウト
    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      console.warn(
        "[Auth] init timeout, set authReady & check sessionUser only",
      );

      const st = useAppStore.getState?.();
      const sessionUser = st?.user;
      const path = location.pathname || "/";

      if (sessionUser && sessionUser.uid) {
        setAuthReady?.(true);
        return;
      }

      setAuthReady?.(true);
      if (
        PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix)) &&
        !PUBLIC_PATHS.includes(path)
      ) {
        navigateOnce("/auth");
      }
    }, 3000);

    console.log("[log] - [Auth] init effect, path:", location.pathname);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;
      window.clearTimeout(timeoutId);

      const path = location.pathname || "/";
      console.log(
        "[log] - [Auth] onAuthStateChanged:",
        !!fbUser,
        "path:",
        path,
      );

      if (fbUser) {
        // ★ Apple 等で Firebase 側がログインしたとき用

        let idToken;
        try {
          idToken = await fbUser.getIdToken();
        } catch (e) {
          console.warn("[Auth] getIdToken failed:", e);
        }

        const sessionUser = {
          uid: fbUser.uid,
          email: fbUser.email || "",
          displayName: fbUser.displayName || "",
          providerId:
            fbUser.providerData?.[0]?.providerId ||
            fbUser.providerId ||
            "firebase",
          idToken,
          refreshToken: fbUser.stsTokenManager?.refreshToken,
        };

        // Zustand & localStorage に保存
        setUser?.(sessionUser);
        try {
          window.localStorage.setItem(
            SESSION_USER_STORAGE_KEY,
            JSON.stringify(sessionUser),
          );
        } catch (e) {
          console.warn("[Auth] sessionUser 保存失敗:", e);
        }

        // XP / Daily
        try {
          await ensureUserDoc?.(fbUser.uid);
        } catch (e) {
          console.warn("ensureUserDoc failed:", e);
        }

        try {
          const st = useAppStore.getState?.();
          st?.loadDailyForUser?.(fbUser.uid);
          st?.ensureDailyToday?.(fbUser.uid);
        } catch (e) {
          console.warn("daily restore failed:", e);
        }

        try {
          initUserXP?.(fbUser.uid);
        } catch (e) {
          console.warn("initUserXP failed:", e);
        }

        setAuthReady?.(true);

        // public ページにいるときだけ、/home or /onboarding に送る
        let forceOnboarding = false;
        try {
          const flag = window.localStorage.getItem("needsOnboarding");
          if (flag === "1") {
            forceOnboarding = true;
            window.localStorage.removeItem("needsOnboarding");
          }
        } catch (e) {
          console.warn("needsOnboarding 読み込み失敗:", e);
        }

        if (PUBLIC_PATHS.includes(path)) {
          if (forceOnboarding) {
            navigateOnce("/onboarding");
          } else {
            navigateOnce("/home");
          }
        }
      } else {
        // ★ Firebase 的にはログアウト
        const st = useAppStore.getState?.();
        const sessionUser = st?.user;

        if (sessionUser && sessionUser.uid) {
          console.log(
            "[Auth] Firebase user is null but sessionUser exists → keep logged in",
          );
          setAuthReady?.(true);
          return;
        }

        clearUser();
        try {
          stopAutoSave?.();
        } catch (e) {
          console.warn(e);
        }

        setAuthReady?.(true);

        if (
          PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix)) &&
          !PUBLIC_PATHS.includes(path)
        ) {
          navigateOnce("/auth");
        }
      }
    });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      unsubscribe && unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // AdMob 初期化（iOS ネイティブアプリのときだけ）
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator?.userAgent || "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isNative = !!window.Capacitor?.isNativePlatform;
    const isAppBuild =
      import.meta.env.VITE_DEPLOY_TARGET === "app";

    if (isIOS && isNative && isAppBuild) {
      initAdMob?.();
    }
  }, []);

  // DEV autologin
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("autologin") !== "1") return;

      const email = import.meta.env.VITE_SHOT_EMAIL;
      const pass = import.meta.env.VITE_SHOT_PASS;
      if (!email || !pass) {
        console.warn(
          "VITE_SHOT_EMAIL / VITE_SHOT_PASS が未設定です (.env.local)。",
        );
        return;
      }

      const unsub = auth.onAuthStateChanged((u) => {
        if (!u) {
          signInWithEmailAndPassword(auth, email, pass).catch(() => {});
        }
        unsub?.();
      });
    } catch (e) {
      console.warn("autologin init failed:", e);
    }
  }, []);

  return null;
};

export default App;