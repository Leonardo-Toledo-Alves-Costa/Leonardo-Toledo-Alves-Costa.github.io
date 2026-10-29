import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

// Export estático: gerado no build.
export const dynamic = "force-static";

/** Só as páginas públicas (a /design-system é noindex e fica de fora). */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/`,
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1 : 0.9,
    alternates: { languages: { "pt-BR": `${SITE_URL}/pt/`, en: `${SITE_URL}/en/`, "x-default": `${SITE_URL}/pt/` } },
  }));
}
