---
title: "La sottile linea del codice"
description: "Un modulo migrato, tutti i test verdi, e a fine mese le notifiche smettono di rinnovarsi. Dove passa la linea tra codice generato controllato e fuori controllo, e come restarci in equilibrio."
pubDate: 2026-08-03
translationKey: "the-fine-line-of-code"
focus: ["tech", "ai"]
authors: ["marco-mariotti"]
tags: ["ai", "codice-generato", "ingegneria-del-software", "pensiero-critico"]
cover: "../../../assets/covers/la-sottile-linea-del-codice.png"
coverAlt: "Copertina di The First Draft: tre cerchi sovrapposti (tech, human e AI) che si incontrano in un punto luminoso, con il titolo 'La sottile linea del codice' sottolineato a mano come una correzione di bozza."
draft: true
---

Avevamo costruito un modulo nuovo: un sistema di notifiche e azioni automatiche che scattano al raggiungimento di certe soglie. La parte più complessa l'abbiamo generata da zero, partendo dalle specifiche della PO, raffinate in brainstorming, tradotte in documentazione e stories, implementate con l'aiuto dell'AI e coperte da test automatici e QA. Tutto verde.

Restava un lavoro che sembrava banale: portare dentro quello nuovo una parte che già esisteva da anni in un vecchio modulo. Non volevamo spostare le tabelle esistenti, per non rifare reportistica e azioni automatiche legate alle soglie. Bastava agganciare le vecchie notifiche alla nuova tabella dei gruppi invece che a quella di prima.

Quel codice era molto vecchio e senza documentazione, così ho chiesto all'AI di analizzarlo, le ho spiegato il risultato che volevo e mi sono fatto generare un piano per arrivarci. L'ho revisionato: chiaro, diretto, niente di sospetto. L'ho implementato, testato in locale e BAM, funzionava. Su in ambiente di test, liberi come l'aria, felici di aver risparmiato ore di lavoro.

Poi, durante quella che si stava rivelando una lunga fase di test, è arrivata la prima scadenza di fine mese. Le notifiche sono scadute e non si sono rinnovate. Non ce lo aspettavamo.

Il vecchio modulo non si limitava a valutare le soglie: era anche incaricato di rinnovare le notifiche alla scadenza. Questo, in fase di analisi, era sfuggito. La funzione di rinnovo continuava a cercare le notifiche scadute nella vecchia tabella dei gruppi, quella che avevamo smesso di popolare. Non trovava niente. Non rinnovava niente. L'abbiamo scoperto e sistemato lì, in fase di test, prima del rilascio in produzione. E l'AI aveva fatto esattamente quello che le avevo chiesto: il buco non era nella sua risposta, era nella mia domanda.

Per molto tempo ho creduto che controllare il codice generato volesse dire leggerlo. Aprire il diff, scorrere le righe, verificare che facessero quello che dicevano. Ma quel codice io l'avevo letto. Il piano l'avevo revisionato riga per riga. Era chiaro, era corretto, e faceva esattamente quello che diceva. Il problema è che faceva esattamente quello che diceva, e niente di più. Se ormai si legge più di quanto si scrive, questa è l'altra faccia della lettura: quella in cui scambiare il capire un codice per il controllarlo si paga caro.

Leggere il codice ti dice cosa fa. Non ti dice di cosa è responsabile. E la differenza tra le due cose è la linea sottile.

Un pezzo di codice è sotto il tuo controllo quando sai rispondere non solo a "cosa fa questa riga", ma a "cosa succede se la tolgo", "chi altro dipende da questo", "di cosa si occupava, davvero, ciò che sto sostituendo". Quando potresti riscriverlo da zero anche senza l'AI, e ti prendi la responsabilità di come si comporterà in produzione tra sei mesi, quando i dettagli te li sarai dimenticati. Fuori controllo è l'opposto: è quando accetti qualcosa che sembra giusto e la responsabilità evapora nel gesto stesso di accettarla.

L'AI non sposta questa linea. La rende solo più facile da attraversare senza accorgersene, perché produce codice che sembra già controllato: pulito, coerente, plausibile. Il vecchio copia e incolla da Stack Overflow almeno aveva un'aria straniera, ti costringeva ad adattarlo per farlo entrare. Il codice generato arriva già vestito come il tuo. Sembra tuo prima di esserlo.

