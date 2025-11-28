// src/components/Footer.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
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

  // 認証系画面ではフッターを隠す（必要なければこの if ごと削除してOK）
  const hideOn = ["/auth", "/login", "/register"];
  if (hideOn.includes(pathname)) return null;

  const year = new Date().getFullYear();

  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label={t("footer.ariaLabel", "フッター")}
    >
      <div className="footer__meta">
        <span className="footer__copy">© {year} nihongo-app</span>
        <span className="footer__sep" aria-hidden>
          •
        </span>
        <span className="footer__ver">v{appVersion}</span>
      </div>

      <p className="footer__tagline">
        {t("footer.madeWithLove", "Made with ❤️ for language learners")}
      </p>
    </footer>
  );
};

export default Footer;