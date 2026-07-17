/**
 * Stato della pipeline editoriale di The First Draft, calcolato dai file:
 * articoli IT/EN (coppie per translationKey, draft, cover, PDF di feedback,
 * carousel) e coerenza con la collection roadmap (src/content/roadmap).
 *
 * Uso:
 *   node scripts/status.mjs
 *
 * Sola lettura: non modifica nulla. Sostituisce il "dove eravamo rimasti"
 * a memoria: HANDOFF.md resta per le decisioni, questo per i fatti.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG = join(ROOT, "src", "content", "blog");
const ROADMAP = join(ROOT, "src", "content", "roadmap");

function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return fm;
}

function articles(lang) {
  const dir = join(BLOG, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => {
      const path = join(dir, f);
      const fm = parseFrontmatter(readFileSync(path, "utf-8"));
      return { path, lang, slug: f.replace(/\.(md|mdx)$/, ""), fm };
    });
}

// Coppie IT/EN per translationKey
const byKey = new Map();
for (const a of [...articles("it"), ...articles("en")]) {
  const key = a.fm.translationKey ?? `(no-key) ${a.slug}`;
  const e = byKey.get(key) ?? {};
  e[a.lang] = a;
  byKey.set(key, e);
}

const flag = (ok) => (ok ? "✓" : "·");
const isDraft = (a) => a?.fm.draft === "true";

console.log("Articoli (per translationKey)\n");
console.log("  stato  data        IT EN cover PDF car.  translationKey");
const rows = [...byKey.entries()].sort((a, b) =>
  String((a[1].it ?? a[1].en)?.fm.pubDate).localeCompare(String((b[1].it ?? b[1].en)?.fm.pubDate))
);
for (const [key, { it, en }] of rows) {
  const ref = it ?? en;
  const draft = isDraft(it) || isDraft(en);
  const covers =
    (it?.fm.cover ? existsSync(resolve(dirname(it.path), it.fm.cover)) : false) &&
    (en?.fm.cover ? existsSync(resolve(dirname(en.path), en.fm.cover)) : false);
  const pdf =
    existsSync(join(ROOT, "feedback")) &&
    it &&
    readdirSync(join(ROOT, "feedback")).some(
      (f) => f.toLowerCase() === `${it.slug.toLowerCase()}.pdf`
    );
  const carousel = [it?.slug, en?.slug].some(
    (s) => s && existsSync(join(ROOT, "carousels", s))
  );
  const state = !it || !en ? "SOLO " + (it ? "IT" : "EN") : draft ? "draft" : "pubbl";
  console.log(
    `  ${state.padEnd(6)} ${String(ref.fm.pubDate).padEnd(11)} ${flag(!!it)}  ${flag(!!en)}  ${flag(covers)}     ${flag(pdf)}   ${flag(carousel)}    ${key}`
  );
}

// Roadmap collection: incroci con gli articoli
console.log("\nRoadmap (collection) vs articoli\n");
let issues = 0;
for (const lang of ["it", "en"]) {
  const dir = join(ROADMAP, lang);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(dir, f), "utf-8");
    for (const m of raw.matchAll(/postTranslationKey:\s*"?([\w-]+)"?[\s\S]*?status:\s*"?([\w-]+)"?/g)) {
      const [, key, status] = m;
      const pair = byKey.get(key);
      const rel = `roadmap/${lang}/${f}`;
      if (!pair) {
        console.log(`  ✖ ${rel}: postTranslationKey "${key}" senza articolo`);
        issues++;
      } else if (status === "published" && (isDraft(pair.it) || isDraft(pair.en))) {
        console.log(`  ✖ ${rel}: "${key}" è published in roadmap ma draft nel blog`);
        issues++;
      }
    }
  }
}
// Articoli pubblicati non ancora agganciati come postTranslationKey
const roadmapRaw = ["it", "en"]
  .map((l) => join(ROADMAP, l))
  .filter(existsSync)
  .flatMap((d) => readdirSync(d).map((f) => readFileSync(join(d, f), "utf-8")))
  .join("\n");
for (const [key, { it, en }] of byKey) {
  if (!isDraft(it) && !isDraft(en) && it && en && !roadmapRaw.includes(key)) {
    console.log(`  ⚠ articolo pubblicato non collegato in roadmap: ${key}`);
    issues++;
  }
}
if (issues === 0) console.log("  ✓ roadmap e blog allineati");
console.log("");
