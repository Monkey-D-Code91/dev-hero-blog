---
title: "Perché la maggior parte dei team fa la code review nel modo sbagliato"
description: "Come i team tecnici sbagliano l'approccio alla code review e tre pratiche concrete per farlo nel modo giusto."
pubDate: 2026-06-09
translationKey: "code-review-the-wrong-way"
author: "marco-mariotti"
tags: ["code-review", "engineering", "team", "qualità del codice", "collaborazione"]
draft: false
---

La code review è uno strumento che quasi tutti i team dichiarano di praticare — ma pochissimi praticano bene. Il risultato sono review che non intercettano i bug rilevanti, tensioni tra colleghi, e PR aperte per giorni senza feedback.

Ho visto questo schema ripetersi in ogni team in cui ho lavorato. Non è una questione di competenza tecnica — spesso sono sviluppatori capaci. È una questione di come si concepisce la review.

## Il problema del "LGTM" automatico

Il pattern più comune: si apre la PR, si scorre il diff velocemente, si commenta una cosa minore come una variabile mal nominata, si approva. Fine.

Non è review. È una firma su un documento che non si è letto.

Una review utile richiede tempo e concentrazione. Bisogna capire cosa il codice intende fare, non solo cosa fa. Questo significa leggere il ticket, comprendere il contesto, testare localmente quando necessario.

## Feedback che divide invece di costruire

Il secondo problema ricorrente è il feedback personale al posto di quello tecnico. "Questo codice è orribile" non aiuta nessuno. "Questo approccio ha complessità O(n²) — usando una mappa si porta a O(n)" è preciso e non è un attacco personale.

La distinzione sembra ovvia, ma in pratica molti team non la applicano. Il tono scritto è ambiguo per natura, le persone si sentono giudicate, e col tempo il team smette di fare review oneste per evitare conflitti.

## Come fare review che funzionano

**Primo: dare contesto nella PR.** Una buona PR description funziona come un buon commit message — spiega il perché, non solo il cosa.

**Secondo: separare i commenti bloccanti da quelli opzionali.** "Questo deve cambiare prima del merge" è diverso da "sarebbe bello affrontarlo in futuro". La distinzione aiuta a gestire le priorità in modo netto.

**Terzo: rispondere entro 24 ore.** Le PR aperte per giorni generano blocchi, frustrazione e merge conflict. Se non è possibile completare la review, un commento che indica quando si potrà farlo è già un contributo utile.
