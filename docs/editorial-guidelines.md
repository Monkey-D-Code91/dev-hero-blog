# The First Draft — Linee guida editoriali

Regole per chiunque scriva o pubblichi sul blog. Valgono per gli articoli e per ogni file che finisce nella repository.

## Privacy e nomi

- **Non citare mai nomi di persone**, in nessun file destinato alla repo (articoli, documenti, commenti nel codice, commit). Unica eccezione: **gli autori** del blog.
- Per chiunque non sia un autore, usare la **qualifica o il ruolo**, non il nome. Esempi: "il Product Owner (PO)", "un collega del team", "il cliente", "un collaboratore".
- **Anonimizzare i dati del datore di lavoro**: prodotti, clienti, architetture, dataset, numeri interni e nomi di progetto vanno resi non riconoscibili. In caso di dubbio su materiale sensibile, chiedere l'ok al Product Owner prima di pubblicare.

## Filtro editoriale

Ogni articolo deve superare tre test (vedi anche `content-roadmap.md`):

1. **Esperienza reale** — parte da qualcosa che è successo davvero, non da teoria.
2. **Tesi** — porta un punto di vista, non un riassunto.
3. **Anti-listicle** — non è il contenuto generato e intercambiabile che il manifesto combatte.

Bonus: lo sguardo **tech / human / AI** emerge in modo naturale.

## Stile

- **Niente trattini lunghi (—)**: sono una firma tipica del testo generato. Usare due punti, virgole, parentesi o punti.
- Prima persona, tono diretto e personale.
- Bilingue: ogni articolo esce in italiano e inglese, collegati dallo stesso `translationKey`. La traduzione è idiomatica, non letterale.
- **Ripetizioni: da ridurre in italiano, non in inglese.** In italiano la ripetizione ravvicinata della stessa parola appesantisce: se un termine torna più volte nello stesso paragrafo o in paragrafi contigui, varia con sinonimi, pronomi o riformulando la frase, per far scorrere il testo. In inglese la stessa ripetizione è naturale e spesso preferibile, perché ripetere il termine chiave dà coesione e chiarezza: non forzare sinonimi solo per evitarla. La traduzione idiomatica tiene conto di questa asimmetria (lo stesso concetto può restare ripetuto in EN e comparire con più varianti in IT).
- **Eccezione: il termine-tesi.** Se una parola è il concetto portante del pezzo (es. "attrito" in un articolo che parla proprio di quello), tenerla dov'è il cuore dell'argomento e alleggerire solo le occorrenze di servizio. La ripetizione voluta come martellamento retorico è legittima; quella involontaria e ravvicinata no.

## Immagini in corpo articolo

Un articolo puo' contenere un'immagine quando questa porta un'informazione che il testo non puo' dare da solo: un diagramma, una misurazione, un confronto. Mai come decorazione o come stacco visivo.

- **Sintassi markdown, non HTML**: `![testo alternativo](../../../assets/diagrams/<slug>.png)`. Solo cosi' Astro ottimizza l'immagine (dimensioni, formati moderni); un `<img>` scritto a mano salta l'ottimizzazione.
- **Didascalia**: il paragrafo in corsivo **immediatamente successivo** all'immagine. E' una convenzione, non un componente: lo stile in `global.css` la riconosce dalla posizione. Dice cosa si sta guardando, non ripete la frase che precede.
- **Testo alternativo**: descrive il contenuto informativo per chi non vede l'immagine, quindi riporta anche i valori che contano. Non "diagramma delle performance", ma cosa mostra e con quali numeri.
- **Simmetria IT/EN**: stesso numero di immagini nelle due lingue, con alt e didascalia tradotti in modo idiomatico. Se l'immagine contiene testo, si genera una variante per lingua a partire dalla **stessa** spec, cosi' l'unica cosa da tenere allineata sono le poche parole al suo interno.
- **Generazione**: i diagrammi si producono con uno script versionato (`scripts/generate-timeline-diagram.mjs` per i confronti a timeline), non a mano e non con strumenti esterni: lo stile resta di sistema e la figura si rigenera se i dati cambiano.
- **Leggibilita'**: la colonna di lettura e' stretta e l'immagine viene scalata. I corpi di testo dentro una figura vanno dimensionati di conseguenza, verificando il risultato alla larghezza reale, non a quella del file.

