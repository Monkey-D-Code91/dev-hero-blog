import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { Lang } from "../i18n/ui";

/**
 * Generatore di OG image per-articolo (1200×630), renderizzate a build-time.
 * Composte con satori (layout → SVG) e rasterizzate con resvg (SVG → PNG).
 * Mostrano titolo + autore + brand, con i colori del sito: l'obiettivo è
 * dare risalto a chi ha scritto il pezzo quando viene condiviso sui social.
 */

// Font caricati una volta sola (cwd = root progetto durante la build).
const fontDir = join(process.cwd(), "src/assets/og-fonts");
const fontRegular = readFileSync(join(fontDir, "Inter-Regular.ttf"));
const fontSemiBold = readFileSync(join(fontDir, "Inter-SemiBold.ttf"));
const fontBold = readFileSync(join(fontDir, "Inter-Bold.ttf"));

// Logo del blog (pennino) rasterizzato in PNG e incorporato come data URI:
// satori riceve un'immagine bitmap, evitando incertezze sul rendering SVG.
const logoSvg = readFileSync(
  join(process.cwd(), "public/logos/fd-3-nib.svg"),
  "utf-8"
);
const logoPng = new Resvg(logoSvg, { fitTo: { mode: "width", value: 128 } })
  .render()
  .asPng();
const logoDataUri = `data:image/png;base64,${logoPng.toString("base64")}`;

// Palette allineata a src/styles/global.css.
const C = {
  bg: "#0b1120",
  text: "#e6edf3",
  muted: "#94a3b8",
  accent: "#38bdf8",
  accent2: "#2dd4bf",
  accentSoft: "rgba(56,189,248,0.4)",
  surface: "#111827",
  border: "#1e293b",
};

/** Helper per costruire l'albero satori senza JSX. */
function h(type: string, style: Record<string, unknown>, children?: unknown): any {
  return { type, props: { style, ...(children !== undefined ? { children } : {}) } };
}

/** Iniziali dell'autore (max 2 parole) per il monogramma. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

interface OgInput {
  title: string;
  authorName: string;
  lang: Lang;
}

export async function renderOgImage({ title, authorName, lang }: OgInput): Promise<Buffer> {
  // Riduce il corpo del titolo per testi molto lunghi, così resta in pagina.
  const titleSize = title.length > 70 ? 52 : title.length > 48 ? 60 : 68;
  const byLabel = lang === "it" ? "di" : "by";

  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.bg,
      backgroundImage: `radial-gradient(900px circle at 80% -10%, rgba(56,189,248,0.18), transparent 55%)`,
      padding: "64px 72px",
      fontFamily: "Inter",
      position: "relative",
      justifyContent: "space-between",
    },
    [
      // barra accent a sinistra
      h("div", {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 14,
        backgroundImage: `linear-gradient(180deg, ${C.accent}, ${C.accent2})`,
      }),

      // header: monogramma brand + nome
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 18 },
        [
          {
            type: "img",
            props: {
              src: logoDataUri,
              width: 56,
              height: 56,
              style: { width: 56, height: 56 },
            },
          },
          h(
            "div",
            { display: "flex", flexDirection: "column" },
            [
              h("div", { fontSize: 26, fontWeight: 700, color: C.text }, "First Draft"),
              h(
                "div",
                { fontSize: 15, color: C.muted, letterSpacing: 3, textTransform: "uppercase" },
                "Tech, Humans & AI"
              ),
            ]
          ),
        ]
      ),

      // titolo
      h(
        "div",
        { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, paddingTop: 28, paddingBottom: 28 },
        h(
          "div",
          { fontSize: titleSize, fontWeight: 700, lineHeight: 1.14, color: C.text, letterSpacing: -1 },
          title
        )
      ),

      // footer: autore + dominio
      h(
        "div",
        { display: "flex", alignItems: "center", justifyContent: "space-between" },
        [
          h(
            "div",
            { display: "flex", alignItems: "center", gap: 18 },
            [
              h(
                "div",
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 9999,
                  backgroundColor: C.surface,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: C.border,
                  color: C.accent,
                  fontSize: 22,
                  fontWeight: 700,
                },
                initials(authorName)
              ),
              h(
                "div",
                { display: "flex", flexDirection: "column" },
                [
                  h("div", { fontSize: 16, color: C.muted }, byLabel),
                  h("div", { fontSize: 28, fontWeight: 600, color: C.text }, authorName),
                ]
              ),
            ]
          ),
          h("div", { fontSize: 22, color: C.muted }, "thefirstdraft.dev"),
        ]
      ),
    ]
  );

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      { name: "Inter", data: fontSemiBold, weight: 600, style: "normal" },
      { name: "Inter", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
  return png;
}
