/**
 * Preflight editoriale di un articolo di The First Draft: verifica in modo
 * deterministico le regole di docs/editorial-guidelines.md e la coerenza
 * strutturale IT/EN prima di rifinire o pubblicare.
 *
 * Uso:
 *   node scripts/preflight-article.mjs src/content/blog/it/<slug>.md   # articolo + gemello
 *   node scripts/preflight-article.mjs --all                           # tutto il blog
 *
 * Controlli (E = errore, blocca; W = warning, segnala):
 *   E  frontmatter: title, description, pubDate, translationKey, authors presenti
 *   E  niente trattini lunghi (—) nel file
 *   E  slug del filename in kebab-case ASCII
 *   E  gemello nell'altra lingua con lo stesso translationKey
 *   E  pubDate e draft identici tra IT ed EN
 *   E  cover dichiarata ma file mancante, o cover senza coverAlt
 *   E  authors non presenti nella collection authors
 *   W  cover assente (ok in bozza, da generare prima di pubblicare)
 *   W  filename EN diverso dal translationKey
 *   W  description fuori range (SEO: indicativamente 50-250 caratteri)
 *   W  tags assenti
 *   W  possibili nomi di persona nel corpo (euristica; consentiti solo gli autori)
 *
 * Exit code: 0 se nessun errore (i warning non bloccano), 1 altrimenti.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, basename, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG = join(ROOT, "src", "content", "blog");
const AUTHORS_DIR = join(ROOT, "src", "content", "authors", "it");

// Bigrammi maiuscoli legittimi che l'euristica sui nomi non deve segnalare.
// Aggiungere qui i falsi positivi ricorrenti (titoli, brand, luoghi, opere).
const NAME_WHITELIST = new Set([
  "The First", "First Draft", "Product Owner", "Tech Lead", "Pull Request",
  "Code Review", "Visual Studio", "Stack Overflow", "New York",
]);
// Parole che a inizio frase generano bigrammi maiuscoli senza essere nomi.
const NAME_STOPWORDS = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "uno", "una", "nel", "nella",
  "del", "della", "dei", "al", "alla", "con", "per", "tra", "fra", "se",
  "ma", "e", "o", "non", "come", "quando", "dove", "chi", "cosa", "che",
  "questo", "questa", "poi", "ogni", "anche", "the", "a", "an", "in", "on",
  "at", "and", "or", "but", "if", "when", "where", "who", "what", "how",
  "this", "that", "then", "every", "not", "as", "so", "my", "our", "your",
]);

// ---------------------------------------------------------------------------
// Parsing frontmatter (sottoinsieme YAML usato dagli articoli del repo)
// ---------------------------------------------------------------------------

function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    let value = raw.replace(/\s+#.*$/, "").trim();
    if (value.startsWith("[")) {
      try { value = JSON.parse(value.replace(/'/g, '"')); } catch { /* lascia stringa */ }
    } else if (/^"(.*)"$/.test(value)) {
      value = value.replace(/^"(.*)"$/, "$1");
    }
    fm[key] = value;
  }
  return { fm, body: md.slice(m[0].length), rawFm: m[1] };
}

// ---------------------------------------------------------------------------
// Raccolta articoli e autori
// ---------------------------------------------------------------------------

function listArticles(lang) {
  const dir = join(BLOG, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => join(dir, f));
}

function loadArticle(path) {
  const md = readFileSync(path, "utf-8");
  const parsed = parseFrontmatter(md);
  const lang = /[\\/]it[\\/][^\\/]+$/.test(path) ? "it" : "en";
  return { path, lang, md, ...(parsed ?? { fm: null, body: md, rawFm: "" }) };
}

function knownAuthorKeys() {
  if (!existsSync(AUTHORS_DIR)) return new Set();
  return new Set(readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));
}

function authorNames() {
  const names = new Set();
  if (!existsSync(AUTHORS_DIR)) return names;
  for (const f of readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".md"))) {
    const md = readFileSync(join(AUTHORS_DIR, f), "utf-8");
    const m = md.match(/^name:\s*"?([^"\n]+)"?\s*$/m);
    if (m) names.add(m[1].trim());
  }
  return names;
}

// ---------------------------------------------------------------------------
// Controlli
// ---------------------------------------------------------------------------

