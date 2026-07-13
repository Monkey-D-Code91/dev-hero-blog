# scripts

Tooling per la pubblicazione degli articoli di The First Draft. Deterministico e riutilizzabile: stesso comando per ogni articolo.

## generate-og.mjs

Genera `public/og-image.png` (1200x630), l'OG di default del sito (home, liste, autori).

```
node scripts/generate-og.mjs
```

## generate-cover.mjs

Genera la cover 1600x836 di un articolo, in stile brand (triade tech/human/AI, "+" luminoso, sottolineatura ondulata, font Inter). Toolchain node del repo (`@resvg/resvg-js`, gia' in `package.json`). I font sono in `scripts/fonts/` (istanze statiche di Inter, pesi 700/600/500, generate dai woff2 del repo per un rendering deterministico e indipendente dai font di sistema).

Legge dal frontmatter `title` (testo, spezzato in righe in automatico) e `cover` (path di output, risolto rispetto al file dell'articolo). Non tocca il resto del frontmatter.

```
node scripts/generate-cover.mjs src/content/blog/it/<slug>.md
node scripts/generate-cover.mjs src/content/blog/en/<slug>.md
```

## generate-feedback-pdf.py

Genera il PDF "bozza per revisione" di un articolo per il gruppo di feedback (pill, titolo, sommario in corsivo, byline, capolettera, testo giustificato serif, numero pagina).

Non e' nella toolchain node: per i PDF impaginati weasyprint (Python) e' lo strumento piu' adatto e leggero. Dipendenza isolata, non fa parte del build del sito.

```
pip install -r scripts/requirements-pdf.txt
python3 scripts/generate-feedback-pdf.py src/content/blog/it/<slug>.md [output.pdf]
```

Legge `title`, `description`, `pubDate` dal frontmatter. Pensato per la versione IT. Se l'output non e' indicato, scrive in `feedback/<Slug-con-iniziale-maiuscola>.pdf`.

### Alternativa pura-node (futura)

Se in futuro si vuole eliminare la dipendenza Python, il PDF di feedback si puo' generare dal sito stesso: una route Astro "print" con CSS di stampa, resa in PDF da un browser headless. Riusa le stesse regole tipografiche del sito, al costo di una dipendenza browser. Per ora weasyprint resta la via piu' semplice.
