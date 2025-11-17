// src/pages/Privacy.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ========= 日本語本文 ========== */
function PrivacyBodyJa() {
  return (
    <>
      <section className="legal-section">
        <h2>1. 基本方針</h2>
        <p>
          Mai Language Lab（以下「当社」といいます。）は、日本語学習サービス
          「nihongo-app」（以下「本サービス」といいます。）の提供にあたり、
          ユーザーのプライバシーを尊重し、個人情報を適切に取り扱います。
        </p>
      </section>

      <section className="legal-section">
        <h2>2. 取得する情報</h2>
        <ul>
          <li>
            アカウント情報：
            メールアドレス、パスワード（Firebase Authentication により管理）、
            ニックネームなど
          </li>
          <li>
            学習データ：
            学習履歴、スコア、レベル、達成状況など
          </li>
          <li>
            利用状況情報：
            アプリの利用ログ、端末・ブラウザ情報等（不具合の解析や改善のため）
          </li>
        </ul>
        <p>
          なお、支払い情報などの決済データを取得・保存する場合は、
          決済事業者のシステムを利用し、当社サーバーでは保存しません。
        </p>
      </section>

      <section className="legal-section">
        <h2>3. 利用目的</h2>
        <ul>
          <li>本サービスの提供および維持管理のため</li>
          <li>学習データに基づく難易度調整・ランキング表示・機能改善のため</li>
          <li>不具合対応・お問い合わせ対応のため</li>
          <li>利用状況の分析によるサービス改善のため</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. 第三者提供・外部サービス</h2>
        <p>
          当社は、主に Firebase 等のクラウドサービスを利用して本サービスを運営します。
          これらのサービス提供者に対して、必要な範囲でユーザー情報が送信される場合があります。
        </p>
        <p>
          将来的に広告 SDK や解析ツールを導入する場合があります。その際は、本ポリシーを更新し、
          収集される情報と利用目的を明示します。
        </p>
      </section>

      <section className="legal-section">
        <h2>5. 情報の保存期間</h2>
        <p>
          アカウント情報および学習データは、ユーザーが本サービスを利用している期間中保存します。
          ユーザーがアカウント削除を希望する場合、合理的な範囲で速やかに削除を行います。
        </p>
      </section>

      <section className="legal-section">
        <h2>6. ユーザーの権利</h2>
        <p>
          ユーザーは、ご自身の情報に関して、閲覧・訂正・削除・利用停止を求めることができます。
          具体的な手続きについては、下記お問い合わせ窓口までご連絡ください。
        </p>
      </section>

      <section className="legal-section">
        <h2>7. セキュリティ</h2>
        <p>
          当社は、ユーザー情報への不正アクセス、紛失、破壊、改ざんおよび漏えいを防止するため、
          合理的な範囲でセキュリティ対策に努めます。
        </p>
      </section>

      <section className="legal-section">
        <h2>8. ポリシーの変更</h2>
        <p>
          本ポリシーの内容は、法令の改正やサービス内容の変更に応じて、適宜見直し・改定されることがあります。
          重要な変更がある場合は、アプリ内表示等によりお知らせします。
        </p>
      </section>

      <section className="legal-section">
        <h2>9. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、次のメールアドレスまでご連絡ください。
          <br />
          メールアドレス：{" "}
          <a href="mailto:mai603526@gmail.com">mai603526@gmail.com</a>
        </p>
        <p className="legal-dates">
          施行日：2025年11月17日
          <br />
          最終更新日：2025年11月17日
        </p>
      </section>
    </>
  );
}

/* ========= 他言語用の簡易メッセージ ========== */
function PrivacyBodyFallback({ lang }) {
  return (
    <section className="legal-section">
      <p>
        This Privacy Policy is currently provided in Japanese only (current
        language: <code>{lang}</code>). If you have questions, please contact us
        at{" "}
        <a href="mailto:mai603526@gmail.com">mai603526@gmail.com</a>.
      </p>
      <p style={{ marginTop: "0.75rem" }}>
        現在、プライバシーポリシーの正式版は日本語のみで掲載しています。
        ご不明な点があれば、上記メールアドレスまでお問い合わせください。
      </p>
    </section>
  );
}

/* ========= メインコンポーネント ========== */
export default function Privacy() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = String(i18n.language || "ja").toLowerCase();

  const title =
    lang.startsWith("en")
      ? "Privacy Policy"
      : lang.startsWith("id")
      ? "Kebijakan Privasi"
      : lang.startsWith("zh") || lang.startsWith("tw")
      ? "隱私權政策"
      : "プライバシーポリシー";

  const backLabel =
    lang.startsWith("en")
      ? "Back"
      : lang.startsWith("id")
      ? "Kembali"
      : lang.startsWith("zh") || lang.startsWith("tw")
      ? "返回"
      : "戻る";

  return (
    <main className="legal legal--privacy" role="main" aria-label={title}>
      <button
        type="button"
        className="legal-back"
        onClick={() => navigate(-1)}
        aria-label={backLabel}
      >
        ← {backLabel}
      </button>

      <h1>{title}</h1>
      <p className="legal-lead">nihongo-app プライバシーポリシー</p>

      {lang.startsWith("ja") ? (
        <PrivacyBodyJa />
      ) : (
        <PrivacyBodyFallback lang={lang} />
      )}
    </main>
  );
}
