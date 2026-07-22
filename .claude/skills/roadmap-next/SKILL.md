---
name: roadmap-next
description: >
  Prende il prossimo punto aperto da un backlog tecnico o di prodotto di The First Draft
  (TECH-IMPROVEMENTS.md, NEW-IDEAS.md, o un file di piano indicato) e lo porta fino alla PR:
  classifica le voci, valuta i trigger contro lo stato reale del repo, propone il candidato
  migliore con motivazione e dimensione, e dopo l'ok implementa su branch, aggiorna il backlog
  con marker e paragrafo di stato, verifica e apre la PR. Sa anche concludere che oggi non c'e'
  niente da fare, ed e' un esito legittimo. Usa questa skill quando Marco dice cose come
  "prossimo punto della roadmap", "leggi TECH-IMPROVEMENTS e implementa il prossimo",
  "cosa c'e' da fare adesso", "prendi la prossima idea", "next roadmap item", "what's next",
  "implementa il punto N di <file>", "aggiorna il backlog con quello che abbiamo fatto".
  NON e' la skill per la roadmap editoriale degli articoli (docs/content-roadmap.md e la
  collection src/content/roadmap): per quella si usano write-article e publish-article.
---

# roadmap-next — Dal backlog alla PR

Sei il collaboratore tecnico che tiene in movimento i backlog del progetto. Il tuo valore non è
scrivere codice in fretta: è **scegliere bene il punto giusto** e dire di no quando il punto
giusto non c'è. Lingua di lavoro: italiano.

Prima di qualsiasi cosa, leggi `CLAUDE.md` alla radice del repo: workflow git, verifiche
obbligatorie e regole editoriali valgono anche qui e non si rinegoziano in questa skill.

**Un solo punto di controllo.** Chiedi conferma una volta sola, sulla scelta del punto (Passo 3).
Dopo l'ok procedi fino alla PR senza micro-conferme, fermandoti solo se emerge una decisione vera
(costi, contenuti pubblici, cambio di scope, un vincolo che non conoscevi).

---

## Passo 0 — Identifica il backlog

| Se Marco... | Backlog |
|---|---|
| non specifica niente | leggi **entrambi**: `TECH-IMPROVEMENTS.md` e `NEW-IDEAS.md` |
| dice "tecnico", "debito", "codice" | `TECH-IMPROVEMENTS.md` |
| dice "idee", "prodotto", "feature editoriale" | `NEW-IDEAS.md` |
| indica un file (`docs/<piano>.md`, un `.md` di piano) | quel file |

**Fermati e instrada** se la richiesta riguarda in realtà la roadmap **editoriale** (quale
articolo esce, quando, in che ordine): quella vive in `docs/content-roadmap.md` e nella collection
`src/content/roadmap/{it,en}`, e si tocca con `write-article` e `publish-article`, non qui.
Il segnale è che si parla di pezzi, date di uscita, archi narrativi, non di codice o feature.

Se il file indicato non esiste, dillo e fermati: `HANDOFF.md` e `HOW-TO-PLAN.md` non sono
versionati e su una macchina diversa da quella di Marco semplicemente non ci sono.

---

## Passo 1 — Classifica ogni voce

Convenzione dei backlog (dichiarata in testa a ciascun file): **il marker
`— IMPLEMENTATO (YYYY-MM-DD)` nel titolo e' il segnale autorevole**, le voci senza marker sono
aperte. Dal 2026-07-22 ogni voce che chiudi porta anche un paragrafo `**Stato**:` (Passo 6); le
voci chiuse prima di quella data hanno il marker e il corpo gia' scritto come prosa di stato, e
vanno bene cosi': non riaprirle per aggiungere il paragrafo. Classifica **tutte** le voci in una di queste categorie, prima di proporre qualsiasi cosa:

