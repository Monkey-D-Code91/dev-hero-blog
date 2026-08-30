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

Sul cliente con il volume maggiore, decine di migliaia di utenze monitorate e diverse centinaia di notifiche configurate, quella pagina ci metteva in media ventidue secondi a comparire. Non a rispondere: a comparire. Prima di quel momento non c'era niente da guardare, perché caricava per intero tutto ciò che le serviva e solo alla fine si disegnava.

Ventidue secondi sono tanti dovunque. Ma la lentezza in sé non è ancora il punto: conta dove cadeva. Cadeva addosso a qualcuno che era stato appena avvisato di un problema da risolvere subito.
