// Trava de release: falha se algum texto ainda "[PENDENTE]" (frases aguardando o autor) chegou ao build.
// Uso: npm run check:release  (gera out/ e roda este script)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MARK = "[PENDENTE]";
const SCANNED = /\.(html|txt|json|xml)$/;

/**
 * Arquivos de texto do build que contêm a marca de pendência.
 * @param {string} dir pasta a varrer (recursivo)
 * @returns {string[]} caminhos com a marca
 */
export function findPending(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return findPending(path);
    return SCANNED.test(name) && readFileSync(path, "utf8").includes(MARK) ? [path] : [];
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
  const found = findPending(out);
  if (found.length > 0) {
    console.error(`Release bloqueado: ${found.length} arquivo(s) com ${MARK} — aprove as frases no dicionário:`);
    for (const f of found) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log("Release ok: nenhum texto pendente no build.");
}