## Articoli vivi: la storia delle revisioni

Il blog si chiama The First Draft: la prima bozza non è l'ultima. Quando un pezzo cambia in modo sostanziale dopo la pubblicazione (una tesi corretta, un fatto aggiornato, una precisazione nata dalla discussione), la modifica non si fa in silenzio: si registra.

Come funziona (campo `revisions` nel frontmatter, un blocco per lingua):

- **Solo revisioni sostanziali**: cambia la tesi, un fatto, un'affermazione importante. Mai per refusi, formattazione o cosmesi (quelle si correggono e basta). Rara e voluta.
- **Ogni voce è datata e nella tua voce**: `date` (YYYY-MM-DD) e `note` (cosa è cambiato e perché). La nota è in prima persona, come il resto del pezzo.
- **Aggiornare `updatedDate`** insieme alla revisione (il preflight avvisa se manca): è ciò che accende l'indicatore "rivisto" nei meta e il badge sulle card.
- **Simmetria IT/EN**: stesso numero di voci nelle due lingue, tradotte idiomaticamente (il preflight controlla il conteggio). Valgono le regole di stile: niente trattini lunghi.
- **Rapporto con "Dal tavolo di discussione"**: sono complementari. La discussione riporta lo scambio; la revisione registra cosa hai cambiato di conseguenza. Una revisione può nascere da uno scambio, ma non deve: puoi rivedere anche per un tuo ripensamento.

## Dal tavolo di discussione

Un articolo non si chiude alla pubblicazione: la conversazione che genera (LinkedIn, commenti Giscus) può tornare nel pezzo. È il principio del manifesto reso concreto, "le idee migliori raramente restano come le avevi scritte la prima volta".

Come funziona (campo `discussion` nel frontmatter, un blocco per lingua):

- **Solo scambi veri e che aggiungono qualcosa**: un'obiezione che regge, una precisazione, un punto di vista che sposta l'argomento. Non ringraziamenti o applausi. Raro e voluto, non un tic a ogni uscita.
- **Attribuzione per ruolo, non per nome** (regola privacy): "Un lettore, Tech Lead", "Un collega del team". I nomi solo per gli autori del blog, o con consenso esplicito della persona.
- **Simmetria IT/EN**: stesso numero di scambi nelle due lingue, tradotti idiomaticamente (il preflight controlla il conteggio). Valgono le regole di stile: niente trattini lunghi, prima persona nella replica.
- **Struttura di ogni scambio**: `from` (chi), `quote` (il punto sollevato), `reply` (la tua risposta, opzionale), `via` (dove, es. "LinkedIn", opzionale).
- **Quando aggiungerlo**: dopo che il pezzo ha raccolto discussione, in un giro di ripubblicazione (togliere e rimettere non serve: si aggiunge il campo e si rifà la build). Aggiornare `updatedDate` se l'aggiunta è sostanziale.

## Domande aperte (`/domande-aperte`)

Ogni pezzo lascia qualcosa in sospeso: un "è un'altra storia", un finale che non chiude, una domanda che il testo pone e non risolve. Queste domande sono raccolte nella pagina `/domande-aperte`: la mappa del pensiero in evoluzione (principio 1 del progetto) e l'innesco pubblico dei pezzi futuri. È anche un punto d'ingresso per collaboratori e lettori ("questa domanda la voglio prendere io").

Come funziona (campo `openQuestions` nel frontmatter, un blocco per lingua):

