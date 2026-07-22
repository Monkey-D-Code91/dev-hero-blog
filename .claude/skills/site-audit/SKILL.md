---
name: site-audit
description: >
  Audit ricorrente del sito The First Draft su checklist stabile: accessibilita', SEO e social
  card, performance, leggibilita', coerenza col brand, entry point (newsletter, RSS, podcast,
  commenti) e igiene dei contenuti bilingui. Gira sul sorgente e sulla build locale, con il sito
  live consultato solo per cio' che dipende dal deploy. Produce un report datato in
  docs/audits/YYYY-MM-DD-site-audit.md con finding a ID stabile, confrontato voce per voce con
  l'audit precedente (risolto, persiste, peggiorato, nuovo, accettato). E' una skill di SOLA
  LETTURA: non modifica codice, non apre branch, non implementa fix. Usa questa skill quando
  Marco dice cose come "fai un audit del sito", "come sta messo il sito", "controlla
  accessibilita' e SEO", "site audit", "audit periodico", "cosa e' peggiorato dall'ultima volta",
  "verifica la coerenza col brand", "controllo di salute del sito". NON e' la skill per
  implementare i fix trovati (per quello: roadmap-next, poi ship) ne' per il preflight editoriale
  di un singolo articolo (preflight-article.mjs, publish-article).
---

# site-audit — Il controllo periodico del sito

Sei il revisore esterno del progetto. Il tuo valore non è trovare il maggior numero di problemi:
è produrre **un giudizio confrontabile nel tempo**, così che Marco possa vedere a colpo d'occhio
cosa è migliorato, cosa è peggiorato e cosa è stato deciso di non fare. Un audit che ogni volta
riscrive tutto da zero, con voci nuove e numerazione diversa, vale meno di zero: fa rumore.

Lingua di lavoro: italiano. Prima di qualsiasi cosa leggi `CLAUDE.md` alla radice del repo, più
`docs/brand.md` e `docs/editorial-guidelines.md`: sono la fonte di verità contro cui misuri, e se
il codice diverge da lì il bug è nel codice, non nel documento.

**Confine invalicabile: questa skill non tocca nulla.** Non crea branch, non modifica file di
codice, non corregge neanche le cose banali. L'unico file che scrive è il report in
`docs/audits/`. Chi audita non implementa: serve a tenere il report onesto (nessuna tentazione di
minimizzare quello che non hai voglia di sistemare) e la sessione corta. I fix passano da
`roadmap-next` e da `ship`, in un'altra sessione.

**Autonomia.** Passi 0-4 li esegui di fila senza chiedere: sono misure, non decisioni. Ti fermi
una volta sola, al Passo 5, per decidere insieme a Marco cosa entra nel backlog.

---

## Passo 0 — Inquadra la run

**Perimetro.** Di default l'audit è **completo**: tutte e sei le aree. Se Marco chiede un'area
sola ("controlla l'accessibilità", "guarda la SEO"), fai quella e **dichiaralo nel report**: un
audit parziale spacciato per completo falsa il confronto con quello dopo.

**Audit precedente.** Cerca il più recente in `docs/audits/`:

```bash
ls docs/audits/*.md 2>/dev/null | sort | tail -3
```

- Se ce n'è uno, **leggilo per intero prima di misurare**. È la baseline: ogni finding vecchio va
  richiuso con un esito esplicito, e i finding marcati `accettato` non si ripropongono come nuovi.
- Se `docs/audits/` contiene solo il `README.md`, questa è la **baseline zero**: dillo nel report,
  non c'è niente da confrontare e va bene così. Se esistono review storiche in `_design-review/` o
  `docs/archive/`, leggile come contesto ma non trattarle come baseline: hanno un altro formato e
  fotografano un sito diverso.

**Stato del repo.** Un audit fatto su un albero sporco misura anche il lavoro a metà di qualcun
altro. Controlla e, se ci sono modifiche non committate, chiedi se vanno incluse o se conviene
partire da `main` pulito:

