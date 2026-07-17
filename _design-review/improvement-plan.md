# Improvement plan — The First Draft (design)

Data: 2026-07-17. Costruito su `_design-review/design-review.md` (review precedente), riverificato
riga per riga sul codice attuale, e ancorato a standard e riferimenti esterni (fonti in fondo).

## Principi del blog che vincolano il design (non negoziabili)

Da `docs/brand.md`, `docs/editorial-guidelines.md`, HANDOFF:

1. **Anti-listicle, quality over quantity**: il design deve comunicare "scrittura vera", non
   "content farm". Niente pattern da SaaS/marketing (popup, badge, urgenza).
2. **Tre pilastri tech · human · AI** e la loro tensione: la triade è già il motivo visivo degli
   asset; il sito deve restare coerente con la palette navy e i motivi ricorrenti.
3. **Sobrietà tipografica**: corsivo per enfasi, mai urlato; niente em-dash in nessun testo.
4. **Accessibilità come tratto identitario**: token dedicati, `:focus-visible`,
   `prefers-reduced-motion`, semantica delle card. Già sopra la media: ogni modifica deve
   mantenerla (WCAG 2.2 AA come baseline).
5. **Bilingue IT/EN simmetrico**: ogni intervento va applicato a entrambe le lingue.
6. **Asset deterministici via script**: la palette e Inter sono replicati in `scripts/`; ogni
   cambio di brand visivo va riflesso in `docs/brand.md` e negli script, non solo nel CSS.

## Regole e riferimenti usati per l'analisi

**Regole (standard di lettura long-form, confermati dalla ricerca 2026):**
- Misura di riga **50–75 caratteri** (sweet spot ~66); corpo **18–20px** su desktop per il
  long-form; interlinea **1.6–1.8**; colonna singola; testo sempre allineato a sinistra.
- Core Web Vitals: l'immagine hero above-the-fold è l'elemento LCP → mai `loading="lazy"`,
  servire `fetchpriority="high"` + `loading="eager"`.
- WCAG 2.2 AA: contrasto testo 4.5:1, UI 3:1 (già gestito con `--color-border-strong`),
  target ≥24px, focus visibile (già ok).
- Serif per il corpo long-form: nel 2026 è tornato legittimo e distintivo per siti editoriali;
  nessuna penalità di leggibilità documentata rispetto al sans per pubblico generalista.

**Skill disponibili nel repo per eseguire il piano:**
- `ui-ux-pro-max` → review/fix di layout, palette, tipografia (usata come checklist).
- `ui-styling` / `design-system` → implementazione token e componenti Tailwind v4.
- `design` → asset fuori standard (se si toccano cover/OG).
- `verify` + `code-review` → validazione dopo ogni intervento; `npm run build` sempre.

**Esempi di riferimento** (per taratura, non per imitazione): Stripe/Cloudflare/GitHub
engineering blogs (gerarchia e misura di lettura), Pragmatic Engineer (voce personale
long-form), CSS-Tricks (cura dei dettagli di lettura).

## Cosa NON toccare

- Fondamenta di accessibilità (token, focus, reduced-motion, aria delle card).
- Palette "Modern Tech Dark" e motivi della triade: sono il brand, funzionano.
- Struttura pagina articolo (back-link, PostMeta, Share, AuthorCard, Related, Giscus).
- Pipeline asset deterministica.

## Piano di miglioramento, in ordine di priorità

### P1 — Cover articolo: fix LCP (bug, ~15 min)
`src/components/blog/BlogPostLayout.astro:101`: l'`<Image>` della cover è above-the-fold ma usa
i default di Astro (`loading="lazy"`). Nella review live appariva come riquadro vuoto.
- Aggiungere `loading="eager"` e `fetchpriority="high"` alla sola cover dell'articolo
  (le card in lista restano lazy).
- Verificare sul deploy che il derivato webp 896px esista sul CDN.

### P2 — Esperienza di lettura: misura e corpo (~1–2 h)
Oggi: `max-w-3xl` (~720px utili) con prose a 16px ≈ 85–95 caratteri per riga, sopra lo
standard 50–75.
- Colonna articolo a **~68ch (~680px)**: sostituire `max-w-3xl` con un `max-w-[68ch]`
  (o token dedicato `--width-measure`).
- Corpo prose a **18–19px** (`prose-lg` o override) con `line-height` ~1.7.
- Header, cover e meta possono restare più larghi della colonna testo se serve respiro.
- Impatto alto sul prodotto principale del blog (la lettura), rischio quasi nullo.

