---
title: "Nell'era dell'AI si legge più di quanto si scrive"
description: "Una story da due righe arriva in review come cinquanta file. L'AI ha reso lo scrivere quasi gratis, e per questo il vero mestiere adesso è leggere e giudicare: quindici minuti di lavoro, quattro ore di review."
pubDate: 2026-07-14
translationKey: "we-read-more-than-we-write"
focus: ["tech", "human"]
authors: ["marco-mariotti"]
tags: ["ai", "code-review", "codice-generato", "ingegneria-del-software"]
cover: "../../../assets/covers/nell-era-dell-ai-si-legge-piu-di-quanto-si-scrive.png"
coverAlt: "Copertina di The First Draft: tre cerchi sovrapposti (tech, human e AI) che si incontrano in un punto luminoso, con il titolo 'Nell'era dell'AI si legge più di quanto si scrive' sottolineato a mano come una correzione di bozza."
draft: false
feedbackReviewed: true
openQuestions:
  - question: "Quanto pesa il controllo che scivola via, quando l'accumulo di codice non voluto si ripete uscita dopo uscita?"
---

C'era una story semplice: scambiare il payload di due endpoint, cioè far sì che due servizi si scambiassero i dati che ricevono in ingresso. Due righe di descrizione, mezza giornata di lavoro se andava lunga. Apro la pull request per la review e trovo cinquanta file modificati. Cosa sta succedendo?

Il primo lavoro non è stato leggere il codice. È stato capire perché una story da due righe era esplosa in cinquanta file.

La story era una riga: scambia A con B. Nella pull request, quella riga c'era. Intorno le si era formata una fetta di sistema intera: un nuovo endpoint di validazione mai chiesto, e dietro di lui i suoi tipi, i suoi errori, le sue traduzioni, il suo aggancio alla pagina. Un "già che ci sono" era diventato una dozzina di file. Più in là, un refactor che rendeva più pulite le chiamate ne aveva aperto un altro: cambiando il modo di inviare i dati, certi campi obbligatori potevano ora mancare, e serviva nuovo codice per gestirli. Nessuno l'aveva chiesto, e quel refactor si era fabbricato da solo un problema nuovo da risolvere.

Niente di tutto questo è pigrizia, e il collega è tutt'altro che incapace: è valido, si è solo lasciato prendere la mano. È la risposta razionale a un costo che è crollato. Quando aggiungere una cosa costava mezz'ora, il "ne vale la pena?" te lo ponevi da solo. Quando costa il tempo di scrivere una frase all'AI, la domanda non scatta più, e ogni "già che ci sono" sembra giustificato. Sotto l'economia c'è qualcosa di più umano: la voglia di fare, di essere veloci e produttivi davanti a tutti, che a costo quasi zero non trova più argine. Ed è proprio quella spinta, buona in sé, che a volte ci fa perdere di vista ciò che conta davvero.

L'attrito che il collega non ha incontrato scrivendo non è sparito. Ha solo cambiato stanza. Ogni file che lui ha aggiunto senza chiederselo, io me lo sono dovuto chiedere in review: serve? c'entra con la story? cosa rompe? Fare quello che la story chiedeva davvero erano quindici minuti di lavoro. Rivedere quella pull request mi è costato quattro ore. Non quattro ore a scrivere: a leggere, a ricostruire, a decidere cosa fosse story e cosa rumore.

È qui che si vede la verità dietro una frase che sembra uno slogan: oggi si legge più di quanto si scrive. Non perché leggere sia diventato un gesto nobile. Perché scrivere è diventato gratis, e ciò che è gratis produrre è caro da verificare. Il lavoro non è calato, e non si è nemmeno solo spostato dalle dita agli occhi: si è moltiplicato lungo il tragitto. Quindici minuti da un lato, quattro ore dall'altro.

Leggere, adesso, somiglia al lavoro del frate amanuense: leggere, catalogare e tramandare il significato di un testo perché non vada perso né frainteso. Con un rovescio. L'amanuense era lento perché copiava a mano, e quella lentezza era fedeltà. Oggi la macchina scrive in un lampo, e la lentezza è tornata dove serve capire, non dove serve produrre. Il mio compito non era ricopiare quel codice: era ritrovare, sotto cinquanta file, quale fosse davvero il testo, e salvarne il senso.

In pratica vuol dire separare ciò che è intenzionale da ciò che è soltanto capitato: la story voluta da una parte, l'accumulo dell'entusiasmo dall'altra. E vuol dire pesare il rischio nascosto. Quelle cinquecento righe in più non sono neutre: sono cinquecento righe che nessuno ha chiesto e che possono rompersi, ognuna una piccola esposizione a un bug che la story non prevedeva. Leggere non è più chiedersi se una riga fa quello che dice, perché quello lo verificano il linter, i test, la stessa AI. È chiedersi quali righe portano un'intenzione e quali un incidente, e quanto ci costa l'incidente.

