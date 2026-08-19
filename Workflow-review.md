# Workflow-review

Revisione della struttura e delle skill del repo, con il piano per arrivare a un workflow
editoriale standardizzato e autonomo. Data: 2026-07-28. Stato: proposta, non ancora attuata.

**Obiettivo dichiarato:** un solo input umano (la bozza dell'articolo), tutto il resto automatico
fino agli asset social pronti e alla PR mergiata.

---

## 1. Verdetto

Il workflow **non è definito end-to-end**. È definito benissimo a pezzi, e i pezzi sono di buona
qualità: dodici skill, otto script deterministici, un preflight che blocca la CI, tre documenti
normativi e un test di guardia sul copy. Il problema non è la mancanza di processo, è che il
processo esiste solo dentro la testa di chi lo ha costruito.

Quattro sintomi misurabili:

1. **Non c'è un punto d'ingresso.** Un collaboratore con una bozza in mano non ha un comando da
   dare. Deve sapere che si dice "rifinisci questo articolo" e non "pubblica questo articolo",
   perché entrambe le frasi triggerano skill diverse che fanno cose parzialmente sovrapposte.
2. **Due passaggi della catena che immagini non esistono in nessuna skill**: la collocazione in
   roadmap e la generazione dei post LinkedIn come artefatto.
3. **I filtri editoriali di cui parli non sono test.** Sono paragrafi in un prompt, dentro l'unica
   skill che una bozza già scritta non attraversa mai.
4. **Tre istruzioni obbligatorie del `CLAUDE.md` puntano a cose che un collaboratore non ha**:
   `HANDOFF.md`, i permessi, e il comando `/code-review`.

Il repo è pronto per l'automazione (script deterministici, schema tipizzato, CI verde). Manca lo
strato di orchestrazione sopra, e mancano tre o quattro controlli che oggi fai a occhio.

---

## 2. Cosa c'è oggi

### 2.1 Skill (`.claude/skills/`)

| Skill | Ruolo dichiarato | Evals | Note |
|---|---|:---:|---|
| `onboarding` | hub per i nuovi, instrada | no | 7 reference, ben fatto |
| `write-article` | co-scrittura dalla prima idea | **no** | contiene il gate editoriale (Fase 1) |
| `refine-article` | tono e stile, poi metadati, traduzione EN, salvataggio, preflight, cover | sì | fa molto più di quanto dice il nome |
| `add-author` | profilo autore IT+EN | sì | confine netto, nessun problema |
| `sync-translation` | manutenzione coppie IT/EN | sì | confine netto |
| `publish-article` | runbook del giorno di uscita | **no** | 8 passi, il più esposto e il meno testato |
| `newsletter-issue` | uscita email | sì | output su file, si ferma prima dell'invio |
| `podcast-repurpose` | kit episodio | **no** | fuori dalla catena principale |
| `design` | fuori standard | no | skill esterna, adattata con nota di progetto |
| `roadmap-next` | backlog tecnico verso PR | sì | processo, non editoriale |
| `site-audit` | audit periodico, sola lettura | sì | processo |
| `ship` | coda git | sì | fonte di verità della coda git, ben isolata |

### 2.2 Script (`scripts/`)

Deterministici e documentati: `preflight-article.mjs` (bloccante in CI), `check-copy.mjs`
(bloccante via `npm test`), `check-translation-sync.mjs` e `status.mjs` (informativi),
`generate-cover.mjs`, `generate-carousel.mjs`, `generate-og.mjs`, `generate-logo-png.mjs`,
`generate-feedback-pdf.py`.

### 2.3 Controlli automatici già attivi

`preflight-article.mjs` verifica: campi obbligatori, authorKey noto, trattini lunghi (errore),
slug kebab-case, esistenza del gemello, simmetria di `pubDate`/`draft`/`respondsTo`, conteggi
simmetrici di `tags`/`discussion`/`revisions`/`openQuestions`, esistenza della cover e presenza
di `coverAlt`, lunghezza della description, presenza di tag e di `focus`, validità dei link
interni, euristica sui nomi di persona.

`check-copy.mjs` verifica i trattini lunghi nel copy dei sorgenti (`.astro`, `.ts`, `.tsx`),
escludendo `src/content` e i commenti di codice.

### 2.4 Cosa non c'è

| Manca | Conseguenza |
|---|---|
| `.claude/commands/` | Nessun ingresso deterministico: tutto passa dal linguaggio naturale, ed è la causa diretta della collisione fra `refine-article` e `publish-article` |
| `.claude/agents/` | Ogni step gira nella stessa sessione: il contesto si satura proprio negli step finali (vedi G16) |
| Hook | Le regole documentate a parole (`CLAUDE.md` §6, build durante il dev) restano affidate alla memoria |
| `.claude/settings.json` versionato | I permessi stanno solo in `settings.local.json`, personale e ignorato: una quarantina di allow accumulati sessione dopo sessione, che un collaboratore riapprova a mano uno per uno |
| `/code-review` nel repo | `CLAUDE.md` §3 lo impone prima di ogni PR non banale, ma è un comando globale della tua installazione. Per chiunque altro è un'istruzione obbligatoria non eseguibile |
| Verdetto editoriale come artefatto | Il giudizio sulla qualità di un pezzo non lascia traccia: non è confrontabile nel tempo né verificabile in CI |

C'è invece `.claude/launch.json` (config del dev server sulla 4321), che resta com'è.

---

## 3. Principi di progettazione

Cinque regole ricavate dai difetti trovati. Servono a decidere i casi futuri senza rifare questa
analisi ogni volta: se una proposta le viola, è probabilmente sbagliata anche se sembra comoda.

**P1. Un solo posto conosce l'ordine della catena.** È la skill orchestratrice. Script, comandi e
agenti conoscono solo il proprio blocco. Ogni volta che due componenti conoscono la stessa
sequenza, quella sequenza diverge: è la diagnosi di G2, e vale un livello sopra.

**P2. Lo stato si deduce dagli artefatti, non si memorizza.** `status.mjs` già lo fa (coppia,
draft, cover, PDF, carousel dedotti dai file). La ripresa della catena da uno step si calcola allo
stesso modo. Un file di avanzamento sarebbe la quarta fonte di verità sullo stato, cioè G9 di
nuovo.

**P3. La correttezza si impone in CI; gli hook servono ad anticiparla.** Gli hook sono locali e
non condivisi: un collaboratore che non li ha non se ne accorge. Un controllo che esiste solo
come hook non è un controllo, è una comodità. Prima il check in CI, poi eventualmente l'hook che
lo fa scattare prima.

**P4. Il contesto è una risorsa scarsa.** Gli step autosufficienti girano isolati e restituiscono
un file. Vale per la catena come `CLAUDE.md` §8 già dice che vale per le sessioni.

**P5. Una skill che non è documentata non esiste.** La PR che introduce o modifica una skill
aggiorna `CLAUDE.md` §9 e `onboarding` nello stesso commit. Altrimenti si ricrea esattamente il
difetto di oggi: processo reale e processo documentato che divergono.

---

## 4. La catena target, e una correzione al tuo ordine

L'ordine che hai descritto è: bozza → refinement → roadmap → cover → struttura finale con
attributi → caroselli → post LinkedIn.

**Due passaggi vanno invertiti, per un vincolo tecnico reale:**

- `generate-cover.mjs` legge dal frontmatter `title` (testo della cover) e `cover` (percorso di
  output). La cover **non è generabile prima** che il frontmatter esista. Quindi "struttura finale
  con attributi" precede la cover, non la segue.
- La collocazione in roadmap richiede `translationKey`, `pubDate`, `focus` e `authorName`, cioè
  di nuovo il frontmatter. Anche la roadmap va dopo la struttura, non prima.

Catena corretta:

| # | Step | Owner | Input | Output | Gate |
|---|---|---|---|---|---|
| 0 | Ingresso bozza | convenzione | `drafts/<slug>.md` | file tracciato | esiste il file |
| 1 | Gate editoriale | `gate-article` (nuova) | bozza grezza | verdetto su file | **bloccante** |
| 2 | Refinement IT | `refine-article` (ridotta) | bozza + persona | testo rifinito | ok autore |
| 3 | Struttura e traduzione | `finalize-article` (nuova) | testo IT | coppia IT+EN con frontmatter | schema Astro |
| 4 | Collocazione roadmap | `place-in-roadmap` (nuova) | frontmatter | tappa IT+EN `planned` | `status.mjs` |
| 5 | Asset visivi | `scripts/assets.mjs` (nuovo) | frontmatter | 2 cover, OG | preflight |
| 6 | Verifica | preflight + build + test | coppia | esito | **bloccante** |
| 7 | Asset social | `social-kit` (nuova) | coppia pronta | 2 carousel PDF, 2 post, newsletter | `check-copy` esteso |
| 8 | Chiusura git | `ship` | tutto | PR mergiata | CI verde |
| 9 | Momento di uscita | `publish-article` (ridotta) | PR mergiata | `status: published`, roadmap allineata | `status.mjs` |

Sopra la catena: `/pubblica` come porta d'ingresso, `article-pipeline` come skill che la percorre
(unica a conoscerne l'ordine, per P1). Sotto: tre subagenti per gli step 3, 7 e `assets.mjs` come
foglia per lo step 5.

---

## 5. Gap analysis

Severità: **A** blocca l'autonomia, **B** genera lavoro manuale o drift, **C** debito.

### G1 (A) Nessun orchestratore, nessun punto d'ingresso

Dodici skill, nessuna che le concateni. `publish-article` è la più vicina a una catena ma parte da
un presupposto forte, dichiarato nel suo prerequisito: "l'articolo esiste in entrambe le lingue,
rifinito e approvato". Tutto ciò che sta prima è affidato a chi conosce il progetto.

### G2 (A) Confini sovrapposti tra le tre skill editoriali

`refine-article` si attiva su "pubblica l'articolo", "voglio pubblicare". `publish-article` si
attiva su "pubblica l'articolo oggi". Le due frasi sono indistinguibili in pratica, e le skill
fanno cose diverse. Peggio: `refine-article` nella Fase 4 raccoglie i metadati, genera gli slug,
traduce in EN, salva i due file, e nella Fase 5 esegue preflight e cover. Cioè fa già metà di
`publish-article`. Non è duplicazione teorica: sono due implementazioni indipendenti della stessa
logica, che divergeranno.

### G3 (A) Lo step "roadmap" non esiste

`write-article` legge `docs/content-roadmap.md` solo per evitare sovrapposizioni di tema.
`publish-article` al Passo 4 **aggiorna** una tappa esistente sostituendo il `title` inline con
`postTranslationKey`. Nessuna skill e nessuno script **crea** la tappa in
`src/content/roadmap/{it,en}/` scegliendo l'arco e la posizione. È esattamente lo step che nella
tua catena sta al centro.

### G4 (A) Il gate editoriale è un prompt, ed è bypassabile

I filtri che citi (esperienza reale, tesi, anti-listicle, anonimizzazione, rispetto) vivono nella
Fase 1 di `write-article`. Ma lo scenario che descrivi come input standard, "l'unico input umano è
la bozza", entra da `refine-article`, che **non ha nessun gate**: legge, analizza il tono e
propone. Un articolo debole, giudicante o non anonimizzato passa senza attrito fino alla PR.

### G5 (B) "Almeno 2 pilastri" non è controllato

Il preflight avvisa solo se `focus` è **vuoto**, e come warning non bloccante. Un articolo con un
solo pilastro passa senza una parola.

### G6 (B) L'anonimizzazione è coperta al 30%

L'unico controllo è una regex su coppie `Nome Cognome` con whitelist, e produce warning. Non
intercetta nomi di aziende, nomi di prodotti interni, ruoli identificanti in contesti piccoli,
numeri riconoscibili. Per un blog che racconta il lavoro reale del datore di lavoro, è il rischio
più costoso del repo: quello che entra in git non si toglie più davvero.

### G7 (B) Carousel opzionale, monolingua, spec improvvisata

`publish-article` Passo 2 lo definisce "opzionale, chiedilo", e il comando di esempio parte solo
dall'articolo IT. La spec JSON delle slide viene inventata in sessione ogni volta, senza template
né regole di lunghezza: due carousel generati a due mesi di distanza non si somigliano.

### G8 (B) Il post LinkedIn non è un artefatto

È un paragrafo di istruzioni (Passo 6) che chiede di "consegnare come testo". La newsletter ha una
convenzione di output (`newsletter/<slug>.md`), LinkedIn no. Conseguenze: non è versionabile, non
è riutilizzabile, non passa da nessun controllo sui trattini lunghi, e non esiste in EN.

### G9 (B) Lo stato della pipeline vive in tre posti

`draft` nel frontmatter del blog, `status` nella collection roadmap, e la presenza dei file asset
sul disco. `status.mjs` esiste **proprio per scoprire quando divergono**, ed è informativo in CI.
Un controllo che serve a rilevare un drift strutturale, e che non blocca, è un drift che accetti.

### G10 (B) Divergenza di tipo sul campo `focus`

Nel blog: `z.enum(["tech","human","ai"])`. Nella roadmap: `z.array(z.string())` con valori
capitalizzati (`["Tech","AI"]`). Se la tappa deve ereditare dall'articolo, l'ereditarietà oggi
richiede una conversione implicita. Va unificato prima di automatizzare.

### G11 (A) Metà della documentazione operativa non esiste per i collaboratori

`.gitignore` esclude `personas/`, `HANDOFF.md`, `HOW-TO-PLAN.md`, `feedback/`, `newsletter/`.
`refine-article` dipende da `personas/`, sei skill rimandano a `HANDOFF.md`, `CLAUDE.md` §1 lo
mette in tabella come documento normativo. Il `CLAUDE.md` lo ammette esplicitamente ("non sono
spariti: non li hai mai avuti"), il che è onesto ma non risolve.

Stesso difetto in altre due forme: i permessi vivono in `settings.local.json`, e `/code-review`
è un comando globale della tua installazione.

### G12 (A) Nessuna convenzione di ingresso per la bozza

`refine-article` accetta "un file .md" da qualunque percorso, `write-article` parte dalla
conversazione. Non c'è nulla su cui agganciare un'automazione o un comando unico.

### G13 (B) Le skill portanti sono quelle senza evals

Hanno evals: `add-author`, `newsletter-issue`, `refine-article`, `roadmap-next`, `ship`,
`site-audit`, `sync-translation`. Non li hanno: `write-article`, `publish-article`,
`podcast-repurpose`, `onboarding`, `design`. Le due che portano il peso maggiore della catena
editoriale sono nella seconda lista.

### G14 (C) `check-copy` non copre gli artefatti prodotti

Guarda `src/**` escludendo `src/content`. Restano fuori: spec JSON dei carousel, bozze newsletter,
post LinkedIn, testo dentro i PDF generati. Sono esattamente i testi che finiscono davanti al
pubblico senza passare dal blog.

### G15 (C) Il vincolo di ambiente è più piccolo di quanto sembra

**Correzione rispetto alla prima stesura.** La CI gira su `ubuntu-latest` con `npm ci`, e il
commento in testa a `.github/workflows/ci.yml` lo dice esplicitamente: npm installa i binari
nativi giusti (`@resvg/resvg-js`) senza i workaround manuali del sandbox. Build e generazione
asset **funzionano già su Linux in CI**. A essere rotto è solo il sandbox di sessione, che eredita
`node_modules` compilati per macOS.

Resta da verificare una cosa sola: che `sharp` (usato solo da `generate-carousel.mjs`) si installi
sul runner, perché oggi la CI non esegue mai quello script. Verifica da mezz'ora.

### G16 (A) L'orchestratore, così com'è disegnato, satura il contesto

`CLAUDE.md` §8 dice già che le sessioni lunghe finiscono in auto-compaction e che da lì in poi
Claude lavora su un riassunto. Ma `article-pipeline` percorre otto step in una sessione sola, e ci
fa passare dentro: bozza, articolo rifinito, traduzione EN completa, spec di due carousel, due
post, bozza newsletter. Su un articolo vero sono decine di migliaia di token che restano in
contesto anche a step chiuso, e il degrado colpirebbe proprio gli ultimi passaggi, quelli
creativi. È un difetto di disegno, non di implementazione: va risolto prima di costruire la
catena, non dopo.

---

## 6. Decisioni prese

| # | Decisione | Conseguenza |
|---|---|---|
| D1 | **Unica fermata umana: l'ok sui contenuti sensibili.** | La catena gira fino a PR mergiata e asset pronti senza chiedere. Newsletter e post restano bozze su file, ma la loro generazione non interroga nessuno. |
| D2 | **Gate qualità: deterministico + giudice LLM.** | Il preflight si estende con ciò che è misurabile; `gate-article` giudica originalità, vaghezza e tono, scrive il verdetto su file ed è bloccante. |
| D3 | **La roadmap la decide la skill, tu correggi dopo.** | `place-in-roadmap` sceglie arco e posizione, scrive la tappa in IT+EN e motiva la scelta. Nessuna conferma richiesta. |
| D4 | **Carousel IT+EN, post LinkedIn IT+EN.** | Convenzioni nuove: `social/<slug>-{it,en}.md`, `carousels/<slug>-{it,en}/`. |
| D5 | **`status` nel frontmatter del blog, roadmap deriva.** | Migrazione di `src/content.config.ts`: `status` fonte unica, `draft` calcolato, tappa roadmap che eredita. Tocca schema, build, test e preflight. |
| D6 | **Lo stato della pipeline entra nel repo, la voce autore resta privata.** | `HANDOFF.md` rimpiazzato da uno stato generato e versionato; `personas/` ignorato ma con template e fallback; `HOW-TO-PLAN.md` in `docs/`. |
| D7 | **Ingresso: `drafts/<slug>.md` versionato.** | Un collaboratore può consegnare una bozza via PR. |
| D8 | **Asset generati in locale, CI da valutare.** | Rivista al ribasso dopo G15: la CI è già Linux e funziona. Resta la verifica di `sharp`. |
| D9 | **Invocazione: comando + skill, script come foglia.** | `/pubblica` porta d'ingresso, `article-pipeline` percorre, `scripts/assets.mjs` raggruppa i soli passaggi asset. Nessun secondo orchestratore (P1). |
| D10 | **Skill esistenti: aggiornate in place, nessuna riscritta.** | I nomi restano, i confini cambiano, gli evals si riscrivono sul nuovo perimetro. |
| D11 | **Denylist anonimizzazione: privato in chiaro, hash versionati.** | `scripts/anonymization-denylist.json` locale e ignorato; `scripts/anonymization-hashes.json` nel repo, così il controllo gira in CI senza rivelare i termini. |
| D12 | **Evals su tutte le skill portanti.** | Gate, pipeline, publish, write, social-kit. |
| D13 | **Tre subagenti: traduzione, spec carousel, post social.** | Gli step con input e output netti girano a contesto fresco e restituiscono un file (P4). Risolve G16. |
| D14 | **Due hook, entrambi di comodità: guardia build-vs-dev e stato all'avvio.** | Nessuna correttezza affidata agli hook (P3). |
| D15 | **Quattro comandi: `/pubblica`, `/gate`, `/stato`, `/audit`.** | Uno per ogni momento che inizia un umano, mai per uno step della catena. Il comando non contiene logica, solo routing. Più una copia locale di `/code-review`. |
| D16 | **Il verdetto del gate è bloccante in CI.** | Diventa un artefatto versionato e obbligatorio per ogni articolo nuovo. I quattro articoli esistenti vanno in grandfathering. Il gate smette di essere aggirabile anche per chi apre una PR a mano. |
| D17 | **La bozza grezza si cancella alla pubblicazione.** | `drafts/` contiene solo lavoro in corso. La storia git conserva l'originale. Di conseguenza i verdetti, che sono permanenti, si spostano in `docs/verdicts/<translationKey>.md`, accanto a `docs/audits/`. |
| D18 | **Autonomia asimmetrica sul merge.** | La catena arriva al merge se l'autore è il proprietario del repo, si ferma alla PR aperta altrimenti. Nessuna modifica alla branch protection: il flusso di Marco resta invariato e la revisione umana c'è dove serve. Risolve V6. |
| D19 | **Le bozze newsletter si versionano.** | `newsletter/` esce dal `.gitignore` e viaggia nella PR come `social/` e `carousels/`. Il testo definitivo resta quello di Buttondown. Risolve V3. |
| D20 | **`add-author` scrive la persona.** | Ultimo passo della skill: intervista sulla voce e `personas/<key>.md` in locale, non versionato. Chi arriva ha subito la propria voce codificata invece di ereditare quella di casa. Risolve V4. |

---

## 7. Skill, agenti, comandi, hook: cosa cambia

**Nessuna skill va rifatta da zero.** Il difetto non è la qualità dei contenuti, è dove passano i
confini. Riscrivere significherebbe buttare evals funzionanti e riscrivere sette rimandi
incrociati per riottenere lo stesso testo dentro un file con un altro nome.

### 7.1 Skill da aggiornare in modo sostanziale (3)

| Skill | Cosa perde | Cosa resta | Fase | Evals |
|---|---|---|---|---|
| `refine-article` | Fasi 4 e 5 (metadati, slug, traduzione EN, salvataggio, preflight, cover); i trigger "pubblica" | Tono, stile, voce dell'autore, uso della persona, loop di iterazione | F0 | da riscrivere; i 3 `input-articles` esistenti si riusano per `gate-article` |
| `publish-article` | Passo 2 (asset), Passo 6 (LinkedIn), Passo 7 (newsletter) | Verifica finale, passaggio a `published`, allineamento roadmap, consegna a `ship` | F0, ritocco in F2 | da creare |
| `write-article` | Fase 1, il gate, che diventa `gate-article` e viene invocato da qui; la Fase 5 non consegna più a `refine-article` ma scrive in `drafts/<slug>.md` | Il metodo di co-scrittura: struttura prima del testo, iterazione punto per punto, difese anti-listicle | F1 | da creare |

Nota su `refine-article`: è l'unica modifica con un costo reale. I suoi 3 evals coprono anche le
fasi che le tolgo, quindi vanno riscritti. In compenso gli articoli di input
(`colloquio-tecnico.md`, `code-review.md`, `produttivita-sviluppatori.md`) sono materiale perfetto
per gli evals del gate: sono bozze vere, di qualità diseguale.

### 7.2 Skill da aggiornare in modo marginale (5)

| Skill | Modifica | Fase |
|---|---|---|
| `onboarding` | 3 reference da riallineare (`scrivere-un-articolo`, `pubblicazione-e-git`, `mappa-skill-e-script`): nuova catena, niente rimandi a `HANDOFF.md`, ingresso da `drafts/` | ogni fase che cambia la catena |
| `newsletter-issue` | Cambia solo chi la invoca: da `publish-article` a `social-kit` | F3 |
| `sync-translation` | Aggiungere `status` ai campi di cui verificare la simmetria dopo D5 | F2 |
| `roadmap-next` | Precisare la description: ora esiste `place-in-roadmap` per la roadmap editoriale | F2 |
| `site-audit` | Due voci in `references/checklist.md`: asset social bilingui presenti, verdetti archiviati | F3 |
| `add-author` | Passo finale nuovo: intervista sulla voce dell'autore e scrittura di `personas/<key>.md` in locale (D20) | F0 |

### 7.3 Skill invariate (3)

`ship`, `podcast-repurpose`, `design`.

`ship` è il modello da imitare per tutte le skill nuove: confine dichiarato in negativo nella
description, un solo mestiere, autonomia esplicita, evals con un caso che deve fallire.

### 7.4 Skill nuove (5)

Regola di naming: **gli step che agiscono su un articolo si chiamano verbo-oggetto**, come le tre
esistenti (`write-article`, `refine-article`, `publish-article`). Le skill che producono un
artefatto o coordinano restano sostantivi, come `newsletter-issue` e `ship`. Per questo la skill
del gate si chiama `gate-article` e non `editorial-gate`.

| Nuova | Cosa fa | Confine (cosa NON è) | Fase |
|---|---|---|---|
| `gate-article` | Giudica la bozza sui 5 criteri, scrive il verdetto, blocca | Non rifinisce (`refine-article`), non scrive (`write-article`) | F1 |
| `finalize-article` | Metadati, slug IT/EN, `focus`, `status`, traduzione, scrittura della coppia | Non giudica (`gate-article`), non tocca il tono (`refine-article`), non pubblica | F0 |
| `place-in-roadmap` | Sceglie arco e posizione, scrive la tappa IT+EN `planned`, aggiorna `docs/content-roadmap.md` | Non è la roadmap tecnica (`roadmap-next`), non porta a `published` | F2 |
| `social-kit` | Spec carousel IT+EN, PDF, i due post, poi passa a `newsletter-issue` | Non pubblica su LinkedIn, non manda email | F3 |
| `article-pipeline` | Percorre gli step 0-8, invoca le altre, si ferma solo su contenuto sensibile | Non reimplementa nessuno step | F4 |

### 7.5 Subagenti nuovi (3) — `.claude/agents/`

Risolvono G16. Ognuno parte a freddo, quindi **deve dichiarare nel proprio prompt i documenti
normativi da leggere**: non eredita il contesto della sessione. Il contratto è la parte che conta:
input definito, output su file, nessuna decisione fuori perimetro.

| Agente | Input | Output | Non decide |
|---|---|---|---|
| `translate-article` | path IT + authorKey | `src/content/blog/en/<slug-en>.md` | metadati, tono, slug IT |
| `carousel-spec` | path articolo + lingua | `carousels/<slug>-<lang>.json` | stile grafico (è dello script), quali articoli |
| `social-post` | path articolo + lingua + URL | `social/<slug>-<lang>.md` | quando pubblicare, il canale |

Regole editoriali da ripetere in ogni contratto, perché l'agente parte a freddo: niente trattini
lunghi, nomi solo per gli autori, anonimizzazione. Il preflight e `check-copy` restano comunque
la rete sotto: se un agente sbaglia, il controllo deterministico lo prende.

Gate e refinement **non** vanno in subagente: sono i due punti dove serve vedere il ragionamento,
non solo il risultato.

### 7.6 Comandi nuovi (5) — `.claude/commands/`

Regola: **un comando per ogni momento che inizia un umano, mai per uno step della catena**, e il
comando non contiene logica, solo routing verso una skill.

| Comando | Momento | Instrada a |
|---|---|---|
| `/pubblica <slug>` | ho una bozza pronta | `article-pipeline` |
| `/gate <slug>` | voglio il giudizio prima di impegnarmi | `gate-article` |
| `/stato` | dove eravamo rimasti | `status.mjs` + `docs/pipeline-state.md` |
| `/audit` | controllo periodico del sito | `site-audit` |
| `/code-review` | copia locale del comando globale oggi assente dal repo | (chiude G11) |

Gli step interni (`refine`, `finalize`, `place-in-roadmap`, `social-kit`, `ship`) non hanno
comando: li invoca la catena, o li chiami a voce quando ti serve un pezzo singolo.

### 7.7 Hook (2), tutti di comodità

Per P3 nessuna correttezza dipende da qui.

| Hook | Tipo | Cosa fa | Perché |
|---|---|---|---|
| Guardia build-vs-dev | `PreToolUse` su Bash | Blocca `npm run build` se la 4321 è occupata | `CLAUDE.md` §6 lo vieta a parole e documenta la procedura di recupero, il che significa che è già successo. Cinque righe, rischio zero |
| Stato all'avvio | `SessionStart` | Inietta l'output di `status.mjs` | `CLAUDE.md` dice già di lanciarlo a ogni sessione: l'hook trasforma un rituale in un automatismo |

Scartati e perché: hook che blocca il push su `main` (la branch protection lo fa già, con
`enforce_admins: true`); hook che pretende il verdetto del gate (D16 lo mette in CI, dove vale per
tutti); preflight dopo ogni scrittura (rumoroso, e la catena lo esegue comunque allo step 6).

### 7.8 Bilancio

12 skill oggi, **17 domani**: 3 modificate in profondità, 6 ritoccate, 3 intatte, 5 nuove. Più 3
subagenti, 5 comandi, 2 hook, 4 script (`assets.mjs`, `generate-carousel-spec.mjs`,
`check-gate-verdicts.mjs`, `hash-denylist.mjs`) e 2 file di configurazione versionati.

---

## 8. Come si fa il setup

### 8.1 Come si costruisce una skill nuova, in ordine

L'ordine conta, ed è controintuitivo:

1. **Prima la `description`.** È l'unica parte che decide se la skill viene invocata. Scritta per
   ultima, produce skill perfette che nessuno attiva. Deve contenere: cosa fa, le frasi che la
   triggerano in italiano e in inglese, e **cosa non è, col nome della skill alternativa**.
2. **Poi 3 evals, di cui uno che deve essere bocciato.** Prima del corpo: scriverli dopo significa
   testare la soluzione che hai già dato. Formato già consolidato:
   `.claude/skills/<nome>/evals/evals.json` con `skill_name` e
   `evals[{id, prompt, expected_output, files, assertions[]}]`.
3. **Poi il corpo**, con la struttura che il repo usa già: passi numerati, tabella "se l'autore
   dice X allora Y", e un paragrafo **Autonomia** che dichiara dove ti fermi e dove no.
4. **Poi si eseguono gli evals** con `skill-creator` (l'hai già usata: in `settings.local.json` ci
   sono le tracce di `refine-article-workspace/iteration-1` e di `aggregate_benchmark`).
5. **Poi `CLAUDE.md` §9 e `onboarding`**, nella stessa PR (P5).

### 8.2 Cosa va creato una volta sola

| Cosa | Dove | Perché |
|---|---|---|
| `docs/workflow.md` | nuovo | La catena della §4 come documento normativo, in tabella in `CLAUDE.md` §1. **È il primo file da scrivere**: tutte le skill lo citeranno |
| `drafts/` + README | nuovo, versionato | Ingresso unico. Solo lavoro in corso: la bozza si cancella alla pubblicazione (D17) |
| `docs/verdicts/` | nuovo, versionato | I verdetti del gate, permanenti, accanto a `docs/audits/` (D16, D17) |
| `scripts/gate-grandfathered.json` | nuovo, versionato | I `translationKey` dei 4 articoli precedenti al gate, altrimenti la CI fallisce dal primo giorno (V8) |
| `social/` | nuovo, versionato | Output dei post. `carousels/` esiste già |
| `newsletter/` fuori dal `.gitignore` | modifica | Le bozze email viaggiano nella PR (D19) |
| Sezione "Come si contribuisce" nel `README.md` | modifica | È la prima pagina che un collaboratore vede su GitHub, e oggi documenta stack e comandi ma non il workflow (V10) |
| `.claude/commands/` | 5 file | §7.6 |
| `.claude/agents/` | 3 file | §7.5 |
| `.claude/settings.json` | nuovo, **versionato** | Allow dei comandi del workflow (`node scripts/*`, `npm test`, `npx astro check`, `gh pr *`) e i 2 hook. Oggi tutto in `settings.local.json` |
| `personas/README.md` | nuovo, versionato | Template e fallback, con `personas/*.md` che resta ignorato |
| `docs/pipeline-state.md` | generato da `status.mjs --write` | Rimpiazza `HANDOFF.md` nei rimandi delle skill |
| `HOW-TO-PLAN.md` → `docs/` | spostamento | Versionato |

**Convenzione dei verdetti.** `gate-article` scrive `drafts/<slug>.verdict.md`. Quando
`finalize-article` crea la coppia e quindi il `translationKey`, il verdetto si sposta in
`docs/verdicts/<translationKey>.md`: la chiave è stabile e condivisa fra IT ed EN, mentre lo slug
della bozza no. Alla pubblicazione la bozza grezza si cancella (resta nella storia git), il
verdetto resta. `check-gate-verdicts.mjs` in CI verifica che ogni `translationKey` abbia il suo
verdetto con esito positivo, salvo quelli elencati in `scripts/gate-grandfathered.json`.

### 8.3 Setup di un collaboratore nuovo

Il test è questo: da zero a "so cosa fare" in cinque passi, senza chiederti nulla.

1. `git clone` e `npm ci`
2. leggere `CLAUDE.md`, poi `docs/workflow.md`
3. invocare la skill `onboarding`
4. `add-author` per il proprio profilo IT+EN
5. bozza in `drafts/<slug>.md`, poi `/pubblica <slug>`

Se un passo richiede un file che non è nel repo, il setup non è finito. Oggi fallisce al punto 2
(il documento non esiste), al punto 5 (né la cartella né il comando) e implicitamente sui permessi.

### 8.4 Test di accettazione

Il workflow è "fatto" quando questo giro funziona senza intervento:

1. metti in `drafts/` un articolo di prova volutamente difettoso (listicle, un pilastro solo, un
   nome azienda dentro);
2. `/pubblica prova`;
3. la catena **deve fermarsi** al gate, con un verdetto scritto che nomina i tre difetti;
4. correggi i tre difetti, rilancia;
5. la catena arriva a PR aperta con: coppia IT+EN, tappa in roadmap, 2 cover, 2 carousel PDF,
   2 post, newsletter in bozza, CI verde;
6. chiudi la PR senza mergiare, cancella il branch.

Da rifare identico alla fine di ogni fase, non solo alla fine: è l'unico modo per sapere quale
fase ha rotto cosa.

### 8.5 Verifica: il percorso di un secondo autore

Il piano è stato ripercorso simulando una persona che ha **solo ciò che è versionato**: nessun
`HANDOFF.md`, nessuna persona, nessun permesso preapprovato, nessun comando globale.

Punto di partenza favorevole: `.claude/` **è tracciato** (65 file, skill ed evals inclusi), quindi
le skill arrivano davvero a chi clona. E l'arco 2 ha già una tappa con `collaborator: true`: il
secondo autore non è un'ipotesi, è previsto dalla roadmap pubblica.

Sono emerse dieci incoerenze. Sei si chiudono nel piano, quattro hanno richiesto una decisione.

| # | Incoerenza | Perché rompe | Dove si chiude |
|---|---|---|---|
| V1 | `write-article` consegna a `refine-article`, non a `drafts/` | Due ingressi, uno dei quali salta la convenzione e il verdetto. Con D16 il collaboratore scopre il verdetto mancante in CI, a lavoro finito | F1, §7.1 |
| V2 | Nessuno verifica l'`authorKey` prima di partire | Un autore senza profilo se ne accorge al preflight, dopo gate e refinement. `/pubblica` deve fermarsi allo step 0 con un messaggio chiaro | F4 |
| V3 | `newsletter/` gitignored | La bozza email di un collaboratore non raggiunge l'unica persona che può inviarla | D19 |
| V4 | Nessuna persona per un autore nuovo | Il primo pezzo viene livellato sulla voce di casa, che è quella di Marco. È il contrario di ciò che il progetto dichiara | D20 |
| V5 | Non è definito chi approva i contenuti sensibili di un collaboratore | È l'**unico** stop umano del sistema, e per la persona che più ne ha bisogno è indefinito. La PO citata in `CLAUDE.md` è quella di Marco, non la sua | F0: riga esplicita in `docs/workflow.md` (responsabilità dell'autore verso il proprio datore, più Marco come editore) |
| V6 | Un collaboratore può mergiare da solo | PR richiesta e CI verde, ma zero approvazioni: pubblicazione e roadmap pubblica modificabili senza revisione umana | D18 |
| V7 | Verdetti dentro `drafts/` | Con D17 `drafts/` è transitoria: un artefatto permanente non ci sta | D17 |
| V8 | Nessuna lista di grandfathering | La CI fallirebbe dal primo giorno sui 4 articoli esistenti | F1, §8.2 |
| V9 | `_design-review/` ancora tracciato | `TECH-IMPROVEMENTS.md` §10 dà la pulizia delle cartelle di lavorazione per implementata, ma questa è rimasta. Non va cancellata: `site-audit/SKILL.md` e `docs/audits/README.md` la citano come contesto storico. Va spostata in `docs/archive/`, dov'è già la stessa classe di materiale | F0b |
| V10 | Il `README.md` non dice come si contribuisce | È la prima pagina su GitHub: documenta stack e comandi, non il workflow | F0, §8.2 |

Restano due asimmetrie **volute**, da scrivere in chiaro invece che lasciarle implicite: solo
Marco invia la newsletter e pubblica su LinkedIn (nessun connettore, e non è un limite tecnico ma
una scelta), e solo Marco mergia (D18).

---

## 9. Piano

> **Vincolo operativo scoperto in attuazione.** In una sessione Cowork la cartella `.claude/` è
> **protetta in scrittura**: non solo `settings.json` e i comandi, ma anche le skill. Tutto ciò
> che tocca `.claude/` va fatto da Claude Code nel terminale. Divisione pratica: Cowork per
> documenti, cartelle, script e configurazione del repo; Claude Code per skill, comandi, agenti e
> hook. Riguarda ogni fase da F0b in poi.

### F0a — Impalcatura del repo (`docs/workflow-foundation`) — FATTA

1. `docs/workflow.md`, con la catena, le tre fermate, chi approva i contenuti sensibili di un
   collaboratore (V5), le asimmetrie volute (§5) e i cinque principi.
2. `drafts/` e `social/` versionate con README che spiegano le convenzioni (G12, D17, D4).
3. `newsletter/` fuori dal `.gitignore` con README (D19); `personas/*` ignorato con eccezione per
   `README.md` (template e fallback, D20); `HOW-TO-PLAN.md` spostato in `docs/`.
4. `CLAUDE.md`: riga per `docs/workflow.md` in §1, principi in §8, regola P5 in §9, correzione su
   CI e ambiente in §7.
5. `README.md`: sezione "Come si contribuisce" in cinque passi (V10).
6. Preparati ma da installare a mano (vincolo `.claude/`): `settings.json` versionato,
   `/code-review` locale, e le correzioni ai rimandi diventati falsi in `roadmap-next` e
   `newsletter-issue`.

### F0b — Confini delle skill (`refactor/confini-skill`)

1. `refine-article` ridotta al tono, description riscritta perché non trigghi più su "pubblica";
   evals riscritti sul nuovo perimetro (G2).
2. Nasce `finalize-article` con metadati, slug, traduzione e scrittura della coppia.
3. `publish-article` perde i passi 2, 6 e 7.
4. `add-author` scrive la persona come ultimo passo (D20).
5. `_design-review/` spostata in `docs/archive/` con i rimandi aggiornati in `site-audit/SKILL.md`
   e `docs/audits/README.md` (V9, rinviata da F0a perché il rimando sta in una skill).
6. `onboarding` riallineata alla nuova catena.

*Fatto quando:* un collaboratore che legge solo `CLAUDE.md` e `docs/workflow.md` sa in che ordine
succedono le cose e quale skill invocare, e le skill fanno esattamente quello che il documento
dice.

### F1 — Il gate editoriale (`feat/gate-article`)

1. `preflight-article.mjs` esteso: `focus` >= 2 (errore), lunghezza minima e rapporto
   titoli/paragrafi, denylist per hash (D11), euristica nomi promossa a errore fuori da `drafts/`.
2. `scripts/hash-denylist.mjs` per rigenerare gli hash dal file locale.
3. Skill `gate-article`, verdetto a struttura fissa, cinque criteri con esito e motivazione.
4. `scripts/check-gate-verdicts.mjs` + step in CI, con `gate-grandfathered.json` (D16, V8). In
   grandfathering vanno i **4** pezzi già pubblicati o in uscita ad agosto: il draft "Musica #1"
   di Fabio, che esce in ottobre, **passa dal gate** e diventa il primo verdetto vero, oltre che
   il primo collaudo del gate su un pezzo non di Marco.
5. `write-article` perde la Fase 1, invoca il gate e consegna in `drafts/<slug>.md` (V1).
6. Evals per `gate-article` (3, di cui uno bocciato e uno borderline) e per `write-article`.
7. Comando `/gate`.

*Fatto quando:* una bozza listicle, o con un nome azienda dentro, viene fermata senza intervento,
e una PR che aggira la catena viene fermata dalla CI.

### F2 — Stato unico e roadmap derivata (`feat/status-e-roadmap`)

1. Migrazione di `src/content.config.ts`: `status` con enum, `draft` derivato, aggiornamento di
   `src/utils/blog.ts`, test, preflight e dei quattro articoli.
2. `focus` unificato sull'enum minuscolo (G10).
3. Skill `place-in-roadmap` (G3); description di `roadmap-next` e `publish-article` precisate.
4. `status.mjs` bloccante in CI sulle incoerenze roadmap/blog; i disallineamenti di traduzione
   restano informativi.
5. `docs/pipeline-state.md` generato e versionato; hook `SessionStart` (D14).
6. `sync-translation` aggiornata con `status`. Comando `/stato`.

*Fatto quando:* `status.mjs` esce con codice 1 se qualcuno pubblica senza toccare la roadmap, e
nessuna skill rimanda più a un file che i collaboratori non hanno.

### F3 — Asset completi e bilingui (`feat/social-kit`)

1. Cover obbligatorie nel preflight per gli articoli non in draft.
2. `scripts/assets.mjs`: cover IT+EN, OG, carousel IT+EN in un comando (la foglia di D9).
3. `scripts/generate-carousel-spec.mjs` con vincoli di lunghezza (G7).
4. Subagenti `carousel-spec` e `social-post` (D13).
5. Skill `social-kit`: i due post con gancio, corpo e primo commento con UTM; poi
   `newsletter-issue` (G8).
6. `check-copy.mjs` esteso a `social/`, `carousels/**/*.json`, `newsletter/` (G14).
7. Verifica di `sharp` sul runner CI (G15). Evals per `social-kit`; checklist di `site-audit`.

*Fatto quando:* da un articolo pronto escono due PDF, due post e una bozza newsletter senza che
nessuno scriva una riga di spec a mano.

### F4 — L'orchestratore (`feat/article-pipeline`)

1. Subagente `translate-article`; `finalize-article` lo invoca (D13).
2. Skill `article-pipeline`: step 0-8, senza reimplementare nulla (P1).
3. `.claude/commands/pubblica.md`; hook build-vs-dev (D14); comando `/audit`.
4. Interruzioni: contenuto sensibile (D1) e, se l'autore non è il proprietario del repo, stop alla
   PR aperta invece che al merge (D18).
5. Controllo di prerequisito allo step 0: profilo autore esistente in `src/content/authors/it/`,
   altrimenti stop immediato e rimando ad `add-author` (V2).
6. Ripresa da uno step qualsiasi, **calcolata da `status.mjs`, non memorizzata** (P2).
7. Evals per `article-pipeline` e `publish-article` (G13). Test di accettazione §8.4 completo,
   eseguito una seconda volta impersonando un autore non proprietario, per verificare D18 e V2.

*Fatto quando:* `drafts/<slug>.md` più `/pubblica <slug>` producono una PR mergiabile con coppia
bilingue, tappa in roadmap, cover, carousel, post e newsletter in bozza.

### F5 — Opportunistica

Voce per `TECH-IMPROVEMENTS.md`: se spostare la generazione asset in CI. Criterio pratico: se
arriva un collaboratore che non lavora su macOS, si sposta; finché sei solo, non serve.

---

## 10. Rischi e cosa non fare

- **Non automatizzare il giudizio editoriale al punto da renderlo invisibile.** Il verdetto va
  scritto e letto: se diventa un check verde che nessuno apre, hai automatizzato la produzione di
  articoli mediocri.
- **Non saltare F0 per arrivare prima a F4.** Un orchestratore costruito su tre skill con confini
  sovrapposti amplifica l'ambiguità invece di risolverla.
- **Non far conoscere l'ordine della catena a due componenti** (P1): è la ragione per cui
  `assets.mjs` è una foglia e i comandi non contengono logica.
- **Non spostare in subagente gli step dove serve vedere il ragionamento** (gate, refinement).
- **Non affidare agli hook nulla che debba valere anche per gli altri** (P3).
- **Non versionare `personas/`**: sono note personali su persone reali, e la loro utilità dipende
  dal fatto che siano schiette.
- **Attenzione alla migrazione di F2**: `content.config.ts` tocca build, test, preflight,
  `status.mjs` e i quattro articoli in un colpo. PR sua, CI verde prima di procedere.
- **Il denylist in chiaro non entra mai nel repo**, nemmeno in un commit poi corretto.

---

## 11. Decisioni ancora aperte

1. Valori esatti dell'enum `status`, e se serve `scheduled`.
2. Se `podcast-repurpose` entra nella catena come step 10 opzionale o resta fuori.
3. Se il post LinkedIn EN ha senso oggi, o se prima va deciso il canale anglofono
   (`NEW-IDEAS.md` §6, ripubblicazione EN con canonical).
4. Come `article-pipeline` riconosce il proprietario del repo per applicare D18: confronto con
   l'`authorKey` di Marco, `gh api user`, o una voce esplicita in `.claude/settings.json`.

---

## 12. Sequenza consigliata

F0 → F1 → F2 → F3 → F4, una PR per fase, con il test di accettazione §8.4 rieseguito alla fine di
ognuna.

Dopo F1 hai il beneficio più grande: nessun articolo debole o non anonimizzato arriva alla PR, né
dalla catena né aggirandola. Dopo F3 il lavoro manuale post-pubblicazione è finito. F4 rende il
tutto un comando solo, ed è l'unico che non ti serve davvero finché lavori da solo.
