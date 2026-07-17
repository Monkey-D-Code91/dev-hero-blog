# The First Draft — Roadmap editoriale

_Ultimo aggiornamento: 2026-07-04 · Cadenza iniziale: 1 articolo ogni 10 giorni (obiettivo: settimanale)_

Questo documento tiene l'ordine di pubblicazione della pipeline di articoli **a firma Marco**. Le date sono indicative: i pezzi dei collaboratori (vedi in fondo) si inseriscono tra un articolo e l'altro e spostano il calendario.

## Il filtro editoriale

Prima di entrare in roadmap, ogni idea deve superare tre test:

1. **Esperienza reale** — parte da qualcosa che è successo davvero, non da teoria.
2. **Tesi** — porta un'opinione o un punto di vista, non un riassunto.
3. **Anti-listicle** — non diventa il contenuto generato e intercambiabile che il manifesto dice di combattere.

Bonus: lo sguardo **tech / human / AI** emerge in modo naturale.

## Principi di ordinamento

- Dopo il manifesto, mantenere la promessa in fretta: i primi pezzi passano dalla dichiarazione alla pratica.
- Arco narrativo: _controllare il codice → leggerlo → far crescere chi lo scrive → il confine del giudizio → la prova sul campo → le conseguenze → la dimensione umana._
- Alternare lo sforzo: non due pezzi ad alto effort di fila.
- Non bruciare il pezzo più forte (il case study) prima che il blog abbia un pubblico.
- Il case study è vincolato a un ok del datore di lavoro e all'anonimizzazione.

## Pubblicato

| # | Titolo | Data | Stato |
|---|--------|------|-------|
| 1 | Elogio dell'idea grezza (manifesto) | 2026-07-04 | ✅ Pubblicato |

## Pipeline

| # | Titolo di lavoro | Data ind. | Origine | Focus | Effort | Angolo & note |
|---|------------------|-----------|---------|-------|--------|----------------|
| 2 | **La sottile linea del codice** | 2026-07-14 | Idea Marco | Tech · AI | Medio | Camminare sulla linea tra codice generato controllato e incontrollato. Converte il manifesto in pratica. **Perno: un caso reale** in cui il codice generato è sfuggito di mano, da cui ricavare le euristiche. Rischio: diventare il listicle che critica. |
| 3 | **Nell'era dell'AI si legge più di quanto si scrive** | 2026-07-24 | Suggerimento | Tech · Human | Medio-basso | La lettura del codice e la code review come competenza centrale che l'AI rende _più_ importante, non meno. Progressione naturale dal "controllare" al "giudicare"; ponte verso il mentoring. |
| 4 | **Imparare a guidare, non a correre** (già "La crescita dello sviluppatore con l'AI") | 2026-08-03 | Idea Marco | Human · AI | Medio | Crescere in modo strutturato nell'era del codice generato, senza restare fermi. Differenziatore: il lato Tech Lead/mentoring, cosa vedi davvero succedere ai junior. **Bozza pronta (`draft: true`), cover e PDF generati.** Perno: una PR con un pattern di hydration/rehydration dove bastava una ref. Tesi: la velocità è il prodotto di scarto di un buon design. |
| 5 | **Cosa non delego all'AI** | 2026-08-13 | Suggerimento | Tech · Human · AI | Basso-medio | Il confine del giudizio umano, raccontato per decisioni concrete. Pezzo-tesi che tira le fila del filone; il tech/human/AI in forma pura. |
| 6 | **Case study: 22s → 1.1s** | 2026-08-23 | Idea Marco | Tech (rigore) | **Alto** | Deep refactor di componenti frontend, query backend e API sullo stesso dataset. Il pezzo più credibile e condivisibile. **Prerequisiti: anonimizzare prodotto/dati/architettura + ok del Product Owner (PO); diagrammi e misurazioni.** Da fare quando c'è buffer di tempo. Opzionale: un paragrafo su dove l'AI ha aiutato e dove no. |
| 7 | **Il costo nascosto del codice che non hai scritto** | 2026-09-02 | Suggerimento | Tech · Human | Medio | Manutenibilità e ownership del codice generato in un contesto B2B secure: chi lo capisce fra sei mesi? Prolunga il case study nelle conseguenze di lungo periodo; è il tuo dominio esatto. |
| 8 | **Criticità e vantaggi di un team distribuito Italia–Albania** | 2026-09-12 | Idea Marco | Human (+ AI) | Medio | Differenze culturali, seniority diverse, capirsi in inglese. Il più personale. Cambio di ritmo dopo un filone tecnico. **Da scrivere con rispetto e umiltà, dal lato di cosa hai imparato tu**, mai come giudizio sui colleghi. Aggancio al filo: async, inglese lingua franca, AI come livellatore linguistico. |

