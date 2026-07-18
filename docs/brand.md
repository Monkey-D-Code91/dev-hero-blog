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
- **Distribuzione:** canali proprietari e senza algoritmo prima di tutto. RSS (feed a contenuto
  completo) e **newsletter** (Buttondown, un'email a uscita) sono i canali diretti; LinkedIn è il
  tavolo di discussione, non il padrone del pubblico. La newsletter è inquadrata come canale
  anti-algoritmo (coerente con "niente algoritmi"), non come marketing. Si attiva impostando lo
  username Buttondown in `src/config.ts` (`NEWSLETTER`); finché è vuoto, resta spenta e il sito
  mostra la CTA RSS.

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

- **Inter** per UI, navigazione, card, meta e tutti gli asset generati (variable sul sito;
  istanze statiche 700/600/500 in `scripts/fonts/` per il rendering deterministico degli asset).
- **Newsreader** (serif, variable, self-hosted) SOLO per l'esperienza di lettura articolo:
  titolo h1 e corpo prose della pagina articolo. Motivazione: il brand parla di scrittura
  ("first draft", la correzione di bozza) e il serif nel corpo long-form lo racconta;
  tutto il resto resta Inter per continuità con sito e asset. Decisione del 2026-07-17.
- Corpo articolo: 19px, interlinea 1.7, colonna ~68 caratteri per riga (`max-w-2xl`).
- Gerarchia negli asset: titolo bold (700), kicker/label medium (500) spaziato in minuscolo
  (es. `tech · human · ai`). Gli asset NON usano il serif.

## Motivi visivi ricorrenti

Il sistema visivo degli asset (cover, OG, carousel) è fatto di pochi elementi fissi:

1. **La triade** — tre cerchi sovrapposti (tech: sky, human: teal, AI: indigo con mini-grafo di
   nodi) che si incontrano al centro.
2. **Il "+" luminoso** — il punto d'incontro dei tre cerchi.
3. **La sottolineatura ondulata** — tratto teal a mano, come una correzione di bozza (richiama il
   "first draft").
4. **La dot grid** — griglia di punti discreta sullo sfondo.

Questi elementi non si ridisegnano a mano: li rendono gli script.

Sul sito la triade ha anche una forma minima: il **glifo focus** (tre punti tech · human · ai
nei colori dei pilastri, pieni o vuoti) su card e header articolo, pilotato dal campo `focus`
del frontmatter. È un indicatore QUALITATIVO (un pilastro c'è o non c'è), mai un punteggio:
niente barre, percentuali o voti, che sono l'estetica del contenuto in serie che combattiamo.

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

## Newsletter — email di benvenuto

Testo canonico della welcome email di Buttondown (parte alla conferma dell'iscrizione).
Icona: `public/logos/fd-3-nib.png`. Colore accento: `#38bdf8` (su fondo scuro `#0b1120`).
Vale la regola: niente trattini lunghi, prima persona, nessun effetto elenco.

### Versione italiana (in uso)

**Oggetto:** Benvenuto sulla prima bozza

> Ciao,
>
> grazie per l'iscrizione, e benvenuto. Sono Marco.
>
> The First Draft è lo spazio dove scrivo di tre cose che sembrano tirare in direzioni opposte e invece si spiegano a vicenda: tech, human e AI. Non opinioni levigate costruite per un feed, ma il ragionamento mentre prende forma, sempre a partire da qualcosa di reale successo al lavoro.
>
> La maggior parte dei pezzi nasce dalla mia esperienza da sviluppatore e Tech Lead: cosa cambia davvero l'AI nel modo in cui scriviamo codice, come crescono le persone attorno, i problemi concreti che incontro. Ma vuole essere uno sforzo corale, non un monologo: altre voci sono già in arrivo, una su AI e musica, una su AI ed etica. Sguardi differenti sulla stessa tecnologia.
>
> Mi farò vivo a ogni nuovo articolo. Un'email, nient'altro.
>
> Per iniziare, ti lascio il manifesto: è il modo più chiaro per capire da dove nasce tutto questo e dove sta andando.
>
> **Elogio dell'idea grezza**
> https://thefirstdraft.dev/blog/elogio-dell-idea-grezza/
>
> Ci vediamo alla prossima bozza,
> Marco

### Versione inglese (non ancora in uso)

Pronta per quando la distribuzione punterà anche al pubblico anglofono (obiettivo 2026). Non
è la welcome email attiva: oggi il pubblico arriva soprattutto da LinkedIn (italiano).

**Oggetto:** Welcome to the first draft

> Hi,
>
> Thanks for subscribing, and welcome. I'm Marco.
>
> The First Draft is where I write about three things that seem to pull in different directions and end up explaining each other: tech, human, and AI. Not polished takes built for a feed, but reasoning while it still takes shape, always starting from something real that happened at work.
>
> Most pieces come from my own experience as a developer and Tech Lead: what AI actually changes in how we write code, how people grow around it, the real problems I run into. But this is meant to be a chorus, not a monologue. Other voices are already on the way: one on AI and music, one on AI and ethics. Different ways of looking at the same technology.
>
> You'll hear from me whenever a new piece goes out. One email, nothing else.
>
> A good place to start is the manifesto. It's the clearest way to see where this comes from and where it's going:
>
> **In Praise of the Rough Idea**
> https://thefirstdraft.dev/en/blog/in-praise-of-the-rough-idea/
>
> See you at the next draft,
> Marco
