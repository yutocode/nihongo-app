import React from "react";
import { useParams } from "react-router-dom";
import WordCard from "../components/WordCard";
import "../styles/WordPage.css";

import { n5WordSets } from "../data/n5WordSets";
import { n4WordSets } from "../data/n4WordSets";
import { n3WordSets } from "../data/n3WordSets";
import { n2WordSets } from "../data/n2WordSets";
import { n1WordSets } from "../data/n1WordSets";

import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";

const flattenLessons = (obj) => (obj ? Object.values(obj).flat() : []);

export default function WordPage() {
  const { level = "", lesson = "" } = useParams();
  const selectedLanguage = useAppStore((s) => s.language);
  const { t } = useTranslation();

  const normLevel = String(level).toLowerCase();
  const wordSetsMap = { n5: n5WordSets, n4: n4WordSets, n3: n3WordSets, n2: n2WordSets, n1: n1WordSets };
  const levelWordSet = wordSetsMap[normLevel];

  // lesson が「n5part_verbs1」等の“パート名”でも、「13 / Lesson13」でも動く
  let wordList = null;
  let titleRight = lesson;

  if (levelWordSet) {
    if (lesson && levelWordSet[lesson]) {
      // ① パート名（例: n5part_verbs1）→配下の全Lessonをまとめて表示
      wordList = flattenLessons(levelWordSet[lesson]);
      titleRight = lesson;
    } else {
      // ② 数字 / Lesson◯ → レベル内の全パートから該当Lessonのみ集約
      const num = (String(lesson).match(/\d+/)?.[0] ?? "").toString();
      const wantedLessonKey = String(lesson).startsWith("Lesson") ? String(lesson) : (num ? `Lesson${num}` : "");
      if (wantedLessonKey) {
        const merged = [];
        for (const part of Object.values(levelWordSet)) {
          if (part && typeof part === "object" && Array.isArray(part[wantedLessonKey])) {
            merged.push(...part[wantedLessonKey]);
          }
        }
        wordList = merged.length ? merged : null;
        titleRight = wantedLessonKey || lesson || "—";
      } else {
        // ③ どちらでもない → 最初のパートの全Lessonを暫定表示
        const firstPart = Object.values(levelWordSet).find(v => v && typeof v === "object");
        wordList = firstPart ? flattenLessons(firstPart) : null;
        titleRight = Object.keys(levelWordSet)[0] || "—";
      }
    }
  }

  return (
    <div className="word-page">
      {wordList ? (
        <>
          <header className="word-page-head">
            <h2 className="word-page-title">
              {t("lesson.lesson", { defaultValue: "課" })} {titleRight}
            </h2>
          </header>

          <WordCard
            wordList={wordList}
            level={normLevel}
            lesson={titleRight}
            selectedLanguage={selectedLanguage}
          />
        </>
      ) : (
        <p className="error-text">
          ❌ {t("common.noWordsFound", { defaultValue: "該当する単語が見つかりません" })} ({normLevel.toUpperCase()} - {titleRight || "—"})
        </p>
      )}
    </div>
  );
}