```bash
git status --short && git branch --show-current
```

---

## Passo 1 — Raccogli i fatti, non le impressioni

Prima le misure deterministiche. Girano tutte, anche quelle che sembrano scontate: il valore
dell'audit è che i numeri li hai presi, non ricordati.

```bash
node scripts/status.mjs                      # stato pipeline: coppie IT/EN, draft, asset
node scripts/preflight-article.mjs --all     # regole editoriali sugli articoli
npm test                                     # vitest
npx astro check                              # type check
npm run build                                # genera dist/, su cui gira meta' della checklist
```

Due avvertenze operative da `CLAUDE.md` §6-§7:

- **Non lanciare `npm run build` con `npm run dev` attivo**: corrompe la cache di Vite.
- **Nel sandbox Linux la build può non girare** (`node_modules` compilati per macOS). Se non gira,
  puoi ancora auditare il sorgente e riusare un `dist/` esistente, ma **devi scriverlo nel
  report**: "build non rigenerata, `dist/` del <data>". Un audit su una build vecchia che si
  presenta come fresco è peggio di un audit mancato.

Poi i controlli sulla build e sul sorgente, area per area: sono elencati con il comando esatto e
la soglia in **`references/checklist.md`**. Leggi quel file e seguilo, non andare a memoria: la
stabilità della checklist è ciò che rende gli audit confrontabili.

Le sei aree:

| Area | Prefisso ID | In una riga |
|---|---|---|
| Accessibilità | `A11Y` | contrasto, focus, alt, semantica, tastiera, reduced-motion |
| SEO e social card | `SEO` | canonical, hreflang reciproci, title/description, OG e Twitter, sitemap, feed |
| Performance | `PERF` | peso pagina, immagine LCP, font, JS spedito, dimensione degli asset |
| Leggibilità | `READ` | misura di riga, corpo testo, gerarchia, densità, resa su mobile |
| Coerenza col brand | `BRAND` | palette e tipografia vs `brand.md`, logo ufficiale, niente trattini lunghi nel copy |
| Entry point e contenuti | `ENTRY` | newsletter, RSS, commenti, podcast, simmetria IT/EN, link morti |

**Quello che si vede solo a occhio, guardalo a occhio.** Su questo progetto i bug arrivati in
produzione erano tutti visivi (leggibilità del testo, favicon, logo vecchio nel footer): nessuno
di essi sarebbe emerso da un grep. Avvia `npm run dev` e apri con Claude in Chrome almeno: home,
indice blog, un articolo, pagina autore, roadmap, newsletter, e le stesse in EN. Guardale anche a
larghezza mobile. Se il browser non è disponibile, dillo nel report e marca le aree `READ` e
`BRAND` come parzialmente verificate.

**Il sito live si consulta solo per ciò che dipende dal deploy**: asset serviti dal CDN (una cover
o un logo vecchi rimasti in cache), header di risposta, presenza del beacon di analytics,
redirect. Tutto il resto si misura in locale, dove vedi anche i draft e arrivi prima del deploy.

---

## Passo 2 — Trasforma le misure in finding

Un finding esiste solo se ha tutte e quattro queste cose. Se una manca, non è un finding: è
un'impressione, e le impressioni vanno nella sezione "osservazioni", non nell'elenco.

1. **ID stabile**: `<PREFISSO>-<slug-kebab>`, es. `A11Y-contrasto-tag-pill`, `SEO-hreflang-autori`,
   `BRAND-emdash-copy-sito`. Lo slug descrive **il problema**, non il file: se il fix si sposta di
   componente l'ID regge. **L'ID non cambia mai** tra un audit e l'altro: è la chiave del
   confronto. Non usare numeri progressivi, si rinumerano da soli e rompono lo storico.
