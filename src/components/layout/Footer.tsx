import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/get-dictionary";

const REPO = "https://github.com/Leonardo-Toledo-Alves-Costa/Leonardo-Toledo-Alves-Costa.github.io";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-text-2">
        <p>© {new Date().getFullYear()} Leonardo Tolêdo · {dict.footer.made}</p>
        <a href={REPO} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center hover:text-text">
          {dict.footer.code}
        </a>
      </Container>
    </footer>
  );
}
