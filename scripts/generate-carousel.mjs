/**
 * Genera un carousel LinkedIn (formato documento 1080x1350, ratio 4:5) in stile
 * brand "The First Draft" a partire da un articolo e da una spec delle slide.
 *
 * Divisione delle responsabilita' (come per generate-cover.mjs):
 *   - lo SCRIPT rende in modo deterministico lo stile brand delle slide;
 *   - il CONTENUTO editoriale (heading/body di ogni slide) viene deciso nel
 *     workflow di scrittura, non inventato dallo script.
 *
 * Toolchain gia' nel repo: @resvg/resvg-js (SVG -> PNG) e sharp (PNG -> raw RGB,
 * per assemblare il PDF). Nessuna dipendenza nuova. Font statici in scripts/fonts.
 *
 * Uso:
 *   node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md
 *   node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md --spec carousels/<slug>.json
 *   node scripts/generate-carousel.mjs src/content/blog/en/<slug>.md --out carousels/<slug>
 *
 * Senza --spec genera uno scheletro onesto di 3 slide (cover dal title, hook dalla
 * description, CTA con l'handle), da rifinire fornendo una spec. Vedi scripts/README.md.
 *
 * Output (in <out>, default ./carousels/<slug>/):
 *   slide-01.png ... slide-NN.png   (le singole slide)
 *   <slug>.pdf                       (documento pronto per l'upload su LinkedIn)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename } from "node:path";
import { deflateSync } from "node:zlib";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS = ["InterB.ttf", "InterSB.ttf", "InterM.ttf"].map((f) =>
  readFileSync(join(__dirname, "fonts", f))
);

// Canvas verticale 4:5 e palette brand (allineata a generate-cover.mjs).
const W = 1080, H = 1350;
const BG0 = "#0b1120", BG1 = "#0f172a";
const SKY = "#38bdf8", TEAL = "#2dd4bf", INDIGO = "#818cf8";
const TEXT = "#e6edf3", MUTED = "#94a3b8", GRID = "#22304a";
const MARGIN = 96;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------------------------------------------------------------------
// Helpers di layout
// ---------------------------------------------------------------------------

/** Spezza `text` in righe che stanno in `maxW` px alla dimensione `size`. */
function wrap(text, size, maxW, maxLines = Infinity) {
  const charW = 0.54 * size;
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (t.length * charW <= maxW || !cur) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

/** Blocco di testo multi-riga, ritorna { svg, height }. */
function textBlock(x, y, text, { size, family = "InterB", fill = TEXT, maxW, lineGap = 12, letter = 0 }) {
  const lines = wrap(text, size, maxW);
  const step = size + lineGap;
  const svg = lines.map((ln, i) =>
    `<text x="${x}" y="${(y + size + i * step).toFixed(1)}" font-family="${family}" font-size="${size}" letter-spacing="${letter}" fill="${fill}">${esc(ln)}</text>`
  ).join("");
  return { svg, height: lines.length * step };
}

const dotGrid = () => {
  let s = "";
  for (let x = MARGIN; x < W - MARGIN; x += 34)
    for (let y = 150; y < H - 150; y += 34)
      s += `<circle cx="${x}" cy="${y}" r="1.7" fill="${GRID}" opacity="0.4"/>`;
  return s;
};

const wave = (x, y, w) => {
  const seg = 30, n = Math.max(3, Math.floor(w / seg));
  let d = `M ${x} ${y} `, up = true;
  for (let i = 0; i < n; i++) { d += `q ${(seg / 2).toFixed(1)} ${up ? -16 : 16} ${seg} 0 `; up = !up; }
  return `<path d="${d}" fill="none" stroke="${TEAL}" stroke-width="5" stroke-linecap="round"/>`;
};

/** Marchio "triade" tech/human/ai, riusato dalla cover, centrato in (cx,cy). */
function triad(cx, cy, r = 92) {
  const off = r * 0.62;
  const tech = [cx - off, cy - off * 0.5];
  const ai = [cx + off, cy - off * 0.5];
  const hum = [cx, cy + off];
  const ring = ([x, y], c) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity="0.09"/>` +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-opacity="0.55" stroke-width="2.5"/>`;
  return (
    ring(tech, SKY) + ring(ai, INDIGO) + ring(hum, TEAL) +
    `<circle cx="${cx}" cy="${cy}" r="58" fill="url(#idea)"/>` +
    `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="InterB" font-size="40" fill="#ffffff">+</text>` +
    `<text x="${tech[0] - 34}" y="${tech[1] + 12}" font-family="InterB" font-size="30" fill="${SKY}">&lt;/&gt;</text>`
  );
}

const frame = () =>
  `<rect x="28" y="28" width="${W - 56}" height="${H - 56}" rx="30" fill="none" stroke="${SKY}" stroke-opacity="0.14" stroke-width="2"/>`;

const footer = (idx, total) =>
  `<text x="${MARGIN}" y="${H - 70}" font-family="InterSB" font-size="22" letter-spacing="3" fill="${SKY}">THE FIRST DRAFT</text>` +
  `<text x="${W - MARGIN}" y="${H - 70}" text-anchor="end" font-family="InterM" font-size="22" fill="${MUTED}">${idx} / ${total}</text>` +
  `<text x="${MARGIN}" y="${H - 40}" font-family="InterM" font-size="20" letter-spacing="1.5" fill="${MUTED}">tech &#183; human &#183; ai</text>`;

const defs = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${BG0}"/><stop offset="100%" stop-color="${BG1}"/></linearGradient>
<radialGradient id="glow" cx="78%" cy="12%" r="60%"><stop offset="0%" stop-color="${SKY}" stop-opacity="0.16"/><stop offset="100%" stop-color="${SKY}" stop-opacity="0"/></radialGradient>
<radialGradient id="idea" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="35%" stop-color="${SKY}" stop-opacity="0.5"/><stop offset="100%" stop-color="${SKY}" stop-opacity="0"/></radialGradient>
</defs>`;

const bg = () =>
  `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>${dotGrid()}${frame()}`;

// ---------------------------------------------------------------------------
// Renderer per tipo di slide
// ---------------------------------------------------------------------------

function slideCover(s, idx, total) {
  const t = triad(W / 2, 300, 96);
  const title = textBlock(MARGIN, 560, s.title, { size: 66, maxW: W - 2 * MARGIN, lineGap: 14 });
  const uy = 560 + title.height + 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
${bg()}
${t}
<text x="${MARGIN}" y="500" font-family="InterSB" font-size="26" letter-spacing="5" fill="${SKY}">THE FIRST DRAFT</text>
${title.svg}
${wave(MARGIN + 2, uy, 240)}
${s.kicker ? `<text x="${MARGIN}" y="${uy + 66}" font-family="InterM" font-size="26" letter-spacing="1.5" fill="${MUTED}">${esc(s.kicker)}</text>` : ""}
${footer(idx, total)}
</svg>`;
}

