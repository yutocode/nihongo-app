import React from "react";

export default function Tokusho() {
  return (
    <main className="legal legal--tokusho">
      <h1>特定商取引法に基づく表記</h1>
      <p>以下はサンプルです。実運用前に必ず更新してください。</p>
      <ul>
        <li><strong>販売事業者：</strong>（氏名/法人名）</li>
        <li><strong>運営責任者：</strong>（氏名）</li>
        <li><strong>所在地：</strong>（住所）</li>
        <li><strong>電話番号：</strong>（番号 or 「請求があれば遅滞なく開示」）</li>
        <li><strong>メール：</strong>support@example.com</li>
        <li><strong>URL：</strong>https://example.com</li>
        <li><strong>販売価格：</strong>プランページに税込価格を表示</li>
        <li><strong>支払方法：</strong>クレジットカード / アプリ内課金 等</li>
        <li><strong>支払時期：</strong>購入時 / 各更新時</li>
        <li><strong>提供時期：</strong>決済完了後ただちに</li>
        <li><strong>返品・解約・返金：</strong>デジタルの性質上、原則返金不可（ストア規約優先）</li>
        <li><strong>動作環境：</strong>（必要に応じて記載）</li>
        <li><strong>定期課金：</strong>あり（自動更新／解約手順へのリンクを案内）</li>
      </ul>
    </main>
  );
}
