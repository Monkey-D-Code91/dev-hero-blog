---
title: "Tre domande travestite da una sola"
description: "Ventidue secondi per aprire la pagina più importante del sistema, e nessuno dei tre problemi era quello che sembrava."
pubDate: 2026-09-09
translationKey: "three-questions-disguised-as-one"
focus: ["tech"]
authors: ["marco-mariotti"]
tags: ["case-study", "performance", "dominio-funzionale", "ingegneria-del-software"]
draft: true
---

C'è un momento preciso in cui quella pagina viene aperta. Non per curiosità e non a caso: è arrivato un avviso, via email o via SMS, che dice che c'è qualcosa da gestire. Chi lo riceve entra nel sistema e va lì, perché è la pagina da cui si vede cosa sta succedendo e si decide cosa fare.

Sul cliente con il volume maggiore, decine di migliaia di utenze monitorate, quella pagina ci metteva in media ventidue secondi a comparire. Non a rispondere: a comparire. Prima di quel momento non c'era niente da guardare, perché caricava per intero tutto ciò che le serviva e solo alla fine si disegnava.

Ventidue secondi sono tanti dovunque. Ma la lentezza in sé non è ancora il punto: conta dove cadeva. Cadeva addosso a qualcuno che era stato appena avvisato di un problema da risolvere subito.

Il codice di quella pagina era vecchio. L'avevano scritto persone che in azienda non ci sono più, non c'era documentazione, e come fosse fatto si capiva a occhio: una catena di query che pescava da cinque a otto tabelle a seconda del tipo di notifica, leggendo porzioni molto grandi di ciascuna per poi scartare a valle quasi tutto quello che aveva appena letto.

La versione comoda di questa storia finisce qui: ho trovato il pasticcio di qualcun altro e l'ho sistemato. È anche la versione meno utile, e non è del tutto vera.

Perché la decisione che stava sotto al pasticcio, carico tutto quello che mi serve e poi disegno, non era assurda. Su un cliente piccolo quella pagina si apriva in un attimo, e non c'era niente da sistemare. Nessuno l'ha rotta: è rimasta identica mentre attorno cambiava l'ordine di grandezza. Non c'è un commit sbagliato da additare, ed è questa la parte scomoda. Certe scelte non nascono sbagliate. Lo diventano da sole, in silenzio, mentre nessuno le sta guardando.

Quando mi ci sono messo, quindi, la domanda ovvia era una sola: come faccio ad andare più veloce? È la domanda che non ho fatto.

"Come faccio ad andare più veloce" è una domanda che ti porta sempre nello stesso posto: dentro le query. Le profili, aggiungi un indice, riscrivi una join, e con un po' di lavoro porti ventidue secondi a quindici. Sarebbe stato un risultato. E la pagina sarebbe rimasta inutilizzabile.

A fermarmi è stato un numero che non tornava. Su quel cliente le notifiche configurate erano diciassette. Diciassette righe da disegnare, ventidue secondi per disegnarle. Qualunque cosa costasse tutto quel tempo, non era la quantità di informazioni da mostrare: era la profondità a cui ognuna andava a pescare.

Così ho lasciato perdere la velocità e sono andato a vedere che cosa succede davvero su quella pagina. Chi la apre non ha una domanda sola: ne ha tre.

La prima è "c'è qualcosa che non va", ed è la domanda con cui si entra: quante utenze sto sorvegliando, quante hanno passato la soglia di preavviso, quante hanno finito quello che avevano a disposizione, quante notifiche non ho ancora gestito. Sono numeri, si leggono in un colpo d'occhio, e non servono a fare niente: servono a decidere se c'è da preoccuparsi.

La seconda è "dove", e sono i pannelli: per ogni notifica configurata, che cosa sorveglia e quante utenze ha in questo momento oltre la soglia. Serve a scegliere da dove cominciare.

