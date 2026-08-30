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
