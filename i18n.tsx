import i18next from "i18next";
import en from "../soundhunters_RN/strings/en.json"
import german from "../soundhunters_RN/strings/german.json";
import { initReactI18next } from "react-i18next";
i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  resources: {
    german: german,
    en: en,
  },
  react: {
    useSuspense: false,
  },
});
export default i18next;