La terza è "e adesso cosa faccio", ed è tutto quello che compare dentro una notifica quando la apri: le soglie, i tempi, l'elenco delle utenze in preavviso e di quelle in superamento, le azioni da applicare a ciascuna. È la parte che pesa. Ed è anche l'unica che riguarda una notifica per volta, quella che l'avviso ti ha mandato a guardare.

Tre domande, tre momenti, tre scopi. E una sola catena di query che rispondeva a tutte insieme, come se fossero la stessa cosa, per tutte le notifiche, prima di mostrare qualunque cosa. Il tempo non se ne andava in una query scritta male. Se ne andava a rispondere in anticipo, e per tutti, a domande che nessuno aveva ancora fatto.

Non era un problema di performance, ma di dominio. Quella pagina non era lenta, era indistinta.

È lo stesso sguardo del [pezzo precedente](/blog/la-sottile-linea-del-codice), rovesciato. Là avevo mappato un dominio a metà, mi ero dimenticato che le notifiche non soltanto scattano ma si rinnovano, e il pezzo che mancava mi è tornato indietro a fine mese sotto forma di guasto. Qui il dominio c'era tutto, però stava in un blocco unico: tre cose diverse tenute insieme da una funzione sola. Nel primo caso il conto l'ho pagato con un errore. Nel secondo con ventidue secondi.

Da qui in poi il lavoro è stato quasi meccanico, ed è la parte che di solito viene raccontata per prima.

Tre domande separate vogliono tre risposte separate: tre query nel backend, ciascuna costruita per la sua, e tre modi diversi di chiederle dal frontend. Arrivato lì la tentazione era riusare le aggregazioni che già esistevano, adattandole. Ho scelto di non farlo e di scriverne tre mirate, ognuna con le sole tabelle che le servono davvero: da otto join per rispondere a tutto si è scesi a tre per ciascun sotto dominio, e i filtri sono saliti a monte, così ogni query si porta dietro una frazione dei dati che leggeva prima, invece di scartarli dopo averli letti.

So che cosa costa questa scelta. Tre query specializzate sono tre punti da aggiornare quando il modello cambia, mentre quella generica era uno solo: ho accettato una duplicazione in cambio della selettività. Il riuso è un principio, ed è uno di quelli buoni. Ma i principi esistono per un motivo, e parte del mestiere è sapere quando deformarli senza perdere di vista il risultato per cui lo stai facendo. Qui il risultato era una pagina che si aprisse in tempo utile per chi era stato appena avvisato, e nessuna aggregazione riusabile ci arrivava.

Sul frontend le tre risposte sono diventate tre momenti. Le prime due partono insieme quando la pagina si apre: le statistiche generali tornano in 88 millisecondi, i dati aggregati delle notifiche in poco più di un secondo, e la pagina è pronta quando è arrivata la più lenta delle due. La terza non parte affatto, finché non serve. Quando apri una notifica, e solo quella, arrivano i suoi dettagli e le sue utenze, altri settecento millisecondi. Se la richiudi e la riapri, quello che avevi è ancora lì.

![Due barre sulla stessa scala temporale: prima ventidue secondi, dopo un secondo e un decimo. Un riquadro ingrandisce il primo secondo e mostra le due chiamate che partono insieme, di 88 e di 1100 millisecondi, e una terza di 700 millisecondi che parte da un click.](../../../assets/diagrams/tre-domande-travestite-da-una-sola.png)

*Le due barre in alto sono sulla stessa scala. Il riquadro ingrandisce il primo secondo: le due chiamate che partono insieme all'apertura, e la terza che parte solo quando apri una notifica.*

Ventidue secondi diventati poco più di uno.

Ed è qui che il numero va guardato meglio, perché scritto così mente per omissione.

Ventidue secondi non sono diventati uno: sono stati spostati. Chi apre una notifica paga altri settecento millisecondi, e li paga di nuovo per ognuna che apre. Il tempo non è sparito, ha cambiato posto, ed è finito dove chi aspetta lo accetta, perché è la conseguenza di una cosa che ha appena chiesto. Ventidue secondi davanti a una pagina vuota sono un'attesa subita. Settecento millisecondi dopo un click sono una risposta. La quantità conta meno di dove cade.

