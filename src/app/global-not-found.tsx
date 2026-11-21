import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orb } from "@/components/motion/Orb";
import { Button } from "@/components/ui/Button";
import { en } from "@/i18n/dictionaries/en";
import { pt } from "@/i18n/dictionaries/pt";
import { THEME_COLOR } from "@/lib/site";
import "@/styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = { themeColor: THEME_COLOR, colorScheme: "dark" };

// O Next já injeta <meta name="robots" content="noindex"> na 404.
export const metadata: Metadata = {
  title: `404 — ${pt.notFound.title} · ${en.notFound.title}`,
};

/** 404 única para qualquer rota inexistente (fora de /pt e /en não há idioma definido: mostra os dois). */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <main className="relative isolate flex min-h-svh flex-col justify-center overflow-x-clip px-4 py-16 sm:px-6">
          {/* Bloco estreito e centralizado: o "404" fica sobre os dois idiomas, não só sobre o português. */}
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            {/* Mini-orbe (só CSS) acima do número, com respiro do halo. */}
            <Orb variant="mini" size="w-16 sm:w-20" />
            <h1 className="mt-14 text-[clamp(64px,14vw,160px)] leading-none font-normal tracking-[-0.05em]">404</h1>
            <div className="mt-12 grid w-full gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-8">
              <section lang="pt-BR">
                <h2 className="text-2xl font-normal tracking-[-0.02em]">{pt.notFound.title}</h2>
                <p className="mt-2 text-ink-dim">{pt.notFound.body}</p>
                <Button href="/pt/" icon="arrow" className="mt-6">
                  {pt.notFound.back}
                </Button>
              </section>
              <section lang="en">
                <h2 className="text-2xl font-normal tracking-[-0.02em]">{en.notFound.title}</h2>
                <p className="mt-2 text-ink-dim">{en.notFound.body}</p>
                <Button href="/en/" variant="ghost" icon="arrow" className="mt-6">
                  {en.notFound.back}
                </Button>
              </section>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
