"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { LocaleSwitch, type SiteRoute } from "./LocaleSwitch";

/** Item da nav: uma seção da home (âncora) ou a rota de projetos (id "projects"). */
export type NavItem = { id: string; label: string };

type NavProps = {
  locale: Locale;
  route: SiteRoute;
  items: NavItem[];
  labels: { nav: string; menu: string; close: string; switchLanguage: string };
};

const PROJECTS_ID = "projects";

/**
 * Seção que cruza a faixa do meio da tela. O hero também é observado: no topo, nenhum item fica ativo.
 * A lista vira uma string para o efeito não reiniciar a cada renderização.
 */
function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    if (!enabled) return;
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
  }, [key, enabled]);
  return active === "hero" ? null : active;
}

/** Fundo só depois de sair do topo: no hero a barra fica transparente sobre o orbe (insp. Obelisk). */
function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Barra larga fixa: nome à esquerda, âncoras ao centro, idioma à direita (menu no celular). */
export function Nav({ locale, route, items, labels }: NavProps) {
  const onHome = route === "home";
  const active = useActiveSection(
    items.filter((i) => i.id !== PROJECTS_ID).map((i) => i.id),
    onHome,
  );
  const scrolled = useScrolled();
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
  const home = `/${locale}/`;

  const link = (item: NavItem, extra: string) => {
    const isProjects = item.id === PROJECTS_ID;
    const href = isProjects ? `${home}projetos/` : onHome ? `#${item.id}` : `${home}#${item.id}`;
    const current = isProjects ? (route === "projects" ? "page" : undefined) : active === item.id ? "true" : undefined;
    return (
      <a
        href={href}
        aria-current={current}
        onClick={close}
        className={cn("transition-colors duration-200", current ? "font-medium text-ink" : "text-ink-dim hover:text-ink", extra)}
      >
        {item.label}
      </a>
    );
  };

  return (
    <header
      data-scrolled={scrolled || open ? "true" : "false"}
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ease-abissal",
        scrolled || open ? "border-line bg-bg-abyss/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label={labels.nav} data-testid="site-nav">
        <Container className="flex items-center gap-4 py-2 md:grid md:grid-cols-[1fr_auto_1fr]">
          <a
            href={onHome ? "#hero" : home}
            onClick={close}
            className="inline-flex min-h-11 items-center md:justify-self-start text-sm font-medium tracking-[-0.01em] text-ink"
          >
            {profile.name}
          </a>
          <ul data-nav-desktop="" className="hidden items-center gap-7 text-sm md:flex">
            {items.map((item) => (
              <li key={item.id}>{link(item, "inline-flex min-h-11 min-w-11 items-center justify-center")}</li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-1 md:ml-0 md:justify-self-end">
            <LocaleSwitch locale={locale} route={route} label={labels.switchLanguage} />
            <button
              ref={toggleRef}
              type="button"
              data-testid="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? labels.close : labels.menu}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-pill text-ink md:hidden"
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
        </Container>
        <ul id="menu-mobile" hidden={!open} className="grid gap-1 border-t border-line px-4 pt-2 pb-4 text-base md:hidden">
          {items.map((item) => (
            <li key={item.id}>{link(item, "flex min-h-11 items-center")}</li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