function checkArticle(article, twin, authors, names, out) {
  const { path, lang, md, fm, body } = article;
  const rel = path.replace(`${ROOT}/`, "");
  const push = (level, msg) => out.push({ level, file: rel, msg });

  if (!fm) { push("E", "frontmatter assente o malformato"); return; }

  // Campi obbligatori (schema: src/content.config.ts)
  for (const k of ["title", "description", "pubDate", "translationKey"]) {
    if (!fm[k]) push("E", `campo obbligatorio mancante nel frontmatter: ${k}`);
  }
  const arts = Array.isArray(fm.authors) ? fm.authors : fm.author ? [fm.author] : [];
  if (arts.length === 0) push("E", "nessun autore (campo authors)");
  for (const a of arts) {
    if (authors.size && !authors.has(a)) push("E", `authorKey sconosciuto: "${a}" (non in src/content/authors/it/)`);
  }

  // Trattini lunghi (regola editoriale: mai, in nessun file)
  md.split(/\r?\n/).forEach((line, i) => {
    if (line.includes("—")) push("E", `trattino lungo (—) alla riga ${i + 1}`);
  });

  // Slug del filename
  const slug = basename(path).replace(/\.(md|mdx)$/, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) push("E", `slug non kebab-case ASCII: "${slug}"`);
  if (lang === "en" && fm.translationKey && slug !== fm.translationKey) {
    push("W", `per convenzione il filename EN coincide col translationKey ("${fm.translationKey}")`);
  }

  // Gemello IT/EN
  if (!twin) {
    push("E", `nessun gemello ${lang === "it" ? "EN" : "IT"} con translationKey "${fm.translationKey}"`);
  } else {
    const t = twin.fm ?? {};
    if (String(t.pubDate) !== String(fm.pubDate)) push("E", `pubDate diversa dal gemello (${fm.pubDate} vs ${t.pubDate})`);
    const draft = (v) => String(v ?? "false");
    if (draft(t.draft) !== draft(fm.draft)) push("E", `stato draft diverso dal gemello (${draft(fm.draft)} vs ${draft(t.draft)})`);
  }

  // Cover
  if (fm.cover) {
    const coverPath = resolve(dirname(path), fm.cover);
    if (!existsSync(coverPath)) push("E", `cover dichiarata ma file mancante: ${fm.cover}`);
    if (!fm.coverAlt) push("E", "cover presente ma coverAlt mancante (accessibilità)");
  } else {
    push("W", "cover assente: generarla con scripts/generate-cover.mjs prima di pubblicare");
  }

  // Description (meta/SEO)
  if (fm.description) {
    const len = fm.description.length;
    if (len < 50 || len > 250) push("W", `description di ${len} caratteri (indicativo: 50-250)`);
  }

  // Tags
  if (!Array.isArray(fm.tags) || fm.tags.length === 0) push("W", "nessun tag");

  // Euristica nomi di persona nel corpo (consentiti solo gli autori)
  const found = new Set();
  const re = /\b([A-Z][a-zà-ú]+) ([A-Z][a-zà-ú]+)\b/g;
  for (const m of body.matchAll(re)) {
    const pair = `${m[1]} ${m[2]}`;
    if (NAME_WHITELIST.has(pair) || names.has(pair)) continue;
    if (NAME_STOPWORDS.has(m[1].toLowerCase())) continue;
    found.add(pair);
  }
  for (const pair of found) {
    push("W", `possibile nome di persona nel corpo: "${pair}" (regola privacy: nomi solo per gli autori; se falso positivo, aggiungerlo alla NAME_WHITELIST dello script)`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Uso: node scripts/preflight-article.mjs <articolo.md> [...] | --all");
  process.exit(1);
}

const all = [...listArticles("it"), ...listArticles("en")].map(loadArticle);
const byKey = new Map();
for (const a of all) {
  if (!a.fm?.translationKey) continue;
  const entry = byKey.get(a.fm.translationKey) ?? {};
  entry[a.lang] = a;
  byKey.set(a.fm.translationKey, entry);
}

let targets;
if (args.includes("--all")) {
  targets = all;
} else {
  targets = [];
  for (const arg of args) {
    const p = resolve(arg);
    if (!existsSync(p)) { console.error(`File non trovato: ${arg}`); process.exit(1); }
    const article = all.find((a) => a.path === p) ?? loadArticle(p);
    targets.push(article);
    // Include automaticamente il gemello, così il controllo è sempre di coppia.
    const twin = byKey.get(article.fm?.translationKey)?.[article.lang === "it" ? "en" : "it"];
    if (twin && !targets.includes(twin) && !args.some((x) => resolve(x) === twin.path)) targets.push(twin);
  }
}

const authors = knownAuthorKeys();
const names = authorNames();
const findings = [];
for (const article of targets) {
  const twin = byKey.get(article.fm?.translationKey)?.[article.lang === "it" ? "en" : "it"];
  checkArticle(article, twin, authors, names, findings);
}

const byFile = new Map();
for (const f of findings) {
  (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)).push(f);
}
for (const article of targets) {
  const rel = article.path.replace(`${ROOT}/`, "");
  const list = byFile.get(rel) ?? [];
  const draft = article.fm?.draft === "true" || article.fm?.draft === true;
  console.log(`\n${rel}${draft ? "  [draft]" : ""}`);
  if (list.length === 0) { console.log("  ✓ ok"); continue; }
  for (const f of list) console.log(`  ${f.level === "E" ? "✖" : "⚠"} ${f.msg}`);
}

const errors = findings.filter((f) => f.level === "E").length;
const warnings = findings.filter((f) => f.level === "W").length;
console.log(`\n${errors} errori, ${warnings} warning su ${targets.length} file.`);
process.exit(errors > 0 ? 1 : 0);
