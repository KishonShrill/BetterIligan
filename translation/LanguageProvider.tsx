"use client";

import { useEffect, useState } from "react";
import i18n from "@/translation/i18n";

const SUPPORTED_LANGUAGES = ["en", "ceb"];

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem("i18nextLng");

      if (
        savedLanguage &&
        SUPPORTED_LANGUAGES.includes(savedLanguage) &&
        savedLanguage !== i18n.language
      ) {
        await i18n.changeLanguage(savedLanguage);
      }

      document.documentElement.lang = i18n.language;

      const updateHtmlLang = (language: string) => {
        document.documentElement.lang = language;
      };

      i18n.on("languageChanged", updateHtmlLang);

      setReady(true);
    };

    initializeLanguage();

    return () => {
      i18n.off("languageChanged");
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
