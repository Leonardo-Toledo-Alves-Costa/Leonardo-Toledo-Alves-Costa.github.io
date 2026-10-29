import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { profile } from "@/content/profile";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const url = `/${locale}/`;
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": "/pt/", en: "/en/", "x-default": "/pt/" },
    },
    // Como o link aparece no LinkedIn, WhatsApp e X.
    openGraph: {
      type: "website",
      url,
      siteName: profile.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt" ? "en_US" : "pt_BR",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: dict.share.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description, images: [{ url: "/og.png", alt: dict.share.ogAlt }] },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={htmlLang[locale]} className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Marca que há JavaScript antes de pintar: efeitos que escondem texto só agem com JS (sem JS, tudo visível). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
