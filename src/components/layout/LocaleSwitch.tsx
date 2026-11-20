"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { htmlLang, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { localizedPath } from "@/lib/locale-path";

export type SiteRoute = "home" | "projects";

const ROUTE_PATH: Record<SiteRoute, string> = { home: "", projects: "projetos/" };

/**
 * Leva para a mesma página no outro idioma (/pt/projetos/ ⇄ /en/projetos/).
 * Sem JS é um link comum; com JS, preserva a âncora atual (#about etc.).
 * O rótulo acessível fica no idioma de destino (quem não lê o atual reconhece).
 */
export function LocaleSwitch({ locale, route, label, className }: { locale: Locale; route: SiteRoute; label: string; className?: string }) {
  const target: Locale = locale === "pt" ? "en" : "pt";
  const href = localizedPath(`/${locale}/${ROUTE_PATH[route]}`, target);
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
      // Começa pelo texto visível (WCAG 2.5.3): quem usa comando de voz diz "EN"/"PT".
      aria-label={`${target.toUpperCase()}, ${label}`}
      onClick={onClick}
      // Alvo de toque de 44px no link; a cápsula desenhada (mais baixa e horizontal) fica no span.
      className={cn("group inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-xs font-medium text-ink", className)}
    >
      <span className="rounded-pill border border-line px-3.5 py-1.5 transition-colors duration-200 group-hover:border-ink-dim">
        {target.toUpperCase()}
      </span>
    </a>
  );
}
