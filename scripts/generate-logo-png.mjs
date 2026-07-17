/**
 * Rende un logo SVG (public/logos/*.svg) in PNG quadrato ad alta risoluzione,
 * per gli usi dove serve un raster: icona newsletter (Buttondown), avatar
 * social, favicon di piattaforme terze. Riusa la toolchain del repo (resvg).
 *
 * Uso:
 *   node scripts/generate-logo-png.mjs fd-3-nib            # 1024x1024 (default)
 *   node scripts/generate-logo-png.mjs fd-3-nib 512        # dimensione custom
 *
 * L'output va accanto all'SVG: public/logos/<nome>.png (o <nome>@<size>.png se
 * la dimensione non è quella di default).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGOS = resolve(__dirname, "..", "public", "logos");
const DEFAULT_SIZE = 1024;

const name = process.argv[2];
const size = Number(process.argv[3] ?? DEFAULT_SIZE);

if (!name) {
  console.error("Uso: node scripts/generate-logo-png.mjs <nome-logo> [size]");
  process.exit(1);
}

const svgPath = join(LOGOS, `${name}.svg`);
if (!existsSync(svgPath)) {
  console.error(`SVG non trovato: ${svgPath}`);
  process.exit(1);
}

const outName = size === DEFAULT_SIZE ? `${name}.png` : `${name}@${size}.png`;
const outPath = join(LOGOS, outName);

const svg = readFileSync(svgPath, "utf-8");
const png = new Resvg(svg, {
  fitTo: { mode: "width", value: size },
}).render().asPng();

writeFileSync(outPath, png);
console.log(`PNG generato: ${outPath} (${size}x${size})`);
