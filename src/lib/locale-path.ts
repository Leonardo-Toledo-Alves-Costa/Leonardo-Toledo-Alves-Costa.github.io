import { isLocale, type Locale } from "@/i18n/config";

/**
 * O mesmo caminho no outro idioma: "/pt/projetos/" → "/en/projetos/".
 * Sem idioma reconhecido no começo, vai para a home do destino. Sempre com barra final (como o Pages serve).
 */
export function localizedPath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const rest = parts[0] && isLocale(parts[0]) ? parts.slice(1) : [];
  return `/${[target, ...rest].join("/")}/`;
}