2. **Evidenza**: il comando e il suo output, o il file e la riga, o cosa hai visto a schermo e su
   quale pagina. "Il contrasto sembra basso" non è evidenza; "`#94a3b8` su `#0f172a` dà 4.8:1,
   sufficiente per il corpo ma sotto la soglia per il testo piccolo" lo è.
3. **Severità**, ancorata al progetto e non al buon senso generico:

   | Severità | Criterio |
   |---|---|
   | **Alto** | Un lettore lo incontra sicuramente, oppure rompe l'indicizzazione, il bilinguismo o una regola dichiarata in `CLAUDE.md` §4-§5 |
   | **Medio** | Degrada l'esperienza o la coerenza senza rompere niente; un lettore su tre lo nota |
   | **Basso** | Rifinitura, debito, cosa che conterà quando gli articoli o gli autori saranno di più |

4. **Azione proposta**, concreta e dimensionata (una riga di CSS / un componente / un lavoro da
   mezza giornata). Se non sai proporre l'azione, il finding non è maturo: mettilo tra le
   osservazioni con la domanda aperta.

**Cosa non è un finding.** Non gonfiare l'elenco con: scelte di gusto senza una regola dietro
(`brand.md` non dice tutto, e dove tace la scelta è di Marco); problemi già coperti in modo
deterministico da `preflight-article.mjs` (quello è il suo mestiere, tu riporti solo che è verde
o rosso); voci di `TECH-IMPROVEMENTS.md` già aperte e conosciute (citale come "già a backlog",
non come scoperte); e tutto ciò che dipende da quanti articoli ci sono oggi e si risolverà da
solo quando saranno dieci.

---

## Passo 3 — Confronta con l'audit precedente

Per **ogni** finding dell'audit precedente, un esito. Nessuno può sparire senza una riga.

| Esito | Quando | Cosa fai |
|---|---|---|
| `risolto` | il problema non si riproduce | verifica davvero, non fidarti di una PR che dice di averlo chiuso; lo togli dall'elenco attivo e lo citi nel riepilogo |
| `persiste` | c'è ancora, uguale | lo riporti con lo **stesso ID** e la data del primo avvistamento |
| `peggiorato` | c'è ancora ed è più grave, o si è esteso | stesso ID, severità alzata, e spieghi cosa è cambiato |
| `regressione` | era `risolto` in un audit precedente ed è tornato | stesso ID, severità **alzata di un livello**: una regressione vale più di un problema mai affrontato, perché segnala che manca un controllo automatico |
| `accettato` | Marco ha deciso consapevolmente di non sistemarlo | resta nel report in una sezione a parte, con la **motivazione e la data**, e non ricompare tra gli attivi |
| `nuovo` | non c'era | primo avvistamento, data di oggi |

Una `regressione` merita sempre una riga in più: **cosa avrebbe dovuto impedirla**. Nove volte su
dieci la risposta è un test in `tests/` o un controllo in `preflight-article.mjs`, e quella è la
vera azione da proporre, più del fix in sé.

---

## Passo 4 — Scrivi il report

Percorso: `docs/audits/YYYY-MM-DD-site-audit.md`, data di oggi (`date +%F`). Un file per run,
versionato: lo storico sta in git e i collaboratori lo vedono. Il formato completo, con l'esempio
di un blocco finding, sta in `docs/audits/README.md`: seguilo. In sintesi, nell'ordine:

1. **Intestazione**: data, perimetro (completo o aree), commit di riferimento
   (`git rev-parse --short HEAD`), audit precedente confrontato, e **cosa non è stato verificato**
   (build non girata, browser non disponibile, live non raggiungibile). Questa riga è la più
   importante del report: dice quanto fidarsi del resto.
2. **Verdetto in cinque righe**: com'è messo il sito, cosa è cambiato dall'ultima volta, la cosa
   più urgente. Deve essere leggibile senza scorrere il resto.
3. **Riepilogo per area**: una tabella area / conteggio per severità / delta rispetto all'audit
   precedente.
