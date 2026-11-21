import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

// Export estático: gerado no build.
export const dynamic = "force-static";

/** Só as páginas públicas (a /design-system é noindex e fica de fora). */
export default function sitemap(): MetadataRoute.Sitemap {
  // Cada página nos dois idiomas, com as alternativas de idioma da mesma página.
  return (["", "projetos/"] as const).flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? (locale === "pt" ? 1 : 0.9) : 0.8,
      alternates: {
        languages: { "pt-BR": `${SITE_URL}/pt/${path}`, en: `${SITE_URL}/en/${path}`, "x-default": `${SITE_URL}/pt/${path}` },
      },
    })),
  );
}
