# Design review — The First Draft

Review del blog live (https://thefirstdraft.dev) e del sorgente in `ProfessionalDevHeroPage`.
Metodo: ispezione live (home, indice blog, articolo) + lettura di `global.css`, componenti `blog/*`, `BaseLayout`, token del design system. Skill di riferimento presenti nel repo: `design-critique`, `accessibility-review`, `ui-ux-pro-max`, `design-system`.

Pubblico e scopo (da `docs/`): blog personale bilingue IT/EN, saggi anti-listicle su tech / human / AI, per sviluppatori e tech lead. Voce editoriale forte, "quality over quantity".

---

## Cosa funziona già (da tenere)

- **Fondamenta accessibilità solide.** Token dedicati (`--color-border-strong` ≥3:1), `:focus-visible`, `prefers-reduced-motion`, `aria-labelledby` sulle card, byline con `sr-only`. Raro vederlo curato così: non toccarlo.
- **Sistema di token pulito** (Tailwind v4 CSS-first) e palette "Modern Tech Dark" coerente.
- **Struttura articolo** ben pensata: back-link doppio, PostMeta, ShareButtons, AuthorCard, RelatedPosts, commenti Giscus.
- **Reveal on-scroll** discreto e rispettoso delle preferenze utente.

---

## Problemi, in ordine di impatto

### 1. La cover dell'articolo non si carica (bug) — Alto
Sulla pagina articolo la cover appare come **riquadro vuoto** (testato dal vivo, restato bianco dopo 2s). Nel `PostCard` dell'indice la stessa cover si vede. Nel build l'`<img>` è above-the-fold ma ha `loading="lazy"` + `fetchpriority="auto"`.
- **Azione:** per l'immagine hero above-the-fold usare `loading="eager"` e `fetchpriority="high"` (è l'elemento LCP: `lazy` qui peggiora anche le Core Web Vitals). Verificare che il derivato webp a 896px sia effettivamente deployato sul CDN.

### 2. Il layout "a griglia" crolla con pochi articoli — Alto
Con 1 solo post pubblicato, sia la home ("Ultimi articoli") sia l'indice blog mostrano **una card isolata con ~60% di spazio vuoto** a destra. Sembra una pagina rotta o in costruzione, proprio all'atto della prima impressione.
- **Azione:** passare a un layout **featured + colonna laterale**. La colonna può ospitare un "In arrivo" alimentato dalla roadmap editoriale reale (`content-roadmap.md`): riempie lo spazio, crea attesa e comunica la cadenza. Vedi mockup A1 e B1.

### 3. Identità tipografica generica per un blog "di scrittura" — Medio-alto
Il brand parla di scrittura e idee (nome "First Draft", logo pennino, "le idee al loro stato grezzo"), ma il testo è **Inter ovunque** — lo stesso font di mille dashboard SaaS. È l'occasione mancata più grande: la tipografia non racconta l'editoriale.
- **Azione:** introdurre un **display/serif** per titoli e corpo articolo (es. Fraunces per i titoli, Newsreader/Source Serif per il corpo), tenendo Inter per UI e meta. Vedi mockup A1/A2. È il cambio a più alto ritorno sull'identità.

### 4. Misura di lettura un po' larga — Medio
Il corpo articolo usa `max-w-3xl` (~768px): a ~16px sono ~85–95 caratteri per riga, sopra l'ideale (65–75). Su un blog long-form incide sulla leggibilità.
- **Azione:** portare la colonna di lettura a ~680px e il corpo a 19–21px con `line-height` ~1.7. Vedi mockup A2.

### 5. Manca wayfinding tematico — Medio
I tag esistono ma non c'è una barra di filtro visibile nell'indice; con l'arco narrativo tech/human/AI della roadmap, aiuterebbe l'esplorazione.
- **Azione:** barra di filtri/tag sotto l'header dell'indice (vedi B1). A basso costo, alto valore di navigazione appena crescono gli articoli.

### 6. Micro-incoerenze con le linee guida editoriali — Basso (ma è nel loro manifesto)
La bio autore in `AuthorCard` **nomina il datore di lavoro** ("in TeamSystem") e usa un **trattino lungo (—)**: entrambi violano `editorial-guidelines.md` (anonimizzare il datore; niente em-dash). Su un blog il cui manifesto è proprio l'anti-generico, la coerenza conta.
- **Azione:** anonimizzare ("in una software house B2B" o simile) e sostituire l'em-dash con due punti/parentesi.

### 7. Dettagli minori
- Cursore/hover sulle card: solo il bordo cambia; considerare un lieve `translateY(-2px)` per feedback (rispettando reduced-motion).
- Empty state commenti ok; valutare un micro-CTA newsletter/RSS a fine articolo per non perdere il lettore che ha finito.

---

## Direzioni proposte (mockup statici allegati)

**Direzione A — "Editorial" (raccomandata).** Pivot d'identità: serif espressivo, palette calda "inchiostro su carta scura", drop-cap, pull-quote, barra di progresso lettura, misura stretta. Comunica esattamente il posizionamento "scrittura vera vs contenuto in serie".
- `mockup-A1-editorial-index.png` — indice: featured post + colonna "In arrivo".
- `mockup-A2-editorial-article.png` — lettura articolo: serif, drop-cap, pull-quote, progress bar.

**Direzione B — "Tech-dark, evoluzione".** Mantiene l'attuale identità navy/ciano e Inter, ma risolve i problemi 2 e 5: layout featured + laterale, barra filtri, meta in monospazio per un tocco "da sviluppatore". Cambio più conservativo, minor rischio.
- `mockup-B1-techdark-index.png` — indice evoluto.

### Come scegliere
- Se l'obiettivo è **differenziarsi e rafforzare il brand editoriale** → Direzione A.
- Se l'obiettivo è **rischio minimo e coerenza col sito personale esistente** → Direzione B.
- Ibrido sensato: adottare A **solo per l'esperienza di lettura articolo** (dove la tipografia conta di più) e B per home/indice.

I mockup sono screen singoli a scopo illustrativo (non pixel-perfect di tutti gli stati); i sorgenti HTML sono in questa cartella.
