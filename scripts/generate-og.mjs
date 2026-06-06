/**
 * Genera public/og-image.png (1200x630) per le anteprime social.
 * Esegui con:  node scripts/generate-og.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og-image.png");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="22%" r="55%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- monogramma -->
  <g transform="translate(80,80)">
    <rect x="0" y="0" width="96" height="96" rx="22" fill="#111827" stroke="#38bdf8" stroke-opacity="0.5" stroke-width="2"/>
    <text x="48" y="62" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#38bdf8">MM</text>
  </g>

  <!-- testo -->
  <text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="78" font-weight="700" fill="#e6edf3">Marco Mariotti</text>
  <text x="82" y="392" font-family="Helvetica, Arial, sans-serif" font-size="36" font-weight="600" fill="#38bdf8">Software Engineer &amp; Tech Lead</text>
  <text x="82" y="470" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#94a3b8">Monitoraggio telecomunicazioni · Leadership di team distribuiti</text>

  <!-- linea accento -->
  <rect x="82" y="510" width="120" height="4" rx="2" fill="#38bdf8"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("OG image generata:", out);