## Note sulla struttura

- **La spina dorsale** (articoli 2, 3, 5, 7) forma un filone coerente sulla disciplina del codice generato: controllare → leggere → non delegare → il costo nel tempo. Distanziati apposta per non risultare ripetitivi.
- **Il case study (6)** è il picco di credibilità: piazzato quando c'è pubblico e clearance, non subito.
- **Il pezzo sul team (8)** è l'outlier umano/leadership: chiude il primo arco con una nota personale.

## Track collaboratori (parallelo)

Pezzi ad altra firma, da inserire tra gli articoli di Marco per dare varietà e respiro al calendario:

- **AI e musica** — Fabio Ziliani. Serie di **4 pezzi** progettata come cerchio (origine → profondità → originalità → valore, chiusura sulla rosa del Piccolo Principe). Da tenere in ordine; gli ultimi due ravvicinati per non diluire la chiusura.
- **AI ed etica** — (collaboratore). Numero di pezzi ancora da definire.

Ogni inserimento sposta in avanti le date della pipeline di Marco.

---

## Secondo arco (bozza provvisoria)

_Tema portante: dal controllare il codice generato al progettare il sistema uomo-AI attorno. Il primo arco era sulla disciplina personale (io e il codice); il secondo sale di livello, sul sistema (io che progetto il loop) e sui temi umani/culturali attorno all'AI. **Struttura provvisoria: numeri e ordine cambieranno quando si definiscono i pezzi etica e le idee aggiuntive di Marco.**_

### Principi di ordinamento (specifici del secondo arco)

- Valgono i principi del primo arco: alternare l'effort (mai due pezzi alti di fila), collaboratori come respiro tra i pezzi di Marco, ogni inserimento slitta le date.
- **Serie musica di Fabio**: è un cerchio con chiusura esplicita, va tenuta in ordine (1→2→3→4). Non spezzarla a caso; il pezzo #4 (valore/rosa) chiude l'intero arco sulla nota umana, come l'articolo 8 chiudeva il primo.
- **I due pezzi context di Marco** (estrazione, doc automatica) sono entrambi medio-alti e sullo stesso sotto-tema: tenerli distanti (≥3 slot), mai vicini, per carico ed evitare ridondanza.
- **Risonanza cross-firma**: il pezzo musica #3 (originalità: "l'autentico era già una formula?") è il gemello del filone di Marco sul codice generato. Se Marco aggiunge un pezzo sull'originalità del codice, va reso adiacente al #3 per creare un dittico esplicito tra i due mondi.

### Pipeline provvisoria

