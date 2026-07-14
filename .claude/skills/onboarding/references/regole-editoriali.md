# Regole editoriali e di stile — non negoziabili

Valgono per gli articoli e per **ogni file che finisce nella repository** (testi, commenti nel
codice, messaggi di commit). Fonte canonica: `docs/editorial-guidelines.md`. Qui la versione operativa
per l'onboarding: falle conoscere al collaboratore *prima* che scriva, non dopo.

## Privacy e nomi

- **Nessun nome di persona** nei file destinati al repo. **Unica eccezione: gli autori del blog.**
- Per chiunque non sia un autore, si usa il **ruolo/qualifica**: "il Product Owner (PO)", "un collega
  del team", "il cliente", "un collaboratore".
- **Anonimizzare i dati del datore di lavoro**: prodotti, clienti, architetture, dataset, numeri
  interni, nomi di progetto vanno resi non riconoscibili. Nel dubbio su materiale sensibile, **ok del
  PO prima di pubblicare**.

## Filtro editoriale (ripasso)

Ogni articolo supera i tre test: **esperienza reale**, **tesi**, **anti-listicle**. Bonus: lo sguardo
tech / human / AI che emerge in modo naturale. Se un pezzo non li supera, si rivede prima di scriverlo,
non dopo.

## Stile

- **Niente trattini lunghi (—).** Sono una firma tipica del testo generato. Si usano due punti,
  virgole, parentesi o punti. (Vale anche per i testi generati dalle skill: se ne vedi, correggili.)
- **Prima persona**, tono diretto e personale.
- **La voce dell'autore resta sua**, soprattutto nei finali. Le skill affinano stile e ritmo, non
  sostituiscono il pensiero né aggiungono idee non presenti nell'originale.

## Bilingue

- Ogni articolo esce in **italiano e inglese**, collegati dallo **stesso `translationKey`**.
- La traduzione è **idiomatica, non letterale**: stesso tono, non stessa sintassi.
- Struttura a specchio: `src/content/blog/it/<slug-it>.md` e `src/content/blog/en/<slug-en>.md`.
  Lo stesso pattern vale per gli autori (`authors/it/`, `authors/en/` con `authorKey` condiviso).

## Documentazione

Cultura del progetto: si documenta sia il tecnico sia il funzionale. In pratica per un collaboratore:
commit chiari, e aggiornamento di `HANDOFF.md` quando cambia lo stato della pipeline (date, pezzi
pronti, cose in attesa di approvazione).

## Perché è severo su questi punti

Il progetto vende esattamente ciò che l'AI tende ad appiattire: voce, giudizio, esperienza reale.
I trattini lunghi, i nomi lasciati per sbaglio, i dati non anonimizzati e la traduzione letterale
sono i modi più veloci per tradire quella promessa. Trattale come vincoli di qualità, non come
formalità.
