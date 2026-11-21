import { cn } from "@/lib/cn";
import { splitEmphasis } from "@/lib/emphasis";
import { Emphasis } from "./Emphasis";

type SerifStatementProps = {
  /** Texto com marcação `{{apagado}}` (spec §4.2). */
  text: string;
  as?: "h2" | "p";
  id?: string;
  className?: string;
  /** Palavras entram uma a uma (só com JS; a animação vem de `[data-js] [data-word]` no CSS). */
  words?: boolean;
};

/** Atraso entre uma palavra e a seguinte, em ms. */
const WORD_STEP = 90;

/** Frase dos grandes momentos (F1–F5): Instrument Serif em pé, grande, com contexto apagado. */
export function SerifStatement({ text, as: Tag = "p", id, className, words = false }: SerifStatementProps) {
  let n = 0;
  return (
    <Tag
      id={id}
      data-statement=""
      className={cn("font-serif text-[clamp(36px,5vw,72px)] leading-[1.05] font-normal tracking-normal text-balance", className)}
    >
      {words
        ? splitEmphasis(text).map((seg, i) => (
            <span key={i} data-emphasis={seg.dim ? "dim" : "lit"} className={seg.dim ? "text-ink-dim" : "text-ink"}>
              {/* Mantém os espaços como texto entre as palavras (quebra de linha e leitura normais). */}
              {seg.text.split(/(\s+)/).map((part, j) =>
                part.trim() === "" ? (
                  part
                ) : (
                  <span key={j} data-word="" className="inline-block" style={{ animationDelay: `${n++ * WORD_STEP}ms` }}>
                    {part}
                  </span>
                ),
              )}
            </span>
          ))
        : <Emphasis text={text} />}
    </Tag>
  );
}
