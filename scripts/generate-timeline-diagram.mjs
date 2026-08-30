/**
 * Genera un diagramma "prima / dopo" a timeline in scala reale, in stile brand
 * "The First Draft". Pensato per le immagini in corpo articolo: la barra del
 * prima e quella del dopo condividono la stessa scala dei tempi, quindi il
 * confronto e' onesto a colpo d'occhio; un riquadro di ingrandimento mostra
 * come il tempo residuo si distribuisce tra le chiamate.
 *
 * Come per generate-cover e generate-carousel, lo script rende lo STILE: il
 * contenuto (tempi, etichette, colori) sta nella spec JSON, non nel codice.
 *
 * Uso:
 *   node scripts/generate-timeline-diagram.mjs --spec <spec.json> --lang it --out <file.png>
 *
 * Spec (esempio):
 * {
 *   "totalScaleSeconds": 22,
 *   "before": { "seconds": 22 },
 *   "after":  { "seconds": 1.1 },
 *   "zoomScaleSeconds": 2,
 *   "calls": [
 *     { "seconds": 0.088, "color": "sky",    "start": 0 },
 *     { "seconds": 1.1,   "color": "teal",   "start": 0 },
 *     { "seconds": 0.7,   "color": "indigo", "start": 1.35, "onDemand": true }
 *   ]
 * }
 *
 * Le uniche stringhe localizzate sono "prima"/"dopo" e il separatore decimale:
 * il resto del diagramma e' fatto di numeri, cosi' la stessa figura vale in IT
 * e in EN con un solo parametro di differenza.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS = ["InterB.ttf", "InterSB.ttf", "InterM.ttf"].map((f) =>
  readFileSync(join(__dirname, "fonts", f))
);

// Palette brand (docs/DESIGN-SYSTEM.md 2.2 e 2.3)
const BG = "#0f172a", BORDER = "#1e293b", GRID = "#22304a";
const TEXT = "#e6edf3", MUTED = "#94a3b8", SLATE = "#64748b";
const COLORS = { sky: "#38bdf8", teal: "#2dd4bf", indigo: "#818cf8", slate: SLATE };

const I18N = {
  it: { before: "PRIMA", after: "DOPO", dec: "," },
  en: { before: "BEFORE", after: "AFTER", dec: "." },
};

const W = 1200, H = 620;
const PAD = 56;             // margine esterno
const AXIS_X = 208;         // dove cominciano tutte le barre
const AXIS_W = W - AXIS_X - PAD;
const BAR_H = 30, R = 7;
// Il diagramma vive dentro una colonna di testo stretta e viene scalato: i corpi
// sono volutamente grandi rispetto al canvas, cosi' restano leggibili.
const FS_LABEL = 27, FS_TICK = 25;

function fmt(seconds, dec) {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  if (Number.isInteger(seconds)) return `${seconds}s`;
  return `${seconds.toFixed(1).replace(".", dec)}s`;
}

function bar(x, y, w, color, opacity = 1) {
  const width = Math.max(w, 3);
  return `<rect x="${x.toFixed(1)}" y="${y}" width="${width.toFixed(1)}" height="${BAR_H}" rx="${R}" fill="${color}" fill-opacity="${opacity}"/>`;
}

function tick(x, y, h, label) {
  return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${y + h}" stroke="${GRID}" stroke-width="1.5"/>` +
    (label ? `<text x="${x.toFixed(1)}" y="${y - 16}" text-anchor="middle" font-family="InterM" font-size="${FS_TICK}" fill="${MUTED}">${label}</text>` : "");
}

function build(spec, lang) {
  const t = I18N[lang] ?? I18N.it;
  const sec2px = AXIS_W / spec.totalScaleSeconds;

  // --- scala principale: tacche in alto, le barre ci scorrono sotto ---
  let ticks = "";
  const step = spec.totalScaleSeconds > 10 ? 5 : 1;
  for (let s = 0; s <= spec.totalScaleSeconds; s += step) {
    ticks += tick(AXIS_X + s * sec2px, 72, 168, s === 0 ? "0" : `${s}s`);
  }

  const yBefore = 104, yAfter = 194;
  const wBefore = spec.before.seconds * sec2px;
  const wAfter = spec.after.seconds * sec2px;
  const AFTER_COLOR = COLORS[spec.after.color ?? "teal"];

  // --- riquadro di ingrandimento sul primo tratto della timeline ---
  const zx = PAD, zy = 318, zh = 258, zw = W - PAD * 2;
  const zPad = 132;                       // spazio a destra per le etichette
  const zAxisX = zx + AXIS_X - PAD;
  const zAxisW = zw - (zAxisX - zx) - zPad;
  const zsec2px = zAxisW / spec.zoomScaleSeconds;

  let zTicks = "";
  for (let s = 0; s <= spec.zoomScaleSeconds; s += 0.5) {
    zTicks += tick(zAxisX + s * zsec2px, zy + 58, zh - 88, s === 0 ? "0" : fmt(s, t.dec));
  }

  // linee della "lente": dal segmento del dopo agli angoli alti del riquadro
  const lens =
    `<path d="M ${AXIS_X} ${yAfter + BAR_H + 8} L ${zx} ${zy}" stroke="${GRID}" stroke-width="1.5" stroke-dasharray="6 6"/>` +
    `<path d="M ${(AXIS_X + wAfter).toFixed(1)} ${yAfter + BAR_H + 8} L ${zx + zw} ${zy}" stroke="${GRID}" stroke-width="1.5" stroke-dasharray="6 6"/>`;

  let calls = "";
  spec.calls.forEach((c, i) => {
    const y = zy + 84 + i * 52;
    const x = zAxisX + (c.start ?? 0) * zsec2px;
    const w = c.seconds * zsec2px;
    if (c.onDemand) {
      // gap tratteggiato + simbolo del click: la terza chiamata nasce da un gesto
      calls += `<line x1="${zAxisX}" y1="${y + BAR_H / 2}" x2="${(x - 28).toFixed(1)}" y2="${y + BAR_H / 2}" stroke="${GRID}" stroke-width="2" stroke-dasharray="4 8"/>`;
      [6, 13, 20].forEach((r, k) =>
        calls += `<circle cx="${(x - 14).toFixed(1)}" cy="${(y + BAR_H / 2).toFixed(1)}" r="${r}" ${k === 0 ? `fill="${COLORS[c.color]}"` : `fill="none" stroke="${COLORS[c.color]}" stroke-opacity="${k === 1 ? 0.5 : 0.22}" stroke-width="2"`}/>`
      );
    }
    calls += bar(x, y, w, COLORS[c.color]);
    calls += `<text x="${(x + w + 18).toFixed(1)}" y="${y + 20}" font-family="InterSB" font-size="${FS_LABEL}" fill="${TEXT}">${fmt(c.seconds, t.dec)}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${BG}"/>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${BORDER}"/>
${ticks}
<text x="${PAD}" y="${yBefore + 21}" font-family="InterSB" font-size="${FS_LABEL}" letter-spacing="3" fill="${MUTED}">${t.before}</text>
${bar(AXIS_X, yBefore, wBefore, SLATE, 0.85)}
<text x="${(AXIS_X + wBefore - 16).toFixed(1)}" y="${yBefore + 21}" text-anchor="end" font-family="InterB" font-size="${FS_LABEL}" fill="#0b1120">${fmt(spec.before.seconds, t.dec)}</text>
<text x="${PAD}" y="${yAfter + 21}" font-family="InterSB" font-size="${FS_LABEL}" letter-spacing="3" fill="${AFTER_COLOR}">${t.after}</text>
${bar(AXIS_X, yAfter, wAfter, AFTER_COLOR)}
<text x="${(AXIS_X + wAfter + 18).toFixed(1)}" y="${yAfter + 21}" font-family="InterB" font-size="${FS_LABEL}" fill="${TEXT}">${fmt(spec.after.seconds, t.dec)}</text>
${lens}
<rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="14" fill="#0b1120" stroke="${BORDER}"/>
${zTicks}
<line x1="${(zAxisX + spec.after.seconds * zsec2px).toFixed(1)}" y1="${zy + 58}" x2="${(zAxisX + spec.after.seconds * zsec2px).toFixed(1)}" y2="${zy + zh - 30}" stroke="${AFTER_COLOR}" stroke-width="2" stroke-opacity="0.55" stroke-dasharray="5 5"/>
${calls}
</svg>`;
}

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i === -1 ? d : args[i + 1]; };
const specPath = arg("--spec");
const lang = arg("--lang", "it");
const out = arg("--out");
if (!specPath || !out) {
  console.error("Uso: node scripts/generate-timeline-diagram.mjs --spec <spec.json> --lang it --out <file.png>");
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, "utf-8"));
const svg = build(spec, lang);
const png = new Resvg(svg, {
  font: { fontBuffers: FONTS, loadSystemFonts: false, defaultFontFamily: "InterM" },
}).render().asPng();
writeFileSync(out, png);
console.log("Diagramma generato:", out);
