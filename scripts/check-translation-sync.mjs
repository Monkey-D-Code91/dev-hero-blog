/**
 * Rilevatore di disallineamento tra le coppie IT/EN di The First Draft.
 *
 * Il preflight verifica che il gemello *esista* e che i conteggi dichiarati nel
 * frontmatter siano simmetrici. Questo script risponde a un'altra domanda: le due
 * lingue sono ancora *la stessa cosa*, o una delle due e' stata modificata da sola
 * dopo l'ultimo allineamento?
 *
 * Due segnali indipendenti, per non fidarsi di uno solo:
 *
 *   1. GIT — il "punto di sync" e' il commit piu' recente che ha toccato entrambi i
 *      file della coppia. Cio' che e' successo a un solo lato dopo quel commit e' il
 *      disallineamento da propagare. Le modifiche non ancora committate nel working
 *      tree contano allo stesso modo: sono il caso piu' frequente (hai appena
 *      ritoccato l'italiano e non hai toccato l'inglese).
 *   2. STRUTTURA — confronto della forma dei due file (heading, blocchi, code fence,
 *      link, immagini, chiavi e voci di lista nel frontmatter), che non dipende da
 *      git e intercetta il caso in cui la storia mente: un commit che tocca entrambi
 *      i file per ragioni non correlate azzera il segnale git ma non questo.
 *
 * Collection coperte: blog (translationKey), authors (authorKey), roadmap (arcKey).
 *
 * Uso:
 *   node scripts/check-translation-sync.mjs                       # tutte le coppie
 *   node scripts/check-translation-sync.mjs src/content/blog/it/x.md   # solo quella coppia
 *   node scripts/check-translation-sync.mjs --json                 # output per la skill sync-translation
 *   node scripts/check-translation-sync.mjs --strict               # exit 1 se c'e' drift (non usato in CI)
 *
 * Exit code: 0 sempre, salvo `--strict` o un errore di esecuzione. In CI e' un
 * warning informativo: il drift e' una decisione editoriale, non un errore di build.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Le tre collection bilingui e il campo che accoppia le due lingue. */
const COLLECTIONS = [
  { name: "blog", dir: join(ROOT, "src", "content", "blog"), keyField: "translationKey" },
  { name: "authors", dir: join(ROOT, "src", "content", "authors"), keyField: "authorKey" },
  { name: "roadmap", dir: join(ROOT, "src", "content", "roadmap"), keyField: "arcKey" },
];

const LANGS = ["it", "en"];

// ---------------------------------------------------------------------------
// Git
// ---------------------------------------------------------------------------

/** Esegue git catturando stdout. Ritorna null invece di lanciare se il comando fallisce. */
function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Stato dell'ambiente git. Fuori da un repo, o in un clone shallow (la CI di
 * default fa `fetch-depth: 1`), la storia non e' interrogabile: lo dichiariamo
 * invece di produrre un "tutto a posto" che non abbiamo verificato.
 */
function gitEnvironment() {
  if (git(["rev-parse", "--git-dir"]) === null) {
    return { available: false, shallow: false, reason: "non siamo dentro un repository git" };
  }
  if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
    return {
      available: false,
      shallow: true,
      reason: "il clone e' shallow: la storia non e' completa (in CI serve fetch-depth: 0)",
    };
  }
  return { available: true, shallow: false, reason: null };
}

/** Separatore di campo nel format di git log: un carattere che non compare nei messaggi. */
const SEP = "\x1f";

/**
 * Storia dei commit che hanno toccato un file, dal piu' recente. `--follow` segue
 * i rename: gli slug IT/EN sono diversi e cambiano, i file si spostano.
 */
function commitsFor(relPath) {
  const out = git(["log", "--follow", `--format=%H${SEP}%cI${SEP}%s`, "--", relPath]);
  if (!out) return [];
  return out.split("\n").filter(Boolean).map((line) => {
    const [hash, date, subject] = line.split(SEP);
    return { hash, date, subject };
  });
}

/** true se il file ha modifiche non committate (o non e' tracciato). */
function hasWorktreeChanges(relPath) {
  const out = git(["status", "--porcelain", "--", relPath]);
  return Boolean(out);
}

/**
 * Commit piu' recente che ha toccato entrambi i file: l'ultimo momento in cui le
 * due lingue sono state pensate insieme. Null se non e' mai successo.
 */