function slidePoint(s, idx, total) {
  const kicker = s.kicker || String(idx).padStart(2, "0");
  const heading = textBlock(MARGIN, 260, s.heading || "", { size: 58, maxW: W - 2 * MARGIN, lineGap: 12 });
  let y = 260 + heading.height + 40;
  const body = s.body
    ? textBlock(MARGIN, y, s.body, { size: 36, family: "InterM", fill: MUTED, maxW: W - 2 * MARGIN, lineGap: 16 })
    : { svg: "", height: 0 };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
${bg()}
<text x="${MARGIN}" y="200" font-family="InterB" font-size="120" fill="${SKY}" fill-opacity="0.18">${esc(kicker)}</text>
${heading.svg}
${wave(MARGIN + 2, 260 + heading.height + 22, 180)}
${body.svg}
${footer(idx, total)}
</svg>`;
}

function slideQuote(s, idx, total) {
  const quote = textBlock(MARGIN, 420, s.body || "", { size: 52, family: "InterSB", fill: TEXT, maxW: W - 2 * MARGIN, lineGap: 16 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
${bg()}
<text x="${MARGIN - 10}" y="380" font-family="InterB" font-size="160" fill="${TEAL}" fill-opacity="0.35">&#8220;</text>
${quote.svg}
${wave(MARGIN + 2, 420 + quote.height + 24, 200)}
${s.attribution ? `<text x="${MARGIN}" y="${420 + quote.height + 90}" font-family="InterM" font-size="28" fill="${MUTED}">${esc(s.attribution)}</text>` : ""}
${footer(idx, total)}
</svg>`;
}

