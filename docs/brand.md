# The First Draft — Brand

Fonte di verità del brand, per persone e per skill/script. Fino a oggi queste regole vivevano
implicite negli script di `scripts/` e in `src/styles/global.css`: se cambi qualcosa lì, aggiorna
anche qui (e viceversa).

## Identità

- **Nome:** The First Draft
- **Tre pilastri:** **tech · human · AI**, e la loro contraddizione apparente. Ogni contenuto vive
  nella tensione tra i tre; lo sguardo emerge in modo naturale, non forzato.
- **Posizionamento:** curiosity first, ancorato a casi reali, per chi vuole ragionamento e idee in
  evoluzione. Blog rivolto a chi lavora nel settore; podcast **The Human Constant**
  (YouTube/Spotify) sugli stessi principi ma per un pubblico curioso anche senza background
  tecnico: stessa identità visiva, wordmark proprio (vedi `docs/podcast-episode-cover.md`).
- **Anti-modello:** il contenuto generato e intercambiabile (listicle). Il manifesto lo combatte;
  il brand non deve mai somigliargli.

## Voce

- Prima persona, tono diretto e personale. Le tesi sono dell'autore, non "della redazione".
- Onestà intellettuale: tesi scomode benvenute se vere e argomentate; mai slogan.
- Metafore precise e possibilmente dell'autore (il guardrail, il frate amanuense): sono un tratto
  distintivo della voce.
- Sobrietà tipografica: corsivo per l'enfasi, mai maiuscolo urlato.
- **Niente trattini lunghi (—)**, in nessun testo del brand: sono una firma del testo generato.
- Bilingue IT/EN con traduzione idiomatica; ripetizioni da alleggerire in IT, naturali in EN
  (regole complete in `docs/editorial-guidelines.md`, che resta la fonte per l'editoriale).

## Palette

Unica palette per sito e asset (dark, navy profondo). Definita in `src/styles/global.css` e
replicata negli script di rendering.

| Ruolo | Hex | Uso |
|---|---|---|
| Background | `#0b1120` | sfondo principale (sito e asset) |
| Surface | `#0f172a` | sezioni alternate, secondo stop dei gradienti |
| Surface 2 | `#111827` | card, elementi sopraelevati |
| Border | `#1e293b` | bordi sottili decorativi |
| Text | `#e6edf3` | testo principale |
| Muted | `#94a3b8` | testo secondario, label |
| Accent (sky) | `#38bdf8` | CTA, link, cerchio "tech" |
| Accent 2 (teal) | `#2dd4bf` | accento secondario, cerchio "human", onda |
| Indigo | `#818cf8` | cerchio/nodi "AI" |
| Grid | `#22304a` | dot grid decorativa degli asset |

## Tipografia

- **Font unico: Inter** (variable sul sito; istanze statiche 700/600/500 in `scripts/fonts/` per il
  rendering deterministico degli asset).
- Gerarchia negli asset: titolo bold (700), kicker/label medium (500) spaziato in minuscolo
  (es. `tech · human · ai`).

## Motivi visivi ricorrenti

Il sistema visivo degli asset (cover, OG, carousel) è fatto di pochi elementi fissi:

1. **La triade** — tre cerchi sovrapposti (tech: sky, human: teal, AI: indigo con mini-grafo di
   nodi) che si incontrano al centro.
2. **Il "+" luminoso** — il punto d'incontro dei tre cerchi.
3. **La sottolineatura ondulata** — tratto teal a mano, come una correzione di bozza (richiama il
   "first draft").
4. **La dot grid** — griglia di punti discreta sullo sfondo.

Questi elementi non si ridisegnano a mano: li rendono gli script.

## Formati e strumenti canonici

| Asset | Formato | Strumento |
|---|---|---|
| Cover articolo | 1600×836 | `scripts/generate-cover.mjs` |
| OG di default del sito | 1200×630 | `scripts/generate-og.mjs` |
| Carousel LinkedIn | 1080×1350 (4:5), PNG + PDF | `scripts/generate-carousel.mjs` |
| PDF gruppo di feedback | A4 | `scripts/generate-feedback-pdf.py` |

Regola: per gli asset standard di un articolo si usano **sempre** gli script (deterministici,
on-brand). Il design "fuori standard" (nuovi formati, banner di canale, esperimenti) passa dalla
skill `design`, che deve comunque rispettare questo documento.

## Convenzioni di distribuzione

- LinkedIn: post con gancio forte, **link nel primo commento**; carousel come documento PDF.
- Podcast (The Human Constant): stesso brand visivo e stessa palette; l'angolo di ogni episodio è
  la "contraddizione apparente" tra i tre pilastri (vedi skill `podcast-repurpose`). Formati e
  regole delle cover episodio in `docs/podcast-episode-cover.md`.
