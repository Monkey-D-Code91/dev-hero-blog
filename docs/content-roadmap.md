# The First Draft — Roadmap editoriale

_Ultimo aggiornamento: 2026-08-30 · Cadenza iniziale: 1 articolo ogni 10 giorni (obiettivo: settimanale)_

Questo documento tiene la pipeline editoriale, organizzata in **capitoli tematici**. Le date sono indicative.

## Come funzionano i capitoli

Dal 2026-08-30 il modello e' cambiato. Prima i capitoli erano archi **sequenziali**: uno finiva, il
successivo cominciava, e i pezzi dei collaboratori si incastravano tra quelli di Marco spostando in
avanti tutto il calendario. Il risultato era che la firma di Marco faceva da collo di bottiglia: se un
suo pezzo slittava, slittava anche la serie di un collaboratore che non c'entrava nulla.

Adesso un capitolo raccoglie una **tematica** e ha una **cadenza propria**. I capitoli corrono in
**parallelo** e non si ordinano piu' tra loro nel tempo: il campo `order` nella collection decide solo
l'ordine di visualizzazione in pagina, non la sequenza di pubblicazione. Conseguenze operative:

- Un capitolo puo' pubblicare indipendentemente dagli altri. Nessun filone aspetta un altro filone.
- Le date si rifasano **dentro** un capitolo, non a cascata su tutta la roadmap. Se slitta un pezzo di
  Marco, le date di Fabio non si toccano.
- Un capitolo puo' esistere **vuoto**, come annuncio di un filone deciso ma non ancora definito
  (vedi il capitolo IV). In quel caso porta solo `upcomingTeaser` e nessuna tappa.
- I vincoli di ordinamento restano **interni** al capitolo (la serie musica resta un cerchio 1-2-3-4;
  i due pezzi context di Marco restano distanti tra loro).
- L'alternanza dell'effort e il "respiro" tra pezzi pesanti ora si valutano per capitolo, non piu'
  sul calendario globale.

## Il filtro editoriale

Prima di entrare in roadmap, ogni idea deve superare tre test:

1. **Esperienza reale** — parte da qualcosa che è successo davvero, non da teoria.
2. **Tesi** — porta un'opinione o un punto di vista, non un riassunto.
3. **Anti-listicle** — non diventa il contenuto generato e intercambiabile che il manifesto dice di combattere.

Bonus: lo sguardo **tech / human / AI** emerge in modo naturale.

## Principi di ordinamento

Valgono **dentro** ogni capitolo, non piu' sul calendario globale (vedi "Come funzionano i capitoli").