Mi sono chiesto se nel caso peggiore la nuova versione perdesse, cioè se qualcuno le aprisse davvero tutte. Su quel cliente le notifiche sono diciassette: aprirle una per una costa poco meno di dodici secondi, che sommati al caricamento fanno tredici contro i ventidue di prima. Regge anche lì, e non era affatto scontato.

Però qualcosa l'ho perso, e non è tempo. Con il caricamento unico il consumo di un'utenza si leggeva una volta sola e serviva tutte le notifiche che la sorvegliavano. Adesso lo rileggo per ognuna che viene aperta: se la stessa utenza è sorvegliata da tre notifiche e le apro tutte e tre, quel dato lo leggo tre volte. È la stessa scelta delle query mirate, ripetuta un livello più in su: accetto di rifare un lavoro pur di non farlo in anticipo per tutti.

E ho perso una cosa più sottile. Prima, quello che vedevi sullo schermo era fotografato tutto nello stesso istante. Adesso ogni notifica aperta ha la sua età: se ne apro una alle dieci e un'altra alle dieci e sei, sulla stessa schermata convivono due istantanee diverse. Il dato resta valido cinque minuti, che non è un numero scelto a caso ma la frequenza massima con cui quei valori cambiano: la cache non può mostrare più di una generazione di ritardo. E ogni azione manuale viene comunque validata dal backend sullo stato corrente, mai su quello che il frontend ha in pancia. Resta un disallineamento visivo, limitato e dichiarato, non il rischio di agire sul dato sbagliato.

Un'ultima cosa sui numeri, perché un case study che non dice il perimetro dei suoi dati vale poco. Le misure precise vengono da un cliente solo, quello con il volume maggiore: browser per il caricamento della pagina, timestamp dei log per le query, medie su esecuzioni ripetute. Su un cliente dal profilo opposto, quasi cento notifiche ma pochissime utenze ciascuna, la pagina stava già tra i cinque e i sette secondi ed è scesa all'ordine delle centinaia di millisecondi. Quel secondo dato non l'ho misurato con lo stesso rigore, e lo do come ordine di grandezza, non come risultato.

Manca la parte che in un pezzo come questo di solito sta all'inizio: quanto di tutto questo sia stato generato dall'AI.

Sul lavoro che ha prodotto il risultato, quasi niente. Le query le ho scritte a mano, una per una. Non per diffidenza: perché il valore non stava nello scriverle, stava nel decidere dove tagliare, e per decidere bisognava sapere che cosa serve a chi apre quella pagina, e in che ordine. Il dominio ce l'avevo in testa; una volta chiaro il taglio, gli interventi mirati mi sono costati poco tempo.

C'è anche una ragione più concreta, ed è la stessa del pezzo precedente. Quel codice era vecchio, sparso su decine di classi, senza documentazione, scritto da persone che non ci sono più. Per farmi aiutare avrei dovuto passare all'AI un contesto che non esisteva: avrei dovuto prima ricostruirlo, e ricostruirlo era già la parte grossa del lavoro. Non è che la macchina non sapesse rispondere. È che la domanda giusta si poteva formulare solo dopo aver capito, e chi ha capito, a quel punto, ha quasi finito.

Dove invece è servita, e parecchio, è nel refactor dei componenti frontend, che le ho fatto portare avanti mentre io lavoravo alle query. È lavoro che dipende da decisioni già prese: i confini erano stabiliti, i tre domini decisi, restava da riorganizzarci attorno del codice. Lì l'AI corre, e ho fatto due cose insieme.

E poi è servita alla fine, per una cosa che nel pezzo precedente mi ero ripromesso: la documentazione di quel modulo, che non era mai esistita, gliel'ho fatta scrivere a partire dal mio commit. È arrivata dopo, a rendere trasmissibile qualcosa che avevo già capito. Non è un ordine casuale: è l'unico in cui poteva funzionare.