function slideCta(s, idx, total) {
  const heading = textBlock(MARGIN, 440, s.heading || "Leggi l'articolo", { size: 60, maxW: W - 2 * MARGIN, lineGap: 12 });
  let y = 440 + heading.height + 36;
  const body = s.body
    ? textBlock(MARGIN, y, s.body, { size: 34, family: "InterM", fill: MUTED, maxW: W - 2 * MARGIN, lineGap: 16 })
    : { svg: "", height: 0 };
  y += body.height + 30;
  const link = s.link || "thefirstdraft.blog";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
${bg()}
${triad(W / 2, 240, 78)}
${heading.svg}
${body.svg}
<rect x="${MARGIN}" y="${y}" width="${W - 2 * MARGIN}" height="2" fill="${GRID}"/>
<text x="${MARGIN}" y="${y + 54}" font-family="InterSB" font-size="30" fill="${SKY}">&#8594; ${esc(link)}</text>
${footer(idx, total)}
</svg>`;
}

const RENDERERS = { cover: slideCover, point: slidePoint, quote: slideQuote, cta: slideCta };

function renderSlide(spec, idx, total) {
  const fn = RENDERERS[spec.kind];
  if (!fn) throw new Error(`Tipo di slide sconosciuto: "${spec.kind}" (usa: ${Object.keys(RENDERERS).join(", ")})`);
  const svg = fn(spec, idx, total);
  return new Resvg(svg, {
    font: { fontBuffers: FONTS, loadSystemFonts: false, defaultFontFamily: "InterM" },
  }).render().asPng();
}

// ---------------------------------------------------------------------------
// Assemblaggio PDF (image-per-page) senza dipendenze extra
// ---------------------------------------------------------------------------

async function buildPdf(pngBuffers) {
  // Converte ogni PNG in RGB grezzo (via sharp), poi lo incapsula come XObject
  // FlateDecode. Un oggetto immagine + un oggetto pagina per slide.
  const objects = []; // stringhe o Buffer, indicizzati da 1
  const add = (data) => { objects.push(data); return objects.length; };

  const pagesRef = [];
  const imageRefs = [];
  const contentRefs = [];

  for (const png of pngBuffers) {
    const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const zipped = deflateSync(data);
    const imgId = objects.length + 1;
    const dict =
      `<< /Type /XObject /Subtype /Image /Width ${info.width} /Height ${info.height} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${zipped.length} >>\nstream\n`;
    const imgBuf = Buffer.concat([Buffer.from(dict, "latin1"), zipped, Buffer.from("\nendstream")]);
    imageRefs.push(add(imgBuf));
  }

  // Content stream + Page per ogni immagine (pagina in punti PDF a 72dpi: usiamo i pixel come punti).
  for (let i = 0; i < pngBuffers.length; i++) {
    const content = `q\n${W} 0 0 ${H} 0 0 cm\n/Im0 Do\nQ`;
    const cBuf = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    contentRefs.push(add(cBuf));
  }
  for (let i = 0; i < pngBuffers.length; i++) {
    const page =
      `<< /Type /Page /Parent __PAGES__ /MediaBox [0 0 ${W} ${H}] ` +
      `/Resources << /XObject << /Im0 ${imageRefs[i]} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`;
    pagesRef.push(add(page));
  }

  const pagesId = add(
    `<< /Type /Pages /Kids [${pagesRef.map((r) => `${r} 0 R`).join(" ")}] /Count ${pagesRef.length} >>`
  );
  // Sostituisci il placeholder del parent nelle pagine.
  for (const r of pagesRef) objects[r - 1] = String(objects[r - 1]).replace("__PAGES__", `${pagesId} 0 R`);
  const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  // Serializza con xref table.
  let pdf = Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1");
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets[i] = pdf.length;
    const head = Buffer.from(`${i + 1} 0 obj\n`, "latin1");
    const body = Buffer.isBuffer(obj) ? obj : Buffer.from(obj, "latin1");
    pdf = Buffer.concat([pdf, head, body, Buffer.from("\nendobj\n", "latin1")]);
  });
  const xrefStart = pdf.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  xref += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.concat([pdf, Buffer.from(xref, "latin1")]);
}

// ---------------------------------------------------------------------------
// Frontmatter + spec di default
// ---------------------------------------------------------------------------

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error("Frontmatter non trovato");
  const get = (k) => (m[1].match(new RegExp(`^${k}:\\s*"(.*)"\\s*$`, "m")) || [])[1];
  return { title: get("title"), description: get("description") };
}

function defaultSpec({ title, description, lang }) {
  const isEn = lang === "en";
  return {
    lang,
    slides: [
      { kind: "cover", title, kicker: isEn ? "A new piece" : "Un nuovo pezzo" },
      { kind: "point", kicker: "01", heading: isEn ? "The idea" : "L'idea", body: description || "" },
      {
        kind: "cta",
        heading: isEn ? "Read the full article" : "Leggi l'articolo completo",
        body: isEn ? "Link in the first comment." : "Link nel primo commento.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--spec") args.spec = argv[++i];
    else if (argv[i] === "--out") args.out = argv[++i];
    else args._.push(argv[i]);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const articlePath = args._[0];
  if (!articlePath) {
    console.error("Uso: node scripts/generate-carousel.mjs <path-articolo.md> [--spec file.json] [--out dir]");
    process.exit(1);
  }

  const md = readFileSync(articlePath, "utf-8");
  const { title, description } = frontmatter(md);
  if (!title) throw new Error("title mancante nel frontmatter dell'articolo");

  const slug = basename(articlePath).replace(/\.mdx?$/, "");
  const lang = /\/en\//.test(articlePath.replace(/\\/g, "/")) ? "en" : "it";

  let spec;
  if (args.spec) {
    spec = JSON.parse(readFileSync(args.spec, "utf-8"));
  } else {
    spec = defaultSpec({ title, description, lang });
    console.warn("Nessuna --spec fornita: genero uno scheletro di 3 slide da rifinire.");
  }
  // La cover eredita il title dell'articolo se la spec non lo sovrascrive.
  spec.slides = spec.slides.map((s) =>
    s.kind === "cover" && !s.title ? { ...s, title } : s
  );

  const outDir = resolve(args.out || join("carousels", slug));
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const total = spec.slides.length;
  const pngs = [];
  spec.slides.forEach((s, i) => {
    const png = renderSlide(s, i + 1, total);
    const file = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    writeFileSync(file, png);
    pngs.push(png);
    console.log("Slide:", file);
  });

  const pdf = await buildPdf(pngs);
  const pdfPath = join(outDir, `${slug}.pdf`);
  writeFileSync(pdfPath, pdf);
  console.log("Carousel PDF:", pdfPath, `(${total} slide)`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
