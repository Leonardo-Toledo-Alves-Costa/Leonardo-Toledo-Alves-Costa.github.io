import { expect, test } from "vitest";
import { isLocale } from "@/i18n/config";
import { pickLocale } from "@/i18n/pick-locale";

test.each([
  [["pt-BR"], "pt"],
  [["en-US"], "en"],
  [["en"], "en"],
  [["es-ES"], "pt"],
  [["pt-PT"], "pt"],
  [[], "pt"],
  [["es", "en-GB"], "en"],
  [["EN-us"], "en"],
])("%j → %s", (langs, expected) => {
  expect(pickLocale(langs)).toBe(expected);
});

test("isLocale aceita só os idiomas suportados", () => {
  expect(isLocale("pt")).toBe(true);
  expect(isLocale("en")).toBe(true);
  expect(isLocale("es")).toBe(false);
  expect(isLocale("PT")).toBe(false);
});
