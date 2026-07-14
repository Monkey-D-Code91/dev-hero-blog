# Il progetto — The First Draft

Contesto per inquadrare un collaboratore nuovo. Riassumi, non recitare: prendi ciò che serve.

## Cos'è

**The First Draft** è un blog professionale **bilingue (IT/EN)** sul rapporto tra **tech, human e AI**:
come cambia il lavoro dell'ingegnere del software nell'era del codice generato. Non è un blog di
tutorial né di news: è un blog di **tesi ancorate a esperienza reale**.

Tecnicamente è un sito **Astro** (output statico, SEO curata), con contenuti in Markdown gestiti da
**Keystatic**. React solo per le isole interattive. Dettagli di stack in `README.md`.

## La missione (il manifesto)

Il pezzo fondativo è *"Elogio dell'idea grezza"* (`src/content/blog/it/elogio-dell-idea-grezza.md`).
Tesi di fondo del progetto: nell'era dell'AI il valore si sposta dallo scrivere codice al **definire
i domini funzionali** e al **giudicare** ciò che viene prodotto. L'AI è un "secondo paio di occhi"
che va usato per alimentare dubbio e scetticismo, non per delegare il pensiero. Il blog combatte il
contenuto generato e intercambiabile ("il listicle") con l'opposto: pochi pezzi, veri, con una voce.

## La triade tech / human / AI

È il filo conduttore e anche l'identità visiva (le tre orbite intrecciate col "+" luminoso nelle
cover e nei carousel). Ogni pezzo migliore la tocca in modo naturale, senza forzarla.

## Il filtro editoriale

Prima di entrare in roadmap, ogni idea supera tre test (fonte: `docs/content-roadmap.md` e
`docs/editorial-guidelines.md`):

1. **Esperienza reale** — parte da qualcosa che è successo davvero, non da teoria.
2. **Tesi** — porta un punto di vista, non un riassunto.
3. **Anti-listicle** — non è il contenuto generato e intercambiabile che il manifesto combatte.

Bonus: lo sguardo tech / human / AI emerge in modo naturale.

## La roadmap

`docs/content-roadmap.md` tiene l'ordine di pubblicazione della pipeline **a firma Marco** (cadenza
iniziale ~1 articolo ogni 10 giorni, obiettivo settimanale). L'arco narrativo va da "controllare il
codice" a "leggerlo", "far crescere chi lo scrive", "il confine del giudizio", "la prova sul campo",
"le conseguenze", "la dimensione umana".

I **pezzi dei collaboratori** viaggiano su un track parallelo e si inseriscono tra un articolo di
Marco e l'altro (ogni inserimento sposta in avanti le date della pipeline). Temi collaboratori già
previsti: *AI ed etica*, *AI e musica*. Un collaboratore nuovo di norma **non riordina la roadmap di
Marco**: propone un pezzo, lo si incastra nel calendario con il Product Owner.

Lo stato vivo della pipeline (cosa esce quando, cosa è in attesa di approvazione) sta in `HANDOFF.md`,
che va aggiornato quando cambia.

## Chi è chi

- **Marco Mariotti** — Senior Software Engineer, owner del progetto e autore principale. L'unico
  nome che compare nei contenuti insieme a quelli degli altri autori.
- **Product Owner (PO)** — approva i contenuti sensibili e l'anonimizzazione dei dati del datore.
  Nei testi si cita per ruolo, mai per nome (vedi `references/regole-editoriali.md`).
- **Collaboratori/autori** — chiunque contribuisca con pezzi a propria firma. Diventano "autori" con
  un profilo dedicato (vedi `references/profilo-autore.md`).

## Dove guardare per farsi un'idea concreta

- Un articolo già pubblicato: `src/content/blog/it/elogio-dell-idea-grezza.md` (+ la gemella EN).
- Un profilo autore di riferimento: `src/content/authors/it/marco-mariotti.md`.
- Le regole: `docs/editorial-guidelines.md`. La pipeline: `docs/content-roadmap.md`.
