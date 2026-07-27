# The First Draft — Nuove idee e direzioni

_Analisi del 2026-07-17. Prima i principi che emergono dal progetto (la lente di valutazione), poi le idee. Ogni idea è passata dallo stesso filtro che usiamo per gli articoli: rafforza l'identità o la diluisce? Le idee che non passano stanno in fondo, scartate esplicitamente._

> **Convenzione di stato** (letta dalla skill `roadmap-next`, vedi `.claude/skills/roadmap-next/`).
> **Il marker `— IMPLEMENTATO (YYYY-MM-DD)` nel titolo è il segnale autorevole**: le idee senza
> marker sono aperte. Un'idea conclusa porta anche un paragrafo `**Stato**:` con cosa è stato
> fatto e cosa resta (incluso il `**Resta da fare (Marco)**`, che è un'azione
> umana e non un lavoro da riaprire). Le sezioni "Idee da
> esplorare" (immature, da discutere prima) e "Idee valutate e scartate" (decisioni negative)
> non si implementano.

## I principi del progetto (come li leggo dal repo)

1. **Il nome è la tesi.** "The First Draft" dice che il valore sta nel pensiero mentre prende forma, non nella risposta levigata. Il manifesto chiude con: "le idee migliori raramente restano come le avevi scritte la prima volta". Questo principio è dichiarato ma **non ancora incarnato dal prodotto**: oggi gli articoli, una volta pubblicati, sono statici come su qualunque altro blog. Qui c'è lo spazio di evoluzione più originale (idea 1).
2. **La triade è una tensione, non tre rubriche.** Tech · human · AI valgono per la loro contraddizione apparente; il glifo della triade sulle card lo rende già visivo. I contenuti migliori del repo (la linea del codice, la slitta) vivono esattamente su quel confine.
3. **Anti-listicle come identità negativa.** Il progetto sa cosa combatte: contenuto generato e intercambiabile. Ogni feature nuova va misurata anche così: "questo ci fa somigliare al nemico?"
4. **L'attrito come prodotto.** "Più teste sullo stesso problema producono attrito, e l'attrito è ciò che manca al contenuto in serie." Il progetto è disegnato per diventare corale (autori, collaboratori, gruppo di feedback, LinkedIn come tavolo di discussione).
5. **Quality over quantity, con una cadenza promessa.** Un pezzo ogni 10 giorni, metodo di co-scrittura punto per punto, archi narrativi invece di calendario. La roadmap pubblica è essa stessa un pezzo di trasparenza raro.
6. **Pubblico primario: chi lavora nel settore** (dev, tech lead), in due lingue; il podcast The Human Constant estenderà gli stessi principi al pubblico curioso non tecnico.

## Idee ad alto potenziale

### 1. Articoli vivi: la "storia delle revisioni" come feature editoriale — IMPLEMENTATO (2026-07-17)

**L'idea più on-brand dell'elenco.** Un blog che si chiama The First Draft dovrebbe mostrare le bozze successive. Concretamente: quando un articolo viene contraddetto, corretto o arricchito (da un commento LinkedIn, dal gruppo di feedback, da un ripensamento), non si riscrive in silenzio: si appende una **revisione datata e firmata** in coda al pezzo ("Seconda bozza, 2026-08: un lettore mi ha fatto notare che..."), con `updatedDate` e un indicatore discreto sulla card ("rivisto").

- Costo tecnico minimo: un campo `revisions` nel frontmatter (data + nota) o una sezione convenzionale nel body; il preflight ne verifica la simmetria IT/EN.
- Valore: nessun altro blog lo fa come formato sistematico; trasforma il principio fondativo in esperienza di lettura; premia chi commenta (il suo attrito diventa parte del pezzo).
- Rischio da governare: le revisioni devono essere rare e vere, non un tic. Regola: solo se cambia la tesi o un fatto, mai per cosmesi.

**Stato**: fatto. Campo `revisions` (`date` + `note`) nel frontmatter, bilingue; componente `RevisionHistory.astro` (changelog editoriale compatto) in coda all'articolo, prima del tavolo di discussione; badge "rivisto" sulle card (`revised` in `ProcessedPost`). Il preflight verifica la simmetria IT/EN e avvisa se ci sono revisioni ma manca `updatedDate`. Regole in `docs/editorial-guidelines.md`; passo in `publish-article`. Complementare all'idea 2 (la discussione riporta lo scambio, la revisione registra il cambiamento).

