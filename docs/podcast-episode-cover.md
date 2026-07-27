# The Human Constant — Formato cover episodi (ricerca e decisioni)

Sintesi della ricerca sui formati cover per il podcast (YouTube + Spotify) e decisioni prese
il 2026-07-17, come base per lo script `scripts/generate-episode-cover.mjs` (da implementare).
Il podcast si chiama **The Human Constant**: stessi principi del blog The First Draft
(tech · human · AI e la loro contraddizione apparente), pubblico curioso anche senza background
tecnico.

## Ricerca: requisiti delle piattaforme (verificati 2026-07)

### Artwork episodio / show (Spotify, Apple Podcasts)

| Requisito | Valore |
|---|---|
| Formato consigliato universale | **3000×3000 px, quadrato 1:1** |
| Minimo Apple Podcasts | 1400×1400 (max 3000×3000) |
| Minimo Spotify | 640×640 (max 10000×10000) |
| File | JPEG o PNG, RGB; **Apple: ≤512KB** (JPEG qualità 80-90 a 3000px ci sta) |
| Episode art | Supportata da Spotify e Apple, stesse specifiche della show art; rende l'episodio riconoscibile in lista e nel player |

### Thumbnail video YouTube (l'episodio come video)

| Requisito | Valore |
|---|---|
| Aspect ratio | **16:9** |
| Risoluzione | 1280×720 standard; da marzo 2026 consigliato fino a 3840×2160 (4K), limite file alzato a 50MB da desktop |
| File | JPG/PNG/GIF statica; JPG di norma il miglior rapporto qualità/peso |
| Playlist podcast YouTube | usa invece **1:1** (1280×1280): si ricava dal master quadrato |

### Vincoli di leggibilità (dalla ricerca sulle best practice)

- ~87% del traffico YouTube è mobile: nel feed suggerimenti la thumbnail appare a **~156×88 px**.
  Tutto ciò che conta deve restare leggibile a quella scala.
- Trend 2026: **poco o zero testo** sulla thumbnail (il titolo lo mostra la piattaforma);
  color blocking netto e un solo soggetto focale sono gli stili a più alto CTR.
- Su Spotify le cover in lista scendono a ~64px: il numero episodio deve reggere anche lì.
- Zone da evitare: angolo in basso a destra su YouTube (overlay durata video); su Spotify/Apple
  alcuni UI arrotondano gli angoli, tenere i contenuti critici nell'~85% centrale.

Fonti:
[Transistor — specs cover art](https://support.transistor.fm/en/article/specs-for-podcast-cover-art-on-apple-podcasts-spotify-etc-1dyjud8/) ·
[Podcastools — guida 2026](https://www.podcastools.com/blog/podcast-cover-art-size) ·
[Moda — Spotify sizes 2026](https://moda.app/resources/sizes/spotify) ·
[PodRewind — requisiti tecnici](https://podrewind.com/blog/podcast-artwork-requirements-guide) ·
[Hooksnap — YouTube thumbnail 2026 e standard 4K](https://www.hooksnap.io/blog/youtube-thumbnail-size-guide-2026) ·
[SocialSizes — YouTube thumbnail](https://socialsizes.io/youtube-thumbnail-size/) ·
[freeimages — CTR design tips 2026](https://blog.freeimages.com/post/youtube-thumbnail-size-2026)

## Decisioni (2026-07-17)

1. **Un'unica spec per episodio → tre rendition** (stesso pattern di `generate-carousel.mjs`):
   - `cover-square.jpg` — **3000×3000**, JPEG ≤512KB: episode art Spotify/Apple, e base per la
     playlist podcast YouTube (downscale 1280×1280 se servirà).
   - `cover-youtube.png` — **2560×1440** (16:9, sopra lo standard 1280×720, sotto i limiti):
     thumbnail del video episodio.
   - `cover-social.jpg` — **1080×1080**: post di lancio LinkedIn/Instagram.
2. **Foto/frame integrata, due trattamenti via flag:**
   - Default: **duotone brand** (sharp: greyscale + tint navy→azzurro `#0b1120`→`#38bdf8`),
     così ogni episodio è coerente qualunque sia la sorgente (foto, frame video).
   - `--natural`: colori originali con gradiente navy di leggibilità sul blocco testo, per i
     casi in cui i colori reali contano (es. frame con schermo/demo).
   - Senza immagine: layout solo tipografico + motivi brand (come le cover blog).
3. **Testo: numero + titolo breve.** "EP. 04" ben visibile (deve reggere a 64-156px) + titolo
   dell'episodio su max 2 righe con auto-wrap (stessa logica di `generate-cover.mjs`). Niente
   altro testo sulla rendition YouTube; sul quadrato anche il wordmark del podcast.
4. **Identità:** il podcast si chiama **The Human Constant**. È un'estensione del brand
   The First Draft: stessa palette, Inter, motivi visivi compatibili (`docs/brand.md` §3.3 e
   `docs/DESIGN-SYSTEM.md` §2),
   ma con wordmark proprio.

## Spec dello script `generate-episode-cover.mjs` (da implementare)

Toolchain già nel repo: `@resvg/resvg-js` (render SVG→PNG, embed dell'immagine come data URI),
`sharp` (crop/resize/duotone della foto, conversione JPEG e controllo peso ≤512KB), font statici
in `scripts/fonts/`.

```
node scripts/generate-episode-cover.mjs episodes/<nn>-<slug>/episode.json
node scripts/generate-episode-cover.mjs episodes/<nn>-<slug>/episode.json --natural
```

Spec `episode.json` (il contenuto sta nella spec, lo script rende lo stile — come il carousel):

```json
{
  "number": 4,
  "title": "Titolo breve dell'episodio",
  "image": "frame.jpg",          // opzionale; path relativo alla spec
  "focal": "center",             // opzionale: center|top|left|right per il crop
  "articleTranslationKey": "..." // opzionale: aggancio all'articolo di origine
}
```

Output in `episodes/<nn>-<slug>/`: `cover-square.jpg`, `cover-youtube.png`, `cover-social.jpg`.

Pipeline: sharp prepara l'immagine (crop al ratio della rendition, resize, duotone o overlay)
→ SVG di layout per ciascuna rendition (numero, titolo con wrap, wordmark, motivi brand)
→ resvg render → sharp per l'export JPEG con qualità adattiva finché ≤512KB (solo square).

Vincoli di layout: contenuti critici nell'85% centrale (square); niente testo nell'angolo in
basso a destra (youtube); "EP. NN" leggibile a 64px (square) e 156px (youtube).

## Punti aperti

- **Wordmark/logo di The Human Constant**: da disegnare (skill `design`, nel rispetto di
  `docs/brand.md` §3.5). Finché non c'è, lo script usa il nome in tipografia Inter.
- **Show cover** (la copertina del canale, una tantum): non tra gli output per-episodio; da
  fare con lo stesso sistema quando il canale apre.
- **Motivo visivo distintivo del podcast**: capire se la triade dei cerchi resta identica al
  blog o se il podcast merita una variante (es. forma d'onda audio che attraversa la triade).
- **Dove vivono gli episodi nel repo**: proposta `episodes/<nn>-<slug>/` (spec + asset);
  da confermare quando esiste il primo episodio reale.