| Categoria | Come la riconosci | Selezionabile? |
|---|---|---|
| **Conclusa** | marker `— IMPLEMENTATO (data)` | no |
| **Vietata** | sta sotto "Cosa NON fare (anti-roadmap tecnica)" o "Idee valutate e scartate" | **mai**, sono decisioni negative prese apposta |
| **Da discutere** | sta sotto "Idee da esplorare (meno mature, da discutere)" | no: prima serve una conversazione, non un branch |
| **Bloccata su un'azione umana** | il paragrafo di stato contiene `**Resta da fare (Marco)**` (creare un account, incollare un token, fornire un contenuto vero) | no: non è lavoro riapribile, è un promemoria per Marco |
| **In attesa di trigger** | la voce dichiara una condizione (`Trigger: ...`, "quando si tocca la navbar", "oltre ~15 articoli", "al lancio del podcast") | solo se il trigger è **scattato** (Passo 2) |
| **Pronta** | aperta, senza condizioni non soddisfatte | sì |

Una voce può essere parzialmente conclusa: il paragrafo di stato a volte dice cosa è rimasto
fuori ("**Non fatta** l'estensione opzionale..."). Quel residuo è una voce aperta a tutti gli
effetti, trattalo come tale ma proponilo per quello che è, un completamento.

---

## Passo 2 — Valuta i trigger sui fatti, non a memoria

I trigger dei backlog sono numerici o legati a eventi. **Misurali**, non stimarli:

```bash
node scripts/status.mjs                                   # stato pipeline, coppie IT/EN
grep -L "^draft: true" src/content/blog/it/*.md | wc -l   # articoli pubblicati (trigger ricerca)
grep -rl "openQuestions:" src/content/blog/it/ | wc -l    # pezzi con domande aperte
git log --oneline -15                                     # cosa si è toccato di recente
```

Regole di lettura:

- **Trigger a soglia** ("oltre ~15 articoli pubblicati" per la ricerca full-text): se il numero
  reale è sotto, il punto **non è pronto**, e non è una questione di opportunità. La soglia è
  stata fissata apposta per non ridiscuterla ogni volta: rispettarla è il senso della voce.
- **Trigger opportunistici** ("la prima volta che si tocca la navbar" per rimuovere React): sono
  pronti solo se quel lavoro è già sul tavolo adesso. Non inventare l'occasione per giustificare
  il punto.
- **Trigger a evento** ("al lancio del podcast", "al prossimo publish-day EN"): verifica che
  l'evento sia successo davvero, in `HANDOFF.md` se c'è, nel repo altrimenti.
- **Vincoli dichiarati nella voce** vanno riportati nella proposta (es. il punto React ha
  "se in roadmap ci sono island interattive future reali, tenerlo": è una condizione da
  verificare, non una nota di colore).

---

## Passo 3 — Proponi, e accetta di non avere niente da proporre

Presenta al massimo **tre** candidati, ordinati, in forma compatta. Per ciascuno:

- **da dove viene**: file e numero della voce;
- **perché adesso**: la motivazione reale, non la riformulazione del titolo;
- **stato del trigger**: scattato, e su quali numeri;
- **dimensione**: piccola (un file, poche ore), media (più file, una sessione), grande (più
  sessioni, richiede un piano su file);
- **cosa tocca**: i file o le aree del repo coinvolte;
- **il rischio principale**, se c'è.

Poi chiedi l'ok su quale prendere. **Non implementare niente prima di questa conferma.**

**Se nessuna voce è selezionabile, questo è l'esito.** Dillo chiaramente, elenca le voci aperte
con il trigger che manca e il numero che manca, e fermati. Non ripiegare sulla voce meno
inadatta e non allargare lo scope per avere qualcosa da fare: un backlog senza punti maturi è
un backlog in salute, e forzarlo è il modo più veloce per costruire cose che non servono.
Se ti sembra che manchi lavoro utile, proponi semmai di **aggiungere** una voce al backlog e
discuterla, che è un altro mestiere.

---

## Passo 4 — Dimensiona prima di scrivere codice

- **Piccola o media**: procedi direttamente al Passo 5.
- **Grande**: scrivi prima il piano su file (`docs/<nome>.md`), seguendo `HOW-TO-PLAN.md` se
  esiste sulla macchina. Il piano va spezzato in punti eseguibili in sessioni separate. In questo
  caso la PR di oggi contiene **il piano**, non l'implementazione: è un esito completo, non un
  ripiego. Lo dici a Marco invece di iniziare comunque a scrivere codice.

Regola pratica: se non sai elencare i file che toccherai, la voce è più grande di quanto sembra.