### 2. Chiudere il loop con LinkedIn: "Dal tavolo di discussione" — IMPLEMENTATO (2026-07-17)

Il manifesto promette che la discussione vive su LinkedIn. Oggi il flusso è a senso unico (blog → post LinkedIn). L'idea: dopo ogni uscita, i 2-3 scambi migliori dei commenti tornano nell'articolo (citati col ruolo, non col nome, salvo consenso: coerente con le regole privacy) come appendice o come prima "revisione" (si aggancia all'idea 1). Effetto composto: chi commenta bene sa che può finire nel pezzo, e la qualità dei commenti sale. È l'attrito del principio 4 reso visibile.

**Stato**: meccanismo pronto. Campo `discussion` nel frontmatter (schema Zod), componente `DiscussionTable.astro` in coda all'articolo (occhiello "Dal tavolo di discussione", citazione in serif, replica opzionale), reso solo se ci sono scambi. Preflight verifica la simmetria IT/EN; regole in `docs/editorial-guidelines.md`; passo aggiunto a `publish-article`. **Resta da fare (Marco)**: fornire il primo scambio reale (es. dai commenti del #3, che aveva il gancio forte su LinkedIn) per inaugurarlo, invece di contenuto inventato. Possibile evoluzione: includere gli scambi anche nel feed RSS (oggi sono nel frontmatter, quindi fuori dal `<content:encoded>`).

### 3. Il formato "Contraddizione" (dittico a due firme) — IMPLEMENTATO (2026-07-18)

La roadmap ha già l'intuizione dei dittici (musica #3 gemello del filone codice). Un passo oltre: un formato ricorrente in cui un secondo autore **risponde** a un pezzo esistente con una tesi opposta o ortogonale, linkato bidirezionalmente ("questo pezzo contraddice → / è contraddetto da ←"). Il manifesto invita esplicitamente a contraddire; questo lo trasforma in un formato editoriale che nessun listicle può imitare, e dà ai collaboratori un modo di entrare a basso attrito (rispondere è più facile che inaugurare un filone). Tecnicamente: un campo `respondsTo: translationKey` e un blocco visivo dedicato.

**Stato**: meccanismo pronto (come per newsletter/discussion: costruito ora, dormiente finché non serve). Campo `respondsTo` (translationKey) nel frontmatter del pezzo che risponde; util `getContradictions` che risolve il legame **bidirezionale** verso i soli articoli pubblicati; componente `Contradiction.astro` reso in due punti della pagina articolo: "In risposta a →" in cima al pezzo nuovo, "Il dialogo continua ←" in coda all'originale. Bilingue (respondsTo è una chiave, identica IT/EN). Il preflight verifica esistenza del bersaglio, no auto-riferimento e simmetria IT/EN. Regole in `docs/editorial-guidelines.md`; passo in `publish-article`. **Resta da fare (Marco)**: usarlo davvero quando Fabio o il collaboratore etica pubblicano il primo pezzo di risposta (basta aggiungere `respondsTo` al loro frontmatter IT+EN).

### 4. Newsletter essenziale (distribuzione anti-algoritmo) — IMPLEMENTATO (2026-07-17)

C'è una contraddizione strategica da risolvere: il manifesto combatte il contenuto ottimizzato per l'algoritmo, ma la distribuzione dipende quasi solo da LinkedIn (un algoritmo). L'RSS è il canale coerente ma di nicchia. Una newsletter minimale (Buttondown o simili, RSS-to-email, bilingue o solo IT all'inizio) è il canale proprietario: chi si iscrive è il pubblico che il progetto dice di volere, e il numero di iscritti è la metrica di "pubblico" che la roadmap usa come vincolo (il case study esce "quando c'è pubblico"). Da fare **prima** che serva: una lista si costruisce lentamente. Nessuna feature in più: un form, un invio per uscita.

