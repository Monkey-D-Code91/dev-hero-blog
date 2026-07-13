/**
 * Genera la cover 1600x836 di un articolo, in stile brand "The First Draft"
 * (triade tech/human/AI, "+" luminoso, sottolineatura ondulata, font Inter).
 * Riusa la stessa toolchain del repo (@resvg/resvg-js) e i font statici in scripts/fonts.
 *
 * Uso:
 *   node scripts/generate-cover.mjs src/content/blog/it/<slug>.md
 *   node scripts/generate-cover.mjs src/content/blog/en/<slug>.md
 *
 * Legge dal frontmatter `title` (per il testo) e `cover` (per il path di output,
 * risolto relativamente al file dell'articolo). Il titolo viene spezzato in righe
 * in automatico. Non tocca il resto del frontmatter.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS = ["InterB.ttf", "InterSB.ttf", "InterM.ttf"].map((f) =>
  readFileSync(join(__dirname, "fonts", f))
);

// Canvas e palette brand (allineati a generate-og.mjs, scala 1200 -> 1600)
const W = 1600, H = 836, K = W / 1200, SX = 40;
const BG0 = "#0b1120", BG1 = "#0f172a";
const SKY = "#38bdf8", TEAL = "#2dd4bf", INDIGO = "#818cf8";
const TEXT = "#e6edf3", MUTED = "#94a3b8", GRID = "#22304a";

const T = (x, y) => [x * K + SX, y * K];
const TECH = T(792, 286), AI = T(908, 286), HUM = T(850, 396), CEN = T(850, 330);
const R = 112 * K;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const dotGrid = () => {
  let s = "";
  for (let x = 650; x < 1130; x += 28)
    for (let y = 140; y < 512; y += 28) {
      const [X, Y] = T(x, y);
      s += `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="1.8" fill="${GRID}" opacity="0.55"/>`;
    }
  return s;
};
const circle = ([cx, cy], c) =>
  `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R.toFixed(1)}" fill="${c}" fill-opacity="0.09"/>` +
  `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="0.55" stroke-width="2.5"/>`;
const aiNodes = () => {
  const [cx, cy] = T(912, 284);
  const p = [[cx - 8, cy - 27], [cx + 37, cy - 16], [cx + 12, cy + 21], [cx + 48, cy + 29]];
  const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]];
  let s = edges.map(([a, b]) => `<line x1="${p[a][0].toFixed(1)}" y1="${p[a][1].toFixed(1)}" x2="${p[b][0].toFixed(1)}" y2="${p[b][1].toFixed(1)}" stroke="${INDIGO}" stroke-width="2" stroke-opacity="0.75"/>`).join("");
  s += p.map(([px, py]) => `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6" fill="${INDIGO}"/>`).join("");
  return s;
};
const wave = () => {
  const [cx, cy] = T(850, 424); const x0 = cx - 53;
  return `<path d="M ${x0.toFixed(1)} ${cy.toFixed(1)} q 13 -15 27 0 t 27 0 t 27 0" fill="none" stroke="${TEAL}" stroke-width="4.5" stroke-linecap="round" stroke-opacity="0.95"/>`;
};
const underline = (x, y, w) => {
  const seg = 26, n = Math.max(3, Math.floor(w / seg));
  let d = `M ${x} ${y} `, up = true;
  for (let i = 0; i < n; i++) { d += `q ${(seg / 2).toFixed(1)} ${up ? -14 : 14} ${seg} 0 `; up = !up; }
  return `<path d="${d}" fill="none" stroke="${TEAL}" stroke-width="4.5" stroke-linecap="round"/>`;
};
const label = (x, y, t) =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-family="InterSB" font-size="17" letter-spacing="3.3" fill="${MUTED}">${t}</text>`;

// Spezza il titolo in righe: prova le dimensioni piu' grandi, scende se sfora 3 righe.
function layoutTitle(title) {
  const maxW = 760;
  for (const size of [52, 46, 40]) {
    const charW = 0.55 * size;
    const words = title.split(/\s+/);
    const lines = []; let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (t.length * charW <= maxW || !cur) cur = t;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    if (lines.length <= 3) return { lines, size };
  }
  // fallback: taglia comunque a 3 righe alla dimensione minima
  const size = 40, charW = 0.55 * size, words = title.split(/\s+/), lines = []; let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (t.length * charW <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return { lines: lines.slice(0, 3), size };
}

function buildSvg(title) {
  const { lines, size } = layoutTitle(title);
  const gap = size + 12, y0 = 372;
  const titleSvg = lines.map((ln, i) =>
    `<text x="120" y="${y0 + i * gap}" font-family="InterB" font-size="${size}" letter-spacing="-1" fill="${TEXT}">${esc(ln)}</text>`
  ).join("");
  const lastY = y0 + (lines.length - 1) * gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${BG0}"/><stop offset="100%" stop-color="${BG1}"/></linearGradient>
<radialGradient id="glow" cx="72%" cy="20%" r="55%"><stop offset="0%" stop-color="${SKY}" stop-opacity="0.18"/><stop offset="100%" stop-color="${SKY}" stop-opacity="0"/></radialGradient>
<radialGradient id="idea" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="35%" stop-color="${SKY}" stop-opacity="0.5"/><stop offset="100%" stop-color="${SKY}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${dotGrid()}
<rect x="32" y="32" width="${W - 64}" height="${H - 64}" rx="27" fill="none" stroke="${SKY}" stroke-opacity="0.14" stroke-width="2"/>
${circle(TECH, SKY)}${circle(AI, INDIGO)}${circle(HUM, TEAL)}
<circle cx="${CEN[0].toFixed(1)}" cy="${CEN[1].toFixed(1)}" r="64" fill="url(#idea)"/>
<text x="${CEN[0].toFixed(1)}" y="${(CEN[1] + 9).toFixed(1)}" text-anchor="middle" font-family="InterB" font-size="29" fill="#ffffff">+</text>
<text x="${(TECH[0] - 51).toFixed(1)}" y="${(TECH[1] - 19).toFixed(1)}" font-family="InterB" font-size="37" fill="${SKY}">&lt;/&gt;</text>
${aiNodes()}${wave()}
${label(T(735, 158)[0], T(735, 158)[1], "TECH")}
${label(T(968, 158)[0], T(968, 158)[1], "AI")}
${label(HUM[0], T(850, 528)[1], "HUMAN")}
<text x="120" y="306" font-family="InterSB" font-size="22" letter-spacing="4" fill="${SKY}">THE FIRST DRAFT</text>
${titleSvg}
${underline(122, lastY + 22, 205)}
<text x="122" y="${lastY + 70}" font-family="InterM" font-size="24" letter-spacing="2" fill="${MUTED}">tech &#183; human &#183; ai</text>
</svg>`;
}

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error("Frontmatter non trovato");
  const get = (k) => (m[1].match(new RegExp(`^${k}:\\s*"(.*)"\\s*$`, "m")) || [])[1];
  return { title: get("title"), cover: get("cover") };
}

const articlePath = process.argv[2];
if (!articlePath) { console.error("Uso: node scripts/generate-cover.mjs <path-articolo.md>"); process.exit(1); }
const md = readFileSync(articlePath, "utf-8");
const { title, cover } = frontmatter(md);
if (!title || !cover) throw new Error("title o cover mancanti nel frontmatter");
const out = resolve(dirname(resolve(articlePath)), cover);

const svg = buildSvg(title);
const png = new Resvg(svg, {
  font: { fontBuffers: FONTS, loadSystemFonts: false, defaultFontFamily: "InterM" },
}).render().asPng();
writeFileSync(out, png);
console.log("Cover generata:", out);
