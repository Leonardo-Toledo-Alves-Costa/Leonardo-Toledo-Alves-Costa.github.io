"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { htmlLang, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * Leva para o mesmo lugar no outro idioma. Sem JS é um link comum para /<idioma>/;
 * com JS, preserva a âncora atual (#stack etc.).
 * O rótulo acessível fica no idioma de destino (quem não lê o atual reconhece).
 */
export function LocaleSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const target: Locale = locale === "pt" ? "en" : "pt";
  const href = `/${target}/`;
  const router = useRouter();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(href + window.location.hash);
  };
  return (
    <a
      data-testid="locale-switch"
      href={href}
      hrefLang={htmlLang[target]}
      lang={htmlLang[target]}
      aria-label={label}
      onClick={onClick}
      className={cn(
        // Cinza: o verde da nav é reservado ao logo e à seção ativa.
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill font-mono text-xs font-medium text-text-2",
        "transition-colors duration-200 hover:text-text",
        className,
      )}
    >
      {target.toUpperCase()}
    </a>
  );
}
