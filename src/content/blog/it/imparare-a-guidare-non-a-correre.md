---
title: "Imparare a guidare, non a correre"
description: "Una pull request piena di codice che funziona ma che nessuno ha capito, dove bastava una ref. L'AI regala velocità, ma la velocità senza direzione ti trascina in giro: crescere non è produrre più codice, è arrivare al cuore dei problemi."
pubDate: 2026-07-24
translationKey: "learning-to-steer-not-to-race"
focus: ["human", "ai"]
authors: ["marco-mariotti"]
tags: ["ai", "codice-generato", "crescita-professionale", "mentoring"]
cover: "../../../assets/covers/imparare-a-guidare-non-a-correre.png"
coverAlt: "Copertina di The First Draft: tre cerchi sovrapposti (tech, human e AI) che si incontrano in un punto luminoso, con il titolo 'Imparare a guidare, non a correre' sottolineato a mano come una correzione di bozza."
draft: true
---

C'è una cosa che, da quando l'AI è entrata nel mio lavoro quotidiano, faccio più fatica a tenere a freno: la voglia di fare di più. La feature in più che nessuno aveva chiesto, il refactor che rimandiamo da mesi e che "già che ci sono" potrei sistemare adesso, il pezzo di architettura che potrei rendere più elegante. Non è pigrizia, è l'opposto: è il desiderio di costruire, di lasciare le cose meglio di come le ho trovate. Una spinta buona, ed è proprio per questo che è difficile da governare: non voglio spegnerla, voglio darle una direzione.

Il rischio, per me, non è scrivere codice cattivo. È lavorare senza struttura: inseguire ogni buona idea nell'istante in cui mi viene, aprire tre fronti mentre ne stavo chiudendo uno, e ritrovarmi a fine giornata più veloce ma senza aver deciso davvero dove stavo andando. Così si spreca proprio lo slancio che l'AI mi aveva regalato.

Mi viene in mente l'immagine di una slitta trainata dai cani. Cinque cani in formazione ti portano a destinazione a una velocità che a piedi non ti sogni. Il problema non sono mai i cani: sono forti, veloci, hanno voglia di correre. Il problema è se nessuno, dietro, decide dove andare. Allora ognuno tira dove vuole, e tutta quella potenza non ti porta da nessuna parte: ti trascina in giro. La velocità c'è, la direzione no.

L'AI mi ha messo cinque cani davanti alla slitta. Non devo rallentarli, e non voglio: sarebbe sprecarli. La questione, adesso, non è più correre. È decidere dove, e tenere il muso di tutti puntato lì.

E se la spinta la sento io, che ho qualche anno di mestiere alle spalle, nei colleghi più giovani vedo qualcosa di più insidioso.

In una review, tempo fa, mi trovo davanti parecchio codice nuovo per un componente. Era stato introdotto un pattern di hydration, gestito nel seguente modo: il componente figlio, a ogni aggiornamento, restituiva i suoi dati al padre attraverso una callback, e il padre li reidratava. Funzionava. Stava in piedi. Ed era completamente inutile: per ottenere lo stesso risultato bastava passare dal padre al figlio una semplice ref e usare quella. Tre righe al posto di un pattern.

Perché tanto codice per così poco? Perché la soluzione l'aveva proposta l'AI, e l'aveva proposta bene: coerente, plausibile, funzionante. Il collega l'aveva provata, girava, i test erano verdi. Quello che non aveva fatto era fermarsi a chiedersi qual era la cosa più semplice che risolveva il problema. Se lo avesse fatto, la ref sarebbe saltata fuori da sola. Ma la macchina gli aveva già dato una risposta completa, e una risposta completa toglie la voglia di cercarne una più semplice. Era stata accettata perché sembrava giusta, non perché fosse stata capita.