E l'incidente, qui, un conto ce l'aveva. Non solo tempo: un ritardo reale rispetto a quanto la story era stimata, e qualcosa di più silenzioso, un po' di controllo sul codice che scivola via, cinquecento righe entrate in un modulo nuovo senza che nessuno le avesse davvero volute. Quanto pesa tutto questo quando si ripete e si accumula, è un'altra storia. Per ora basta la prima: leggere è tornato a essere il lavoro lento, e il lavoro lento è tornato a essere il mestiere.

I test c'erano, e passavano. Ma coprivano la parte facile, quella comoda, e lasciavano fuori diverse modifiche e alcune parti nuove per intero. Il verde, qui, è una bugia sottile: non certifica un mondo sbagliato, tace su quello che non ha guardato. Copre il sottoinsieme comodo, e su tutto il resto non dice niente. E un verde parziale, sullo schermo, si legge esattamente come un verde pieno.

Sotto quel verde non c'era una mappa. Nessun elenco di cosa andasse testato e come: solo un muro di codice tenuto insieme da promesse, promesse che se si sgretolano possono far crollare tutto. Quelle promesse erano gli assunti impliciti che le parti non testate funzionassero. Mancava la cosa che serviva più di ogni test: la dichiarazione di cosa quel codice toccava davvero.

Perché una lista di test è prima di tutto la dichiarazione di un dominio. Chi scrive dice: ecco cosa ho toccato, ecco i confini di ciò che cambia, ecco come lo si verifica. Senza quel confine io, in review, non posso controllare la copertura contro l'intento, perché l'intento non è mai stato scritto da nessuna parte.

La responsabilità, qui, è condivisa, ma ha un ordine. Prima è di chi sviluppa: individuare il dominio, esplicitarlo, darne indicazione, così che chi revisiona e chi fa QA possano verificarlo e testarlo a dovere. Poi è di chi fa review: controllare che il dominio dichiarato sia davvero quello, e che non ci siano falle o storpiature. La prima responsabilità disegna la mappa, la seconda la confronta col territorio.

Così la review ha smesso di essere l'ultimo controllo prima del merge ed è diventata un'altra cosa: il punto in cui rimetto l'attrito che l'AI aveva tolto. Non ho corretto virgole. Ho catalogato le modifiche per sapere cosa toccava cosa. Ho chiamato il collega, non per rimproverarlo ma per farmi aiutare a segnare le aree a rischio, perché quel codice ce l'aveva in testa lui. E ho riorganizzato quel blocco unico in story separate, ognuna col suo dominio, ognuna testabile una alla volta.

Quello che ho fatto, in fondo, è stato ridare allo sviluppo la resistenza che la generazione gli aveva risparmiato: rimettere il freno del "questo appartiene alla story? questo che rischio porta? questo come si testa?", una domanda alla volta.

Ed è qui la cosa che è cambiata davvero. L'attrito, prima, era una proprietà del mezzo: scrivere costava, e siccome costava ti autolimitavi da solo, riga per riga. Adesso scrivere non costa più niente, e quel freno non è più nel mezzo. Se lo vogliamo, deve diventare il compito di qualcuno. Il reviewer non è più chi dà l'ultima occhiata: è la persona che rimette, a mano, ciò che la macchina ha tolto. La code review non è più un controllo di fine linea, è il luogo dove si ridefinisce lo scopo.

Resta da dire una cosa onesta: rimettere l'attrito a valle, in review, costa più che averlo a monte. Quattro ore mie contro i quindici minuti di uno sviluppo tenuto nei suoi confini. Il reviewer-attrito è una toppa, non lo stato ideale. Il rimedio vero è farlo tornare dove serve, in chi scrive: dichiarare il dominio, restare nella story, limitarsi da soli. Ma perché torni lì non basta uno strumento, serve un modo di lavorare. E quello si insegna.

Leggere e giudicare, adesso, sono i nostri guardrail. Nel migliore dei casi ci accompagnano lungo la strada, a lato del campo visivo, e quasi non li notiamo. Nel peggiore, ci salvano da un brutto incidente. Ma la nostra responsabilità è agire sul guidatore. Perché agire sul guidatore vuol dire una cosa sola: che giudicare smetta di essere il mestiere di chi revisiona a valle, e diventi il modo di scrivere di chiunque, fin dalla prima riga. I guardrail serviranno sempre, e vanno tenuti solidi. Il punto è far sì che le scelte di chi sta alla guida riducano al minimo le volte in cui devono entrare in azione.

---

*Le opinioni e le esperienze condivise in questo articolo sono personali e non rappresentano posizioni ufficiali del mio datore di lavoro. I casi descritti sono volutamente generici e anonimizzati, a scopo divulgativo.*
