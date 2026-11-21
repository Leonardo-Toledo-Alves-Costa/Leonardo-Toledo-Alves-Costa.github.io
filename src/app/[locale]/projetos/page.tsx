import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav, type NavItem } from "@/components/layout/Nav";
import { type ChapterData, ProjectChapter } from "@/components/projects/ProjectChapter";
import { ProjectsIntro } from "@/components/projects/ProjectsIntro";
import { ProjectsOutro } from "@/components/projects/ProjectsOutro";
import { StackBeats, type StackGroup } from "@/components/projects/StackBeats";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillCategory } from "@/content/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { chapterVisual, localize, projectsBySkill, skillCategories, skillsByCategory } from "@/lib/content";

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
 * Stack em 4 batidas (Task 17); os capítulos dos projetos (Tasks 18–19) substituem a lista simples.
 */
export default async function ProjectsPage({ params }: PageProps<"/[locale]/projetos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const items: NavItem[] = (["about", "timeline", "projects", "contact"] as const).map((id) => ({ id, label: dict.nav[id] }));
  const grouped = skillsByCategory(skills);
  // Dados prontos para a ilha cliente: nome no idioma e nomes dos projetos que usam cada skill.
  const groups: StackGroup[] = skillCategories.map((category) => ({
    category,
    label: dict.stack.categories[CATEGORY_KEY[category]],
    skills: grouped[category].map((skill) => ({
      id: skill.id,
      name: localize(skill.name, locale),
      level: skill.level,
      projects: projectsBySkill(skill.id).map((p) => p.name),
    })),
  }));

  // Capítulos: dados reais do conteúdo; o espaço visual só existe com imagem (diagramas: Task 19).
  const chapters: ChapterData[] = projects.map((project) => {
    const kind = chapterVisual(project, false);
    return {
      id: project.id,
      name: project.name,
      tagline: localize(project.tagline, locale),
      description: localize(project.description, locale),
      role: project.role && localize(project.role, locale),
      award: project.award && localize(project.award, locale),
      skills: project.skills.flatMap((id) => {
        const skill = skills.find((s) => s.id === id);
        return skill ? [{ id, name: localize(skill.name, locale), level: skill.level }] : [];
      }),
      visual:
        kind === "media" && project.media
          ? { kind, src: project.media.src, alt: localize(project.media.alt, locale) }
          : { kind: kind === "diagram" ? ("diagram" as const) : ("none" as const) },
    };
  });

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

        <section id="stack" aria-labelledby="stack-title" className="pt-20 sm:pt-28">
          <Container>
            <SectionLabel index="01" as="h2" id="stack-title">
              {dict.projectsPage.stackLabel}
            </SectionLabel>
          </Container>
          <StackBeats
            groups={groups}
            statement={dict.statements.f5}
            levels={dict.levels}
            legendLabel={dict.stack.legend}
            usedInLabel={dict.stack.usedIn}
            hint={dict.stack.hint}
          />
        </section>

        <section id="chapters" aria-labelledby="chapters-title" className="pt-20 sm:pt-28">
          <Container>
            <SectionLabel index="02" as="h2" id="chapters-title">
              {dict.projectsPage.chaptersLabel}
            </SectionLabel>
          </Container>
          {chapters.map((chapter, i) => (
            <ProjectChapter
              key={chapter.id}
              chapter={chapter}
              index={i}
              total={chapters.length}
              levels={dict.levels}
              labels={{
                role: dict.projectsPage.roleLabel,
                delivery: dict.projectsPage.deliveryLabel,
                award: dict.projectsPage.awardLabel,
                stack: dict.projects.stack,
              }}
            />
          ))}
        </section>

        <ProjectsOutro locale={locale} dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
