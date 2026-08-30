---
name: ship
description: >
  Coda di chiusura standardizzata di The First Draft: porta un lavoro gia' fatto e verificato da
  "modifiche sul disco" a "merged su main", sempre nello stesso modo. Sposta le modifiche su un
  branch se sei ancora su main, mette in stage i file uno per uno (mai git add -A), scrive il
  commit in conventional commit italiano nello stile del repo, apre la PR con una descrizione
  vera, aspetta la CI, fa il merge in squash e riallinea main. Usa questa skill quando Marco dice
  cose come "chiudi", "fai la PR", "committa e apri la PR", "manda in PR", "shippa", "mergia",
  "porta a casa questa modifica", "ship it", "open the PR", "close this out". Non e' la skill che
  decide COSA fare (per quello: roadmap-next) ne' che pubblica un articolo (publish-article, che
  usa questa skill per la sua coda git). Non fa mai push diretti su main e non mergia mai con la
  CI rossa.
---

# ship — Dalla modifica al merge

Sei la coda di chiusura del progetto: il pezzo di processo che deve essere **identico ogni volta**,
perche' e' quello dove gli errori costano di piu' (un dato sensibile in un commit non si toglie
piu' davvero, un file privato in una PR e' pubblico). Lingua di lavoro: italiano.

Prerequisito: il lavoro e' **gia' fatto**. Se c'e' ancora da implementare, questa non e' la skill
giusta. Se il lavoro non e' stato verificato, lo verifichi tu al Passo 2: non e' opzionale.

**Autonomia.** Passi 0-4 li esegui di fila senza chiedere. Ti fermi e chiedi conferma in tre casi
soli: prima del **commit** (mostri cosa entra), se trovi qualcosa di **sensibile**, e prima del
**merge**. Tutto il resto e' meccanico.

---

## Passo 0 — Fotografa la situazione

```bash
git status --short
git branch --show-current
git diff --stat
git log --oneline -5
```

Tre casi, tre aperture:

| Situazione | Cosa fai |
|---|---|
| sei su `main` con modifiche non committate | `git switch -c <tipo>/<slug>` (le modifiche non committate ti seguono sul nuovo branch) |
| sei gia' su un branch di lavoro | prosegui, ma verifica che il naming sia conforme |
| sei su `main` pulito | non c'e' niente da shippare: dillo e fermati |

**Non provare mai a committare o pushare su `main`.** Non e' una preferenza: la branch protection
di GitHub rifiuta il push, per tutti, admin inclusi. Se ti trovi con dei commit gia' fatti su
`main` in locale, non forzare niente: crea il branch da li' (`git switch -c <tipo>/<slug>`) e
riporta `main` indietro con `git reset --hard origin/main`, dopo aver verificato con
`git log origin/main..main` che stai spostando solo i commit che credi.

Naming del branch (`CLAUDE.md` §2): `feat|fix|chore|docs|perf/<slug>`, slug in kebab-case che
descrive il cambiamento, non il file toccato.

---

## Passo 1 — Guarda cosa stai per rendere pubblico

Questo passo esiste per un motivo solo: **quello che entra nella storia git non si toglie piu'
davvero**. Leggi il diff, non solo la lista dei file.

```bash
git diff                    # modifiche a file gia' tracciati
git status --short          # le righe che iniziano con ?? sono file NUOVI, non tracciati
```

Tre controlli, in quest'ordine:

1. **File privati o di lavoro.** `personas/`, `feedback/`, `HANDOFF.md` sono gitignorati e non
   compaiono. Ma i file **non tracciati e non ignorati** (piani locali, appunti, analisi) sono
   la vera trappola: compaiono come `??` e finirebbero dentro a un `git add -A`. Per ciascuno
   decidi esplicitamente se entra o resta fuori, e se resta fuori chiedi a Marco se va
   gitignorato, cosi' il problema non si ripresenta.
2. **Contenuti sensibili** (`CLAUDE.md` §4): dati del datore di lavoro non anonimizzati, nomi di
   persone che non siano autori del blog, dettagli di clienti o architetture interne. Vale anche
   nei commenti al codice, nei messaggi di commit e nella descrizione della PR, non solo negli
   articoli. **Se trovi qualcosa, fermati e chiedi**: la clearance la da' il Product Owner, non tu.
3. **Segreti.** Chiavi, token, credenziali. Nota: `CF_BEACON_TOKEN` **non e' un segreto** (compare
   nell'HTML della pagina, vedi `CLAUDE.md` §7), quindi non allarmarti se lo vedi; qualunque altra
   cosa che somigli a una credenziale, invece, fermati.

---

## Passo 2 — Verifica prima di committare

Le verifiche di `CLAUDE.md` §3. Girano qui, non "quando capita": la CI le rifara' comunque, ma
scoprire un errore adesso costa un minuto invece di un giro di PR.

```bash
node scripts/preflight-article.mjs --all
npm test
npx astro check
npm run build          # in locale; nel sandbox puo' non girare (CLAUDE.md §7)
```

- **Preflight in errore**: bloccante, si sistema prima di committare.
- **Build che non gira nel sandbox**: dillo esplicitamente invece di far finta di averla fatta.
  La CI la eseguira' su Linux, ma Marco deve sapere che il controllo locale e' saltato.
- **Modifiche visibili a schermo**: guardale nel browser (`npm run dev` + Claude in Chrome) prima
  della PR. Su questo progetto i bug arrivati in produzione erano tutti visivi.

---

## Passo 3 — Commit

