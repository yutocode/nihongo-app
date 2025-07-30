// src/pages/ResultPage.jsx
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "../styles/ResultPage.css"

const ResultPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  // クイズ結果データ（location.stateから受け取る）
  const {
    score = 0,
    total = 0,
    correct = 0,
    xpGained = 0
  } = location.state || {}

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  // レベル計算
  let level = 1
  if (xpGained >= 200) level = 5
  else if (xpGained >= 150) level = 4
  else if (xpGained >= 100) level = 3
  else if (xpGained >= 50) level = 2

  return (
    <div className="result-page">
      <h2>{t("resultTitle", "🎉 Results!")}</h2>

      <div className="score-box">
        <p>{t("score")}: {score}</p>
        <p>{t("accuracy")}: {accuracy}%</p>
        <p>{t("question")}: {correct} / {total}</p>
        <p>{t("score")}: <span className="xp">{xpGained} XP</span></p>
        <p>{t("level", "Level")}: <span className="level">Lv.{level}</span></p>

        <div className="level-bar">
          <div
            className="fill"
            style={{ width: `${Math.min(xpGained, 200) / 2}%` }}
          />
        </div>
      </div>

      <button className="retry-button" onClick={() => navigate("/")}>
        🔁 {t("start", "Start")} {t("part", { num: 1 })}
      </button>
    </div>
  )
}

export default ResultPage