Se il codice generato sembra mio prima di esserlo, come faccio ad accorgermi che sto attraversando la linea? I segnali ci sono. Il problema è che, mentre la attraversi, sembrano tutti buone notizie. Col senno di poi, quel giorno erano lì, ben visibili. Sul momento li ho letti come conferme.

Il primo era il piano stesso. Era chiaro, lineare, esauriva tutti i casi che avevo specificato. Mi aspettavo di vedere certe cose e le ho viste tutte, e questo mi ha rassicurato. Ma stavo controllando che l'AI avesse fatto bene quello che le avevo chiesto, non che io avessi chiesto tutto il necessario. Verificavo la risposta, non la domanda. Chi controlla il controllore, se il controllore sono le mie stesse aspettative?

Il secondo era l'assenza di attrito. Dalla revisione del piano all'implementazione sono passati pochi minuti. Non un dubbio, non un "questo lo verifico meglio". Quando un'operazione delicata, spostare qualcosa che gira in produzione da anni, non oppone nessuna resistenza, l'assenza di resistenza è essa stessa il segnale. Il codice fuori controllo non frena: è per questo che è fuori controllo.

Il terzo era l'entusiasmo. Ero felice di star risparmiando ore, perché volevo dedicarmi a una cosa che mi premeva: una skill che genera in automatico documentazione e context per l'AI a partire dal codice, per coprire pezzo dopo pezzo le parti non documentate del progetto. Qui c'è l'ironia che sul momento non ho colto. Stavo correndo oltre un buco di documentazione per andare a costruire lo strumento che quei buchi li chiude. La fretta di curare il problema in generale mi ha fatto ignorare la sua istanza concreta, proprio lì, sotto le mani. Quella spinta in avanti, verso il premio, è esattamente ciò che toglie attenzione al presente. Non mi mancava il mestiere per accorgermene: mi mancava, in quel momento, l'attrito che il mestiere di solito porta con sé. È la competenza stessa, quando smette di dubitare, a farti andare veloce proprio dove dovresti rallentare.

Sotto a tutto questo c'era una condizione di fondo che rendeva i tre segnali più pericolosi: del vecchio modulo non avevamo documentazione. È un problema normale, e infatti uso l'AI proprio per documentare ciò che nessuno ha più in testa. Ma quel giorno significava una cosa precisa: stavo chiedendo a una macchina di spiegarmi un codice di cui, nel team, nessuno era più il custode. Non c'era una verità umana a cui appoggiarsi. Solo la mia domanda, e la sua risposta.

I tre segnali hanno una radice comune: puntano tutti lontano dal codice e verso di me. Le mie aspettative, la mia fretta, il mio entusiasmo. Per questo sono difficili da vedere: la fonte del rumore sono io. E se il pericolo sono io, le regole che ho ricavato da quel giorno servono a una cosa sola: rimettere l'attrito dove la competenza me lo toglie. Non sono una checklist, sono quattro modi di guardare.

Il primo. Una funzionalità è un oggetto matematico: ha un dominio dai confini precisi. Il mio errore non è stato leggere male il codice, è stato accontentarmi di una parte del dominio. Le notifiche non si limitano a scattare al superamento di una soglia: nascono, vengono valutate, scadono, si rinnovano. Il rinnovo era un punto di quel dominio, e io avevo mappato tutto tranne quello. È lì, nella discontinuità che non avevo esplorato, che sono cascato con tutte le scarpe. La contromossa non è leggere di più, è chiedersi prima: qual è il dominio completo di questa funzionalità, tutti i suoi stati e tutti i suoi eventi, non solo la rappresentazione che mi sono fatto nella mia testa? È la stessa differenza tra controllare la risposta e controllare la domanda. Se chiedo all'AI un piano per il percorso che immagino, otterrò un piano perfetto per un dominio incompleto.

Il secondo. Analizzare la feature come se fosse un oggetto sconosciuto, anche quando sembra familiare. È la difesa diretta contro la trappola della confidenza. Il codice generato arriva vestito come il mio, e proprio per questo va trattato da estraneo finché non ho verificato che lo sia diventato davvero. Rendere di nuovo strano ciò che sembra ovvio è un atto di disciplina, non di sfiducia: è il modo di rimettere lo sguardo del principiante senza rinunciare al mestiere del senior.

Il terzo. Il codice non documentato è terra di nessuno, e in terra di nessuno il buonsenso non basta. Dove non c'è più nessun custode, le convenzioni che dai per scontate possono non valere: quel vecchio modulo si rinnovava da solo, una regola implicita che nessun documento dichiarava e nessuno ricordava. In terra di nessuno non si deduce, si verifica.

