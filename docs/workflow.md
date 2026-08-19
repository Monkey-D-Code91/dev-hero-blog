# Workflow editoriale

Come un'idea diventa un articolo pubblicato con i suoi asset. Questo documento è la **fonte di
verità del processo editoriale**: se una skill o uno script fanno diversamente, il bug è lì.

Confini con gli altri documenti normativi: `ship` è la fonte di verità della **coda git**,
`docs/editorial-guidelines.md` delle **regole di scrittura**, `docs/brand.md` e
`docs/DESIGN-SYSTEM.md` di **voce e valori visivi**. Qui sta solo l'ordine delle operazioni e chi
fa cosa.

L'analisi che ha prodotto questo processo, con i gap e il piano di attuazione, sta in
`Workflow-review.md` alla radice.

---

## 1. La catena

Dieci passaggi. La colonna **Stato** dice cosa è già attivo e cosa arriva con le fasi del piano:
un documento che descrive un processo inesistente è esattamente il difetto che stiamo curando.

| # | Passaggio | Chi lo fa | Produce | Stato |
|---|---|---|---|---|
| 0 | Ingresso della bozza | l'autore | `drafts/<slug>.md` | attivo |
| 1 | Gate editoriale | `gate-article` | `docs/verdicts/<translationKey>.md` | F1 |
| 2 | Rifinitura del tono in IT | `refine-article` | testo rifinito | attivo |
| 3 | Struttura, metadati, traduzione EN | `finalize-article` | coppia IT+EN in `src/content/blog/` | F0b |
| 4 | Collocazione in roadmap | `place-in-roadmap` | tappa IT+EN `planned` | F2 |
| 5 | Asset visivi | `scripts/generate-cover.mjs` (poi `assets.mjs`) | cover IT+EN, OG | attivo |
| 6 | Verifica | `preflight-article.mjs`, `npm test`, `npm run build` | esito bloccante | attivo |
| 7 | Asset social | `social-kit` | carousel IT+EN, post IT+EN, bozza newsletter | F3 |
| 8 | Chiusura git | `ship` | PR, CI verde, merge | attivo |
| 9 | Momento di uscita | `publish-article` | articolo pubblicato, roadmap allineata | attivo |

Sopra la catena, quando esisterà (F4): il comando `/pubblica <slug>` e la skill
`article-pipeline`, **unica a conoscerne l'ordine**.

### Due passaggi che non si possono invertire

- La cover si genera **dopo** il frontmatter, non prima: `generate-cover.mjs` legge `title` e
  `cover` dal file dell'articolo.
- La collocazione in roadmap viene **dopo** i metadati: la tappa ha bisogno di `translationKey`,
  `pubDate`, `focus` e `authorName`.

---

## 2. L'ingresso: `drafts/`

Ogni pezzo entra da `drafts/<slug>.md`, in una lingua sola (di norma IT), anche senza frontmatter.
È l'unico ingresso previsto, e vale sia per chi scrive di getto sia per chi arriva da
`write-article`.

Due percorsi, stessa porta:

| Se l'autore... | Percorso |
|---|---|
| ha già una bozza scritta | la mette in `drafts/<slug>.md` e si parte dal passo 1 |
| ha solo un'idea | `write-article` lo accompagna e **consegna in `drafts/<slug>.md`**, poi passo 1 |

**La bozza grezza si cancella quando l'articolo esce.** `drafts/` contiene solo lavoro in corso;
l'originale resta nella storia git, e il verdetto del gate resta in `docs/verdicts/`.

---

## 3. Chi decide, e dove ci si ferma

Il processo è pensato per girare senza chiedere conferme a ogni passaggio. Le conferme si
riservano alle decisioni vere.

**Fermate previste, e sono tre.**

1. **Il gate boccia il pezzo** (passo 1). Non è una fermata negoziabile: si torna al testo.
2. **Il pezzo tocca dati di un datore di lavoro** (in qualunque passaggio). Vedi §4.
3. **L'autore non è il proprietario del repo** (passo 8). La catena si ferma alla PR aperta invece
   di arrivare al merge. Vedi §5.

Tutto il resto procede senza micro-conferme, incluse le scelte che si possono correggere dopo: la
collocazione in roadmap, i tag, la spec del carousel, il gancio del post.

---

## 4. Contenuti sensibili: chi approva

È l'unica fermata che dipende da una persona, quindi non può restare implicita.

| Caso | Chi approva |
|---|---|
| Il pezzo racconta dati o vicende del datore di lavoro **dell'autore** | l'autore, verso il proprio datore, prima del commit. Nessuno può farlo al posto suo |
| Il pezzo tocca il datore di lavoro **di Marco** | il Product Owner, come da `CLAUDE.md` §2 |
| In ogni caso, prima della pubblicazione | Marco come editore del blog |

La regola pratica: **l'anonimizzazione non è un'opinione**. Nomi di persona (tranne gli autori),
nomi di aziende, prodotti interni e sigle non entrano nel testo, e dal gate in poi il controllo è
automatico. Quello che entra nella storia git non si toglie più davvero.

---

## 5. Asimmetrie volute

Non sono limiti tecnici da rimuovere: sono scelte. Scritte qui perché un collaboratore le sappia
in anticipo invece di sbatterci contro.

- **Il merge lo fa Marco.** La catena arriva al merge solo per il proprietario del repo; per tutti
  gli altri si ferma alla PR aperta. La roadmap pubblica e il calendario editoriale sono decisioni
  editoriali, non tecniche.
- **La newsletter la invia Marco.** Le bozze si versionano in `newsletter/` e viaggiano nella PR,
  ma l'invio da Buttondown resta a lui.
- **I post social li pubblica Marco.** Le bozze stanno in `social/<slug>-{it,en}.md`, pronte da
  incollare. Nessuna skill pubblica da sola su LinkedIn.

---

## 6. I principi

Cinque regole ricavate dai difetti che questo processo corregge. Servono a decidere i casi nuovi
senza rifare l'analisi: se una proposta le viola, è probabilmente sbagliata anche quando sembra
comoda.

**P1. Un solo posto conosce l'ordine della catena.** È la skill orchestratrice. Script, comandi e
subagenti conoscono solo il proprio blocco. Quando due componenti conoscono la stessa sequenza,
quella sequenza diverge.

**P2. Lo stato si deduce dagli artefatti, non si memorizza.** `status.mjs` lo fa già: coppia,
draft, cover, PDF e carousel sono dedotti dai file. Un file di avanzamento sarebbe l'ennesima
fonte di verità da tenere allineata.

**P3. La correttezza si impone in CI; gli hook servono ad anticiparla.** Gli hook sono locali e
non condivisi: un controllo che esiste solo come hook è una comodità, non un controllo.

**P4. Il contesto è una risorsa scarsa.** Gli step autosufficienti (traduzione, spec carousel,
post) girano isolati e restituiscono un file.

**P5. Una skill che non è documentata non esiste.** La PR che introduce o modifica una skill
aggiorna `CLAUDE.md` §9 e la skill `onboarding` nello stesso commit.

---

## 7. Cosa fare quando qualcosa non torna

| Sintomo | Dove guardare |
|---|---|
| non so a che punto è un pezzo | `node scripts/status.mjs` |
| il preflight segnala qualcosa che non capisco | `docs/editorial-guidelines.md`, poi `scripts/README.md` |
| IT ed EN sono disallineati | `node scripts/check-translation-sync.mjs`, poi la skill `sync-translation` |
| una skill fa una cosa diversa da questo documento | il bug è nella skill: correggila, non aggirarla |
| questo documento non copre il caso | applicane i principi (§6), poi aggiornalo |
