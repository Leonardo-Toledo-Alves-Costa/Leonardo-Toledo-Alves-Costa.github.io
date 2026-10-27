import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

// Provisório: as seções entram na Fase 3.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main>
      <h1>Leonardo Tolêdo</h1>
    </main>
  );
}
