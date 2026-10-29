import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <main className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-4 sm:px-6">
          <div aria-hidden className="pcb-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_45%,#000_15%,transparent_70%)]" />
          {/* Bloco estreito e centralizado: o "404" fica sobre os dois idiomas, não só sobre o português. */}
          <div className="mx-auto w-full max-w-3xl">
            <p className="silkscreen text-signal">&gt; route --resolve · exit 404</p>
            <h1 className="mt-4 text-[clamp(64px,14vw,160px)] font-bold leading-none tracking-[-0.045em]">404</h1>
            <div className="mt-10 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-8">
              <section lang="pt-BR">
                <h2 className="text-2xl font-semibold">{pt.notFound.title}</h2>
                <p className="mt-2 text-text-2">{pt.notFound.body}</p>
                <Button href="/pt/" className="mt-6">
                  {pt.notFound.back}
                </Button>
              </section>
              <section lang="en">
                <h2 className="text-2xl font-semibold">{en.notFound.title}</h2>
                <p className="mt-2 text-text-2">{en.notFound.body}</p>
                <Button href="/en/" variant="glass" className="mt-6">
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
