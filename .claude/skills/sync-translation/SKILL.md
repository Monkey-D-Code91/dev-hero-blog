---
name: sync-translation
description: >
  Tiene allineate le coppie IT/EN di The First Draft dopo una modifica. Le altre skill coprono
  la CREAZIONE bilingue (write-article, add-author); questa copre la MANUTENZIONE: quando ritocchi
  una sola lingua di un contenuto che esiste gia' in entrambe, trova il gemello, misura cosa e'
  cambiato dall'ultimo allineamento, propaga la modifica in traduzione idiomatica senza riscrivere
  il resto, verifica e passa la coda git a ship. Vale per tutte e tre le collection bilingui:
  blog (translationKey), authors (authorKey), roadmap (arcKey). Usa questa skill quando Marco dice
  cose come "ho modificato l'italiano, aggiorna l'inglese", "allinea le traduzioni", "il gemello EN
  e' vecchio", "propaga questa modifica nell'altra lingua", "controlla se IT ed EN sono allineati",
  "sync translation", "update the English version", oppure quando lo script
  scripts/check-translation-sync.mjs segnala una coppia disallineata. NON e' la skill per scrivere
  un articolo nuovo (write-article), per rifinire il tono (refine-article), per creare un profilo
  autore (add-author) ne' per pubblicare (publish-article).
---

# sync-translation — Manutenzione delle coppie IT/EN

Il bilinguismo di The First Draft non si rompe alla creazione: si rompe dopo. Un articolo nasce
in IT e EN insieme, poi passano tre mesi, arriva una correzione dal tavolo di discussione, la
metti in italiano e l'inglese resta indietro. Nessuno se ne accorge, perche' nessuno rilegge il
sito in inglese. Il tuo mestiere e' chiudere questa falla. Lingua di lavoro: italiano.

Prima di agire leggi `CLAUDE.md` alla radice e `docs/editorial-guidelines.md`: le regole
editoriali sono fonte di verita' e non si rinegoziano qui.

**Autonomia.** Un solo punto di controllo: il piano di propagazione (Passo 3). Prima di quello
misuri e proponi, dopo quello vai fino alla consegna a `ship` senza micro-conferme. Ti fermi
comunque se emerge una decisione vera: un cambiamento di sostanza che modifica la tesi, un
contenuto sensibile, un URL pubblico da cambiare.

---

## Passo 0 — Identifica la coppia e la direzione

| Se Marco... | Cosa fai |
|---|---|
| indica un file | quella coppia, direzione = dal file indicato verso il gemello |
| dice "ho modificato l'italiano" senza file | lanci lo script (Passo 1) e proponi le coppie con IT piu' recente |
| chiede "sono allineati?" | esegui solo i Passi 1 e 2 e ti fermi: e' una domanda, non un incarico |
| non specifica niente | lanci lo script su tutto e presenti il quadro |

**La direzione la decide chi ha cambiato, non la lingua.** IT verso EN e' il caso frequente, non
l'unico: se la correzione e' arrivata da un lettore anglofono la sorgente e' l'inglese. Non dare
mai per scontato che l'italiano sia l'originale da cui si copia.

Le tre collection bilingui e la chiave che le accoppia:

| Collection | Chiave | Cartelle |
|---|---|---|
| blog | `translationKey` | `src/content/blog/{it,en}` |
| authors | `authorKey` | `src/content/authors/{it,en}` |
| roadmap | `arcKey` | `src/content/roadmap/{it,en}` |

**Gli slug dei file sono diversi tra IT ed EN e non servono ad accoppiare niente.** Il legame e'
la chiave nel frontmatter. Cercare il gemello per somiglianza del nome file e' un errore.

---

## Passo 1 — Misura, non stimare

```bash
node scripts/check-translation-sync.mjs                       # tutte le coppie
node scripts/check-translation-sync.mjs <file>                # solo quella coppia
node scripts/check-translation-sync.mjs --json                # output strutturato
```

Lo script incrocia due segnali indipendenti e ti dice quale dei due ha parlato:

