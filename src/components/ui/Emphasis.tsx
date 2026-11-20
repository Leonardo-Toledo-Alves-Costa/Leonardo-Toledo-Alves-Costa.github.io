import { splitEmphasis } from "@/lib/emphasis";

/** Renderiza texto com trechos `{{apagados}}` em ink-dim e o resto aceso em ink (spec §4.2). */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {splitEmphasis(text).map((seg, i) => (
        <span key={i} data-emphasis={seg.dim ? "dim" : "lit"} className={seg.dim ? "text-ink-dim" : "text-ink"}>
          {seg.text}
        </span>
      ))}
    </>
  );
}