**Mai `git add -A`, mai `git add .`.** Metti in stage i file uno per uno, o per cartella quando
sono tanti e omogenei. E' l'unico modo per essere sicuro di cosa stai committando.

```bash
git add <file> <file> ...
git status --short          # rilegge: in stage c'e' esattamente quello che volevi?
```

Il messaggio, in **conventional commit** e in **italiano** (`CLAUDE.md` §2):

```
<tipo>(<scope>): <cosa cambia, in minuscolo, senza punto finale>
```

- **Tipi in uso nel repo**: `feat`, `fix`, `chore`, `docs`, `perf`, e `content` per le modifiche
  ai testi dei contenuti.
- **Scope reali gia' usati**: `blog`, `newsletter`, `rss`, `tooling`, `skills`, `assets`, `brand`,
  `readme`, `authors`, `a11y`, `seo`, `lcp`, `podcast`, e il nome della feature quando ne ha uno
  proprio (`open-questions`, `contradiction`, `feedback-note`). Riusa uno scope esistente se
  calza: sono una tassonomia, non un campo libero.
- Il soggetto dice **cosa cambia per chi legge il repo**, non quali file hai toccato.
- Corpo del commit solo se serve spiegare il perche'; il cosa sta nel soggetto e nel diff.

Mostra a Marco il messaggio e la lista dei file in stage **prima** di committare. E' il primo dei
tre punti di conferma.

---

## Passo 4 — Push e PR

```bash
git push -u origin <branch>
gh pr create --fill          # solo se il commit dice gia' tutto
```

`--fill` va bene per un cambiamento singolo e autoesplicativo. Negli altri casi scrivi la PR a
mano (`--title`, `--body`), in italiano, con:

- **cosa cambia** e perche', in due o tre righe;
- **cosa e' rimasto fuori** di proposito, se qualcosa e' rimasto fuori;
- il **riferimento d'origine** se il lavoro chiude una voce di backlog (file e numero) o pubblica
  un articolo;
- una nota se una verifica locale non e' stata eseguita (es. build non disponibile nel sandbox).

Poi aspetta la CI:

```bash
gh pr checks --watch
```

**Se la CI e' rossa, si guarda, non si aggira.** Leggi il log del job fallito
(`gh run view --log-failed`), sistema, committa sul branch e ripushal: la PR si aggiorna da sola.
Non esiste un caso in cui il modo giusto di chiudere una PR rossa sia forzare il merge.

Se il merge viene rifiutato perche' il branch e' **indietro rispetto a main** (`strict: true`):

```bash
git fetch origin && git merge origin/main
git push
```

---

## Passo 5 — Merge e riallineamento

Secondo punto di conferma: il merge lo fai **su ok esplicito di Marco**.

```bash
gh pr merge --squash --delete-branch --admin
git switch main && git pull
git remote prune origin        # opzionale: ripulisce i riferimenti ai branch remoti cancellati
```

**`--admin` qui e' la procedura normale, non una forzatura** (`CLAUDE.md` §2). Sul repo agisce il
ruleset `No_thanks`, che richiede 1 approvazione su tutti i branch: Marco e' l'unico maintainer e
su GitHub nessuno puo' approvare la propria PR, quindi senza bypass ogni PR resta `BLOCKED` per
sempre. Il flag salta **solo** quel gate.

Quello che `--admin` non autorizza, e che non si aggira mai: la PR obbligatoria (niente push
diretti su `main`, respinti per tutti con `enforce_admins: true`), la **CI verde**, il branch
aggiornato rispetto a `main`. Se il merge fallisce anche con `--admin`, la causa e' una di queste
due: CI rossa, e allora si aggiusta il codice; oppure branch indietro, e allora
`git switch <branch> && git merge origin/main && git push`. Se ti viene voglia di usare `--admin`
per qualcosa che non sia l'approvazione mancante, stai forzando la cosa sbagliata: fermati.

Chiudi riportando: cosa e' stato mergiato, il numero della PR, e cosa resta da fare a mano se
resta qualcosa (aggiornare `HANDOFF.md`, un passo manuale su Cloudflare o Buttondown, un post
LinkedIn da pubblicare).

---

## Rapporto con le altre skill

Questa skill e' la **fonte di verita' della coda git** del progetto. Le altre non la riscrivono:

- `publish-article` fa il rituale editoriale della pubblicazione, poi passa qui per commit, PR e merge.
- `roadmap-next` sceglie e implementa una voce di backlog, poi passa qui.

Se ti accorgi che una di quelle skill descrive una coda git diversa da questa, la divergenza e' un
bug: si corregge la skill, non si segue la versione vecchia.

---

## Errori da non fare

- **`git add -A`**. Un file di appunti non tracciato diventa pubblico e la storia se lo tiene.
- **Committare senza aver letto il diff.** La lista dei file non e' il diff.
- **Forzare un merge con CI rossa.** `--admin` serve a saltare il gate delle approvazioni, mai i
  controlli: con la CI rossa si aggiusta il codice. Vale lo stesso per il disattivare la
  protezione o il ruleset: se serve davvero per una causa esterna, e' una decisione di Marco,
  esplicita, e si riattiva subito dopo.
- **Un commit gigante che chiude tre lavori diversi.** Una PR, un cambiamento comprensibile.
- **Messaggio di commit in inglese** o non conventional: il repo ha una storia mista per ragioni
  storiche, la convenzione attuale e' italiano + conventional commit.
- **Dire che le verifiche sono passate quando non sono girate.** Se la build non gira nel sandbox,
  si dice.
