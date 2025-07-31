// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import AuthPage from "./pages/AuthPage"
import Home from "./pages/Home"
import QuizPage from "./pages/QuizPage"
import WordPage from "./pages/WordPage"
import ResultPage from "./pages/ResultPage"
import RankingPage from "./pages/RankingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 全ルート共通のLayout（Header/Footer） */}
        <Route path="/" element={<Layout />}>
          {/* 最初に表示されるトップページ */}
          <Route index element={<AuthPage />} />
          <Route path="home" element={<Home />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="words" element={<WordPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App