**Stato**: scaffold pronto, provider **Buttondown**, inquadrata come **canale anti-algoritmo** (decisione di Marco: reframe della copy, non più "niente newsletter"). Gated da `NEWSLETTER.buttondownUser` in `src/config.ts`: finché è vuoto la newsletter è spenta e resta la CTA RSS (produzione invariata). Quando si imposta lo username compaiono: form di fine articolo (con "oppure via RSS"), link nel footer, pagina `/newsletter` IT/EN. Form senza JavaScript (POST al form pubblico Buttondown, double opt-in gestito dal provider). **Attiva dal 2026-07-18**: account creato, username `thefirstdraft` in `src/config.ts`, welcome email in uso (testo canonico in `docs/brand.md` §Newsletter). La prima uscita curata è partita il 2026-07-25; dal 2026-07-25 il formato è codificato nella skill `newsletter-issue`, che prepara oggetto, corpo e link con UTM e si ferma prima dell'invio. Valutata e per ora scartata l'automazione RSS-to-email di Buttondown: manderebbe un digest, mentre la scelta è un'email riscritta per la casella di posta. Possibile evoluzione: un link "Newsletter" anche in navbar.

### 5. La pagina "Domande aperte" — IMPLEMENTATO (2026-07-18)

Ogni articolo lascia domande volutamente aperte ("è un'altra storia" nel #3, il finale del manifesto). Una pagina che le colleziona (una riga ciascuna, link al pezzo d'origine, stato: aperta / ripresa nel pezzo X) fa tre cose: mostra il pensiero in evoluzione (principio 1), semina i pezzi futuri in pubblico (la roadmap narrativa già lo fa per i titoli, questa lo fa per le idee), e offre ai collaboratori e ai lettori un punto d'ingresso concreto ("questa domanda la voglio prendere io"). Manutenzione quasi nulla: si aggiorna al publish-day, dentro il runbook `publish-article`.

**Stato**: fatto. Campo `openQuestions` (`question` + `resumedBy` opzionale) nel frontmatter, bilingue; util `getOpenQuestions` che raccoglie le domande dagli articoli pubblicati e risolve titolo/URL d'origine e lo stato (aperta / ripresa se `resumedBy` punta a un pezzo pubblicato). Componente `OpenQuestions.astro` e pagine `/domande-aperte` (IT) e `/en/open-questions` (EN), link in navbar. Il preflight verifica la simmetria IT/EN (numero di domande). Regole in `docs/editorial-guidelines.md`; passo aggiunto a `publish-article` (Passo 4). Inaugurata con due domande reali già poste dai pezzi pubblicati: il "quanto pesa, accumulato" di #2 (l'esplicito "è un'altra storia") e il "riuscirà a diventare corale" del manifesto. Complementare all'idea 1 (le revisioni registrano i cambiamenti, le domande aperte seminano quelli futuri).

### 6. Ripubblicazione EN con canonical (crescita del pubblico anglofono)

Lo schema ha già `canonicalUrl` (mai usato). Rovesciarlo: pubblicare le versioni EN anche su dev.to (che supporta il canonical verso il sito), dove il pubblico dev anglofono già sta. Zero costo di scrittura (il pezzo EN esiste già), SEO consolidata sul dominio, e il pubblico EN oggi è probabilmente quasi nullo perché la distribuzione LinkedIn è di fatto italiana. Aggiungerlo come passo opzionale del runbook di pubblicazione.

### 7. Podcast: pagina episodio sul sito, non solo piattaforme

Quando The Human Constant parte (spec cover già pronte), dare a ogni episodio una pagina sul sito: player embed, show notes, link incrociati articolo↔episodio. Il sito resta l'hub di tutte le forme dello stesso pensiero (blog per chi lavora nel settore, podcast per i curiosi) e ogni episodio rimanda al pezzo d'origine e viceversa. Da progettare come collection `podcast` col pattern bilingue già rodato. **Trigger: al lancio del podcast, non prima.**

### 8. Riassorbire il CV nella pagina autore

Il sito nasce come sito personale (`About`, `Experience`, `Skills`, `Contact` più la home
portfolio) ed è diventato una pubblicazione multi-firma, senza che la transizione fosse mai
decisa. `docs/BRAND-IDENTITY.md` §1.6 la decide: **l'ombrello è The First Draft, il profilo
professionale di Marco vive in `/autori/marco-mariotti`, non esiste una sezione portfolio
separata.** Finché le componenti restano dove sono, il sito comunica un'architettura di brand
diversa da quella scritta.

Cosa comporta: far confluire esperienza, competenze, dominio e contatti nella pagina autore (il
frontmatter di `src/content/authors/{it,en}/marco-mariotti.md` li contiene già quasi tutti),
ridisegnare la home come home della pubblicazione, rimuovere o riusare le componenti orfane.
Intervento medio, tutto visivo: da verificare in browser prima del merge.

