import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import homeEn from "./locales/en/home.json";
import homeCeb from "./locales/ceb/home.json";
import aboutEn from "./locales/en/about.json";
import aboutCeb from "./locales/ceb/about.json";
import iliganEn from "./locales/en/iligan.json";
import iliganCeb from "./locales/ceb/iligan.json";
import travelEn from "./locales/en/travel.json";
import travelCeb from "./locales/ceb/travel.json";
import servicesEn from "./locales/en/services.json";
import servicesCeb from "./locales/ceb/services.json";
import transparencyEn from "./locales/en/transparency.json";
import transparencyCeb from "./locales/ceb/transparency.json";
import governmentEn from "./locales/en/government.json";
import governmentCeb from "./locales/ceb/government.json";

const resources = {
  en: {
    home: homeEn,
    about: aboutEn,
    iligan: iliganEn,
    travel: travelEn,
    services: servicesEn,
    transparency: transparencyEn,
    government: governmentEn,
  },
  ceb: {
    home: homeCeb,
    about: aboutCeb,
    iligan: iliganCeb,
    travel: travelCeb,
    services: servicesCeb,
    transparency: transparencyCeb,
    government: governmentCeb,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ceb"],
    load: "languageOnly",
    ns: [
      "home",
      "about",
      "iligan",
      "travel",
      "services",
      "transparency",
      "government",
    ],
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
