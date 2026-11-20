export type EmphasisSegment = { text: string; dim: boolean };

const OPEN = "{{";
const CLOSE = "}}";

/**
 * Separa um texto em trechos acesos e apagados (spec §4.2).
 * Marcação: `{{trecho apagado}}`; o resto sai aceso. Sem aninhamento.
 */
export function splitEmphasis(text: string): EmphasisSegment[] {
  const segments: EmphasisSegment[] = [];
  const push = (part: string, dim: boolean) => {
    if (!part) return;
    const last = segments.at(-1);
    if (last && last.dim === dim) last.text += part;
    else segments.push({ text: part, dim });
  };

  let rest = text;
  while (rest) {
    const open = rest.indexOf(OPEN);
    const close = rest.indexOf(CLOSE);
    if (open === -1) {
      if (close !== -1) throw new Error("emphasis: chaves desbalanceadas");
      push(rest, false);
      break;
    }
    if (close !== -1 && close < open) throw new Error("emphasis: chaves desbalanceadas");
    push(rest.slice(0, open), false);
    const inner = rest.slice(open + OPEN.length);
    const end = inner.indexOf(CLOSE);
    if (end === -1 || inner.slice(0, end).includes(OPEN)) throw new Error("emphasis: chaves desbalanceadas");
    push(inner.slice(0, end), true);
    rest = inner.slice(end + CLOSE.length);
  }
  return segments;
}
