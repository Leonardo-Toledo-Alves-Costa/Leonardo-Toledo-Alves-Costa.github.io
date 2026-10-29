"use client";

import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { LocaleSwitch } from "./LocaleSwitch";

export type NavItem = { id: string; label: string };

type NavProps = {
  locale: Locale;
  items: NavItem[];
  labels: { nav: string; menu: string; close: string; switchLanguage: string };
};

/**
 * Seção que cruza a faixa do meio da tela. O hero também é observado: no topo, nenhum item fica ativo.
 * A lista vira uma string para o efeito não reiniciar a cada renderização.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["hero", ...key.split(",")]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);
  return active === "hero" ? null : active;
}

/** Navegação em pílula de vidro, fixa no topo. No celular: pílula compacta (mesma largura aberta ou fechada) + menu. */
export function Nav({ locale, items, labels }: NavProps) {
  const active = useActiveSection(items.map((i) => i.id));
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const link = (item: NavItem, extra: string) => {
    const isActive = active === item.id;
    return (
      <a
        href={`#${item.id}`}
        aria-current={isActive ? "true" : undefined}
        onClick={close}
        className={cn(
          "rounded-pill transition-colors duration-200",
          // O verde é o "LED" da seção atual: o hover não o apaga.
          isActive ? "text-signal" : "text-text-2 hover:text-text",
          extra,
        )}
      >
        {item.label}
      </a>
    );
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      {/* Celular: largura fixa nos dois estados; aberto vira painel (cantos de 22px) para não recortar o conteúdo. */}
      <GlassPanel
        as="nav"
        aria-label={labels.nav}
        data-testid="site-nav"
        className={cn(
          "pointer-events-auto w-full max-w-sm md:w-auto md:max-w-none",
          open ? "max-md:rounded-panel md:rounded-pill" : "rounded-pill",
        )}
      >
        <div className="flex items-center py-0.5 pr-1 pl-2">
          <a
            href="#hero"
            onClick={close}
            // O nome acessível começa pelo texto visível (WCAG 2.5.3: quem usa voz diz "LT").
            aria-label="LT, Leonardo Tolêdo"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill px-2 font-mono text-sm font-medium text-signal"
          >
            LT_
          </a>
          {/* Desktop: itens em linha. */}
          <ul className="ml-2 hidden items-center gap-5 pr-3 text-sm md:flex">
            {items.map((item) => (
              <li key={item.id}>{link(item, "inline-flex min-h-11 items-center")}</li>
            ))}
          </ul>
          {/* Grupo da direita: idioma (+ menu no celular), sempre nas mesmas coordenadas. */}
          <div className="ml-auto flex items-center border-l border-line pl-1 md:ml-0">
            <LocaleSwitch locale={locale} label={labels.switchLanguage} />
            <button
              ref={toggleRef}
              type="button"
              data-testid="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? labels.close : labels.menu}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-pill text-text md:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span
                  className={cn("absolute left-0 h-px w-4 bg-current transition-transform duration-200", open ? "top-1.5 rotate-45" : "top-0")}
                />
                <span
                  className={cn("absolute left-0 h-px w-4 bg-current transition-transform duration-200", open ? "top-1.5 -rotate-45" : "top-3")}
                />
              </span>
            </button>
          </div>
        </div>
        <ul id="menu-mobile" hidden={!open} className="grid gap-1 border-t border-line px-3 pt-2 pb-3 text-base md:hidden">
          {items.map((item) => (
            <li key={item.id}>{link(item, "flex min-h-11 items-center px-2")}</li>
          ))}
        </ul>
      </GlassPanel>
    </header>
  );
}