export function findSyncPoint(commitsA, commitsB) {
  const inB = new Set(commitsB.map((c) => c.hash));
  return commitsA.find((c) => inB.has(c.hash)) ?? null;
}

/** Commit su `relPath` successivi al punto di sync (escluso). */
function commitsSince(relPath, syncHash) {
  const out = git(["log", "--follow", `--format=%H${SEP}%cI${SEP}%s`, `${syncHash}..HEAD`, "--", relPath]);
  if (!out) return [];
  return out.split("\n").filter(Boolean).map((line) => {
    const [hash, date, subject] = line.split(SEP);
    return { hash, date, subject };
  });
}

// ---------------------------------------------------------------------------
// Lettura dei contenuti
// ---------------------------------------------------------------------------

/** Frontmatter + body. Sottoinsieme YAML usato dai contenuti del repo, come negli altri script. */
function parseFile(absPath) {
  const md = readFileSync(absPath, "utf-8");
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: {}, rawFm: "", body: md };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { fm, rawFm: m[1], body: md.slice(m[0].length) };
}

/** Tutti i file di una collection per lingua, con chiave di accoppiamento. */
function collectionFiles(collection, lang) {
  const dir = join(collection.dir, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => {
      const absPath = join(dir, f);
      const parsed = parseFile(absPath);
      return {
        absPath,
        relPath: relative(ROOT, absPath),
        lang,
        slug: f.replace(/\.(md|mdx)$/, ""),
        key: parsed.fm[collection.keyField] ?? null,
        ...parsed,
      };
    });
}

// ---------------------------------------------------------------------------
// Confronto strutturale (indipendente da git)
// ---------------------------------------------------------------------------

/**
 * Impronta della forma di un file. Non misura la lunghezza del testo (IT ed EN
 * hanno naturalmente lunghezze diverse) ma il numero di elementi strutturali, che
 * una traduzione fedele conserva.
 */
