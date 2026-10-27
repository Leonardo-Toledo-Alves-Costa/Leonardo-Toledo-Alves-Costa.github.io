"use client";

import { useEffect } from "react";
import { pickLocale } from "@/i18n/pick-locale";

/** Leva para /pt/ ou /en/ conforme o idioma do navegador (site estático: não há servidor para decidir). */
export function LocaleRedirect() {
  useEffect(() => {
    const languages = navigator.languages?.length ? navigator.languages : navigator.language ? [navigator.language] : [];
    window.location.replace(`/${pickLocale(languages)}/`);
  }, []);
  return null;
}
