import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { Emphasis } from "@/components/ui/Emphasis";
import { splitEmphasis } from "@/lib/emphasis";

test("trecho entre {{ }} sai apagado, o resto aceso", () => {
  expect(splitEmphasis("{{Engenharia de}} Computação.")).toEqual([
    { text: "Engenharia de", dim: true },
    { text: " Computação.", dim: false },
  ]);
});

test("texto sem marcação sai todo aceso", () => {
  expect(splitEmphasis("sem marcação")).toEqual([{ text: "sem marcação", dim: false }]);
});

test("vários trechos apagados intercalados", () => {
  expect(splitEmphasis("a {{b}} c {{d}}")).toEqual([
    { text: "a ", dim: false },
    { text: "b", dim: true },
    { text: " c ", dim: false },
    { text: "d", dim: true },
  ]);
});

test("chaves desbalanceadas ou aninhadas são erro", () => {
  expect(() => splitEmphasis("{{aberto")).toThrow("chaves desbalanceadas");
  expect(() => splitEmphasis("fechado}}")).toThrow("chaves desbalanceadas");
  expect(() => splitEmphasis("{{a {{b}} c}}")).toThrow("chaves desbalanceadas");
});

test("trecho apagado vazio é ignorado", () => {
  expect(splitEmphasis("x{{}}y")).toEqual([{ text: "xy", dim: false }]);
});

test("<Emphasis> renderiza spans apagado/aceso com as classes dos tokens", () => {
  const html = renderToStaticMarkup(createElement(Emphasis, { text: "{{Engenharia de}} Computação." }));
  expect(html).toBe(
    '<span data-emphasis="dim" class="text-ink-dim">Engenharia de</span><span data-emphasis="lit" class="text-ink"> Computação.</span>',
  );
});