- **git**: il *punto di sync* e' l'ultimo commit che ha toccato entrambi i file. Quello che e'
  successo a un solo lato dopo quel commit (commit o modifiche non ancora committate) e' il
  disallineamento.
- **struttura**: numero di heading, blocchi, code fence, link, immagini, chiavi e voci di lista
  del frontmatter. Non dipende da git: intercetta il caso in cui la storia mente, cioe' un commit
  che ha toccato entrambi i file per ragioni non correlate e ha azzerato il segnale git.

Stati che puo' restituire, e cosa significano per te:

| Stato | Lettura |
|---|---|
| `ok` | allineate per quanto e' verificabile: non c'e' lavoro |
| `stale-en` / `stale-it` | una lingua e' cambiata da sola: e' il caso normale, procedi |
| `both-changed` | entrambe cambiate dopo il punto di sync: **non scegliere tu** quale vince, vedi Passo 3 |
| `no-sync-point` | mai committate insieme: l'allineamento non e' mai stato verificato, tratta come revisione completa |
| `unpaired` | manca il gemello: non e' un disallineamento, e' un contenuto monolingue. Fermati e segnalalo |
| `unknown` | git non interrogabile (clone shallow): resta il solo confronto strutturale, **dillo** |

Se lo script dice `ok` ma Marco sostiene che c'e' un disallineamento, ha ragione lui: significa
che la modifica e' entrata in un commit che ha toccato entrambi i file. Passa al confronto
semantico del Passo 2 e fidati della lettura, non del tool.

---

## Passo 2 — Leggi il diff e classifica cosa e' cambiato

Lo script ti stampa il comando esatto. Leggi il diff **e poi leggi entrambi i file per intero**:
il diff dice cosa e' cambiato, i file dicono se la traduzione esistente regge ancora.

Classifica ogni modifica in una di queste categorie, perche' si propagano in modo diverso:

| Categoria | Esempio | Come si propaga |
|---|---|---|
| **Sostanza** | una tesi corretta, un fatto aggiornato, un paragrafo nuovo | si traduce e si propaga: e' il motivo per cui esisti |
| **Struttura** | un heading aggiunto, un blocco spostato, una lista che diventa prosa | si replica la struttura, poi si traduce il contenuto |
| **Metadato tradotto** | `title`, `description`, `coverAlt`, `tags` | si traduce (vedi tabella del Passo 4) |
| **Metadato chiave** | `translationKey`, `pubDate`, `draft`, `respondsTo`, `focus` | si **copia identico**, mai tradotto |
| **Cosmetica di una lingua sola** | un sinonimo per evitare una ripetizione in IT, una virgola | **non si propaga**: e' proprio l'asimmetria voluta tra le due lingue |

L'ultima riga e' la piu' importante e la piu' facile da sbagliare. Le linee guida dicono che in
italiano le ripetizioni ravvicinate si alleggeriscono e in inglese no: se il diff IT e' "ho
sostituito la seconda occorrenza di *strumento* con *arnese*", in inglese **non c'e' niente da
fare**. Propagare quella modifica peggiora l'inglese.

---

## Passo 3 — Proponi il piano, e accetta di non avere lavoro

Presenta in forma compatta, per ogni coppia:

- **quale coppia** e in che direzione va la propagazione;
- **cosa e' cambiato**, diviso nelle categorie del Passo 2, con il testo reale (non "modifiche
  minori": la frase);
- **cosa NON propaghi** e perche' (la cosmetica di lingua): dichiararlo evita che sembri una
  dimenticanza;
- **se serve rileggere oltre il diff**: quando la modifica cambia un pezzo di ragionamento, il
  paragrafo successivo nell'altra lingua spesso non regge piu' anche se non e' stato toccato;
- **cosa resta a Marco**, se resta qualcosa.

Poi chiedi l'ok. **Non modificare niente prima.**

Casi in cui **non procedi da solo**:

- **`both-changed`**: le due lingue sono andate avanti separatamente. Mostri i due diff e chiedi
  quale versione fa testo, o se vanno fuse. Sceglierlo tu significa cancellare del lavoro.
