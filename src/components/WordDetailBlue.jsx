import React, { useState } from "react";

// Preview-ready single-file React component
// Theme: Blue (例青)
// Recreates the look & layout of the screenshots: header bar, tabs, kanji table, word detail, and conjugation block.

export default function WordDetailBlue() {
  const [tab, setTab] = useState("kanji"); // "vocab" | "kanji" | "sentence"

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-[390px] max-w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        {/* Status-ish header */}
        <div className="bg-sky-500 text-white px-4 pt-5 pb-3 relative">
          <button className="absolute left-3 top-5 text-white/90 text-xl" aria-label="Back">◀</button>
          <h1 className="text-center text-2xl font-bold tracking-wider">遠慮</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-around border-b border-slate-200">
          {[
            { k: "vocab", label: "Vocabulary" },
            { k: "kanji", label: "Kanji" },
            { k: "sentence", label: "Sentence" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`relative flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
                tab === t.k ? "text-sky-600" : "text-slate-500"
              }`}
            >
              {t.label}
              {tab === t.k && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-14 bg-sky-500 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* Content area */}
        {tab === "kanji" && <KanjiTab />}
        {tab === "vocab" && <VocabTab />}
        {tab === "sentence" && <SentenceTab />}

        {/* bottom safe-area spacer */}
        <div className="h-5" />
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="px-4 pt-4">
      <div className="bg-sky-100 text-sky-800 font-extrabold rounded-xl px-3 py-2 inline-block">{children}</div>
    </div>
  );
}

function KanjiTab() {
  return (
    <div className="pb-6">
      {/* Top muted card (like example image's faded content) */}
      <div className="mx-4 my-3 h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
        遠くに島が見えた。
      </div>

      <SectionTitle>Examples of classification by reading method</SectionTitle>

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-sky-500/20 px-4 py-3">
          <div className="text-lg font-bold text-slate-800">Onyomi</div>
          <div className="text-slate-700 mt-1">えん</div>
        </div>

        <DLRow
          left={<Ruby base="遠足" ruby="えんそく" />}
          right={<span className="text-slate-700">excursion</span>}
        />
        <Divider />
        <DLRow
          left={<Ruby base="遠慮" ruby="えんりょ" />}
          right={<span className="text-slate-700">reserve</span>}
        />
        <Divider />
        <DLRow
          left={<Ruby base="遠方 おちかた" ruby="えんぽう おちかた" />}
          right={<span className="text-slate-700">long way</span>}
        />
        <Divider />
        <DLRow
          left={<Ruby base="永遠" ruby="えいえん" blueFirst />}
          right={<span className="text-slate-700">eternity</span>}
        />
      </div>
    </div>
  );
}

function VocabTab() {
  return (
    <div className="pb-8">
      {/* Word header card */}
      <div className="mx-4 mt-4 p-4 rounded-2xl border border-slate-200 shadow-sm bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-wide">遠慮</div>
            <div className="mt-1 text-slate-600">えんりょ</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-sky-50 text-sky-600" aria-label="favorite">♡</button>
            <button className="p-2 rounded-full bg-sky-50 text-sky-600" aria-label="audio">🔊</button>
          </div>
        </div>

        <ul className="mt-3 grid gap-1 text-sky-700 font-medium">
          <li>reserve, constraint, restraint, modesty</li>
          <li>diffidence, hesitation, holding back</li>
          <li>discretion, tact, thoughtfulness</li>
        </ul>
      </div>

      {/* Example sentence */}
      <div className="mx-4 mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
        <p className="text-[17px] leading-7 text-slate-900">
          <span className="ruby">独力</span>でそれがやれるなら、
          <span className="text-sky-700 font-semibold">遠慮</span>せずにやりなさい。
        </p>
        <p className="mt-2 text-slate-500 text-[15px]">
          If you can do it on your own, do it without reserve.
        </p>
      </div>

      {/* Conjugation table (suru-verb) */}
      <details className="mx-4 mt-3 rounded-2xl border border-slate-200 bg-white open:shadow-sm">
        <summary className="cursor-pointer select-none list-none px-4 py-3 text-slate-800 font-semibold">Conjugation verb table</summary>
        <div className="px-4 pb-4">
          <CTRow a="Dictionary (辞書)" b="遠慮する" />
          <CTRow a="Past (た)" b="遠慮した" />
          <CTRow a="Negative (未然)" b="遠慮しない" />
          <CTRow a="Polite (丁寧)" b="遠慮します" />
          <CTRow a="te (て)" b="遠慮して" />
          <CTRow a="Potential (可能)" b="遠慮できる" />
          <CTRow a="Passive (受身)" b="遠慮される" />
          <CTRow a="Causative (使役)" b="遠慮させる" />
          <CTRow a="Conditional (条件)" b="遠慮すれば" />
          <CTRow a="Imperative (命令)" b="遠慮しろ" />
          <CTRow a="Volitional (意向)" b="遠慮しよう" />
          <CTRow a="Prohibition (禁止)" b="遠慮するな" />
        </div>
      </details>

      {/* Synonym */}
      <div className="mx-4 mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="text-sky-700 font-bold">Synonym of: 遠慮</div>
        <ul className="mt-2 list-disc list-inside text-slate-700">
          <li>保留</li>
        </ul>
      </div>
    </div>
  );
}

function SentenceTab() {
  return (
    <div className="pb-8">
      <div className="mx-4 mt-4 p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-slate-800 font-semibold">Sentence</div>
          <button className="p-2 rounded-full bg-sky-50 text-sky-600">🔊</button>
        </div>
        <p className="mt-2 text-[17px] leading-7 text-slate-900">
          彼 か 私 が <span className="text-sky-700 font-semibold">悪い</span>。
        </p>
        <p className="text-slate-500 mt-1">He or I am to blame.</p>
      </div>

      <SectionTitle>Onyomi (悪)</SectionTitle>
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-sky-500/20 px-4 py-3">
          <div className="text-slate-800">あく</div>
        </div>
        <DLRow left={<Ruby base="悪趣味" ruby="あくしゅみ" />} right={<span />} />
        <Divider />
        <DLRow left={<Ruby base="悪魔" ruby="あくま" />} right={<span className="text-slate-700">devil</span>} />
        <Divider />
        <DLRow left={<Ruby base="改悪" ruby="かいあく" />} right={<span className="text-slate-700">deterioration</span>} />
        <Divider />
        <DLRow left={<Ruby base="悪日" ruby="あくにち あくび" />} right={<span className="text-slate-700">unlucky day</span>} />
      </div>
    </div>
  );
}

function DLRow({ left, right }) {
  return (
    <div className="grid grid-cols-[1.1fr_0.9fr] px-4 py-3 bg-white">
      <div className="text-slate-900">{left}</div>
      <div className="text-right">{right}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-200" />;
}

function CTRow({ a, b }) {
  return (
    <div className="grid grid-cols-[1.1fr_0.9fr] py-2">
      <div className="text-slate-600">{a}</div>
      <div className="text-slate-900 text-right">{b}</div>
    </div>
  );
}

function Ruby({ base, ruby, blueFirst = false }) {
  // Simple ruby-like rendering: blue kanji + red reading below, mimicking screenshot style
  return (
    <div className="leading-tight">
      <span className={`${blueFirst ? "text-sky-600" : "text-sky-700"} font-semibold`}>{base.split(" ")[0]}</span>
      <div className="text-rose-500 text-sm mt-1">{ruby}</div>
    </div>
  );
}