| # | Titolo di lavoro | Firma | Focus | Effort | Ruolo & note |
|---|------------------|-------|-------|--------|--------------|
| 9 | **The new loop** | Marco | Tech · AI · Human | Medio | Cappello dell'arco: dal human-in-the-loop al loop chiuso dev↔AI su ogni fase del workflow. **Da ancorare a un episodio reale** (una fase dove il loop si è chiuso e ti ha sorpreso), altrimenti resta teoria. Gestire la tensione col manifesto e con l'articolo 5: non "il confine sparisce" ma "decido dove tengo la mano sul volante". |
| 10 | **Musica #1 — l'origine** | Fabio Ziliani | Human · AI | — | "Conta sapere chi ha scritto una cosa, per poterla amare?" Respiro dopo il concettuale; eco del cappello (AI come specchio dell'umano). |
| 11 | **Context fantastici e dove trovarli** (estrazione) | Marco | Tech · Human | Medio-alto | Skill che a ogni code review estrae dal dev il contesto mancante; struttura gerarchica modulo→feature; il contesto alimenta l'AI per meno iterazioni. La prova concreta del "new loop". **Dittico con l'articolo 7** (7 pone il problema, questo è la risposta ingegneristica). Rischio: diventare changelog/annuncio di prodotto → la tesi resta sul principio (il contesto come asset di prima classe, estratto quando la conoscenza è fresca), i dettagli sono prova non contenuto. Anonimizzazione + probabile ok PO. |
| 12 | **Musica #2 — la profondità** | Fabio Ziliani | Human · AI | — | "Una cosa vera deve per forza essere seria, sofferta, importante?" L'ironia come forma legittima di sincerità. Respiro leggero. |
| 13 | **AI ed etica #1** | Collab | Human · AI | — | Apre il filone etica. Tema/i da definire col collaboratore. |
| 14 | **Context → documentazione automatica** | Marco | Tech · Human | Medio-alto | Seconda skill: traduce il context tecnico/funzionale in documento funzionale pubblicato su Confluence. Tesi: la documentazione funzionale come sottoprodotto automatico del lavoro, non come tassa separata. Distante 3 slot da #11: ok sul carico. Anonimizzazione + probabile ok PO. |
| 15 | **Musica #3 — l'originalità** | Fabio Ziliani | Human · AI | — | "Quanto di ciò che chiamiamo autentico era già una formula?" Il gemello musicale del filone codice generato. **Tenere adiacente a un eventuale pezzo di Marco sull'originalità del codice** (dittico cross-firma). |
| 16 | **AI ed etica #2…N** | Collab | — | — | Placeholder: dipende dal numero di pezzi etica. |
| 17 | **Musica #4 — il valore** | Fabio Ziliani | Human · AI | — | "Il valore nasce da quanto tempo ci hai messo, o da quanto tempo qualcuno sceglie di dedicarle?" La rosa del Piccolo Principe, chiusura del cerchio. **Chiude l'intero secondo arco** sulla nota umana. Rima con "il costo nascosto del codice" (art. 7). |

## Next steps — Secondo arco

_Da riprendere alla prossima sessione. Le prime tre voci sbloccano la sequenza definitiva._

- [ ] **Definire il numero di pezzi su AI ed etica** e i loro temi (col collaboratore). Adesso sono 2 placeholder: il numero reale sposta la chiusura dell'arco e la numerazione da #16 in poi.
- [ ] **Aggiungere le idee di Marco** per bilanciare l'identità del blog. Conteggio attuale: 3 Marco / 4 Fabio / ≥1 etica → la firma di Marco è in minoranza. Decisione da prendere di proposito: aggiungere 2-3 idee Marco per tenere il 50%+1, oppure accettare consapevolmente un "arco corale" più polifonico del primo.
- [ ] **Valutare il pezzo Marco sull'originalità del codice** ("l'AI non ha rubato l'originalità, l'ha resa visibile") da appaiare al pezzo musica #3: riempirebbe sia il buco d'identità sia lo slot del dittico cross-firma.
- [ ] **#9 The new loop**: trovare l'episodio reale che ancora la tesi (test "esperienza reale" non ancora superato). Verificare che non contraddica il manifesto / articolo 5.
- [ ] **#11 e #14 (context)**: valutare clearance PO e anonimizzazione (stesso vincolo del case study #6); decidere se separarli ancora di più o inserire uno slot cuscinetto a basso effort tra i due.
- [ ] **#11 context**: decidere il titolo. Il riferimento a J.K. Rowling ("Animali fantastici e dove trovarli") ammicca a una public figure controversa: valutare se il tono del pezzo regge la leggerezza o se stona su un tema tecnico. Da decidere in fase di scrittura.
- [ ] **Serie musica**: confermare con Fabio l'ordine e la ravvicinatura degli ultimi due pezzi (chiusura del cerchio).
- [ ] **Rivedere le date indicative** una volta fissata la sequenza (il primo arco chiude ~2026-09-12; il secondo parte ~10 giorni dopo, poi slitta a ogni inserimento).
