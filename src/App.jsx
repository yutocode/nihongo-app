// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import QuizPage from "./pages/QuizPage"
import WordPage from "./pages/WordPage"
import ResultPage from "./pages/ResultPage"
import RankingPage from "./pages/RankingPage"
import Layout from "./components/Layout"
import AuthPage from "./pages/AuthPage"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🔐 認証画面は Layout なし */}
        <Route path="/" element={<AuthPage />} />

        {/* 🏠 Layout を使うルート */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/words" element={<WordPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App


