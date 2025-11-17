// src/pages/Terms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../styles/Legal.css";
/* ========= 日本語本文 ========== */
function TermsBodyJa() {
  return (
    <>
      {/* 第1条 */}
      <section className="legal-section">
        <h2>第1条（適用）</h2>
        <ol>
          <li>
            本規約は、Mai Language Lab（以下「当社」といいます。）が提供する日本語学習サービス
            「<strong>nihongo-app</strong>」（ウェブ／モバイル、関連サイト・API を含みます。
            以下「本サービス」といいます。）の利用条件を定めるものです。
          </li>
          <li>
            ユーザーは、本サービスの利用（閲覧、アカウント登録、コンテンツ利用等を含みます。）をもって、
            本規約に同意したものとみなされます。
          </li>
          <li>
            当社が別途定め公表する各種ポリシー（プライバシーポリシー、クッキーポリシー、
            ガイドライン等を含みます。）は、本規約の一部を構成します。
          </li>
        </ol>
      </section>

      {/* 第2条 */}
      <section className="legal-section">
        <h2>第2条（本サービスの内容）</h2>
        <ol>
          <li>
            本サービスは、日本語学習コンテンツ（単語帳、クイズ、読解、ランキング等を含みます。）を提供します。
          </li>
          <li>
            本サービスは、
            <strong>広告（第三者配信広告を含みます。）により運営</strong>
            されます。広告の表示位置・頻度・内容は、当社の裁量で変更されることがあります。
          </li>
          <li>
            当社は、ユーザー体験を損なわない範囲で、広告の最適化（頻度キャップ、配置調整等）に努めます。
          </li>
        </ol>
      </section>

      {/* 第3条 */}
      <section className="legal-section">
        <h2>第3条（アカウント）</h2>
        <ol>
          <li>
            アカウント登録にあたり、ユーザーは正確かつ最新の情報を提供し、その管理を自己の責任において行うものとします。
          </li>
          <li>
            ID／パスワードの不正使用により生じた損害について、当社に故意または重過失がない限り、
            当社は一切の責任を負いません。
          </li>
          <li>
            不正目的・迷惑行為が疑われるアカウントについて、当社は自らの裁量により、利用停止・削除等の措置を行うことができます。
          </li>
        </ol>
      </section>

      {/* 第4条 */}
      <section className="legal-section">
        <h2>第4条（未成年の利用）</h2>
        <p>
          未成年者は、法定代理人（親権者等）の同意を得たうえで本サービスを利用してください。
          学習コンテンツの範囲内であっても、
          <strong>広告の表示</strong>
          が含まれる点を、法定代理人へ告知するものとします。
        </p>
      </section>

      {/* 第5条 */}
      <section className="legal-section">
        <h2>第5条（広告・第三者サービス）</h2>
        <ol>
          <li>
            本サービスには、第三者が配信・提供する広告、広告 SDK、解析ツールが含まれます。
            これらによりクッキー、端末識別子、広告 ID 等が利用される場合があります。
            詳細はプライバシーポリシーをご確認ください。
          </li>
          <li>
            第三者サービスの利用にあたっては、当該第三者の利用規約・プライバシーポリシーが適用される場合があり、
            ユーザーはそれらの条件にも従うものとします。
          </li>
          <li>
            広告の内容、リンク先、第三者サービスの可用性について、当社はその正確性・適法性等を保証しません。
          </li>
        </ol>
      </section>

      {/* 第6条 */}
      <section className="legal-section">
        <h2>第6条（コンテンツと知的財産権）</h2>
        <ol>
          <li>
            本サービスのプログラム、UI／UX デザイン、テキスト、画像、音声、データベース等に関する著作権その他の
            知的財産権は、当社または正当な権利者に帰属します。
          </li>
          <li>
            当社が明示的に許諾した範囲を超えて、複製、翻案、頒布、転載、スクレイピング、データ抽出等を
            行ってはなりません。
          </li>
          <li>
            学習用の音声（TTS／録音等）、イラスト、アイコン等には第三者ライセンスが適用される場合があります。
            別途表示があるときは、その条件が優先します。
          </li>
        </ol>
      </section>

      {/* 第7条 */}
      <section className="legal-section">
        <h2>第7条（ユーザーコンテンツ）</h2>
        <ol>
          <li>
            ユーザーが本サービス上で投稿・送信・保存するテキスト、画像等（以下「ユーザーコンテンツ」といいます。）
            の権利は、原則としてユーザーに帰属します。
          </li>
          <li>
            ユーザーは、当社に対し、ユーザーコンテンツを本サービスの提供・運営・品質改善・告知の範囲で、
            無償かつ非独占的に利用（保存、表示、翻訳、改変、配信、二次利用を含みます。）する権利を許諾します。
          </li>
          <li>
            ユーザーは、ユーザーコンテンツが第三者の権利を侵害しないことを保証します。
            侵害通報または当社の判断により、当社は当該コンテンツを削除・非表示にすることができます。
          </li>
        </ol>
      </section>

      {/* 第8条 */}
      <section className="legal-section">
        <h2>第8条（学習データ・ランキング）</h2>
        <ol>
          <li>
            当社は、学習履歴、スコア、到達度等（以下「学習データ」といいます。）を、
            難易度調整、ランキング表示、機能改善等のために解析・統計化して利用します。
          </li>
          <li>
            ランキング表示に際しては、ニックネーム等の識別子を用い、個人が特定されないよう配慮します。
          </li>
        </ol>
      </section>

      {/* 第9条 */}
      <section className="legal-section">
        <h2>第9条（禁止事項）</h2>
        <p>ユーザーは、本サービスの利用にあたり、次の行為を行ってはなりません。</p>
        <ul>
          <li>法令・公序良俗・プラットフォーム規約に反する行為</li>
          <li>他者の権利（著作権、商標、プライバシー等）を侵害する行為</li>
          <li>逆コンパイル、リバースエンジニアリング、スクレイピング等による大量データ取得</li>
          <li>不正アクセス、アカウントの不正利用、スパム、広告クリックの不正操作</li>
          <li>評価・ランキングの不正操作、チート、複数アカウントによる水増し</li>
          <li>当社または第三者になりすます行為</li>
        </ul>
      </section>

      {/* 第10条 */}
      <section className="legal-section">
        <h2>第10条（サービスの変更・停止）</h2>
        <ol>
          <li>
            当社は、ユーザーへの事前告知のうえで、本サービスの内容変更・一時停止・終了を行うことができます。
            やむを得ない事情がある場合は、事後告知となることがあります。
          </li>
          <li>
            広告パートナーやプラットフォームの仕様変更により、広告の表示形態や収益条件が変更される場合があります。
          </li>
        </ol>
      </section>

      {/* 第11条 */}
      <section className="legal-section">
        <h2>第11条（保証の否認）</h2>
        <p>
          本サービスは「現状有姿」で提供されるものであり、特定目的適合性、完全性、可用性、有用性等について、
          当社は明示または黙示の保証を行いません。ただし、法令により否定できない保証についてはこの限りではありません。
        </p>
      </section>

      {/* 第12条 */}
      <section className="legal-section">
        <h2>第12条（責任の制限）</h2>
        <p>
          当社は、当社の故意または重過失による場合を除き、本サービスに起因または関連してユーザーに生じた損害
          （間接損害、逸失利益、データ喪失等を含みます。）について責任を負いません。
          賠償が認められる場合でも、その上限は、当該損害発生時から遡って直近 12 か月間にユーザーが当社に実際に
          支払った金額の総額（広告モデルでは通常 0 円）を上限とします
          （消費者保護法令で許される範囲で）。
        </p>
      </section>

      {/* 第13条 */}
      <section className="legal-section">
        <h2>第13条（反社会的勢力の排除）</h2>
        <p>
          ユーザーは、反社会的勢力に該当せず、将来にわたって関与しないことを表明・保証します。
          当社は、違反が判明した場合、催告なく利用停止等の措置を講じることができます。
        </p>
      </section>

      {/* 第14条 */}
      <section className="legal-section">
        <h2>第14条（規約の変更）</h2>
        <ol>
          <li>
            当社は、必要に応じて本規約を変更することができます。重要な変更については、
            アプリ内表示、当社ウェブサイト、メール、プッシュ通知等により周知します。
          </li>
          <li>
            変更後の本規約は、公表時または当社が定める効力発生日から適用されます。
          </li>
        </ol>
      </section>

      {/* 第15条 */}
      <section className="legal-section">
        <h2>第15条（通知・連絡）</h2>
        <ol>
          <li>
            当社からユーザーへの通知は、アプリ内掲示、ウェブ掲載、登録メールアドレスへの送付、
            プッシュ通知その他当社が適切と判断する方法により行います。
          </li>
          <li>
            ユーザーから当社への連絡は、当社が指定するお問い合わせフォームまたはサポート窓口を利用してください。
          </li>
        </ol>
      </section>

      {/* 第16条 */}
      <section className="legal-section">
        <h2>第16条（準拠法・裁判管轄）</h2>
        <p>
          本規約は日本法に準拠します。本サービスに関して当社とユーザーとの間で紛争が生じた場合、
          訴額に応じて東京地方裁判所または東京簡易裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>

      {/* 第17条 */}
      <section className="legal-section">
        <h2>第17条（分離可能性・権利不行使）</h2>
        <ol>
          <li>
            本規約の一部が無効・違法・執行不能とされた場合でも、残余部分は継続して有効とします。
          </li>
          <li>
            当社が本規約に基づく権利を行使しない場合でも、その権利を放棄するものではありません。
          </li>
        </ol>
      </section>

      {/* 付則 */}
      <section className="legal-section">
        <h2>付則（情報）</h2>
        <ul>
          <li>
            運営者情報（推奨）：
            <strong>Mai Language Lab（個人開発）／mai603526@gmail.com</strong>
            （詳細は今後作成するプライバシーポリシー等で案内します）
          </li>
          <li>
            広告の種類や表示ルールの詳細については、今後アプリ内またはプライバシーポリシー等で案内します。
          </li>
          <li>クッキー等の利用：本サービスのプライバシーポリシーで説明します。</li>
        </ul>

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
function TermsBodyFallback({ lang }) {
  return (
    <section className="legal-section">
      <p>
        This Terms of Use is currently provided in Japanese only (current
        language: <code>{lang}</code>). If you have questions, please contact us
        at{" "}
        <a href="mailto:mai603526@gmail.com">mai603526@gmail.com</a>.
      </p>
      <p style={{ marginTop: "0.75rem" }}>
        現在、利用規約の正式版は日本語のみで掲載しています。
        ご不明な点があれば、上記メールアドレスまでお問い合わせください。
      </p>
    </section>
  );
}

/* ========= メインコンポーネント ========== */
export default function Terms() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = String(i18n.language || "ja").toLowerCase();

  const title =
    lang.startsWith("en")
      ? "Terms of Use"
      : lang.startsWith("id")
      ? "Ketentuan Layanan"
      : lang.startsWith("zh") || lang.startsWith("tw")
      ? "使用條款"
      : "利用規約";

  const backLabel =
    lang.startsWith("en")
      ? "Back"
      : lang.startsWith("id")
      ? "Kembali"
      : lang.startsWith("zh") || lang.startsWith("tw")
      ? "返回"
      : "戻る";

  return (
    <main className="legal legal--terms" role="main" aria-label={title}>
      <button
        type="button"
        className="legal-back"
        onClick={() => navigate(-1)}
        aria-label={backLabel}
      >
        ← {backLabel}
      </button>

      <h1>{title}</h1>
      <p className="legal-lead">nihongo-app 利用規約（広告モデル v1.2）</p>

      {lang.startsWith("ja") ? (
        <TermsBodyJa />
      ) : (
        <TermsBodyFallback lang={lang} />
      )}
    </main>
  );
}