Il quarto. Quando cambi il dominio, i test devono cambiare con lui, o continueranno a certificare il mondo di prima. Il rinnovo io lo conoscevo. Quello che non avevo collegato è che si appoggiava alla vecchia tabella dei gruppi, quella che avevo smesso di usare. E i test automatici non l'hanno svelato per un motivo quasi beffardo: erano loro, in fase di setup, a popolare ancora quella vecchia tabella. Così il rinnovo, sotto test, trovava sempre i suoi dati e passava. Nell'ambiente di test, dove non la riempiva più nessuno, al primo rinnovo di fine mese non trovava niente. L'illusione dei test verdi è durata fino a quella prima scadenza. Il verde non era una conferma: era l'eco di un mondo che avevo appena spento. Se alteri il dominio e i test restano identici, quella luce verde va guardata con sospetto, non con sollievo.

Torniamo alla domanda scomoda: l'AI ha analizzato, documentato, pianificato e generato, e ha fatto tutto bene. Il guasto resta mio. Non è una contraddizione, è la forma esatta del nostro rapporto. La macchina e io rispondiamo di cose diverse.

L'AI ha, per sua natura, un focus ristretto. È straordinaria dentro il contesto che le dai, cieca fuori da quello. Fa benissimo ciò che le inquadri e non sa nulla di ciò che non hai inquadrato. Il rinnovo non è sfuggito all'AI: è sfuggito al contesto che le ho passato. Per questo il lavoro che resta umano non è scrivere il codice, è costruire il contesto: definire il dominio funzionale, dargli confini, dotarsi degli strumenti per navigarlo. Meno tempo sulle dita, più responsabilità sulla testa.

È uno spostamento che esisteva già prima dell'AI. Per un buon ingegnere la progettazione e la definizione del dominio erano forse il settanta per cento del lavoro, e il codice il resto. L'AI comprime proprio quel resto. La proporzione si inclina ancora, e mi porta a una domanda che un anno fa non avrei osato fare: se la macchina scrive il codice, la definizione dei domini non rischia di diventare, un giorno, non il settanta per cento del lavoro, ma *il* lavoro?

E qui va detta la cosa scomoda. L'AI è stata introdotta per togliere attrito, ed è esattamente ciò che fa. Ma l'attrito era anche ciò che mi teneva sveglio. Rimuovendolo non mi ha solo aiutato: ha cambiato il tipo di errore che commetto. Non è uno strumento neutro che lascia l'ingegnere identico a prima, solo più rapido. Mi rende più veloce e più liscio, e la scivolosità è precisamente ciò per cui si casca.

Per questo l'AI non deve diventare la scusa per delegare la complessità. Deve diventare il secondo paio di occhi su contesti sempre più ampi, e va usata al contrario di come viene spontaneo: non per confermare, ma per dubitare, per interrogare tutto ciò che sembra banale. Perché è questa, alla fine, la lezione di quel giorno. Il lavoro sembrava banale. E se qualcosa sembra banale, spesso non lo è: è solo mal definito. La banalità era il sintomo, non la realtà.

Quello che l'AI non potrà prendersi in carico al posto mio è proprio questo: l'occhio critico verso un codice che potrebbe non essere allineato al suo scopo. La macchina può verificare che il codice faccia quello che dice. Solo io posso dubitare che quello che dice sia quello che serve.

Non mi illudo che quella linea diventerà più facile. Al contrario: più l'AI toglie attrito, più la linea si fa scivolosa, e questa storia è solo la prima di molte volte in cui perderò l'equilibrio. Va bene così. Non è un difetto da eliminare, è la condizione del mestiere adesso.

Camminare in equilibrio su una linea sottile non è un'emergenza, è la normalità. Il punto non è non oscillare mai. È sviluppare, a ogni cambiamento grande, una consapevolezza ancora più grande: è l'unica cosa che può crescere alla stessa velocità della scivolosità. Questa volta la linea l'ho attraversata senza accorgermene. La prossima la sentirò sotto i piedi.

E un giorno, a forza di attraversarla, saremo equilibristi perfetti.

---

*Le opinioni e le esperienze condivise in questo articolo sono personali e non rappresentano posizioni ufficiali del mio datore di lavoro. I casi descritti sono volutamente generici e anonimizzati, a scopo divulgativo.*