L'ho chiamato. Gli ho chiesto due cose: di spiegarmi il pattern, e poi di spiegarmi perché lo aveva scelto. Sulla prima domanda era pronto, il pattern lo sapeva raccontare. Sulla seconda si è fermato. È venuto fuori che non lo aveva scelto: lo aveva proposto l'AI, e lui lo aveva preso. "Funzionare funziona," gli ho detto, "ma qui è inutile. Con una ref togliamo una ventina di righe da cinque componenti, e non dobbiamo più metterci mano tutti e cinque ogni volta che cambia qualcosa a monte. Meno codice da leggere, meno da mantenere." Non era una correzione di stile. Era tornare insieme al cuore del problema, quello che la risposta completa aveva coperto.

È qui che mi accorgo che sta cambiando il modo stesso in cui si cresce. Il collega non era incapace: si era fermato in superficie. E fermarsi in superficie, oggi, sembra non costare niente. L'AI ti dà una risposta che funziona, tu la prendi, vai avanti. Ma ogni volta che demando alla macchina non la scrittura, quella va benissimo, ma la comprensione, perdo un pezzo di ownership sul codice che porta il mio nome.

E la comprensione persa non si recupera da sola. Un componente che non capisco fino in fondo ne chiama un altro che non capisco, che a sua volta ne chiama un altro. Scatole dentro scatole, una matrioska di black box. Finché tutto funziona nessuno la apre, e sembra perfino un vantaggio: guarda quanto andiamo veloci. Il conto arriva dopo, tutto insieme. Il giorno che qualcosa si rompe scopri che nessuno, in tutta la catena, sa più cosa c'è dentro: non il collega che l'ha accettata, non io che l'ho lasciata passare, non la macchina, che non sa di aver risposto. E da lì non si esce con un'altra domanda all'AI: si esce solo tornando a capire, cioè rifacendo tutto in una volta e sotto pressione il lavoro che si era saltato un pezzo alla volta.

Di fronte a questo ho cambiato quello che chiedo, soprattutto ai più giovani. Prima il metro era il codice: quanto ne produci, quanto in fretta. Adesso il metro è il problema: quanto a fondo lo capisci. La domanda che ho imparato a fare non è "cosa fa questo codice?", a quella risponde già la macchina, ma "perché proprio questo, e non qualcosa di più semplice?". È la stessa che avevo fatto al collega al telefono, solo spostata prima: non in review, quando il codice c'è già, ma mentre lo si sta ancora pensando.

In concreto, questo vuol dire non partire dal codice. A un junior chiedo di partire dall'analisi: segnarsi tutte le parti coinvolte, identificare il dominio che la story tocca, disegnare un flusso, e solo da lì cominciare a scrivere. Sembra molto più lento, e probabilmente lo è. Ma è l'unico modo in cui si impara davvero, ed è quello che gli permetterà, un domani, di gestire story molto più complesse senza perdersi in un bicchier d'acqua. Quella lentezza non è tempo perso: è la mappa che gli eviterà di girare a vuoto dopo.

Quello che provo a insegnare è semplice da dire e difficile da fare: il nostro mestiere non è evitare la complessità, è conviverci. Accettarla, prima di tutto. Poi conoscerla, andando a fondo: il perché di una cosa, il come, lo scopo che serve davvero. E infine gestirla. Arrivare al cuore di un problema significa conoscerlo, e conoscerlo è l'unico modo per risolverlo invece di girarci intorno. Quella ref al posto del pattern di hydration non era una scorciatoia: era il cuore del problema, e si vedeva solo a chi al cuore c'era arrivato.

Torno alla slitta. I cani sono la potenza, e l'AI ne mette cinque. Ma la slitta ha bisogno di qualcuno che stia dietro e decida la direzione, e quel qualcuno non corre: progetta. Guarda la mappa, sceglie la rotta, tiene i cani allineati. Crescere, nell'era del codice generato, non vuol dire imparare a correre più forte. I cani corrono già. Vuol dire imparare a guidare.

Perché la velocità, in fondo, non è lo scopo dell'AI. È il prodotto di scarto di un buon design e di una buona progettazione. Arriva da sola, quando hai capito dove stai andando.

---

*Le opinioni e le esperienze condivise in questo articolo sono personali e non rappresentano posizioni ufficiali del mio datore di lavoro. I casi descritti sono volutamente generici e anonimizzati, a scopo divulgativo.*
