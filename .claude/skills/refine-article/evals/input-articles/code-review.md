# Perché la maggior parte dei team fa la code review nel modo sbagliato

La code review è uno di quegli strumenti che tutti i team dicono di fare, ma pochissimi fanno bene. Il risultato? Review che non trovano i bug veri, tensioni tra colleghi, e PR aperte per giorni senza feedback.

Ho visto questo pattern ripetersi in ogni team in cui ho lavorato. Non è una questione di competenza — spesso sono sviluppatori bravi — è una questione di come si concepisce la review.

## Il problema del "LGTM" automatico

Il modo in cui molti team fanno review: si apre la PR, si scorre velocemente il diff, si lascia un commento su una cosa minore come una variabile mal nominata, si approva. Fine.

Questo non è review. È una firma su un foglio che non hai letto.

La review utile richiede tempo e concentrazione. Devi capire cosa sta cercando di fare il codice, non solo cosa fa. Questo significa leggere il ticket, capire il contesto, testare localmente se necessario.

## Feedback che divide invece di costruire

L'altro problema classico è il feedback personale invece che tecnico. "Questo codice è orribile" non aiuta nessuno. "Questo approccio ha O(n²) complessità — possiamo usare una mappa qui e portarlo a O(n)?" è utile e non è un attacco personale.

La differenza sembra ovvia ma in pratica molti team non ci arrivano. Il tono scritto è ambiguo, le persone si sentono giudicate, e nel tempo il team smette di farsi review oneste per non creare conflitti.

## Come fare review che funzionano

Prima cosa: dare contesto nella PR. Una buona PR description è come un buon commit message — spiega il perché, non solo il cosa.

Seconda cosa: separare i commenti bloccanti da quelli opzionali. "Questo deve cambiare prima del merge" vs "questa sarebbe una cosa bella da fare in futuro". Aiuta tantissimo a gestire le priorità.

Terza cosa: fare review entro 24 ore. Le PR che rimangono aperte per giorni creano blocchi, frustrazione, e merge conflict. Se non riesci a fare una review completa, almeno lascia un commento che dica quando puoi.
