/**
 * Guardia sul copy del sito: niente trattini lunghi nel testo che il lettore vede.
 *
 * `CLAUDE.md` §4 vieta il trattino lungo in **tutto** il copy del brand, non nei
 * soli articoli. Ma `preflight-article.mjs` guarda solo i file dei contenuti:
 * `title`, meta description, `og:title` e `aria-label` non li controllava nessuno,
 * ed è esattamente il testo che finisce nei risultati di ricerca e nelle anteprime
 * social, cioè il primo contatto con il brand.
 *
 * Perché sui sorgenti e non su `dist/`: in CI `npm test` gira **prima** di
 * `npm run build`, quindi un controllo su `dist/` leggerebbe una build vecchia o
 * assente. Sui sorgenti il controllo è sempre valido e non dipende dall'ordine
 * degli step.
 *
 * Cosa NON e' una violazione: i **commenti** di codice (JSDoc, riga, blocco, HTML).
 * Li' la regola non si applica, come per i documenti interni del repo.
 * Il controllo li rimuove prima di cercare.
 *
 * Uso:
 *   node scripts/check-copy.mjs            # exit 1 se trova violazioni
 *
 * Il controllo gira anche in `npm test` (tests/copy-guard.test.ts), quindi è
 * bloccante in CI: a differenza di un disallineamento IT/EN, un trattino lungo nel
 * copy non è una decisione editoriale, è una violazione deterministica di una regola.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, join, relative, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

/** Estensioni che possono contenere copy visibile. */
const EXTENSIONS = new Set([".astro", ".ts", ".tsx"]);

/**
 * Cartelle escluse: `src/content` sono i contenuti, già coperti (e con regole
 * proprie) da `preflight-article.mjs`.
 */
const EXCLUDED_DIRS = new Set(["content"]);

/**
 * I caratteri vietati nel copy.
 *
 * Solo l'em dash, che e' la regola dichiarata in `CLAUDE.md` §4 ed e' la firma
 * tipica del testo generato. **Il trattino medio (en dash) non e' qui di proposito**:
 * nei range di date ("Ott 2024 – Oggi") e' la forma tipograficamente corretta, e
 * vietarlo produrrebbe solo falsi positivi. Resta il buco teorico di chi aggira la
 * regola scrivendo – al posto di —: se un giorno capitasse davvero, si aggiunge qui
 * una riga.
 */
export const FORBIDDEN = [{ char: "—", name: "trattino lungo (em dash)" }];

/**
 * Rimuove i commenti, dove la regola non si applica.
 *
 * I commenti di riga vengono rimossi solo se il `//` apre la riga (a parte gli
 * spazi): così non si tocca uno `https://` dentro una stringa, che altrimenti
 * troncherebbe il resto della riga e nasconderebbe violazioni vere.
 * Le sequenze rimosse sono sostituite da spazi per non spostare le colonne.
 */
export function stripComments(source) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank) // /* ... */ e /** ... */
    .replace(/<!--[\s\S]*?-->/g, blank) // <!-- ... -->
    .replace(/^[ \t]*\/\/.*$/gm, blank); // // a inizio riga
}

/**
 * Violazioni in un singolo file. Ritorna riga, colonna, carattere e il contesto,
 * perché un elenco di path non basta a decidere con cosa sostituire.
 */
export function findViolations(relPath, source) {
  const cleaned = stripComments(source);
  const out = [];
  cleaned.split("\n").forEach((line, i) => {
    for (const { char, name } of FORBIDDEN) {
      let from = 0;
      let at = line.indexOf(char, from);
      while (at !== -1) {
        out.push({
          file: relPath,
          line: i + 1,
          column: at + 1,
          char,
          name,
          context: line.trim(),
        });
        from = at + 1;
        at = line.indexOf(char, from);
      }
    }
  });
  return out;
}

/** File candidati sotto src/, esclusi i contenuti. */
export function sourceFiles(dir = SRC, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (EXCLUDED_DIRS.has(entry)) continue;
      sourceFiles(full, acc);
    } else if (EXTENSIONS.has(extname(entry))) {
      acc.push(full);
    }
  }
  return acc;
}

/** Tutte le violazioni del progetto. */
export function checkCopy() {
  return sourceFiles().flatMap((absPath) =>
    findViolations(relative(ROOT, absPath), readFileSync(absPath, "utf-8"))
  );
}

// --- main -------------------------------------------------------------------
// Gira solo su invocazione diretta: importato dal test, il modulo espone le
// funzioni pure senza eseguire niente.

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const violations = checkCopy();

  console.log("\nCopy del sito: trattini lunghi\n");

  if (violations.length === 0) {
    console.log("  ✓ nessun trattino lungo nel copy dei sorgenti\n");
    process.exit(0);
  }

  let current = null;
  for (const v of violations) {
    if (v.file !== current) {
      current = v.file;
      console.log(`  ✖ ${v.file}`);
    }
    console.log(`      ${v.line}:${v.column}  ${v.name}`);
    console.log(`      ${v.context}`);
  }

  const files = new Set(violations.map((v) => v.file)).size;
  console.log(
    `\n  ${violations.length} occorrenze in ${files} file. Sostituisci con due punti, virgole, parentesi o punti.\n`
  );
  process.exit(1);
}
