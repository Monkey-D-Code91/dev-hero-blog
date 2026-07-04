/**
 * Genera public/og-image.png (1200x630) — OG di default del sito.
 * Brand "The First Draft", stile Marginalia (triade tech/human/AI + segno di bozza).
 * Immagine di fallback usata dalle pagine senza OG dedicata (home, lista blog, autori).
 * Esegui con:  node scripts/generate-og.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og-image.png");

const W = 1200, H = 630;

// Palette brand
const BG0 = "#0b1120", BG1 = "#0f172a";
const SKY = "#38bdf8", TEAL = "#2dd4bf", INDIGO = "#818cf8";
const TEXT = "#e6edf3", MUTED = "#94a3b8", GRID = "#22304a", SURF = "#111827";
const FONT = "Inter, Helvetica, Arial, sans-serif";

// Trio di cerchi: Tech, AI, Human
const TECH = [792, 286, 112];
const AI = [908, 286, 112];
const HUM = [850, 396, 112];
const CEN = [850, 330];

const dotGrid = () => {
  let s = "";
  for (let x = 650; x < 1130; x += 28)
    for (let y = 140; y < 512; y += 28)
      s += `<circle cx="${x}" cy="${y}" r="1.5" fill="${GRID}" opacity="0.55"/>`;
  return s;
};

const circle = ([cx, cy, r], c) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" fill-opacity="0.09"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-opacity="0.55" stroke-width="2"/>`;

const aiNodes = (cx, cy) => {
  const p = [[cx - 6, cy - 20], [cx + 28, cy - 12], [cx + 9, cy + 16], [cx + 36, cy + 22]];
  const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]];
  let s = edges
    .map(([a, b]) => `<line x1="${p[a][0]}" y1="${p[a][1]}" x2="${p[b][0]}" y2="${p[b][1]}" stroke="${INDIGO}" stroke-width="1.5" stroke-opacity="0.75"/>`)
    .join("");
  s += p.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="4.5" fill="${INDIGO}"/>`).join("");
  return s;
};

const wave = (cx, cy) => {
  const x0 = cx - 40;
  return `<path d="M ${x0} ${cy} q 10 -11 20 0 t 20 0 t 20 0" fill="none" stroke="${TEAL}" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.95"/>`;
};

const underline = (x, y, w) => {
  const seg = 22, n = Math.max(3, Math.floor(w / seg));
  let d = `M ${x} ${y} `, up = true;
  for (let i = 0; i < n; i++) { d += `q ${seg / 2} ${up ? -11 : 11} ${seg} 0 `; up = !up; }
  return `<path d="${d}" fill="none" stroke="${TEAL}" stroke-width="3.5" stroke-linecap="round"/>`;
};

const label = (x, y, t) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="13" letter-spacing="2.5" fill="${MUTED}">${t}</text>`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG0}"/><stop offset="100%" stop-color="${BG1}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="20%" r="55%">
      <stop offset="0%" stop-color="${SKY}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="idea" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="${SKY}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${SKY}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${dotGrid()}
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="20" fill="none" stroke="${SKY}" stroke-opacity="0.14" stroke-width="1.5"/>

  ${circle(TECH, SKY)}
  ${circle(AI, INDIGO)}
  ${circle(HUM, TEAL)}
  <circle cx="${CEN[0]}" cy="${CEN[1]}" r="48" fill="url(#idea)"/>
  <text x="${CEN[0]}" y="${CEN[1] + 7}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="22" fill="#ffffff">+</text>

  <text x="${TECH[0] - 38}" y="${TECH[1] - 14}" font-family="${FONT}" font-weight="700" font-size="28" fill="${SKY}">&lt;/&gt;</text>
  ${aiNodes(AI[0] + 4, AI[1] - 2)}
  ${wave(HUM[0], HUM[1] + 28)}
  ${label(735, 158, "TECH")}
  ${label(968, 158, "AI")}
  ${label(HUM[0], 528, "HUMAN")}

  <g transform="translate(80,92)">
    <rect x="0" y="0" width="72" height="72" rx="16" fill="${SURF}" stroke="${SKY}" stroke-opacity="0.5" stroke-width="2"/>
    <text x="36" y="48" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" letter-spacing="-1" fill="${SKY}">FD</text>
  </g>

  <text x="80" y="352" font-family="${FONT}" font-weight="700" font-size="64" letter-spacing="-1.5" fill="${TEXT}">The First</text>
  <text x="80" y="424" font-family="${FONT}" font-weight="700" font-size="64" letter-spacing="-1.5" fill="${TEXT}">Draft</text>
  ${underline(82, 446, 176)}
  <text x="82" y="498" font-family="${FONT}" font-weight="500" font-size="24" letter-spacing="2" fill="${MUTED}">tech &#183; human &#183; ai</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("OG image generata:", out);
