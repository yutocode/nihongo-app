// src/pages/KanjiPage.jsx
// JLPT 語彙データから「1文字漢字」を集めて表示する Kanji Trainer 画面

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { n1WordSets } from "@/data/n1WordSets";
import { n2WordSets } from "@/data/n2WordSets";
import { n3WordSets } from "@/data/n3WordSets";
import { n4WordSets } from "@/data/n4WordSets";
import { n5WordSets } from "@/data/n5WordSets";

import "@/styles/KanjiPage.css";

const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];

const WORDSETS_BY_LEVEL = {
  n1: n1WordSets,
  n2: n2WordSets,
  n3: n3WordSets,
  n4: n4WordSets,
  n5: n5WordSets,
};

const flattenLessons = (obj) => (obj ? Object.values(obj).flat() : []);

/** JLPT 語彙データから「1文字漢字だけ」を抽出してユニークにする */
function collectKanjiWords(levelKey) {
  const set = WORDSETS_BY_LEVEL[levelKey];
  if (!set) return [];

  const allWords = Object.values(set).flatMap(flattenLessons);
  const seen = new Set();
  const result = [];

  for (const w of allWords) {
    const k = w.kanji;
    if (!k) continue;
    if (k.length !== 1) continue; // 1文字だけ
    if (seen.has(k)) continue;

    seen.add(k);
    result.push(w);
  }

  return result;
}

/** 今日の漢字を 1 つ選ぶ（とりあえず日付ベースで擬似ランダム） */
function pickTodayKanji(kanjiList) {
  if (!kanjiList.length) return null;
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % kanjiList.length;
  return kanjiList[index];
}

