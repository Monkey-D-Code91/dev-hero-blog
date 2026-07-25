# scripts

Tooling per la pubblicazione degli articoli di The First Draft. Deterministico e riutilizzabile: stesso comando per ogni articolo.

## preflight-article.mjs

Controllo editoriale e strutturale di un articolo (e del suo gemello nell'altra lingua, incluso in automatico): campi obbligatori del frontmatter, niente trattini lunghi, slug kebab-case, coppia IT/EN allineata (`translationKey`, `pubDate`, `draft`, numero di tag), cover esistente con `coverAlt`, autori noti, `focus` non vuoto, link interni al blog validi (bersaglio esistente e, per i pezzi pubblicati, non-draft), euristica sui nomi di persona (regola privacy). Errori bloccanti (exit 1) e warning. Da eseguire prima di rifinire e sempre prima di pubblicare.

```
node scripts/preflight-article.mjs src/content/blog/it/<slug>.md
node scripts/preflight-article.mjs --all
```

## status.mjs

Stato della pipeline calcolato dai file, in sola lettura: coppie IT/EN per `translationKey` (draft/pubblicato, cover, PDF feedback, carousel presenti) e coerenza tra la collection roadmap e il blog (tappe `published` che puntano a draft, articoli pubblicati non collegati in roadmap). Il "dove eravamo rimasti" fattuale; `HANDOFF.md` resta per le decisioni.

```
node scripts/status.mjs
```

## check-translation-sync.mjs

Rileva le coppie IT/EN disallineate nelle tre collection bilingui: blog (`translationKey`), authors (`authorKey`), roadmap (`arcKey`). Il preflight verifica che il gemello *esista* e che i conteggi dichiarati siano simmetrici; questo script risponde a un'altra domanda: le due lingue sono ancora la stessa cosa, o una e' stata modificata da sola dopo l'ultimo allineamento?

Due segnali indipendenti. **Git**: il "punto di sync" e' l'ultimo commit che ha toccato entrambi i file; quello che e' successo a un solo lato dopo quel commit (commit o modifiche non ancora committate) e' il disallineamento da propagare. **Struttura**: heading, blocchi, code fence, link, immagini, chiavi e voci di lista del frontmatter, che non dipendono da git e intercettano il caso in cui un commit ha toccato entrambi i file per ragioni non correlate.

Sola lettura, exit 0 salvo `--strict`: in CI e' informativo, perche' un disallineamento e' una decisione editoriale, non un errore di build. Richiede la storia git completa (in CI serve `fetch-depth: 0`); su un clone shallow lo dichiara e ripiega sul solo confronto strutturale. Il fix passa dalla skill `sync-translation`.

```
node scripts/check-translation-sync.mjs                          # tutte le coppie
node scripts/check-translation-sync.mjs src/content/blog/it/<slug>.md
node scripts/check-translation-sync.mjs --json                   # output per la skill
node scripts/check-translation-sync.mjs --strict                 # exit 1 se c'e' drift
```

## generate-og.mjs

Genera `public/og-image.png` (1200x630), l'OG di default del sito (home, liste, autori).

```
node scripts/generate-og.mjs
```

## generate-logo-png.mjs

Rende un logo SVG di `public/logos/` in PNG quadrato ad alta risoluzione (1024x1024 di default), per gli usi che richiedono un raster: icona newsletter (Buttondown), avatar social, favicon di piattaforme terze. Output accanto all'SVG.

```
node scripts/generate-logo-png.mjs fd-3-nib        # public/logos/fd-3-nib.png (1024x1024)
node scripts/generate-logo-png.mjs fd-3-nib 512    # public/logos/fd-3-nib@512.png
```

## generate-cover.mjs

Genera la cover 1600x836 di un articolo, in stile brand (triade tech/human/AI, "+" luminoso, sottolineatura ondulata, font Inter). Toolchain node del repo (`@resvg/resvg-js`, gia' in `package.json`). I font sono in `scripts/fonts/` (istanze statiche di Inter, pesi 700/600/500, generate dai woff2 del repo per un rendering deterministico e indipendente dai font di sistema).

Legge dal frontmatter `title` (testo, spezzato in righe in automatico) e `cover` (path di output, risolto rispetto al file dell'articolo). Non tocca il resto del frontmatter.

```
node scripts/generate-cover.mjs src/content/blog/it/<slug>.md
node scripts/generate-cover.mjs src/content/blog/en/<slug>.md
```

## generate-carousel.mjs

Genera un carousel LinkedIn in formato documento 1080x1350 (ratio 4:5) in stile brand (stesse triade, "+" luminoso, sottolineatura ondulata e font Inter della cover) a partire da un articolo e da una spec delle slide, e assembla il tutto in un PDF pronto per l'upload su LinkedIn (piu' le singole slide PNG). Toolchain gia' nel repo: `@resvg/resvg-js` per il rendering, `sharp` (dipendenza di Astro) per assemblare il PDF. Nessuna dipendenza nuova.

Come per la cover, lo script rende lo *stile*; il *contenuto editoriale* di ogni slide sta nella spec, non viene inventato dallo script. Senza `--spec` genera uno scheletro onesto di 3 slide (cover dal `title`, hook dalla `description`, CTA) da rifinire.

```
node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md
node scripts/generate-carousel.mjs src/content/blog/it/<slug>.md --spec carousels/<slug>.json
node scripts/generate-carousel.mjs src/content/blog/en/<slug>.md --out carousels/<slug>
```

Output di default in `carousels/<slug>/`: `slide-01.png ... slide-NN.png` + `<slug>.pdf`. La lingua (per le etichette di default della CTA) e' dedotta dal path (`/it/` o `/en/`) o dal campo `lang` della spec.

### Formato della spec (JSON)

```json
{
  "lang": "it",
  "slides": [
    { "kind": "cover", "title": "(opz., default = title articolo)", "kicker": "Nuovo articolo" },
    { "kind": "point", "kicker": "01", "heading": "Titolo del punto", "body": "Testo breve." },
    { "kind": "quote", "body": "Una frase forte.", "attribution": "The First Draft" },
    { "kind": "cta", "heading": "Leggi l'articolo", "body": "Link nel primo commento.", "link": "thefirstdraft.blog" }
  ]
}
```

Tipi di slide: `cover`, `point`, `quote`, `cta`. Il testo va a capo in automatico. Consiglio: 6-10 slide, una idea per slide, testo corto, la tesi nelle prime due slide, sempre una `cta` finale. Valgono le linee guida editoriali (niente trattini lunghi, niente nomi).

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
