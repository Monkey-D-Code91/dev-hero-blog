---
name: publish-article
description: >
  Runbook del giorno di pubblicazione per un articolo di The First Draft: porta una coppia IT+EN
  da draft a pubblicata in modo completo e verificato. Esegue il preflight editoriale, toglie
  draft su entrambe le lingue, verifica/genera gli asset (cover, PDF feedback, carousel), valida
  la build, aggiorna la roadmap (collection IT+EN e docs/content-roadmap.md) e HANDOFF.md,
  prepara commit/PR e la bozza del post LinkedIn. Usa questa skill quando l'autore dice cose come
  "pubblica l'articolo oggi", "esce il pezzo", "manda live", "togli il draft", "publication day",
  "publish this article", o quando in HANDOFF.md è previsto che oggi esca un pezzo. Per rifinire
  il testo prima della pubblicazione la skill giusta è refine-article; questa parte da un
  articolo già pronto.
---

# publish-article — Runbook di pubblicazione

Porti un articolo pronto (IT+EN in `draft: true`) al suo stato pubblicato, senza dimenticare
nessun pezzo del rituale. Sei metodico: ogni passo verificato prima del successivo. Lingua di
lavoro: italiano.

**Prerequisito:** l'articolo esiste in entrambe le lingue, rifinito e approvato dall'autore.
Se il testo non è pronto, ferma e instrada verso `refine-article`.

## Passo 0 — Identifica la coppia e fai il punto

1. Se l'autore non ha indicato l'articolo, esegui `node scripts/status.mjs` e proponi il
   candidato più plausibile (draft con `pubDate` più vicina a oggi). Chiedi conferma.
2. Verifica in `HANDOFF.md` e `docs/content-roadmap.md` se ci sono vincoli aperti (es. ok del
   datore di lavoro non ancora arrivato, come per il pezzo del caso reale). **Se un vincolo è
   aperto, fermati e segnalalo**: la pubblicazione la sblocca l'autore, non tu.
3. Se `pubDate` non è oggi, chiedi se aggiornarla a oggi (in entrambe le lingue) o mantenerla.

## Passo 1 — Preflight

```bash
node scripts/preflight-article.mjs src/content/blog/it/<slug>.md
```

Il gemello EN è incluso in automatico. **Zero errori è vincolante.** I warning vanno mostrati
all'autore e risolti o accettati esplicitamente (es. cover assente → generarla ora).

**Nota sull'anteprima per il feedback.** Se prima della pubblicazione serve un ultimo giro col
gruppo di feedback, il canale è la build di anteprima di Workers Builds: apri (o riusa) una PR
col draft e condividi il Branch Preview URL che Cloudflare commenta sulla PR
(`<branch>-dev-hero-blog.marco-mariotti09.workers.dev`). Le build di branch diversi da `main`
includono i draft con `noindex` e banner; l'URL è stabile per branch e si aggiorna a ogni push.
Il PDF (`scripts/generate-feedback-pdf.py`) resta come canale secondario. Vedi `src/utils/preview.ts`.

## Passo 2 — Asset

- **Cover mancanti** (IT o EN): aggiungi `cover`/`coverAlt` al frontmatter e genera con
  `node scripts/generate-cover.mjs <articolo>` per ciascuna lingua.
- **Se il titolo è cambiato** dopo l'ultima generazione: rigenera le cover comunque.
- **Carousel LinkedIn** (opzionale, chiedilo): proponi tu una spec JSON di 6-10 slide ricavata
  dall'articolo (tesi nelle prime due, una idea per slide, `cta` finale, regole editoriali valide
  anche qui), falla approvare, poi
  `node scripts/generate-carousel.mjs <articolo-it> --spec carousels/<slug>.json`.
- Il PDF di feedback di norma è già stato fatto prima; non serve per pubblicare.

## Passo 3 — Togli il draft e valida

1. Rimuovi `draft: true` (o metti `false`) **su entrambe le lingue**.
2. `npm run build` in locale (non con `npm run dev` attivo). Deve completare senza errori.
3. Ri-esegui il preflight: ancora zero errori.

