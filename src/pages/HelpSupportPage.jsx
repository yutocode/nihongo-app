// src/pages/HelpSupportPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/HelpSupportPage.css";

export default function HelpSupportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main
      className="help-page"
      role="main"
      aria-label={t("help.title", "ヘルプ・サポート")}
    >
      <header className="help-page__header">
        <button
          type="button"
          className="help-page__back"
          onClick={() => navigate(-1)}
          aria-label={t("common.back", "戻る")}
        >
          ←
        </button>
        <div className="help-page__titles">
          <h1 className="help-page__title">
            {t("help.title", "ヘルプ・サポート")}
          </h1>
          <p className="help-page__subtitle">
            {t(
              "help.subtitle",
              "困ったときは、まずこのページを確認してください。"
            )}
          </p>
        </div>
      </header>

      <section className="help-page__section">
        <h2 className="help-page__sectionTitle">
          {t("help.gettingStarted.title", "はじめに")}
        </h2>
        <ul className="help-page__list">
          <li>{t("help.gettingStarted.account", "アカウント作成・ログインができません")}</li>
          <li>{t("help.gettingStarted.studyFlow", "学習の流れが分かりません")}</li>
          <li>{t("help.gettingStarted.levelSelect", "どのレベルから始めればよいか知りたい")}</li>
        </ul>
      </section>

      <section className="help-page__section">
        <h2 className="help-page__sectionTitle">
          {t("help.study.title", "学習機能について")}
        </h2>
        <ul className="help-page__list">
          <li>{t("help.study.wordbook", "単語帳の使い方")}</li>
          <li>{t("help.study.quiz", "クイズ・模試の仕組み")}</li>
          <li>{t("help.study.xp", "XP・レベル・ランキングについて")}</li>
        </ul>
      </section>

      <section className="help-page__section">
        <h2 className="help-page__sectionTitle">
          {t("help.trouble.title", "トラブルシューティング")}
        </h2>
        <ul className="help-page__list">
          <li>{t("help.trouble.cannotOpen", "画面が開かない・真っ白になる")}</li>
          <li>{t("help.trouble.audio", "音声が再生されない")}</li>
          <li>{t("help.trouble.progress", "進捗やXPが反映されない")}</li>
        </ul>
      </section>

      <section className="help-page__section">
        <h2 className="help-page__sectionTitle">
          {t("help.contactSection.title", "解決しない場合")}
        </h2>
        <p className="help-page__text">
          {t(
            "help.contactSection.text",
            "下のボタンから、お問い合わせページへ進んでご連絡ください。"
          )}
        </p>
        <button
          type="button"
          className="help-page__contactButton"
          onClick={() => navigate("/contact")}
        >
          {t("help.contactSection.button", "お問い合わせへ")}
        </button>
      </section>
    </main>
  );
}