### P3 — Identità tipografica dell'articolo (decisione di brand, ~mezza giornata)
Il brand parla di scrittura ("First Draft", pennino, correzione di bozza) ma tutto è Inter,
che `docs/brand.md` codifica come font unico. Raccomandazione (opzione "ibrida" della review
precedente): **serif solo per l'esperienza di lettura articolo** (titolo h1 + corpo prose),
Inter ovunque altro (UI, card, meta, asset).
- Candidati: **Newsreader** o **Source Serif 4** per il corpo; titoli o nello stesso serif
  o Fraunces se si vuole più carattere. Variable font, self-hosted come Inter.
- Richiede aggiornamento di `docs/brand.md` (nuova sezione tipografia: "Inter per UI e asset,
  serif per il corpo articolo") — gli script asset NON cambiano.
- Se si preferisce rischio zero: rimandare e fare solo P2; la misura corretta da sola
  migliora già molto.

### P4 — Indice blog: layout "featured + In arrivo" (~mezza giornata)
Con 2 articoli pubblicati la griglia 2-col regge appena; il problema si ripresenta a ogni
numero dispari e non comunica la cadenza editoriale.
- Primo articolo come **featured** a tutta larghezza, gli altri in griglia.
- Colonna/striscia **"In arrivo"** alimentata dalla roadmap reale (`docs/content-roadmap.md`
  o la collection della pagina roadmap già esistente): riempie, crea attesa, è on-brand
  ("idee in evoluzione"). Riusare i dati della pagina `/roadmap` già implementata.

### P5 — Wayfinding: barra tag nell'indice (~1–2 h)
Le pagine `/blog/tag/[tag]` esistono già ma non sono raggiungibili dall'indice.
- Barra di `TagPill` linkabili sotto l'header di `BlogList` (IT + EN), con stato "attivo"
  sulla pagina tag. Costo minimo, valore crescente con i contenuti.

### P6 — Coerenza editoriale nei contenuti autore (~30 min, decisione di Marco)
`src/content/authors/{it,en}/marco-mariotti.md` usa **em-dash** (subline e "Dominio — Telecom")
e **nomina il datore** ("TeamSystem", anche in `company:`). Le linee guida del brand vietano
gli em-dash ovunque e chiedono dati del datore anonimizzati; nel contesto attuale (articolo #2
in attesa di approvazione del datore) la coerenza conta doppio.
- Em-dash: sostituire con due punti o virgole (nessuna ambiguità, fare subito).
- Nome del datore sulla pagina autore: può essere una scelta deliberata di personal branding;
  **da confermare con Marco** prima di anonimizzare.

### P7 — Rifiniture (backlog, quando capita)
- Hover card: aggiungere `translateY(-2px)` oltre al bordo (dentro il blocco
  `prefers-reduced-motion: no-preference`).
- Barra di progresso lettura sull'articolo (sottile, accent, `prefers-reduced-motion` aware).
- Micro-CTA a fine articolo: link RSS + rimando al podcast The Human Constant quando lancia
  (niente popup, coerente col principio anti-marketing).
- Drop-cap / pull-quote: solo se si adotta P3, altrimenti stonano con Inter.

## Sequenza consigliata

1. P1 + P6(em-dash) in un'unica PR piccola (fix oggettivi).
2. P2 (misura di lettura) → verificare con `verify` su un articolo reale IT ed EN.
3. Decisione su P3 con Marco (unica scelta di brand del piano); poi P3 se approvata.
4. P4 + P5 insieme (stessa area, indice blog).
5. P7 a piacere.

Ogni step: branch + PR (mai push su main), `npm run build` verde, controllo IT ed EN,
check contrasto su ogni nuovo colore/testo introdotto.

## Fonti

- UXPin — Optimal line length 50–75 char: https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/
- USWDS Typography (standard pubblico su misura/leading): https://designsystem.digital.gov/components/typography/
- Adoc Studio — Typography guide 2026: https://www.adoc-studio.app/blog/typography-guide
- Logos Web Designs — Web typography 2026 (serif comeback, 1.6–1.8 lh): https://logoswebdesigns.com/blog/website-typography-best-practices-2026/
- Draft.dev — Engineering blogs benchmark 2026: https://draft.dev/learn/engineering-blogs
- Review precedente e mockup: `_design-review/design-review.md`, `mockup-A1/A2/B1`.
