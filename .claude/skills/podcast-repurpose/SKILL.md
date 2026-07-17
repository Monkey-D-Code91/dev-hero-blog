---
name: podcast-repurpose
description: >
  Trasforma un articolo pubblicato di The First Draft nel kit di un episodio del podcast
  (YouTube + Spotify): scaletta parlata pensata per un pubblico curioso senza background tecnico,
  descrizione YouTube con capitoli, show notes per Spotify, titoli candidati e collegamenti
  incrociati col blog. Il podcast copre gli stessi principi del blog (tech / human / AI e la loro
  apparente contraddizione) ma cambia registro: dal lettore che lavora nel settore all'ascoltatore
  curioso. Usa questa skill quando l'autore dice cose come "prepariamo l'episodio", "portiamo
  questo articolo nel podcast", "scaletta della puntata", "show notes", "descrizione YouTube",
  "repurpose per il podcast", "podcast episode from this article".
---

# podcast-repurpose — Dall'articolo all'episodio

Trasformi un articolo del blog nel materiale di un episodio di **The Human Constant** (il podcast
del progetto). Non è una lettura ad alta voce del pezzo: è **lo stesso ragionamento, ripensato per
un altro pubblico**. Il lettore del blog lavora
nel settore; l'ascoltatore del podcast è curioso ma può non avere background tecnico. Lingua di
lavoro: italiano (l'episodio è in italiano salvo diversa indicazione).

**Carica il contesto:**
- L'articolo sorgente (di norma la versione IT in `src/content/blog/it/`)
- `docs/editorial-guidelines.md` — le regole valgono anche a voce e nei metadati: niente nomi
  (solo autori), anonimizzazione del datore, niente trattini lunghi nei testi scritti
- `personas/<author-key>.md` se esiste (la voce dell'autore deve restare riconoscibile anche parlata)

## Fase 1 — Il travaso (il passaggio che decide tutto)

Prima di scrivere qualsiasi asset, ricava dall'articolo e proponi all'autore:

1. **La tesi in una frase senza gergo.** Prova del nove: la capirebbe una persona che non ha mai
   aperto una pull request? Se la frase regge solo con termini tecnici, non hai ancora trovato il
   cuore universale del pezzo.
2. **La storia portante.** L'episodio reale al centro dell'articolo, raccontabile a voce in 2-3
   minuti. Le storie sopravvivono al cambio di pubblico; le argomentazioni tecniche no.
3. **La traduzione dei concetti.** Per ogni termine tecnico essenziale, un equivalente quotidiano
   concordato con l'autore (es. la code review come "rileggere e firmare il lavoro di un collega
   prima che vada dal cliente"). Massimo 3-4 concetti tecnici per episodio: gli altri si tagliano,
   non si spiegano.
4. **Il gancio "contraddizione apparente".** Il podcast vive sulla tensione tech/human/AI: formula
   l'angolo dell'episodio come domanda o paradosso che incuriosisce anche fuori dal settore
   (es. "più la macchina scrive, più l'umano deve leggere").

Falla approvare all'autore prima di proseguire: se il travaso è sbagliato, tutto il resto lo è.

## Fase 2 — Scaletta parlata

Struttura una scaletta di 15-25 minuti (adattala se l'autore indica un formato diverso):

- **Cold open** (30-60 sec): il gancio o un pezzo della storia, prima di ogni presentazione.
- **Chi siamo / di cosa parliamo oggi** (breve, senza rito).
- **La storia** raccontata per intero, con i dettagli sensoriali che a voce funzionano.
- **Cosa significa** — la tesi, sviluppata con i concetti tradotti in Fase 1.
- **Il controcampo umano** — perché questa cosa riguarda anche chi non lavora nel tech.
- **Chiusura** — la frase da portare a casa, con parole dell'autore (come nei finali del blog).

Per ogni blocco: punti da toccare e frasi-perno, **non un copione parola per parola** (deve restare
parlato, non letto). Segna dove l'autore può improvvisare su materiale suo.

## Fase 3 — Asset di distribuzione

Prepara e sottoponi all'autore:

1. **Titoli candidati** (3-5): incuriosiscono senza clickbait, comprensibili fuori dal settore.
   Possono divergere dal titolo dell'articolo.
2. **Descrizione YouTube**: 2-3 frasi di gancio + capitoli con timestamp (dalla scaletta, da
   rifinire dopo il montaggio) + link all'articolo IT e EN + link agli altri canali.
3. **Show notes Spotify**: versione compatta della descrizione, senza capitoli, con i link.
4. **Cross-link per il blog**: proponi la riga/paragrafo da aggiungere all'articolo per puntare
   all'episodio ("Ne abbiamo parlato anche nel podcast: ...") quando l'episodio è online.

## Regole sempre attive

- **Mai promettere nell'episodio più di quanto l'articolo argomenta**: stesso rigore, altro registro.
- Niente nomi di persone (solo gli autori/conduttori), dati del datore anonimizzati anche negli
  aneddoti parlati: a voce scappano più facilmente, segnala all'autore i punti a rischio.
- La semplificazione non deve tradire la tesi: se un passaggio semplificato diventa falso,
  meglio ometterlo che distorcerlo.
- Un episodio = un articolo = una tesi. Se l'autore vuole coprire più pezzi, proponi una serie.

## Chiusura

Consegna il kit completo (travaso, scaletta, titoli, descrizioni, cross-link) in un unico
riepilogo. Se utile per il montaggio o per i collaboratori, salva la scaletta in un file che
l'autore indica; non committare nulla senza il suo ok.
