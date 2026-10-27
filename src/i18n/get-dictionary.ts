import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";

/** Mesma forma do dicionário PT, com todas as folhas como string: falta de tradução vira erro de compilação. */
type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]> };
export type Dictionary = DeepStringify<typeof pt>;

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