export function shape(file) {
  const body = file.body.replace(/```[\s\S]*?```/g, " CODE ");
  return {
    headings: (body.match(/^#{1,6}\s+\S/gm) ?? []).length,
    paragraphs: body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).length,
    codeFences: (file.body.match(/^```/gm) ?? []).length / 2,
    images: (body.match(/!\[[^\]]*\]\([^)]*\)/g) ?? []).length,
    links: (body.match(/(?<!!)\[[^\]]*\]\([^)]*\)/g) ?? []).length,
    listItems: (body.match(/^\s*[-*]\s+\S/gm) ?? []).length,
    blockquotes: (body.match(/^>\s/gm) ?? []).length,
    fmKeys: Object.keys(file.fm).sort().join(","),
    fmListItems: (file.rawFm.match(/^\s*-\s+\S/gm) ?? []).length,
  };
}

/** Etichette leggibili dei campi dell'impronta. */
const SHAPE_LABELS = {
  headings: "heading",
  paragraphs: "blocchi di testo",
  codeFences: "blocchi di codice",
  images: "immagini",
  links: "link",
  listItems: "voci di lista nel corpo",
  blockquotes: "citazioni",
  fmKeys: "chiavi del frontmatter",
  fmListItems: "voci di lista nel frontmatter",
};

/**
 * Differenze strutturali tra i due file. `paragraphs` tollera uno scarto di 1:
 * una traduzione idiomatica puo' legittimamente unire o dividere un blocco.
 */
export function structuralDiff(it, en) {
  const a = shape(it);
  const b = shape(en);
  const out = [];
  for (const field of Object.keys(SHAPE_LABELS)) {
    if (a[field] === b[field]) continue;
    if (field === "paragraphs" && Math.abs(a[field] - b[field]) <= 1) continue;
    out.push({
      field,
      label: SHAPE_LABELS[field],
      it: a[field],
      en: b[field],
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Analisi di una coppia
// ---------------------------------------------------------------------------

/**
 * Stati possibili:
 *   ok            le due lingue sono allineate per quanto e' verificabile
 *   stale-en      l'italiano e' cambiato da solo: da propagare in inglese
 *   stale-it      l'inglese e' cambiato da solo: da propagare in italiano
 *   both-changed  entrambe cambiate dopo il punto di sync: serve un occhio umano
 *   no-sync-point le due lingue non sono mai state committate insieme
 *   unpaired      manca il gemello
 *   unknown       git non interrogabile (clone shallow o fuori repo)
 */
function analysePair({ collection, key, it, en, gitEnv }) {
  const base = { collection: collection.name, key, it: it?.relPath ?? null, en: en?.relPath ?? null };

  if (!it || !en) {
    return { ...base, state: "unpaired", missing: it ? "en" : "it", structural: [] };
  }

  const structural = structuralDiff(it, en);

  if (!gitEnv.available) {
    return { ...base, state: "unknown", reason: gitEnv.reason, structural };
  }

  const itCommits = commitsFor(it.relPath);
  const enCommits = commitsFor(en.relPath);
  const worktree = { it: hasWorktreeChanges(it.relPath), en: hasWorktreeChanges(en.relPath) };
  const syncPoint = findSyncPoint(itCommits, enCommits);

  if (!syncPoint) {
    return {
      ...base,
      state: itCommits.length && enCommits.length ? "no-sync-point" : "ok",
      syncPoint: null,
      worktree,
      itCommitsSince: [],
      enCommitsSince: [],
      structural,
    };
  }

  const itSince = commitsSince(it.relPath, syncPoint.hash);
  const enSince = commitsSince(en.relPath, syncPoint.hash);
  const itMoved = itSince.length > 0 || worktree.it;
  const enMoved = enSince.length > 0 || worktree.en;

  let state = "ok";
  if (itMoved && enMoved) state = "both-changed";
  else if (itMoved) state = "stale-en";
  else if (enMoved) state = "stale-it";

  return {
    ...base,
    state,
    syncPoint,
    worktree,
    itCommitsSince: itSince,
    enCommitsSince: enSince,
    structural,
  };
}

/**
 * Comandi per vedere esattamente cosa e' cambiato dal punto di sync in poi.
 * `git diff <commit> -- <file>` confronta con il working tree, quindi include
 * anche le modifiche non ancora committate: e' il caso piu' frequente.
 */
function diffCommands(pair) {
  if (!pair.syncPoint) return [];
  const sides =
    pair.state === "stale-it" ? ["en"] : pair.state === "both-changed" ? ["it", "en"] : ["it"];
  return sides
    .filter((lang) => pair[lang])
    .map((lang) => ({ lang, command: `git diff ${pair.syncPoint.hash} -- ${pair[lang]}` }));
}

// ---------------------------------------------------------------------------
// Esecuzione
// ---------------------------------------------------------------------------

function buildPairs(filterRelPath) {
  const gitEnv = gitEnvironment();
  const pairs = [];

  for (const collection of COLLECTIONS) {
    const byKey = new Map();
    for (const lang of LANGS) {
      for (const file of collectionFiles(collection, lang)) {
        // Senza chiave di accoppiamento non c'e' coppia da valutare: e' un errore
        // di frontmatter che appartiene al preflight, non a questo script.
        const key = file.key ?? `(senza ${collection.keyField}) ${file.lang}/${file.slug}`;
        const entry = byKey.get(key) ?? {};
        entry[lang] = file;
        byKey.set(key, entry);
      }
    }
    for (const [key, { it, en }] of byKey) {
      if (filterRelPath && ![it?.relPath, en?.relPath].includes(filterRelPath)) continue;
      pairs.push(analysePair({ collection, key, it, en, gitEnv }));
    }
  }

  return { gitEnv, pairs };
}

const NEEDS_ATTENTION = new Set(["stale-en", "stale-it", "both-changed", "no-sync-point"]);

const STATE_LABEL = {
  "stale-en": "EN da aggiornare (l'italiano e' cambiato da solo)",
  "stale-it": "IT da aggiornare (l'inglese e' cambiato da solo)",
  "both-changed": "entrambe le lingue cambiate dopo l'ultimo allineamento",
  "no-sync-point": "mai committate insieme: allineamento mai verificato",
  unpaired: "gemello mancante",
  unknown: "non verificabile",
};

function report({ gitEnv, pairs }) {
  console.log("\nAllineamento delle coppie IT/EN\n");

  if (!gitEnv.available) {
    console.log(`  ⚠ storia git non interrogabile: ${gitEnv.reason}`);
    console.log("    Resta valido il solo confronto strutturale.\n");
  }

  const attention = pairs.filter((p) => NEEDS_ATTENTION.has(p.state));
  const structuralOnly = pairs.filter(
    (p) => !NEEDS_ATTENTION.has(p.state) && p.structural.length > 0
  );
  const unpaired = pairs.filter((p) => p.state === "unpaired");
  const unknown = pairs.filter((p) => p.state === "unknown");

  for (const pair of attention) {
    console.log(`  ⚠ [${pair.collection}] ${pair.key}`);
    console.log(`      ${STATE_LABEL[pair.state]}`);
    if (pair.syncPoint) {
      console.log(
        `      ultimo allineamento: ${pair.syncPoint.hash.slice(0, 7)} (${pair.syncPoint.date.slice(0, 10)}) ${pair.syncPoint.subject}`
      );
    }
    for (const lang of LANGS) {
      const since = lang === "it" ? pair.itCommitsSince : pair.enCommitsSince;
      for (const c of since) {
        console.log(`      ${lang.toUpperCase()} ${c.hash.slice(0, 7)} ${c.date.slice(0, 10)} ${c.subject}`);
      }
      if (pair.worktree?.[lang]) {
        console.log(`      ${lang.toUpperCase()} modifiche non committate nel working tree`);
      }
    }
    for (const d of pair.structural) {
      console.log(`      struttura: ${d.label} IT=${d.it} EN=${d.en}`);
    }
    for (const { lang, command } of diffCommands(pair)) {
      console.log(`      cosa e' cambiato in ${lang.toUpperCase()}: ${command}`);
    }
    console.log("");
  }

  for (const pair of structuralOnly) {
    console.log(`  ⚠ [${pair.collection}] ${pair.key}`);
    console.log(
      pair.state === "unknown"
        ? "      git non interrogabile; la struttura diverge:"
        : "      git dice allineate, ma la struttura diverge:"
    );
    for (const d of pair.structural) {
      console.log(`      ${d.label}: IT=${d.it} EN=${d.en}`);
    }
    console.log("");
  }

  for (const pair of unpaired) {
    console.log(`  ✖ [${pair.collection}] ${pair.key}: manca la versione ${pair.missing.toUpperCase()}`);
  }
  if (unpaired.length) console.log("");

  const total = pairs.length;
  const flagged = attention.length + structuralOnly.length + unpaired.length;
  if (flagged === 0) {
    const suffix = unknown.length ? " (per quanto verificabile senza storia git)" : "";
    const frase = total === 1 ? "1 coppia allineata" : `${total} coppie allineate`;
    console.log(`  ✓ ${frase}${suffix}\n`);
  } else {
    const frase = flagged === 1 ? "1 coppia" : `${flagged} coppie`;
    console.log(`  ${frase} su ${total} da guardare. Skill: sync-translation.\n`);
  }

  return flagged;
}

// --- main -------------------------------------------------------------------
// Il blocco sotto gira solo su invocazione diretta: importato da un test, il
// modulo espone le funzioni pure senza eseguire niente.

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const strict = args.includes("--strict");
  const pathArg = args.find((a) => !a.startsWith("--"));

  let filterRelPath = null;
  if (pathArg) {
    const abs = resolve(process.cwd(), pathArg);
    if (!existsSync(abs)) {
      console.error(`File non trovato: ${pathArg}`);
      process.exit(1);
    }
    filterRelPath = relative(ROOT, abs);
  }

  const result = buildPairs(filterRelPath);

  if (filterRelPath && result.pairs.length === 0) {
    console.error(`Nessuna coppia trovata per ${pathArg}: non e' un contenuto di una collection bilingue.`);
    process.exit(1);
  }

  let flagged;
  if (asJson) {
    const payload = {
      generatedAt: new Date().toISOString(),
      git: result.gitEnv,
      pairs: result.pairs.map((p) => ({ ...p, diffCommands: diffCommands(p) })),
    };
    flagged = result.pairs.filter(
      (p) => NEEDS_ATTENTION.has(p.state) || p.state === "unpaired" || p.structural.length > 0
    ).length;
    console.log(JSON.stringify(payload, null, 2));
  } else {
    flagged = report(result);
  }

  process.exit(strict && flagged > 0 ? 1 : 0);
}