- **La modifica cambia la tesi** del pezzo. Allora non e' manutenzione della traduzione: e' una
  revisione, e va gestita come tale (vedi Passo 4, `revisions`).
- **Il contenuto tocca dati del datore di lavoro o nomi di persone**. Vale la regola di
  `CLAUDE.md` §4: la clearance la da' il Product Owner.

Se lo script dice `ok` su tutte le coppie, **questo e' l'esito**: dillo e fermati. Non cercare
micro-differenze stilistiche da "sistemare" per avere qualcosa da fare: sono la traduzione
idiomatica che funziona.

---

## Passo 4 — Propaga

**Regola prima di ogni altra: modifica chirurgica.** Tocchi i punti che il diff ha toccato e i
punti che quelli rendono incoerenti. Non ritraduci l'articolo da capo. La traduzione esistente e'
gia' stata rifinita e approvata: riscriverla per intero cancella quel lavoro e introduce
regressioni che nessuno rileggera'.

### Cosa si traduce e cosa si copia identico

| Collection | Si traduce (idiomatico) | Si copia identico |
|---|---|---|
| **blog** | `title`, `description`, `coverAlt`, corpo, valori dei `tags`, `revisions[].note`, `discussion[].from/quote/reply`, `openQuestions[].question` | `translationKey`, `pubDate`, `updatedDate`, `draft`, `focus`, `authors`, `feedbackReviewed`, `canonicalUrl`, `respondsTo`, `resumedBy`, `revisions[].date`, `discussion[].via`, il path della `cover` |
| **authors** | `role`, `badge`, `headline`, `subline`, `aboutLead`, `experience[].role/description`, `skills[].title/items`, corpo | `authorKey`, `name`, `monogram`, `links`, `stats`, `avatar`, `experience[].period/company` |
| **roadmap** | `title`, `lead`, `period`, `signature`, `upcomingTeaser.label/text`, `items[].title` (solo tappe di pipeline), `items[].focus` | `arcKey`, `order`, `numeral`, `items[].postTranslationKey`, `items[].date`, `items[].status`, `items[].authorName`, `items[].collaborator` |

Tre trappole ricorrenti:

1. **Le chiavi non si traducono mai.** `respondsTo`, `resumedBy`, `postTranslationKey`,
   `translationKey` sono identificatori: tradurli rompe i collegamenti risolti a build time e il
   preflight lo segnala come link a un articolo inesistente.
2. **I `tags` si traducono ma il numero deve restare lo stesso** (il preflight conta).
3. **`pubDate` e `draft` devono essere identici** nelle due lingue: e' un errore bloccante del
   preflight, non una svista cosmetica.

### Regole di scrittura

- **Traduzione idiomatica, non letterale.** Se la frase italiana nuova ha una struttura che in
  inglese suona tradotta, la si riscrive, non la si ricalca.
- **Asimmetria delle ripetizioni**: in italiano varia i termini ripetuti a breve distanza; in
  inglese lascia ripetere il termine chiave, che da' coesione. Non applicare la regola italiana
  all'inglese.
- **Niente trattini lunghi** in nessun testo del brand: due punti, virgole, parentesi, punti.
  Vale anche nel testo che stai aggiungendo adesso.
- **Niente nomi di persone** tranne gli autori del blog: per tutti gli altri il ruolo.
- **Prima persona e voce dell'autore.** La frase nuova deve suonare come il resto del pezzo, non
  come una nota redazionale infilata dentro.
- Se esiste `personas/<author-key>.md` sulla macchina, leggilo e usalo per orientare la voce
  (e' privato e non versionato: non citarlo e non riportarne il contenuto).

### Lo slug del file non si tocca

Se la modifica cambia il `title`, **lo slug del file resta quello**: e' l'URL pubblico, e
rinominarlo rompe i link esistenti e la cronologia. Rinominare si puo' solo se il contenuto e'
ancora `draft: true`. Se pensi che lo slug vada davvero cambiato su un pezzo pubblicato, e' una
decisione di Marco e comporta un redirect: proponila, non eseguirla.

### Quando la modifica va dichiarata al lettore

Se il cambiamento e' una **revisione sostanziale dopo la pubblicazione** (una tesi corretta, un
fatto aggiornato, una precisazione arrivata da un lettore), non basta allineare le due lingue:
va aggiunta una voce in `revisions`, datata, **in entrambe le lingue**, nella voce dell'autore.
Le linee guida sono esplicite sul fatto che sia rara e vera: refusi e cosmesi non ci vanno.
Se sei in dubbio, chiedi: e' una decisione editoriale, non tecnica.

