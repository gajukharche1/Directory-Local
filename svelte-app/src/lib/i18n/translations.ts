import en from "$lib/messages/en.json";
import mr from "$lib/messages/mr.json";
import hi from "$lib/messages/hi.json";

export type Locale = "en" | "mr" | "hi";

export const LOCALES: { code: Locale; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
];

export const dictionaries = {
  en,
  mr,
  hi,
};

export function getTranslations(locale: Locale = "en") {
  return dictionaries[locale] || dictionaries.en;
}