---

## Passo 5 — Implementa su branch

```bash
git switch -c <tipo>/<slug>     # feat|fix|chore|docs|perf, slug dal titolo della voce
```

Durante l'implementazione:

- Rispetta i confini dichiarati dal backlog stesso. La sezione "Cosa NON fare" è vincolante
  anche mentre implementi un altro punto: niente SSR, niente CMS con UI, niente redesign,
  niente automazione della scrittura.
- Se tocchi testi visibili al lettore, valgono le regole editoriali di `CLAUDE.md` §4:
  bilingue IT+EN, niente trattini lunghi, niente nomi di persone.
- Se scopri che la voce nasconde una decisione di prodotto non presa, **fermati e chiedi**:
  è una delle eccezioni al "niente micro-conferme".

Verifiche prima di considerare fatta l'implementazione (`CLAUDE.md` §3):

```bash
node scripts/preflight-article.mjs --all
npm test
npx astro check
npm run build          # in locale; nel sandbox può non girare (CLAUDE.md §7)
```

Se la modifica è visibile a schermo, guardala nel browser (`npm run dev` + Claude in Chrome)
prima di aprire la PR. I bug arrivati in produzione su questo progetto erano tutti visivi.

---

## Passo 6 — Aggiorna il backlog nella stessa PR

Non è un passo opzionale e non aspetta che Marco lo chieda: un backlog non aggiornato è la
ragione per cui questa skill esiste.

1. **Marker nel titolo**: `### N. Titolo — IMPLEMENTATO (YYYY-MM-DD)` con la data di oggi.
2. **Paragrafo di stato** in coda alla voce, aperto da `**Stato**:`. Deve dire, in prosa e
   onestamente: cosa è stato fatto, dove vive nel repo (file e componenti reali), cosa è rimasto
   fuori di proposito, e se resta un'azione umana la marchi `**Resta da fare (Marco)**`. Niente
   formule di rito: chi lo rilegge tra tre mesi deve capire lo stato senza aprire il codice.
3. **Riga di intestazione "Stato al ..."** in testa al file: aggiorna data ed elenco dei punti
   aperti e conclusi.
4. Se la voce apre o chiude qualcosa in altri documenti (`docs/brand.md`,
   `docs/editorial-guidelines.md`, README, una skill), aggiorna anche quelli: sono fonte di
   verità e divergere è un bug.
5. Se lo stato del progetto è cambiato in modo sostanziale e `HANDOFF.md` esiste, aggiornalo
   (non è versionato: non finirà nella PR, ma serve alla prossima sessione).

---

## Passo 7 — PR

La coda git la fa la skill **`ship`**, che e' la fonte di verita' del processo (staging esplicito,
verifiche, commit, PR, CI, merge, riallineamento di `main`): passale il lavoro invece di
riscriverla qui.

Quello che le consegni, specifico di questa skill:

- **commit**: `<tipo>(<scope>): <cosa cambia>`, con lo scope della feature toccata;
- **corpo della PR**: **quale voce del backlog chiude** (file e numero), cosa e' stato fatto,
  cosa e' rimasto fuori e perche'. Chi la rilegge deve poter tornare alla voce d'origine.
- **file**: ricordati di includere il backlog aggiornato al Passo 6, non solo il codice.

---

## Errori da non fare

- **Implementare una voce dell'anti-roadmap** perché "tecnicamente si può". Quelle sezioni sono
  il lavoro di pensiero già fatto: sono la parte più preziosa del backlog, non la meno.
- **Trattare "Resta da fare (Marco)" come lavoro da riaprire.** Creare un account Buttondown o
  incollare un token non è codice: è un promemoria per una persona.
- **Anticipare un trigger** perché il punto sembra maturo. La soglia esiste per non ridiscuterla.
- **Chiudere una voce a metà** mettendo il marker su un lavoro parziale. Meglio nessun marker e
  un paragrafo di stato onesto che un `IMPLEMENTATO` falso.
- **Implementare e non aggiornare il backlog.** La PR è incompleta finché il file non è allineato.
- **Incatenare due punti nella stessa sessione.** Una voce, una PR, poi `/clear` (`CLAUDE.md` §8).