---

## Passo 5 — Verifica

```bash
node scripts/check-translation-sync.mjs <file>     # la coppia deve tornare allineata
node scripts/preflight-article.mjs --all
npm test
npx astro check
npm run build                                      # in locale; nel sandbox puo' non girare
```

Lo script continuera' a segnalare la coppia finche' le modifiche non sono committate insieme:
e' corretto, il punto di sync si crea con il commit. Quello che devi verificare adesso e' che
**le differenze strutturali siano sparite** e che il preflight sia pulito.

Poi rileggi la versione tradotta per intero, a occhio. Il preflight conta gli elementi, non sa se
la frase nuova stona con il paragrafo che la precede.

---

## Passo 6 — Consegna a `ship`

La coda git la fa la skill **`ship`**, fonte di verita' del processo: non riscriverla qui.
Quello che le consegni, specifico di questa skill:

- **commit**: `content(<scope>): allinea <lingua> di <slug o chiave>` quando e' solo propagazione;
  `content(blog): <cosa cambia>` quando la modifica di sostanza entra ora in entrambe le lingue.
  Scope: `blog`, `authors`, `roadmap`.
- **entrambi i file nello stesso commit.** Non e' una preferenza estetica: il punto di sync di
  domani e' questo commit. Spezzare IT ed EN in due commit rende la coppia disallineata per
  costruzione e rompe il rilevamento successivo.
- **corpo della PR**: cosa e' cambiato, in quale lingua era gia' presente, cosa non e' stato
  propagato di proposito (la cosmetica di lingua) e perche'.

---

## Rapporto con le altre skill

| Skill | Confine |
|---|---|
| `write-article` | crea la coppia. Quando la coppia esiste, il seguito e' qui |
| `refine-article` | rifinisce tono e stile di un pezzo. Se rifinisce **una lingua sola**, il riallineamento e' lavoro di questa skill |
| `add-author` | crea il profilo IT+EN. Le modifiche successive al profilo passano da qui |
| `publish-article` | il rituale del giorno di uscita. Non si sovrappone: qui si lavora su contenuti gia' pubblicati |
| `site-audit` | trova e non tocca. Se un audit segnala un disallineamento IT/EN, il fix e' qui |
| `ship` | la coda git, sempre |

---

## Errori da non fare

- **Ritradurre l'articolo intero** perche' e' cambiato un paragrafo. Cancella il lavoro di
  rifinitura gia' fatto e nessuno rileggera' l'inglese per accorgersene.
- **Propagare la cosmetica di una lingua sola.** Un sinonimo introdotto in IT per evitare una
  ripetizione non ha un corrispettivo in EN: replicarlo peggiora l'inglese.
- **Tradurre una chiave** (`respondsTo`, `resumedBy`, `postTranslationKey`). Rompe collegamenti
  che il preflight vede e le pagine che li risolvono a build time.
- **Rinominare il file per far combaciare gli slug.** Gli slug sono diversi apposta e l'URL e'
  pubblico.
- **Scegliere da solo in `both-changed`.** Una delle due versioni contiene lavoro che stai per
  buttare.
- **Committare IT ed EN separatamente.** Distrugge il punto di sync su cui si basa il
  rilevamento successivo.
- **Dire che la coppia e' allineata perche' lo script dice `ok`** quando lo script gira su un
  clone shallow o fuori da git: in quel caso hai verificato solo la struttura, e va detto.
- **Trattare una revisione sostanziale come una propagazione.** Se cambia la tesi, il lettore ha
  diritto a vederlo in `revisions`.