- Dopo il manifesto, mantenere la promessa in fretta: i primi pezzi passano dalla dichiarazione alla pratica.
- Alternare lo sforzo: non due pezzi ad alto effort di fila nello stesso capitolo.
- Non bruciare il pezzo piu' forte (il case study) prima che il blog abbia un pubblico.
- Il case study e' vincolato a un ok del datore di lavoro e all'anonimizzazione.
- I numeri dei pezzi (#1, #2, ...) sono **identificatori stabili**, non una sequenza globale: servono a
  richiamare un pezzo dalle note degli altri. Non si rinumerano quando un capitolo cambia cadenza.

---

## Pubblicato

| # | Titolo | Data | Capitolo | Stato |
|---|--------|------|----------|-------|
| 1 | Elogio dell'idea grezza (manifesto) | 2026-07-04 | I | ✅ Pubblicato |
| 2 | Nell'era dell'AI si legge più di quanto si scrive | 2026-07-14 | I | ✅ Pubblicato |
| 3 | Imparare a guidare, non a correre | 2026-07-24 | I | ✅ Pubblicato |
| 4 | La sottile linea del codice | 2026-08-30 | I | ✅ Pubblicato |

---

## Capitolo I — La disciplina del codice generato

_A firma Marco · Lug – Ott 2026 · in corso._

Dal controllare il codice al leggerlo, fino al confine di cio' che non deleghiamo. La disciplina
personale nell'era dell'AI: io e il codice.

| # | Titolo di lavoro | Data ind. | Origine | Focus | Effort | Angolo & note |
|---|------------------|-----------|---------|-------|--------|----------------|
| 5 | **Cosa non delego all'AI** | 2026-09-09 | Suggerimento | Tech · Human · AI | Basso-medio | Il confine del giudizio umano, raccontato per decisioni concrete. Pezzo-tesi che tira le fila del filone; il tech/human/AI in forma pura. |
| 6 | **Case study: 22s → 1.1s** | 2026-09-19 | Idea Marco | Tech (rigore) | **Alto** | Deep refactor di componenti frontend, query backend e API sullo stesso dataset. Il pezzo più credibile e condivisibile. **Prerequisiti: anonimizzare prodotto/dati/architettura + ok del Product Owner (PO); diagrammi e misurazioni.** Da fare quando c'è buffer di tempo. Opzionale: un paragrafo su dove l'AI ha aiutato e dove no. |
| 7 | **Il costo nascosto del codice che non hai scritto** | 2026-09-29 | Suggerimento | Tech · Human | Medio | Manutenibilità e ownership del codice generato in un contesto B2B secure: chi lo capisce fra sei mesi? Prolunga il case study nelle conseguenze di lungo periodo; è il tuo dominio esatto. |
| 8 | **Criticità e vantaggi di un team distribuito Italia–Albania** | 2026-10-09 | Idea Marco | Human (+ AI) | Medio | Differenze culturali, seniority diverse, capirsi in inglese. Il più personale. Cambio di ritmo dopo un filone tecnico. **Da scrivere con rispetto e umiltà, dal lato di cosa hai imparato tu**, mai come giudizio sui colleghi. Aggancio al filo: async, inglese lingua franca, AI come livellatore linguistico. |

**Note di capitolo**

- **La spina dorsale** (articoli 2, 4, 5, 7) forma un filone coerente sulla disciplina del codice generato: leggere → controllare → non delegare → il costo nel tempo. Distanziati apposta per non risultare ripetitivi.
- **Il case study (6)** e' il picco di credibilita': piazzato quando c'e' pubblico e clearance, non subito.
- **Il pezzo sul team (8)** e' l'outlier umano/leadership: chiude il capitolo con una nota personale.

---

## Capitolo II — Progettare il loop uomo-AI

_A firma Marco · Ott – Nov 2026 · da aprire._

Dalla disciplina personale al sistema. Non piu' "io e il codice", ma io che progetto il loop dev↔AI e
ne rendo il contesto un asset di prima classe.

| # | Titolo di lavoro | Data ind. | Firma | Focus | Effort | Ruolo & note |
|---|------------------|-----------|-------|-------|--------|--------------|
| 9 | **The new loop** | 2026-10-19 | Marco | Tech · AI · Human | Medio | Cappello dell'arco: dal human-in-the-loop al loop chiuso dev↔AI su ogni fase del workflow. **Da ancorare a un episodio reale** (una fase dove il loop si è chiuso e ti ha sorpreso), altrimenti resta teoria. Gestire la tensione col manifesto e con l'articolo 5: non "il confine sparisce" ma "decido dove tengo la mano sul volante". |
| 11 | **Context fantastici e dove trovarli** (estrazione) | 2026-10-29 | Marco | Tech · Human | Medio-alto | Skill che a ogni code review estrae dal dev il contesto mancante; struttura gerarchica modulo→feature; il contesto alimenta l'AI per meno iterazioni. La prova concreta del "new loop". **Dittico con l'articolo 7** (7 pone il problema, questo è la risposta ingegneristica). Rischio: diventare changelog/annuncio di prodotto → la tesi resta sul principio (il contesto come asset di prima classe, estratto quando la conoscenza è fresca), i dettagli sono prova non contenuto. Anonimizzazione + probabile ok PO. |
| 14 | **Context → documentazione automatica** | 2026-11-08 | Marco | Tech · Human | Medio-alto | Seconda skill: traduce il context tecnico/funzionale in documento funzionale pubblicato su Confluence. Tesi: la documentazione funzionale come sottoprodotto automatico del lavoro, non come tassa separata. Distante 3 slot da #11: ok sul carico. Anonimizzazione + probabile ok PO. |

**Note di capitolo**

- **I due pezzi context** (#11 estrazione, #14 documentazione automatica) sono entrambi medio-alti e sullo stesso sotto-tema: tenerli distanti, mai vicini, per carico ed evitare ridondanza. Ora che il capitolo non ospita piu' i pezzi dei collaboratori, la distanza e' di un solo slot: valutare uno slot cuscinetto a basso effort tra i due.
- **#9 The new loop** e' il cappello del capitolo: va pubblicato per primo.

---

## Capitolo III — AI e musica

_A firma Fabio Ziliani · Set – Nov 2026 · cadenza propria, ogni 20 giorni._

Un cerchio in quattro pezzi. Le stesse domande del blog, poste dal lato del suono.

| # | Titolo di lavoro | Data ind. | Firma | Focus | Effort | Ruolo & note |
|---|------------------|-----------|-------|-------|--------|--------------|
| 10 | **Musica #1 — l'origine** ("Dove vive una canzone, quando la ascolti") | 2026-09-15 | Fabio Ziliani | Human · AI | — | "Conta sapere chi ha scritto una cosa, per poterla amare?" Apre il cerchio. Titolo ufficiale definito, draft pronto in `src/content/blog/{it,en}` (pubDate allineata alla roadmap pubblica: 2026-09-15). |
| 12 | **Musica #2 — la profondità** | 2026-10-05 | Fabio Ziliani | Human · AI | — | "Una cosa vera deve per forza essere seria, sofferta, importante?" L'ironia come forma legittima di sincerità. Respiro leggero. |
| 15 | **Musica #3 — l'originalità** | 2026-10-25 | Fabio Ziliani | Human · AI | — | "Quanto di ciò che chiamiamo autentico era già una formula?" Il gemello musicale del filone codice generato. **Tenere adiacente a un eventuale pezzo di Marco sull'originalità del codice** (dittico cross-firma). |
| 17 | **Musica #4 — il valore** | 2026-11-14 | Fabio Ziliani | Human · AI | — | "Il valore nasce da quanto tempo ci hai messo, o da quanto tempo qualcuno sceglie di dedicarle?" La rosa del Piccolo Principe, chiusura del cerchio. **Chiude il capitolo** sulla nota umana. Rima con "il costo nascosto del codice" (#7). |

**Note di capitolo**

- **La serie e' un cerchio con chiusura esplicita**: va tenuta in ordine (1→2→3→4) e non si spezza. E' l'unico vincolo di sequenza forte della roadmap.
- **Risonanza cross-firma**: il pezzo #15 (originalita': "l'autentico era gia' una formula?") e' il gemello del filone di Marco sul codice generato. Con i capitoli in parallelo l'adiacenza non si ottiene piu' spostando le posizioni in lista, ma **allineando le date**: se Marco scrive il pezzo sull'originalita' del codice, gli si da' una data vicina al 2026-10-25 per creare il dittico.
- La cadenza a 20 giorni e' indipendente da quella di Marco: un suo slittamento non tocca queste date.

---

## Capitolo IV — AI ed etica

_Arco corale · periodo in definizione · **capitolo aperto e ancora vuoto**._

Il filone e' deciso, i pezzi no. In roadmap pubblica il capitolo compare con il solo teaser e nessuna
tappa: e' un annuncio, non una pipeline.

| # | Titolo di lavoro | Data ind. | Firma | Focus | Effort | Ruolo & note |
|---|------------------|-----------|-------|-------|--------|--------------|
| 13 | **AI ed etica #1** | da definire | Collab | Human · AI | — | Apre il filone etica. Tema/i da definire col collaboratore. |
| 16 | **AI ed etica #2…N** | da definire | Collab | — | — | Placeholder: dipende dal numero di pezzi etica. |

---

## Next steps

_Le prime due voci sbloccano il capitolo IV e l'equilibrio delle firme._

- [ ] **Definire il numero di pezzi su AI ed etica** e i loro temi (col collaboratore). Adesso il capitolo IV e' un annuncio vuoto: servono i pezzi veri e una cadenza propria, che non dipende da nessun altro capitolo.
- [ ] **Aggiungere le idee di Marco** per bilanciare l'identita' del blog. Conteggio attuale sui capitoli non ancora chiusi: 3 Marco / 4 Fabio / ≥1 etica, quindi la firma di Marco e' in minoranza. Decisione da prendere di proposito: aggiungere 2-3 idee, oppure accettare consapevolmente una roadmap piu' polifonica.
- [ ] **Valutare il pezzo Marco sull'originalita' del codice** ("l'AI non ha rubato l'originalita', l'ha resa visibile"): riempirebbe sia il buco d'identita' sia il dittico cross-firma col pezzo musica #15. Con i capitoli paralleli va datato vicino al 2026-10-25, non incastrato in lista.
- [ ] **#9 The new loop**: trovare l'episodio reale che ancora la tesi (test "esperienza reale" non ancora superato). Verificare che non contraddica il manifesto e il pezzo #5.
- [ ] **#11 e #14 (context)**: valutare clearance PO e anonimizzazione (stesso vincolo del case study #6). Ora distano un solo slot: decidere se allontanarli o inserire un pezzo cuscinetto a basso effort.
- [ ] **#11 context**: decidere il titolo. Il riferimento a "Animali fantastici e dove trovarli" ammicca a una public figure controversa: valutare se il tono del pezzo regge la leggerezza o se stona su un tema tecnico. Da decidere in fase di scrittura.
- [ ] **Serie musica**: confermare con Fabio la cadenza a 20 giorni e la data di partenza del 2026-09-15 (il draft #1 e' pronto, ma la data non e' ancora concordata con lui).
