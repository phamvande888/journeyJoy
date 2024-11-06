import React from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import "./LanguageSwitcher.css";

const LanguageSwitcher = ({ changeLanguage }) => {
  const { i18n } = useTranslation();

  const changeLanguageHandler = (lng) => {
    i18n.changeLanguage(lng);
    changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <span
        role="img"
        aria-label="English"
        title="English"
        className="flag-icon"
        onClick={() => changeLanguageHandler("en")}
        style={{ cursor: "pointer" }}
      >
        <ReactCountryFlag
          countryCode="US"
          svg
          style={{
            fontSize: '1.4em',
            lineHeight: '1.4em',
          }}
        />
      </span>
      <span
        role="img"
        aria-label="Vietnamese"
        title="Vietnamese"
        className="flag-icon"
        onClick={() => changeLanguageHandler("vi")}
        style={{ cursor: "pointer" }}
      >
        <ReactCountryFlag
          countryCode="VN"
          svg
          style={{
            fontSize: '1.4em',
            lineHeight: '1.4em',
          }}
        />
      </span>
    </div>
  );
};

export default LanguageSwitcher;
