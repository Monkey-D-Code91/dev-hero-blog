# Asset social e di pubblicazione

Gli asset che accompagnano un articolo. Tooling versionato e deterministico in `scripts/` (stesso
comando per ogni articolo); dettagli in `scripts/README.md`.

## Cover dell'articolo — `scripts/generate-cover.mjs`

Immagine 1600x836 in stile brand (triade tech/human/AI, "+" luminoso, sottolineatura ondulata, font
Inter). Legge `title` e `cover` dal frontmatter dell'articolo e scrive il PNG nel path indicato da
`cover`. Toolchain node del repo (`@resvg/resvg-js`).

```bash
node scripts/generate-cover.mjs src/content/blog/it/<slug>.md
node scripts/generate-cover.mjs src/content/blog/en/<slug>.md
```

## Carousel LinkedIn — `scripts/generate-carousel.mjs`

Genera un **carousel in formato documento 1080x1350 (4:5)** in stile brand a partire da un articolo e
da una **spec delle slide**, e assembla il tutto in un **PDF pronto per l'upload su LinkedIn**
(più le singole slide PNG). Stessa toolchain: `@resvg/resvg-js` per il rendering, `sharp` (già nel
repo, via Astro) per assemblare il PDF. Nessuna dipendenza nuova.

Divisione delle responsabilità, coerente con le cover: lo **script** rende lo **stile**; il
**contenuto editoriale** di ogni slide lo decidi tu nel workflow (o l'autore), non lo inventa lo
script.

```bash
# Scheletro rapido di 3 slide (cover dal title, hook dalla description, CTA):
node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md

# Carousel completo da una spec:
node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md --spec carousels/<slug>.json
node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md --out carousels/<slug>
```

Output di default in `carousels/<slug>/`: `slide-01.png … slide-NN.png` + `<slug>.pdf`.

### Formato della spec (JSON)

```json
{
  "lang": "it",
  "slides": [
    { "kind": "cover", "title": "(opz., default = title dell'articolo)", "kicker": "Nuovo articolo" },
    { "kind": "point", "kicker": "01", "heading": "Titolo del punto", "body": "Testo breve." },
    { "kind": "quote", "body": "Una frase forte.", "attribution": "The First Draft" },
    { "kind": "cta", "heading": "Leggi l'articolo", "body": "Link nel primo commento.", "link": "thefirstdraft.blog" }
  ]
}
```

Tipi di slide: `cover` (hero brand), `point` (numero + heading + body), `quote` (citazione), `cta`
(chiusura con link). Consiglio editoriale: 6-10 slide, una idea per slide, testo corto (il body va a
capo da solo ma non ci scrivi un paragrafo intero), la tesi dell'articolo nelle prime due slide,
sempre una `cta` finale. Rispetta `references/regole-editoriali.md` anche qui (niente trattini lunghi,
niente nomi).

## OG image del sito — `scripts/generate-og.mjs`

Genera `public/og-image.png` (1200x630), l'anteprima social di default (home, liste, autori).
Rigenerala dopo aver cambiato nome/ruolo nella config.

```bash
node scripts/generate-og.mjs
```

## PDF "bozza per revisione" — `scripts/generate-feedback-pdf.py`

PDF impaginato di un articolo per il gruppo di feedback (pill, titolo, sommario, byline, capolettera,
testo giustificato serif). Dipendenza Python isolata (`weasyprint`), fuori dal build del sito.

```bash
pip install -r scripts/requirements-pdf.txt
python3 scripts/generate-feedback-pdf.py src/content/blog/it/<slug>.md [output.pdf]
```

Legge `title`, `description`, `pubDate`. Pensato per la versione IT. Senza output esplicito scrive in
`feedback/<Slug-con-iniziale-maiuscola>.pdf`.

## Grafica più elaborata

Per banner, slide non-carousel, foto social o varianti di formato oltre a questi script, usa la skill
**`design`**. Qualunque cosa produca deve rispettare **`docs/brand.md`** (motivi visivi, voce, senso
delle scelte) e **`docs/DESIGN-SYSTEM.md`** (palette, tipografia e ogni altro valore concreto).

## Nota ambiente

Nel sandbox `astro build` e gli script che usano i binari nativi (`@resvg/resvg-js`, `sharp`) possono
non girare, perché i `node_modules` del repo sono compilati per il sistema locale. **Valida sempre in
locale** prima di pubblicare (vedi `HANDOFF.md`).