4. **Finding attivi**, ordinati per severità e poi per area.
5. **Risolti dall'ultimo audit**: elenco a una riga ciascuno. È la parte che fa vedere il
   progresso, non tagliarla per brevità.
6. **Accettati**: ID, motivazione, data della decisione.
7. **Osservazioni**: le cose viste che non sono finding, e le domande aperte per Marco.

Scrivi in italiano, diretto, senza trattini lunghi (il report è un documento interno, ma la
regola di `CLAUDE.md` §4 vale comunque per abitudine e perché il report può finire citato altrove).
Niente nomi di persone oltre agli autori del blog, come ovunque nel repo.

---

## Passo 5 — Il travaso nel backlog (unico punto di conferma)

Il report da solo non cambia niente. Presenta a Marco i finding **Alto** e **Medio** e proponi
quali travasare in `TECH-IMPROVEMENTS.md` (o `NEW-IDEAS.md` se sono feature, non correzioni),
nel formato di quei file: titolo, corpo, trigger se il lavoro non è per adesso. Cita l'ID del
finding e il report d'origine, così il legame regge in entrambe le direzioni.

Non travasare tutto d'ufficio: un backlog gonfio di voci `Basso` è indistinguibile da un backlog
non curato. I `Basso` restano nel report, che è il loro posto.

Poi chiudi:

- il report e le voci di backlog si committano con **`ship`**, che è la fonte di verità della coda
  git. Non riscrivere qui la sequenza di branch, commit e PR: chiamala.
- l'implementazione dei fix è di **`roadmap-next`**, in una sessione nuova. Dillo esplicitamente
  invece di iniziare a sistemare: la tentazione di "tanto è una riga" è esattamente il modo in cui
  un audit diventa una PR da trenta file.

---

## Cadenza

L'audit ha senso **periodico**, non a ogni push. Momenti giusti: dopo una pubblicazione, dopo un
cambio di layout o di design system, dopo l'ingresso di un nuovo autore, o a intervallo fisso
(mensile è ragionevole con questo ritmo editoriale). Se l'ultimo audit è di meno di due settimane
fa e in mezzo non è cambiato niente di visibile, dillo e proponi di rimandare: un audit che
ripete l'audit precedente parola per parola insegna solo a non leggerlo.

---

## Rapporto con le altre skill e con gli script

| Strumento | Confine |
|---|---|
| `preflight-article.mjs` | controlla **gli articoli** contro le regole editoriali. Tu lo esegui e ne riporti l'esito, non ne reimplementi i controlli |
| `status.mjs` | dà i fatti della pipeline editoriale. Stessa cosa: lo esegui, non lo riscrivi |
| `roadmap-next` | implementa le voci di backlog, comprese quelle che nascono da qui |
| `ship` | committa il report e apre la PR |
| `publish-article` | il rituale di pubblicazione di un pezzo, non un controllo di salute del sito |
| `design` | interviene sul design fuori standard; l'audit lo segnala, non lo esegue |

---

## Errori da non fare

- **Sistemare qualcosa durante l'audit.** Anche una riga. Il confine è il punto della skill.
- **Rinumerare i finding a ogni run.** Gli ID sono stabili o il confronto non esiste.
- **Far sparire un finding vecchio senza esito.** Se non lo riproponi, dichiara perché.
- **Dire che una verifica è passata quando non è girata.** Build non disponibile, browser non
  aperto, live non raggiungibile: si scrive nel report, in intestazione.
- **Auditare solo il grep.** Metà dei problemi di questo sito si vedono solo aprendo la pagina, e
  quelli sono anche i più gravi.
- **Auditare solo l'italiano.** Il sito è bilingue: ogni pagina EN ha lo stesso diritto di essere
  guardata, e le divergenze IT/EN sono tra i finding più frequenti.
- **Confondere severità e sforzo.** Un problema `Alto` che si risolve in un minuto resta `Alto`:
  la severità misura l'impatto sul lettore, non la fatica.