## Passo 4 — Allinea roadmap e stato

1. **Collection roadmap** (`src/content/roadmap/{it,en}/`): trova la tappa dell'articolo e
   sostituisci `title` inline con `postTranslationKey: <translationKey>` e `status: published`
   (titolo, data e link verranno ereditati dal post). **In entrambe le lingue.**
2. **`docs/content-roadmap.md`**: sposta la riga nella tabella "Pubblicato" con data e ✅;
   ricalibra le date della pipeline se l'uscita è slittata.
3. **`HANDOFF.md`**: aggiorna lo stato (cosa è uscito oggi, prossimo pezzo in pipeline) e la data
   di ultimo aggiornamento. Nota: HANDOFF.md non è versionato, va comunque tenuto aggiornato.
4. **Domande aperte** (`openQuestions`, opzionale ma consigliato): se il pezzo lascia una domanda
   davvero in sospeso ("è un'altra storia", un finale che non chiude), dichiarala nel frontmatter
   **in IT e in EN** (stesso numero, il preflight controlla). Confluisce nella pagina
   `/domande-aperte`. Solo domande vere che il testo pone, non riempitivi. Se questo pezzo riprende
   una domanda di un articolo precedente, aggiungi `resumedBy: <translationKey di questo pezzo>`
   alla domanda d'origine (verrà marcata "ripresa" e linkata). Dettagli in `docs/editorial-guidelines.md`.
5. Verifica l'allineamento: `node scripts/status.mjs` non deve segnalare incoerenze roadmap/blog.

## Passo 5 — Commit e PR

Mostra all'autore il diff sintetico e proponi:

```bash
git checkout -b publish/<slug>
git add src/content/blog src/content/roadmap src/assets/covers docs/content-roadmap.md [carousels/<slug>]
git commit -m "feat(blog): publish <titolo IT>"
```

PR su GitHub con `gh pr create` (titolo = titolo dell'articolo, corpo con link IT ed EN attesi).
Commit e push solo con l'ok esplicito dell'autore.

## Passo 6 — Bozza post LinkedIn

Prepara la bozza del post di lancio, da consegnare come testo (non pubblicarlo tu):

- **Gancio forte in apertura**, preso dal cuore del pezzo (es. per il pezzo sulla review:
  "quindici minuti di lavoro, quattro ore di review"). Mai un riassunto piatto.
- Corpo breve (4-8 righe), prima persona, la tesi senza spoilerare tutto l'argomento.
- **Link nel primo commento** (convenzione del blog): prepara anche il testo del commento con
  l'URL dell'articolo.
- Se c'è il carousel, il post lo accompagna come documento PDF.
- Valgono le regole editoriali: niente trattini lunghi, niente nomi, anonimizzazione.

## Dopo l'uscita — articoli vivi

Non sono passi del giorno di pubblicazione, ma vanno ricordati qui: un pezzo continua a vivere.
Entrambi si aggiungono in un giro di ripubblicazione (dettagli in `docs/editorial-guidelines.md`).

- **Dal tavolo di discussione** (`discussion`): quando il pezzo ha raccolto discussione (LinkedIn,
  Giscus), i 2-3 scambi migliori tornano nell'articolo. Solo scambi veri che aggiungono qualcosa,
  attribuzione per ruolo (regola privacy), stessa quantità in IT ed EN (il preflight controlla).
- **Storia delle revisioni** (`revisions`): quando il pezzo cambia in modo sostanziale (tesi, un
  fatto, una precisazione), si registra una voce datata. Solo revisioni vere, mai refusi/cosmesi.
  Aggiornare `updatedDate` insieme (accende l'indicatore "rivisto"); simmetria IT/EN controllata.

## Chiusura

Riepiloga: URL attesi IT/EN, stato roadmap, PR aperta, post LinkedIn pronto. Se qualcosa è
rimasto fuori (es. carousel rimandato), scrivilo in `HANDOFF.md` come prossimo passo.
