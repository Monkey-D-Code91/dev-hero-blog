# Creare il profilo autore

Un collaboratore che firma pezzi ha un **profilo autore** bilingue, che genera la sua pagina pubblica.

## Non farlo a mano: usa la skill `add-author`

L'intero workflow è già implementato e mantenuto nella skill **`add-author`**. Instrada lì. La skill:

- raccoglie i dati in **una sola lingua** (a scelta) e **auto-traduce** nell'altra, con anteprima da
  confermare;
- genera `src/content/authors/it/<slug>.md` e `src/content/authors/en/<slug>.md` con lo schema
  corretto (definito in `src/content.config.ts`);
- valida con `npx astro build`.

Come guida dell'onboarding, il tuo compito è solo: spiegare *perché* si fa (comparire come autore,
avere la propria pagina), poi **attivare `add-author`** e lasciarla lavorare.

## Cosa conviene avere pronto prima di partire

Così la sessione con `add-author` scorre senza interruzioni:

- **Nome** e **slug** desiderato (es. `nome-cognome`).
- **Ruolo** (es. "Software Engineer").
- **Badge / headline / subline**: eyebrow, titolo hero, breve paragrafo in prima persona.
- **Bio "about"** (2-4 frasi) e una frase-guida (`aboutLead`).
- **Esperienze** (periodo, ruolo, azienda, 2-3 frasi) e **categorie di skill**.
- **Link** opzionali (LinkedIn, GitHub, sito) e i **numeri** (anni, team, paesi).
- **Foto profilo** opzionale (path relativo alla root) o solo monogramma come fallback.

## Dopo la creazione

- Il profilo sarà live su `/autori/<slug>/` (IT) e `/en/authors/<slug>/` (EN).
- Commit suggerito (già proposto dalla skill):
  `git add src/content/authors/ && git commit -m "feat(authors): add <nome> profile"`.
- Ricorda: **gli autori sono l'unica categoria di persone citabili per nome** nei contenuti (vedi
  `references/regole-editoriali.md`).

## Riferimento di stile

Il benchmark di tono e struttura è `src/content/authors/it/marco-mariotti.md` (+ la versione EN):
guardalo se serve calibrare badge/headline/subline di un nuovo autore.
