// src/components/Footer.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Nihongo App</p>
        <p>{t("footer.madeWithLove", "Made with ❤️ for language learners")}</p>
      </div>
    </footer>
  );
};

export default Footer;
