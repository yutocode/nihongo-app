// src/pages/TextLessonPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 各言語の教材を import
import { N5ParticlesPage1_ja } from "../data/text/n5/particles/page1/page1.ja";
import { N5ParticlesPage1_en } from "../data/text/n5/particles/page1/page1.en";
import { N5ParticlesPage1_id } from "../data/text/n5/particles/page1/page1.id";
import { N5ParticlesPage1_zh } from "../data/text/n5/particles/page1/page1.zh";
import { N5ParticlesPage1_tw } from "../data/text/n5/particles/page1/page1.tw";

export default function TextLessonPage() {
  const { level, category, pageId } = useParams(); // e.g. n5, particles, page1
  const { i18n } = useTranslation();

  // 言語ごとの教材データをまとめる
  const lessons = {
    particles: {
      page1: {
        ja: N5ParticlesPage1_ja,
        en: N5ParticlesPage1_en,
        id: N5ParticlesPage1_id,
        zh: N5ParticlesPage1_zh,
        tw: N5ParticlesPage1_tw,
      }
    }
    // 今後: verb-forms や adjectives もここに追加
  };

  // 現在の言語
  const lang = i18n.language || "ja";

  // データを取得（なければ ja にフォールバック）
  const data =
    lessons[category]?.[pageId]?.[lang] ||
    lessons[category]?.[pageId]?.ja;

  if (!data) {
    return <div>教材データが見つかりませんでした。</div>;
  }

  return (
    <div className="text-content">
      <h1>{data.title}</h1>

      {data.sections.map((section, idx) => (
        <div key={idx} className={`section section-${section.type}`}>
          {section.heading && <h2>{section.heading}</h2>}

          {["explanation", "summary"].includes(section.type) && (
            <div
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}

          {section.type === "examples" && (
            <ul>
              {section.content.map((ex, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: ex }} />
              ))}
            </ul>
          )}

          {section.type === "practice" && (
            <ol>
              {section.questions.map((q, i) => (
                <li key={i}>
                  <p>{q.q}</p>
                  <div>
                    {q.choices.map((choice, j) => (
                      <button key={j}>{choice}</button>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}