export default function KanjiTrainerPage() {
  const { level: levelParam = "n5" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const levelKey = String(levelParam).toLowerCase(); // n1〜n5
  const levelLabel = levelKey.toUpperCase();

  const kanjiList = useMemo(
    () => collectKanjiWords(levelKey),
    [levelKey],
  );

  const totalCount = kanjiList.length || 100; // データ未整備のときは仮
  const todayKanji = useMemo(
    () => pickTodayKanji(kanjiList),
    [kanjiList],
  );
  const todayCount = Math.min(10, totalCount); // とりあえず固定

  const handleChangeLevel = (lv) => {
    if (!lv || lv === levelKey) return;
    navigate(`/kanji/${lv}`);
  };

  const handleOpenReading = () => {
    // TODO: 読み＋意味の詳細画面に飛ばしたくなったらここ
  };

  const handleOpenQuiz = () => {
    // TODO: 漢字クイズ画面へ
  };

  const handleStrokeOrder = () => {
    // TODO: 書き順ビューへ
  };

  const handleRandomTest = () => {
    // TODO: ランダム5問テストへ
  };

  const handleStartLevelTest = () => {
    // TODO: レベル別漢字テストへ
  };

  return (
    <div className="kanji-page">
      {/* ===== ヘッダー行 ===== */}
      <header className="kanji-header">
        <button
          type="button"
          className="kanji-back-btn"
          onClick={() => navigate(-1)}
          aria-label={t("common.back", "戻る")}
        >
          <span className="kanji-back-icon" aria-hidden="true">
            ‹
          </span>
        </button>

        <div className="kanji-header-main">
          <h1 className="kanji-title">{`${levelLabel} Kanji Trainer`}</h1>
          <p className="kanji-subtitle">
            {t("kanji.summary", {
              defaultValue: "合計 {{total}} 字 ・ 今日 {{today}} 字",
              total: totalCount,
              today: todayCount,
            })}
          </p>
        </div>

        <button
          type="button"
          className="kanji-info-btn"
          aria-label={t("common.info", "情報")}
        >
          i
        </button>
      </header>

      {/* ===== JLPT レベルタブ ===== */}
      <div className="kanji-level-tabs" role="tablist" aria-label="JLPT level">
        {LEVEL_ORDER.map((lv) => (
          <button
            key={lv}
            type="button"
            role="tab"
            aria-selected={lv === levelKey}
            className={
              lv === levelKey
                ? "kanji-level-tab is-active"
                : "kanji-level-tab is-idle"
            }
            onClick={() => handleChangeLevel(lv)}
          >
            {lv.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ===== 上部 2×2 タイル ===== */}
      <section className="kanji-feature-grid">
        <button
          type="button"
          className="kanji-feature-tile"
          onClick={handleOpenReading}
        >
          <div className="kanji-feature-icon kanji-feature-icon--book" />
          <div className="kanji-feature-label-main">Reading &amp; Meaning</div>
          <div className="kanji-feature-label-sub">読みと意味</div>
        </button>

        <button
          type="button"
          className="kanji-feature-tile"
          onClick={handleOpenQuiz}
        >
          <div className="kanji-feature-icon kanji-feature-icon--quiz" />
          <div className="kanji-feature-label-main">Kanji Quiz</div>
          <div className="kanji-feature-label-sub">クイズ</div>
        </button>

        <button
          type="button"
          className="kanji-feature-tile"
          onClick={handleStrokeOrder}
        >
          <div className="kanji-feature-icon kanji-feature-icon--stroke" />
          <div className="kanji-feature-label-main">Stroke order</div>
          <div className="kanji-feature-label-sub">書き順</div>
        </button>

        <div className="kanji-feature-tile kanji-feature-tile--soon" aria-disabled>
          <div className="kanji-feature-icon kanji-feature-icon--writing" />
          <div className="kanji-feature-label-main">Writing</div>
          <div className="kanji-feature-label-sub">手書き練習</div>
          <span className="kanji-soon-pill">Soon</span>
        </div>
      </section>

      {/* ===== 本日の漢字カード ===== */}
      {todayKanji && (
        <section className="kanji-today-section">
          <div className="kanji-today-card">
            <div className="kanji-today-header">
              <div className="kanji-today-title-block">
                <div className="kanji-today-label-main">本日の漢字</div>
                <div className="kanji-today-label-sub">今日の漢字</div>
              </div>
              <div className="kanji-today-xp-pill">XP +10</div>
            </div>

            <div className="kanji-today-body">
              <div className="kanji-today-character">{todayKanji.kanji}</div>
              <div className="kanji-today-text">
                <div className="kanji-today-reading">{todayKanji.reading}</div>
                <div className="kanji-today-meaning">
                  {todayKanji.meanings?.en ||
                    todayKanji.meanings?.id ||
                    todayKanji.meanings?.zh ||
                    todayKanji.meanings?.tw ||
                    ""}
                </div>
              </div>
            </div>

            <div className="kanji-today-progress">
              <span className="kanji-today-progress-label">今日の漢字</span>
              <span className="kanji-today-progress-count">3/5</span>
            </div>
            <div className="kanji-today-progress-bar">
              <div className="kanji-today-progress-bar-fill" />
            </div>
          </div>
        </section>
      )}

      {/* ===== 漢字一覧タイトル行 + フィルタ ===== */}
      <section className="kanji-list-section">
        <div className="kanji-list-header">
          <h2 className="kanji-list-title">{levelLabel} の漢字一覧</h2>
          <button
            type="button"
            className="kanji-filter-btn"
            aria-label={t("kanji.filter", "絞り込み")}
          >
            <span className="kanji-filter-icon" aria-hidden="true" />
            <span className="kanji-filter-label">Filter</span>
          </button>
        </div>

        {/* ===== リスト本体 ===== */}
        <ul className="kanji-list" aria-label={`${levelLabel} kanji list`}>
          {kanjiList.map((w) => {
            const meaningEn =
              w.meanings?.en ||
              w.meanings?.id ||
              w.meanings?.zh ||
              w.meanings?.tw ||
              "";
            const meaningCap =
              meaningEn.charAt(0).toUpperCase() + meaningEn.slice(1);

            return (
              <li key={w.id ?? w.kanji} className="kanji-row">
                <div className="kanji-row-left">
                  <div className="kanji-row-avatar">
                    <span className="kanji-row-avatar-char">{w.kanji}</span>
                  </div>

                  <div className="kanji-row-text">
                    <div className="kanji-row-main">
                      <span className="kanji-row-meaning-en">
                        {meaningCap}
                      </span>
                    </div>
                    <div className="kanji-row-meta">
                      <span className="kanji-row-reading">{w.reading}</span>
                      <span className="kanji-row-separator">・</span>
                      <span className="kanji-row-meta-rest">
                        JLPT {levelLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="kanji-bookmark-btn"
                  aria-label={t("kanji.bookmark", "ブックマーク")}
                >
                  <span className="kanji-bookmark-icon" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===== 画面下の 2 ボタン ===== */}
      <div className="kanji-footer-cta">
        <button
          type="button"
          className="kanji-cta-btn kanji-cta-btn--secondary"
          onClick={handleRandomTest}
        >
          ランダム5問テスト
        </button>
        <button
          type="button"
          className="kanji-cta-btn kanji-cta-btn--primary"
          onClick={handleStartLevelTest}
        >
          {levelLabel}漢字テストを開始
        </button>
      </div>
    </div>
  );
}