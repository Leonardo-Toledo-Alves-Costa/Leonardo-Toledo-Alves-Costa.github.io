import { defaultLocale, isLocale, type Locale } from "./config";

/** Primeiro idioma da lista do navegador que suportamos (pelo prefixo, ex. "en-GB" → "en"); senão o padrão. */
export function pickLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const prefix = language.toLowerCase().split("-")[0] ?? "";
    if (isLocale(prefix)) return prefix;
  }
  return defaultLocale;
}
