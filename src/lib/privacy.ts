/**
 * Celular brasileiro (DDD + 9 + 8 dígitos) com ou sem +55, parênteses, espaços, pontos ou hífens.
 * Usado nos testes que garantem que nenhum telefone é publicado (no código, no conteúdo ou no build).
 */
// Fronteiras alfanuméricas evitam falso positivo dentro de hashes e números longos.
export const PHONE = /(?<![0-9A-Za-z])(?:\+?55[\s.-]*)?\(?\d{2}\)?[\s.-]*9[\s.-]*\d{4}[\s.-]*\d{4}(?![0-9A-Za-z])/;

export function findPhones(text: string): string[] {
  return text.match(new RegExp(PHONE.source, "g")) ?? [];
}
