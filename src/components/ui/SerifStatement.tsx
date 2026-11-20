import { cn } from "@/lib/cn";
import { Emphasis } from "./Emphasis";

type SerifStatementProps = {
  /** Texto com marcação `{{apagado}}` (spec §4.2). */
  text: string;
  as?: "h2" | "p";
  id?: string;
  className?: string;
};

/** Frase dos grandes momentos (F1–F5): Instrument Serif em pé, grande, com contexto apagado. */
export function SerifStatement({ text, as: Tag = "p", id, className }: SerifStatementProps) {
  return (
    <Tag
      id={id}
      data-statement=""
      className={cn("font-serif text-[clamp(36px,5vw,72px)] leading-[1.05] font-normal tracking-normal text-balance", className)}
    >
      <Emphasis text={text} />
    </Tag>
  );
}