- **Solo domande vere che il pezzo pone davvero**: quelle che l'articolo lascia esplicitamente aperte, non riempitivi generati per avere una riga in più. Rara e voluta: spesso una per pezzo, a volte nessuna.
- **Nella voce dell'autore**, una domanda per voce (campo `question`). Valgono le regole di stile: niente trattini lunghi.
- **Simmetria IT/EN**: stesso numero di domande nelle due lingue, tradotte idiomaticamente (il preflight controlla il conteggio).
- **Quando una domanda viene ripresa**: se un articolo successivo la raccoglie, aggiungere `resumedBy: <translationKey>` alla domanda d'origine. Appena quel pezzo è pubblicato, la pagina la marca come "ripresa" e la linka. Fino ad allora resta "aperta".
- **Quando aggiungerle**: al publish-day del pezzo che le pone (fanno parte del pezzo), oppure quando un nuovo pezzo ne riprende una vecchia (si aggiorna `resumedBy` sull'origine e si rifà la build).

## Gruppo di feedback (nota di processo)

Il gruppo di feedback rivede i pezzi prima che escano, ma è invisibile al lettore. Una riga discreta in coda all'articolo rende visibile il processo di qualità senza esporre nessuno.

Come funziona (campo `feedbackReviewed` nel frontmatter, un booleano per lingua):

- **`feedbackReviewed: true`** → compare in coda al pezzo la riga "Questo pezzo è passato dal gruppo di feedback prima di uscire". Assente o `false` → niente riga.
- **Per-articolo e onesto**: attivarlo **solo** sui pezzi che ci sono passati davvero. Non è una dichiarazione globale (i primi pezzi a firma singola non ci passano).
- **Niente nomi, niente numeri**: la riga parla del gruppo, mai delle persone (regola privacy).
- **Solo pagina articolo**, non sulle card (a differenza del badge "rivisto"): è un dettaglio di processo, non un attributo da lista.
- **Simmetria IT/EN**: stesso valore nelle due lingue (il preflight avvisa se differisce).

## Formato "Contraddizione" (dittico a due firme)

Il manifesto invita a contraddire. Questo formato lo rende un oggetto editoriale: un secondo autore risponde a un pezzo esistente con una tesi opposta o ortogonale, e i due pezzi si linkano a vicenda. È un modo a basso attrito per far entrare i collaboratori (rispondere è più facile che inaugurare un filone).

Come funziona (campo `respondsTo` nel frontmatter del pezzo che risponde):

- **`respondsTo: <translationKey>`**: la chiave dell'articolo a cui il pezzo risponde. Va **solo sul pezzo nuovo** (quello che risponde); l'originale non si tocca, il legame all'indietro è automatico.
- **Bidirezionale e automatico**: il pezzo che risponde mostra in cima "In risposta a →"; l'originale mostra in coda "Il dialogo continua ←". Entrambi solo verso articoli **pubblicati** (un legame verso una bozza compare quando la bozza esce).
- **Identico in IT ed EN**: `respondsTo` è una chiave, non testo, quindi lo stesso valore nelle due lingue (il preflight lo verifica, insieme all'esistenza del bersaglio e al no-auto-riferimento).
- **Quando usarlo**: quando un pezzo è davvero una risposta a un altro (tesi opposta o ortogonale), non per semplice affinità tematica (per quella ci sono i tag e i correlati). Raro e voluto.

## Pagina Roadmap (`/roadmap`)

La pagina roadmap è la versione pubblica e reader-facing del piano editoriale: racconta la direzione del blog per **archi narrativi** (capitoli), non come calendario. La fonte strategica interna resta `content-roadmap.md`; la pagina ha la sua fonte dati curata.

Come si aggiorna (senza toccare il codice):

- I contenuti stanno nella collection `roadmap`: un file per arco per lingua in `src/content/roadmap/{it,en}/`. Modificabili a mano.
- **Ogni modifica va replicata in IT e in EN** (stesso `arcKey`), come per articoli e autori.
- Una tappa ha due forme: **collegata a un post** (`postTranslationKey`) oppure **di pipeline** (`title` + `date` inline). Quando un articolo passa da bozza a pubblicato, sostituire nella tappa il `title` con il `postTranslationKey` del post e mettere `status: published`: titolo, data e link vengono ereditati dal post (nessuna duplicazione).
- **Date**: la pagina mostra la data esatta solo per le tappe già pubblicate e per la prossima in uscita; tutte le altre sono degradate a "mese anno" per evitare di dover rincorrere le scadenze. Nei file la `date` resta comunque completa (YYYY-MM-DD).
- **Firme dei collaboratori**: impostare `collaborator: true` sulla tappa per evidenziarne la firma. Vale la regola privacy: i collaboratori possono essere nominati solo se sono autori del blog; altrimenti usare il ruolo.
- **Filoni non ancora definiti** (es. il track etica): non elencarli come tappe datate. Usare il blocco `upcomingTeaser` in coda all'arco, come invito, finché temi e numero di pezzi non sono confermati col collaboratore.
