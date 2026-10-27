import type { Metadata } from "next";
import Link from "next/link";
import { LocaleRedirect } from "./LocaleRedirect";

export const metadata: Metadata = {
  title: "Leonardo Tolêdo",
  robots: { index: false },
};

export default function RootPage() {
  return (
    <main>
      <LocaleRedirect />
      {/* Sem JavaScript, o visitante escolhe o idioma. */}
      <noscript>
        <p>
          <Link href="/pt/">Português</Link> · <Link href="/en/">English</Link>
        </p>
      </noscript>
    </main>
  );
}
