import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import homeEn from "./locales/en/home.json";
import homeCeb from "./locales/ceb/home.json";

const resources = {
  en: {
    home: homeEn,
  },
  ceb: {
    home: homeCeb,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ceb"],
    load: "languageOnly",
    ns: ["home"],
    defaultNS: "home",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
