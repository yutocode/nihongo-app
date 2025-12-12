// src/pages/KanjiTrainerPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "@/styles/KanjiTrainerPage.css";

const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];

// ★ 仮データ（あとで本物の漢字DBに差し替え）
const MOCK_KANJI = {
  n5: [
    { id: 1, kanji: "右", reading: "みぎ", meaning: "right", strokes: 5 },
    { id: 2, kanji: "雨", reading: "あめ", meaning: "rain", strokes: 8 },
    { id: 3, kanji: "円", reading: "えん", meaning: "circle", strokes: 4 },
    { id: 4, kanji: "王", reading: "おう", meaning: "king", strokes: 4 },
    { id: 5, kanji: "音", reading: "おと", meaning: "sound", strokes: 9 },
    { id: 6, kanji: "下", reading: "した", meaning: "below", strokes: 3 },
    { id: 7, kanji: "火", reading: "ひ", meaning: "fire", strokes: 4 },
    { id: 8, kanji: "花", reading: "はな", meaning: "flower", strokes: 7 },
  ],
  n4: [],
  n3: [],
  n2: [],
  n1: [],
};

export default function KanjiTrainerPage() {
  const { level: levelParam } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const level = (levelParam || "n5").toLowerCase();
  const kanjiList = MOCK_KANJI[level] || [];
  const levelLabel = level.toUpperCase();

  const totalCount = kanjiList.length || 100; // 仮
  const todayCount = Math.min(10, totalCount); // 仮: 今日10字

  const todayKanji = useMemo(
    () => (kanjiList.length ? kanjiList[0] : null),
    [kanjiList],
  );

  const handleChangeLevel = (lv) => {
    if (lv === level) return;
    navigate(`/kanji/${lv}`);
  };

  const handleOpenReading = () => {
    // TODO: 読み＋意味の詳細画面
  };

  const handleOpenQuiz = () => {
    // TODO: 漢字クイズ画面
  };

  const handleStrokeOrder = () => {
    // TODO: 書き順ビュー
  };

  const handleRandomTest = () => {
    // TODO: ランダム5問テスト
  };

  const handleStartLevelTest = () => {
    // TODO: レベル別テスト
  };

  return (
    <div className="kanji-trainer">
      {/* ===== 上部ヘッダー ===== */}
      <header className="kanji-trainer__header">
        <button
          type="button"
          className="kanji-trainer__back"
          onClick={() => navigate(-1)}
          aria-label={t("common.back", "戻る")}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="kanji-trainer__header-main">
          <h1 className="kanji-trainer__title">{`${levelLabel} Kanji Trainer`}</h1>
          <p className="kanji-trainer__subtitle">
            合計 {totalCount} 字・今日 {todayCount} 字
          </p>
        </div>

        <button
          type="button"
          className="kanji-trainer__info"
          aria-label={t("common.info", "情報")}
        >
          i
        </button>
      </header>

      {/* ===== JLPT レベルタブ ===== */}
      <div
        className="kanji-trainer__tabs"
        role="tablist"
        aria-label="JLPT level"
      >
        {LEVEL_ORDER.map((lv) => (
          <button
            key={lv}
            type="button"
            role="tab"
            aria-selected={lv === level}
            className={
              lv === level
                ? "kanji-trainer__tab is-active"
                : "kanji-trainer__tab"
            }
            onClick={() => handleChangeLevel(lv)}
          >
            {lv.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ===== 4 つの機能タイル ===== */}
      <section className="kanji-trainer__feature-grid">
        <button
          type="button"
          className="kanji-feature"
          onClick={handleOpenReading}
        >
          <div className="kanji-feature__icon kanji-feature__icon--book" />
          <div className="kanji-feature__label-main">Reading &amp; Meaning</div>
          <div className="kanji-feature__label-sub">読みと意味</div>
        </button>

        <button
          type="button"
          className="kanji-feature"
          onClick={handleOpenQuiz}
        >
          <div className="kanji-feature__icon kanji-feature__icon--quiz" />
          <div className="kanji-feature__label-main">Kanji Quiz</div>
          <div className="kanji-feature__label-sub">クイズ</div>
        </button>

        <button
          type="button"
          className="kanji-feature"
          onClick={handleStrokeOrder}
        >
          <div className="kanji-feature__icon kanji-feature__icon--stroke" />
          <div className="kanji-feature__label-main">Stroke order</div>
          <div className="kanji-feature__label-sub">書き順</div>
        </button>

        <div
          className="kanji-feature kanji-feature--soon"
          aria-disabled="true"
        >
          <div className="kanji-feature__icon kanji-feature__icon--writing" />
          <div className="kanji-feature__label-main">Writing</div>
          <div className="kanji-feature__label-sub">手書き練習</div>
          <span className="kanji-feature__soon-pill">Soon</span>
        </div>
      </section>

      {/* ===== 本日の漢字カード ===== */}
      {todayKanji && (
        <section className="kanji-today">
          <div className="kanji-today__card">
            <div className="kanji-today__header">
              <div>
                <div className="kanji-today__label-main">本日の漢字</div>
                <div className="kanji-today__label-sub">今日の漢字</div>
              </div>
              <div className="kanji-today__xp-pill">XP +10</div>
            </div>

            <div className="kanji-today__body">
              <div className="kanji-today__glyph">{todayKanji.kanji}</div>
              <div className="kanji-today__text">
                <div className="kanji-today__reading">
                  {todayKanji.reading}
                </div>
                <div className="kanji-today__meaning">{todayKanji.meaning}</div>
              </div>
            </div>

            <div className="kanji-today__progress-row">
              <span className="kanji-today__progress-label">今日の漢字</span>
              <span className="kanji-today__progress-count">3/5</span>
            </div>
            <div className="kanji-today__progress-bar">
              <div className="kanji-today__progress-fill" />
            </div>
          </div>
        </section>
      )}

      {/* ===== 漢字一覧 + Filter ボタン ===== */}
      <section className="kanji-list-section">
        <div className="kanji-list-section__header">
          <h2 className="kanji-list-section__title">
            {levelLabel} の漢字一覧
          </h2>
          <button
            type="button"
            className="kanji-filter"
            aria-label={t("kanji.filter", "絞り込み")}
          >
            <span className="kanji-filter__icon" aria-hidden="true" />
            <span className="kanji-filter__label">Filter</span>
          </button>
        </div>

        <ul
          className="kanji-list"
          aria-label={`${levelLabel} kanji list`}
        >
          {kanjiList.map((k) => (
            <li key={k.id} className="kanji-row">
              <div className="kanji-row__left">
                <div className="kanji-row__avatar">
                  <span className="kanji-row__glyph">{k.kanji}</span>
                </div>
                <div className="kanji-row__text">
                  <div className="kanji-row__main">
                    <span className="kanji-row__meaning-en">
                      {k.meaning.charAt(0).toUpperCase() + k.meaning.slice(1)}
                    </span>
                  </div>
                  <div className="kanji-row__meta">
                    <span className="kanji-row__reading">{k.reading}</span>
                    <span className="kanji-row__sep">・</span>
                    <span className="kanji-row__rest">
                      JLPT {levelLabel}・{k.strokes}画
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="kanji-row__bookmark"
                aria-label={t("kanji.bookmark", "ブックマーク")}
              >
                <span className="kanji-row__bookmark-icon" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 下の 2 ボタン ===== */}
      <div className="kanji-footer-cta">
        <button
          type="button"
          className="kanji-footer-cta__btn kanji-footer-cta__btn--secondary"
          onClick={handleRandomTest}
        >
          ランダム5問テスト
        </button>
        <button
          type="button"
          className="kanji-footer-cta__btn kanji-footer-cta__btn--primary"
          onClick={handleStartLevelTest}
        >
          {levelLabel}漢字テストを開始
        </button>
      </div>
    </div>
  );
}