**Trigger: la prima volta che si tocca la home o la pagina autore.** Non merita una sessione
dedicata subito (nessun lettore se ne lamenta), ma non va fatto a pezzi: quando si apre quel
file, si apre tutto il lavoro. Vincolo: la pagina autore resta bilingue e simmetrica IT/EN.

## Idee da esplorare (meno mature, da discutere)

- **Il "gruppo di feedback" come istituzione visibile** — IMPLEMENTATO (2026-07-18): oggi è invisibile ai lettori. Una riga in coda agli articoli ("questo pezzo è passato dal gruppo di feedback prima di uscire") racconta il processo di qualità senza esporre nessuno. Micro-costo, rafforza il posizionamento. **Stato**: campo `feedbackReviewed` (booleano, per-articolo) nel frontmatter; componente `FeedbackNote.astro` rende una riga discreta in coda alla pagina articolo (solo lì, non sulle card), bilingue, senza nomi né numeri. Preflight verifica la simmetria IT/EN. Attivo su "we-read-more" (confermato passato dal gruppo). Regole in `docs/editorial-guidelines.md`; passo in `publish-article`.
- **Serie come oggetto di prima classe**: la "spina dorsale" (controllare → leggere → non delegare → il costo nel tempo) esiste in roadmap ma non sulla pagina articolo. Un piccolo indicatore "parte del filone X, pezzo 2 di 4" con navigazione prev/next darebbe al lettore nuovo il percorso di lettura. Da fare quando i filoni hanno ≥3 pezzi pubblicati.
- **Traduzioni come contenuto**: una nota occasionale sulle scelte di traduzione idiomatica IT↔EN (il repo ha già una teoria sofisticata sulle ripetizioni asimmetriche). Nicchia, ma perfettamente nella triade (lingua = tech + human + AI). Forse un pezzo, non una feature.
- **Archivio annuale "com'è andata"**: a fine arco, un pezzo di retrospettiva onesta (numeri, cosa ha funzionato, cosa no). Coerente con "mostrare il pensiero mentre prende forma" applicato al progetto stesso.

## Idee valutate e scartate (per tenere il focus)

- **Membership/paywall**: contraddice la fucina aperta; il progetto non ha bisogno di monetizzare, ha bisogno di pubblico e credibilità.
- **Pezzi brevi/notes/microblog**: diluirebbe la promessa "un ragionamento fatto per bene"; il formato corto vive già su LinkedIn come post di lancio.
- **AI-assisted summaries / TL;DR in cima agli articoli**: è esattamente l'estetica del nemico; chi vuole il riassunto non è il lettore del progetto.
- **Tema chiaro / personalizzazioni UI**: il dark navy è identità di brand consolidata; costo di manutenzione doppio per valore marginale.
- **Cross-posting automatico multi-piattaforma (X, Medium, ecc.)**: distribuzione a pioggia = logica del contenuto in serie. Meglio un canale presidiato bene (LinkedIn) + uno proprietario (newsletter) + un satellite mirato (dev.to EN, idea 6).

## Sequenza suggerita

1. **Subito, a costo quasi zero**: idea 2 (dal tavolo di discussione, già dal post del #3) e la riga sul gruppo di feedback.
2. **Prossime 2-3 uscite**: idea 1 (revisioni: definire il formato ora, usarlo alla prima occasione vera) e idea 4 (newsletter aperta prima che serva).
3. **Con i collaboratori**: idea 3 (contraddizione) quando Fabio o il collaboratore etica hanno il primo pezzo pubblicato.
4. **A trigger**: idea 6 (al prossimo publish-day EN), idea 5 (quando le domande aperte sono ≥5), idea 7 (al lancio del podcast), idea 8 (alla prima volta che si tocca la home o la pagina autore).

## Domande aperte — risposte di Marco (2026-07-17)

- **Gate del case study #6**: solo il vincolo dell'ok del PO, nessuna soglia di pubblico. Newsletter e analytics restano valide per sé, ma non sono prerequisiti del #6.
- **Gruppo di feedback**: si passa all'**URL di anteprima** come canale principale (PDF opzionale). Alza la priorità del punto 6 dei miglioramenti tecnici.
- **Commenti**: si tiene **Giscus** (verificato poi: era già configurato e attivo sul sito). LinkedIn resta il canale di lancio, non l'unico tavolo.
- **Pubblico EN**: **obiettivo reale 2026**. L'idea 6 (dev.to con canonical) entra nel runbook di pubblicazione.
