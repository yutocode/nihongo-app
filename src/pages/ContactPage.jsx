// src/pages/ContactPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/ContactPage.css";

const SUPPORT_EMAIL = "mai603526@gmail.com";

export default function ContactPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("nihongo-app に関するお問い合わせ");
    const body = encodeURIComponent(
      [
        "以下の内容をご記入ください：",
        "",
        "・ご利用の端末とOS（例：iPhone 15 / iOS 18 など）",
        "・発生している問題やご要望",
        "・再現手順（分かる範囲で）",
        "",
      ].join("\n")
    );
    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, []);

  return (
    <main className="contact-page" role="main">
      {/* 上部ヘッダー（戻る＋タイトル） */}
      <header className="contact-header">
        <button
          type="button"
          className="contact-backButton"
          onClick={() => navigate(-1)}
          aria-label={t("common.back", "戻る")}
        >
          ←
        </button>
        <div className="contact-headerTitleBlock">
          <h1 className="contact-title">
            {t("contact.title", "お問い合わせ")}
          </h1>
          <p className="contact-subtitle">
            {t(
              "contact.subtitle",
              "不具合やご要望があれば、下記からご連絡ください。"
            )}
          </p>
        </div>
      </header>

      {/* カード本体 */}
      <section
        className="contact-card"
        aria-label={t("contact.form", "お問い合わせ案内")}
      >
        <p className="contact-text">
          {t(
            "contact.description",
            "送信ボタンを押すと、お使いのメールアプリが起動します。"
          )}
        </p>

        {/* 返信先メールアドレスの説明 */}
        <div className="contact-field">
          <div className="contact-fieldLabel">
            {t("contact.replyAddress", "返信先メールアドレス（任意）")}
          </div>
          <div className="contact-fieldHelp">
            {t(
              "contact.replyAddressHint",
              "本文にご自身のメールアドレスをご記入ください。（例：you@example.com）"
            )}
          </div>
        </div>

        {/* お問い合わせ内容の書き方 */}
        <div className="contact-field">
          <div className="contact-fieldLabel">
            {t("contact.messageLabel", "お問い合わせ内容")}
          </div>
          <div className="contact-fieldHelp">
            {t(
              "contact.messageHint",
              "発生している問題やご要望、再現手順などを、できるだけ詳しくご記入ください。"
            )}
          </div>
        </div>

        {/* メール起動ボタン */}
        <a href={mailtoHref} className="contact-mailButton">
          {t("contact.openMailApp", "メールアプリを開く")}
        </a>

        {/* 直接メール用アドレス */}
        <p className="contact-footerNote">
          {t("contact.directMailPrefix", "直接メールする場合：")}{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="contact-emailLink"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  );
}
