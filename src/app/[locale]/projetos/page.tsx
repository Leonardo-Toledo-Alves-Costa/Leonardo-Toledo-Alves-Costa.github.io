import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav, type NavItem } from "@/components/layout/Nav";
import { ProjectsIntro } from "@/components/projects/ProjectsIntro";
import { ProjectsOutro } from "@/components/projects/ProjectsOutro";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillCategory } from "@/content/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localize, skillCategories, skillsByCategory } from "@/lib/content";

const CATEGORY_KEY: Record<SkillCategory, "software" | "cloud" | "engineering" | "hardwareAi"> = {
  software: "software",
  cloud: "cloud",
  engineering: "engineering",
  "hardware-ai": "hardwareAi",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/projetos">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const t = dict.projectsPage;
  const url = `/${locale}/projetos/`;
  return {
    title: t.metaTitle,
    description: t.description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": "/pt/projetos/", en: "/en/projetos/", "x-default": "/pt/projetos/" },
    },
    openGraph: {
      type: "website",
      url,
      siteName: profile.name,
      title: t.metaTitle,
      description: t.description,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt" ? "en_US" : "pt_BR",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: dict.share.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.description, images: [{ url: "/og.png", alt: dict.share.ogAlt }] },
  };
}

/**
 * /projetos (spec §6): abertura com halo + F4, stack e projetos, fechamento com contato.
 * Esqueleto da Task 16 — a stack em batidas (Task 17) e os capítulos (Tasks 18–19) substituem o miolo.
 */
export default async function ProjectsPage({ params }: PageProps<"/[locale]/projetos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const items: NavItem[] = (["about", "timeline", "projects", "contact"] as const).map((id) => ({ id, label: dict.nav[id] }));
  const grouped = skillsByCategory(skills);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-3 focus:text-bg-abyss"
      >
        {dict.common.skipToContent}
      </a>
      <Nav
        locale={locale}
        route="projects"
        items={items}
        labels={{ nav: dict.nav.label, menu: dict.nav.menu, close: dict.nav.close, switchLanguage: dict.common.switchLanguage }}
      />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <ProjectsIntro dict={dict} />

        <section id="stack" aria-labelledby="stack-title" className="py-20 sm:py-28">
          <Container>
            <SectionLabel index="01" as="h2" id="stack-title">
              {dict.projectsPage.stackLabel}
            </SectionLabel>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {skillCategories.map((category) => (
                <div key={category}>
                  <h3 className="text-xl font-normal tracking-[-0.015em] text-ink">{dict.stack.categories[CATEGORY_KEY[category]]}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {grouped[category].map((skill) => (
                      <li key={skill.id}>
                        <Pill level={skill.level} levelLabel={dict.levels[skill.level]}>
                          {localize(skill.name, locale)}
                        </Pill>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="chapters" aria-labelledby="chapters-title" className="py-20 sm:py-28">
          <Container>
            <SectionLabel index="02" as="h2" id="chapters-title">
              {dict.projectsPage.chaptersLabel}
            </SectionLabel>
            <ol className="mt-10 grid gap-12">
              {projects.map((project) => (
                <li key={project.id} data-project={project.id} className="max-w-3xl">
                  <h3 className="text-3xl font-normal tracking-[-0.03em] text-ink sm:text-4xl">{project.name}</h3>
                  <p className="mt-2 text-ink-dim">{localize(project.tagline, locale)}</p>
                  <p className="mt-4 leading-relaxed text-pretty text-ink-dim">{localize(project.description, locale)}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <ProjectsOutro locale={locale} dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
