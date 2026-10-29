"use client";

import { useEffect } from "react";

/**
 * Reaplica html[data-js] depois de cada troca de idioma feita pelo navegador do Next:
 * o script inline do <head> só roda no carregamento do documento, e a troca recria o <html>.
 * Sem o atributo, tudo o que tem data-requires-js some (ex.: botão de copiar e-mail).
 */
export function JsFlag({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.dataset.js = "";
  }, [locale]);
  return null;
}
