// src/components/Footer.jsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // 例: .env に VITE_APP_VERSION=1.0.0 を設定
  const appVersion = useMemo(
    () => import.meta?.env?.VITE_APP_VERSION || "1.0.0",
    []
  );

  // 不要な画面でフッターを隠したい場合の例（任意）
  const hideOn = ["/auth", "/login", "/register"];
  if (hideOn.includes(pathname)) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label={t("footer.ariaLabel", "フッター")}>
      <nav className="footer__links" aria-label={t("footer.legal", "法的情報")}>
        <Link className="footer__link" to="/legal/tokusho">
          {t("footer.tokusho", "特定商取引法に基づく表記")}
        </Link>
        <span className="footer__dot" aria-hidden>•</span>
        <Link className="footer__link" to="/legal/terms">
          {t("footer.terms", "利用規約")}
        </Link>
        <span className="footer__dot" aria-hidden>•</span>
        <Link className="footer__link" to="/legal/privacy">
          {t("footer.privacy", "プライバシー")}
        </Link>
      </nav>

      <div className="footer__meta">
        <span className="footer__copy">© {year} nihongo-app</span>
        <span className="footer__sep" aria-hidden>•</span>
        <span className="footer__ver">v{appVersion}</span>
      </div>

      <p className="footer__tagline">
        {t("footer.madeWithLove", "Made with ❤️ for language learners")}
      </p>
    </footer>
  );
};

export default Footer;

