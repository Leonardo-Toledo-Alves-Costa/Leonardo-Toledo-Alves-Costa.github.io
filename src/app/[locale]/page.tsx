import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav, type NavItem } from "@/components/layout/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Learning } from "@/components/sections/Learning";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { learning } from "@/content/learning";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // "Agora" só aparece na navegação se houver estudo em andamento.
  const items: NavItem[] = (["about", "stack", "timeline", "projects", "learning", "contact"] as const)
    .filter((id) => id !== "learning" || learning.length > 0)
    .map((id) => ({ id, label: dict.nav[id] }));

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-text focus:px-4 focus:py-3 focus:text-bg"
      >
        {dict.common.skipToContent}
      </a>
      <Nav
        locale={locale}
        items={items}
        labels={{ nav: dict.nav.label, menu: dict.nav.menu, close: dict.nav.close, switchLanguage: dict.common.switchLanguage }}
      />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero locale={locale} dict={dict} />
        <About locale={locale} dict={dict} />
        <Stack locale={locale} dict={dict} />
        <Timeline locale={locale} dict={dict} />
        <Projects locale={locale} dict={dict} />
        <Learning locale={locale} dict={dict} />
        <Contact locale={locale} dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
